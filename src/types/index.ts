export type LevelType = '1AC' | '2AC';

export type GroupType = 'CE' | 'G1' | 'G2'; // Classe Entière, Groupe 1, Groupe 2 (dédoublement TP)

export type SemesterType = 'S1' | 'S2';

export interface Student {
  id: string;
  classId: string;
  massarCode: string; // Ex: K134892011
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  birthDate?: string;
  group: 'G1' | 'G2';
  parentPhone?: string;
  medicalNotes?: string; // e.g. Port de lunettes, asthme, allergies en labo
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "1AC-1", "1AC-2", "2AC-1", "2AC-2"
  level: LevelType;
  academicYear: string; // "2025/2026"
  studentCount?: number;
  roomName: string; // e.g. "Salle SVT 1", "Laboratoire de Biologie"
}

export interface CahierEntry {
  id: string;
  classId: string;
  level: LevelType;
  group: GroupType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08h30 - 10h20"
  unitId: string;
  chapterId: string;
  title: string;
  activities: string; // Description détaillée des activités (TP, démarche d'investigation)
  documents: string; // Ex: Manuel p.24 doc 1 et 2, Microscope, Lame d'élodée
  homework?: string; // Travail à faire pour la séance prochaine
  homeworkDueDate?: string;
  status: 'FAIT' | 'REPORTE' | 'PLANIFIE';
}

export interface ScheduleSlot {
  id: string;
  dayOfWeek: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  timeSlot: string; // e.g. "08h30 - 10h20", "10h40 - 12h30", "14h30 - 16h20", "16h40 - 18h30"
  classId: string;
  group: GroupType;
  room: string;
  note?: string;
}

export interface Chapter {
  id: string;
  code: string; // e.g. "CH1", "CH2"
  title: string;
  allocatedHours: number; // Durée préconisée en heures
  keyConcepts: string[];
  investigationSituations: string[];
  status: 'TERMINE' | 'EN_COURS' | 'A_VENIR';
  completedHours?: number;
}

export interface CurriculumUnit {
  id: string;
  level: LevelType;
  semester: SemesterType;
  number: number; // 1 ou 2
  title: string;
  totalHours: number;
  chapters: Chapter[];
}

export interface FichePedagogique {
  id: string;
  title: string;
  level: LevelType;
  unit: string;
  chapter: string;
  duration: string; // e.g. "2 heures"
  targetCompetencies: string[]; // Compétences visées (disciplinaires, méthodologiques)
  prerequisites: string[]; // Prérequis
  learningObjectives: string[]; // Objectifs opérationnels
  didacticMaterials: string[]; // Matériel et supports (lames, vidéoprojecteur, manuels, etc.)
  startingProblem: string; // Situation-problème de départ
  phases: {
    stage: string; // e.g. "Situation déclenchante", "Recherche & Investigation", "Structuration", "Évaluation"
    teacherActivity: string;
    studentActivity: string;
    duration: string;
    modality: string; // e.g. "Travail en binômes (TP)", "Collectif", "Individuel"
  }[];
  writtenTrace: string; // Bilan / Résumé à retenir
  formativeAssessment: string; // Évaluation formative
  createdAt: string;
  updatedAt: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  score: number | null; // Note sur 20
  absent?: boolean;
}

export interface Evaluation {
  id: string;
  classId: string;
  semester: SemesterType;
  type: 'CC1' | 'CC2' | 'CC3' | 'ACTIVITES_TP'; // Contrôles Continus 1, 2, 3 ou Activités intégrées
  title: string;
  date: string;
  coefficient: number; // Ex: CC1=1, CC2=1, CC3=1, Activités=1
  maxScore: number; // 20
  grades: Record<string, number | null>; // studentId -> score
  absentees: string[]; // studentIds
}

export interface AbsenceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  timeSlot: string;
  isJustified: boolean;
  reason?: string;
  type: 'ABSENCE' | 'RETARD';
}

export interface RemediationPlan {
  id: string;
  title: string;
  level: LevelType;
  domain: 'INVESTIGATION' | 'ANALYSE_DOCS' | 'LEXIQUE_SCIENTIFIQUE' | 'SCHEMA_DESSIN' | 'MANIPULATION_LABO' | 'RAISONNEMENT';
  description: string;
  targetStudents: {
    studentId: string;
    studentName: string;
    classId: string;
    initialObservation: string;
    outcomeStatus: 'ACQUIS' | 'EN_COURS' | 'NON_ACQUIS';
  }[];
  plannedActivities: string;
  evaluationMethod: string;
  datePlanned: string;
  completed: boolean;
}

export interface LibraryResource {
  id: string;
  title: string;
  level: LevelType | 'TOUS';
  category: 'SCHEMA' | 'FICHE_TP' | 'COURS_RESUME' | 'VIDEO' | 'PRESENTATION' | 'EXERCICE';
  unit: string;
  description: string;
  format: 'PDF' | 'IMAGE' | 'PPT' | 'LIEN_VIDEO';
  url?: string;
  fileData?: string; // base64 or stored object URL
  tags: string[];
  isCustom?: boolean;
}

export interface TeacherProfile {
  name: string;
  schoolName: string; // e.g. "Collège Ibn Al-Haytham"
  directorate: string; // Direction Provinciale (e.g. "Tétouan", "Casablanca-Anfa", "Rabat")
  academy: string; // AREF (e.g. "AREF Tanger-Tétouan-Al Hoceïma")
  schoolYear: string; // "2025/2026"
  inspectorName?: string;
}

export interface AppDataState {
  teacher: TeacherProfile;
  classes: ClassRoom[];
  students: Student[];
  cahierEntries: CahierEntry[];
  schedule: ScheduleSlot[];
  progression: CurriculumUnit[];
  fiches: FichePedagogique[];
  evaluations: Evaluation[];
  absences: AbsenceRecord[];
  remediations: RemediationPlan[];
  resources: LibraryResource[];
  lastSavedAt: string;
  version: string;
}
