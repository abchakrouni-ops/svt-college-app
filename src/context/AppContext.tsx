import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  AppDataState,
  ClassRoom,
  Student,
  CahierEntry,
  ScheduleSlot,
  FichePedagogique,
  Evaluation,
  AbsenceRecord,
  RemediationPlan,
  LibraryResource,
  TeacherProfile,
  LevelType
} from '../types';
import { INITIAL_STATE } from '../data/initialData';
import {
  loadPersistedState,
  savePersistedState,
  exportBackupToFile,
  importBackupFromFile
} from '../services/storage';

export type TabType =
  | 'dashboard'
  | 'classes'
  | 'cahier'
  | 'schedule'
  | 'progression'
  | 'fiches'
  | 'evaluations'
  | 'remediation'
  | 'library'
  | 'backup';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface AppContextType {
  state: AppDataState;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedLevel: LevelType | 'ALL';
  setSelectedLevel: (level: LevelType | 'ALL') => void;
  isLoading: boolean;
  toasts: ToastMessage[];
  addToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Actions
  updateTeacher: (teacher: Partial<TeacherProfile>) => void;
  addClass: (cls: Omit<ClassRoom, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  batchImportStudents: (students: Omit<Student, 'id'>[]) => void;
  addCahierEntry: (entry: Omit<CahierEntry, 'id'>) => void;
  updateCahierEntry: (id: string, entry: Partial<CahierEntry>) => void;
  deleteCahierEntry: (id: string) => void;
  addScheduleSlot: (slot: Omit<ScheduleSlot, 'id'>) => void;
  updateScheduleSlot: (id: string, slot: Partial<ScheduleSlot>) => void;
  deleteScheduleSlot: (id: string) => void;
  updateChapterStatus: (unitId: string, chapterId: string, status: 'TERMINE' | 'EN_COURS' | 'A_VENIR', completedHours?: number) => void;
  addFiche: (fiche: Omit<FichePedagogique, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFiche: (id: string, fiche: Partial<FichePedagogique>) => void;
  deleteFiche: (id: string) => void;
  addEvaluation: (evaluation: Omit<Evaluation, 'id'>) => void;
  updateEvaluationGrades: (evalId: string, grades: Record<string, number | null>, absentees: string[]) => void;
  deleteEvaluation: (id: string) => void;
  addAbsence: (absence: Omit<AbsenceRecord, 'id'>) => void;
  deleteAbsence: (id: string) => void;
  addRemediationPlan: (plan: Omit<RemediationPlan, 'id'>) => void;
  updateRemediationPlan: (id: string, plan: Partial<RemediationPlan>) => void;
  deleteRemediationPlan: (id: string) => void;
  addLibraryResource: (res: Omit<LibraryResource, 'id'>) => void;
  deleteLibraryResource: (id: string) => void;
  downloadBackup: () => void;
  restoreBackup: (file: File) => Promise<boolean>;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppDataState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string>('c-1ac-1');
  const [selectedLevel, setSelectedLevel] = useState<LevelType | 'ALL'>('ALL');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadPersistedState();
        setState(loaded);
        if (loaded.classes.length > 0) {
          setSelectedClassId(loaded.classes[0].id);
        }
      } catch (err) {
        console.error('Failed to load state', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // State persistence helper
  const updateStateAndPersist = useCallback((updater: (prev: AppDataState) => AppDataState) => {
    setState((prev) => {
      const next = updater(prev);
      savePersistedState(next).catch((err) => console.error('Save error', err));
      return next;
    });
  }, []);

  // Teacher Profile
  const updateTeacher = useCallback((teacher: Partial<TeacherProfile>) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      teacher: { ...prev.teacher, ...teacher }
    }));
    addToast('Profil enseignant mis à jour');
  }, [updateStateAndPersist, addToast]);

  // Classes
  const addClass = useCallback((cls: Omit<ClassRoom, 'id'>) => {
    const newId = `c-${Date.now()}`;
    const newClass: ClassRoom = { ...cls, id: newId };
    updateStateAndPersist((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
    setSelectedClassId(newId);
    addToast(`Classe ${cls.name} ajoutée avec succès`);
  }, [updateStateAndPersist, addToast]);

  const updateClass = useCallback((id: string, cls: Partial<ClassRoom>) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === id ? { ...c, ...cls } : c))
    }));
    addToast('Classe modifiée');
  }, [updateStateAndPersist, addToast]);

  const deleteClass = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== id),
      students: prev.students.filter((s) => s.classId !== id),
      evaluations: prev.evaluations.filter((e) => e.classId !== id),
      cahierEntries: prev.cahierEntries.filter((c) => c.classId !== id),
      schedule: prev.schedule.filter((s) => s.classId !== id)
    }));
    addToast('Classe et ses données associées supprimées', 'warning');
  }, [updateStateAndPersist, addToast]);

  // Students
  const addStudent = useCallback((student: Omit<Student, 'id'>) => {
    const newId = `s-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      students: [...prev.students, { ...student, id: newId }]
    }));
    addToast(`Élève ${student.firstName} ${student.lastName} ajouté`);
  }, [updateStateAndPersist, addToast]);

  const updateStudent = useCallback((id: string, student: Partial<Student>) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === id ? { ...s, ...student } : s))
    }));
    addToast('Fiche élève mise à jour');
  }, [updateStateAndPersist, addToast]);

  const deleteStudent = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id)
    }));
    addToast('Élève retiré de la liste');
  }, [updateStateAndPersist, addToast]);

  const batchImportStudents = useCallback((newStudents: Omit<Student, 'id'>[]) => {
    const formatted = newStudents.map((s, idx) => ({
      ...s,
      id: `s-imp-${Date.now()}-${idx}`
    }));
    updateStateAndPersist((prev) => ({
      ...prev,
      students: [...prev.students, ...formatted]
    }));
    addToast(`${newStudents.length} élèves importés avec succès`);
  }, [updateStateAndPersist, addToast]);

  // Cahier de textes
  const addCahierEntry = useCallback((entry: Omit<CahierEntry, 'id'>) => {
    const newId = `cahier-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      cahierEntries: [{ ...entry, id: newId }, ...prev.cahierEntries]
    }));
    addToast('Séance enregistrée au cahier de textes');
  }, [updateStateAndPersist, addToast]);

  const updateCahierEntry = useCallback((id: string, entry: Partial<CahierEntry>) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      cahierEntries: prev.cahierEntries.map((c) => (c.id === id ? { ...c, ...entry } : c))
    }));
    addToast('Séance mise à jour');
  }, [updateStateAndPersist, addToast]);

  const deleteCahierEntry = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      cahierEntries: prev.cahierEntries.filter((c) => c.id !== id)
    }));
    addToast('Séance supprimée du cahier de textes');
  }, [updateStateAndPersist, addToast]);

  // Schedule
  const addScheduleSlot = useCallback((slot: Omit<ScheduleSlot, 'id'>) => {
    const newId = `sch-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { ...slot, id: newId }]
    }));
    addToast('Créneau ajouté à l’emploi du temps');
  }, [updateStateAndPersist, addToast]);

  const updateScheduleSlot = useCallback((id: string, slot: Partial<ScheduleSlot>) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s) => (s.id === id ? { ...s, ...slot } : s))
    }));
    addToast('Créneau horaire mis à jour');
  }, [updateStateAndPersist, addToast]);

  const deleteScheduleSlot = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== id)
    }));
    addToast('Créneau supprimé');
  }, [updateStateAndPersist, addToast]);

  // Progression
  const updateChapterStatus = useCallback(
    (unitId: string, chapterId: string, status: 'TERMINE' | 'EN_COURS' | 'A_VENIR', completedHours?: number) => {
      updateStateAndPersist((prev) => ({
        ...prev,
        progression: prev.progression.map((u) => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            chapters: u.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              return {
                ...ch,
                status,
                completedHours: completedHours !== undefined ? completedHours : (status === 'TERMINE' ? ch.allocatedHours : ch.completedHours || 0)
              };
            })
          };
        })
      }));
      addToast('Progression pédagogique actualisée');
    },
    [updateStateAndPersist, addToast]
  );

  // Fiches pédagogiques
  const addFiche = useCallback((fiche: Omit<FichePedagogique, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newId = `fiche-${Date.now()}`;
    const newFiche: FichePedagogique = {
      ...fiche,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    updateStateAndPersist((prev) => ({
      ...prev,
      fiches: [newFiche, ...prev.fiches]
    }));
    addToast('Fiche pédagogique créée');
  }, [updateStateAndPersist, addToast]);

  const updateFiche = useCallback((id: string, fiche: Partial<FichePedagogique>) => {
    const now = new Date().toISOString().split('T')[0];
    updateStateAndPersist((prev) => ({
      ...prev,
      fiches: prev.fiches.map((f) => (f.id === id ? { ...f, ...fiche, updatedAt: now } : f))
    }));
    addToast('Fiche pédagogique mise à jour');
  }, [updateStateAndPersist, addToast]);

  const deleteFiche = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      fiches: prev.fiches.filter((f) => f.id !== id)
    }));
    addToast('Fiche pédagogique supprimée');
  }, [updateStateAndPersist, addToast]);

  // Evaluations & Notes
  const addEvaluation = useCallback((evaluation: Omit<Evaluation, 'id'>) => {
    const newId = `eval-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      evaluations: [...prev.evaluations, { ...evaluation, id: newId }]
    }));
    addToast(`Évaluation "${evaluation.title}" ajoutée`);
  }, [updateStateAndPersist, addToast]);

  const updateEvaluationGrades = useCallback(
    (evalId: string, grades: Record<string, number | null>, absentees: string[]) => {
      updateStateAndPersist((prev) => ({
        ...prev,
        evaluations: prev.evaluations.map((ev) =>
          ev.id === evalId ? { ...ev, grades, absentees } : ev
        )
      }));
      addToast('Notes et assiduité sauvegardées');
    },
    [updateStateAndPersist, addToast]
  );

  const deleteEvaluation = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      evaluations: prev.evaluations.filter((e) => e.id !== id)
    }));
    addToast('Évaluation supprimée');
  }, [updateStateAndPersist, addToast]);

  // Absences
  const addAbsence = useCallback((absence: Omit<AbsenceRecord, 'id'>) => {
    const newId = `abs-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      absences: [{ ...absence, id: newId }, ...prev.absences]
    }));
    addToast('Absence/Retard consigné');
  }, [updateStateAndPersist, addToast]);

  const deleteAbsence = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      absences: prev.absences.filter((a) => a.id !== id)
    }));
    addToast('Enregistrement d’absence supprimé');
  }, [updateStateAndPersist, addToast]);

  // Remédiation
  const addRemediationPlan = useCallback((plan: Omit<RemediationPlan, 'id'>) => {
    const newId = `rem-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      remediations: [{ ...plan, id: newId }, ...prev.remediations]
    }));
    addToast('Plan de soutien et remédiation enregistré');
  }, [updateStateAndPersist, addToast]);

  const updateRemediationPlan = useCallback((id: string, plan: Partial<RemediationPlan>) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      remediations: prev.remediations.map((r) => (r.id === id ? { ...r, ...plan } : r))
    }));
    addToast('Plan de remédiation actualisé');
  }, [updateStateAndPersist, addToast]);

  const deleteRemediationPlan = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      remediations: prev.remediations.filter((r) => r.id !== id)
    }));
    addToast('Plan de remédiation supprimé');
  }, [updateStateAndPersist, addToast]);

  // Bibliothèque
  const addLibraryResource = useCallback((res: Omit<LibraryResource, 'id'>) => {
    const newId = `res-${Date.now()}`;
    updateStateAndPersist((prev) => ({
      ...prev,
      resources: [{ ...res, id: newId, isCustom: true }, ...prev.resources]
    }));
    addToast('Ressource didactique ajoutée');
  }, [updateStateAndPersist, addToast]);

  const deleteLibraryResource = useCallback((id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== id)
    }));
    addToast('Ressource supprimée');
  }, [updateStateAndPersist, addToast]);

  // Backup & Restore
  const downloadBackup = useCallback(() => {
    exportBackupToFile(state);
    addToast('Fichier de sauvegarde téléchargé avec succès');
  }, [state, addToast]);

  const restoreBackup = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const restored = await importBackupFromFile(file);
        setState(restored);
        await savePersistedState(restored);
        if (restored.classes.length > 0) {
          setSelectedClassId(restored.classes[0].id);
        }
        addToast('Données restaurées avec succès', 'success');
        return true;
      } catch (err: any) {
        addToast(`Erreur lors de la restauration : ${err.message || 'Fichier invalide'}`, 'error');
        return false;
      }
    },
    [addToast]
  );

  const resetToInitialData = useCallback(() => {
    setState(INITIAL_STATE);
    savePersistedState(INITIAL_STATE);
    setSelectedClassId(INITIAL_STATE.classes[0].id);
    addToast('Réinitialisation aux données officielles 1AC/2AC effectuée');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        selectedClassId,
        setSelectedClassId,
        selectedLevel,
        setSelectedLevel,
        isLoading,
        toasts,
        addToast,
        removeToast,
        updateTeacher,
        addClass,
        updateClass,
        deleteClass,
        addStudent,
        updateStudent,
        deleteStudent,
        batchImportStudents,
        addCahierEntry,
        updateCahierEntry,
        deleteCahierEntry,
        addScheduleSlot,
        updateScheduleSlot,
        deleteScheduleSlot,
        updateChapterStatus,
        addFiche,
        updateFiche,
        deleteFiche,
        addEvaluation,
        updateEvaluationGrades,
        deleteEvaluation,
        addAbsence,
        deleteAbsence,
        addRemediationPlan,
        updateRemediationPlan,
        deleteRemediationPlan,
        addLibraryResource,
        deleteLibraryResource,
        downloadBackup,
        restoreBackup,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
