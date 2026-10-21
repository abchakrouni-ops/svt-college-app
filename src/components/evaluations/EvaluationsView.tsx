import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Evaluation, Student, SemesterType } from '../../types';
import { exportGradesToCSV } from '../../services/storage';
import {
  BarChart2,
  Plus,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Trash2,
  Edit2,
  Clock,
  UserCheck,
  UserX,
  X
} from 'lucide-react';

export const EvaluationsView: React.FC = () => {
  const {
    state,
    selectedClassId,
    setSelectedClassId,
    addEvaluation,
    updateEvaluationGrades,
    deleteEvaluation,
    addAbsence,
    deleteAbsence,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'NOTES' | 'ABSENCES'>('NOTES');
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>('S1');
  const [showAddEvalModal, setShowAddEvalModal] = useState(false);
  const [showAddAbsenceModal, setShowAddAbsenceModal] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');

  // New Eval Form
  const [newEvalTitle, setNewEvalTitle] = useState('');
  const [newEvalType, setNewEvalType] = useState<Evaluation['type']>('CC2');
  const [newEvalDate, setNewEvalDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEvalCoeff, setNewEvalCoeff] = useState(1);

  // New Absence Form
  const [absenceStudentId, setAbsenceStudentId] = useState('');
  const [absenceDate, setAbsenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [absenceSlot, setAbsenceSlot] = useState('08h30 - 10h20');
  const [absenceType, setAbsenceType] = useState<'ABSENCE' | 'RETARD'>('ABSENCE');
  const [absenceJustified, setAbsenceJustified] = useState(false);
  const [absenceReason, setAbsenceReason] = useState('');

  const currentClass = state.classes.find((c) => c.id === selectedClassId) || state.classes[0];
  const classStudents = state.students.filter((s) => s.classId === currentClass?.id);
  const classEvals = state.evaluations.filter(
    (e) => e.classId === currentClass?.id && e.semester === selectedSemester
  );
  const classAbsences = state.absences.filter((a) => a.classId === currentClass?.id);

  // Filtered Students for Table
  const filteredStudents = classStudents.filter((s) =>
    `${s.lastName} ${s.firstName} ${s.massarCode}`.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Local state for editable grades in currently viewed evaluation
  const [activeEvalId, setActiveEvalId] = useState<string>(classEvals[0]?.id || '');
  const activeEvaluation = classEvals.find((e) => e.id === activeEvalId) || classEvals[0];

  // Grade change handler
  const handleGradeChange = (studentId: string, valueStr: string) => {
    if (!activeEvaluation) return;
    const currentGrades = { ...activeEvaluation.grades };
    const currentAbsentees = [...activeEvaluation.absentees];

    if (valueStr.trim() === '') {
      currentGrades[studentId] = null;
    } else {
      const num = parseFloat(valueStr);
      if (!isNaN(num) && num >= 0 && num <= 20) {
        currentGrades[studentId] = num;
        // remove from absentees if was absent
        const idx = currentAbsentees.indexOf(studentId);
        if (idx !== -1) currentAbsentees.splice(idx, 1);
      }
    }

    updateEvaluationGrades(activeEvaluation.id, currentGrades, currentAbsentees);
  };

  // Toggle student absent for this test
  const handleToggleAbsentForEval = (studentId: string) => {
    if (!activeEvaluation) return;
    const currentGrades = { ...activeEvaluation.grades };
    const currentAbsentees = [...activeEvaluation.absentees];

    if (currentAbsentees.includes(studentId)) {
      // Unmark absent
      const updatedAbsentees = currentAbsentees.filter((id) => id !== studentId);
      updateEvaluationGrades(activeEvaluation.id, currentGrades, updatedAbsentees);
    } else {
      // Mark absent
      currentGrades[studentId] = null;
      updateEvaluationGrades(activeEvaluation.id, currentGrades, [...currentAbsentees, studentId]);
    }
  };

  // Compute Statistics for the active evaluation
  const calculateStats = (evaluation?: Evaluation) => {
    if (!evaluation) return { average: 0, min: 0, max: 0, successRate: 0, count: 0, brackets: [0, 0, 0, 0, 0] };
    const validScores: number[] = [];
    Object.values(evaluation.grades).forEach((sc) => {
      if (sc !== null && sc !== undefined) validScores.push(sc);
    });

    if (validScores.length === 0) {
      return { average: 0, min: 0, max: 0, successRate: 0, count: 0, brackets: [0, 0, 0, 0, 0] };
    }

    const sum = validScores.reduce((a, b) => a + b, 0);
    const average = sum / validScores.length;
    const min = Math.min(...validScores);
    const max = Math.max(...validScores);
    const successCount = validScores.filter((s) => s >= 10).length;
    const successRate = Math.round((successCount / validScores.length) * 100);

    // Brackets: [<10, 10-12, 12-14, 14-16, 16-20]
    const b0 = validScores.filter((s) => s < 10).length;
    const b1 = validScores.filter((s) => s >= 10 && s < 12).length;
    const b2 = validScores.filter((s) => s >= 12 && s < 14).length;
    const b3 = validScores.filter((s) => s >= 14 && s < 16).length;
    const b4 = validScores.filter((s) => s >= 16).length;

    return {
      average: Number(average.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      successRate,
      count: validScores.length,
      brackets: [b0, b1, b2, b3, b4]
    };
  };

  const activeStats = calculateStats(activeEvaluation);

  // Student global average across all evaluations of the semester
  const calculateStudentSemesterAverage = (studentId: string): number | null => {
    let total = 0;
    let totalWeight = 0;
    classEvals.forEach((ev) => {
      const sc = ev.grades[studentId];
      if (sc !== null && sc !== undefined) {
        total += sc * ev.coefficient;
        totalWeight += ev.coefficient;
      }
    });
    return totalWeight > 0 ? Number((total / totalWeight).toFixed(2)) : null;
  };

  const handleCreateEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvalTitle.trim() || !currentClass) return;

    addEvaluation({
      classId: currentClass.id,
      semester: selectedSemester,
      type: newEvalType,
      title: newEvalTitle.trim(),
      date: newEvalDate,
      coefficient: newEvalCoeff,
      maxScore: 20,
      grades: {},
      absentees: []
    });

    setNewEvalTitle('');
    setShowAddEvalModal(false);
  };

  const handleCreateAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!absenceStudentId || !currentClass) return;

    addAbsence({
      classId: currentClass.id,
      studentId: absenceStudentId,
      date: absenceDate,
      timeSlot: absenceSlot,
      isJustified: absenceJustified,
      reason: absenceReason.trim() || undefined,
      type: absenceType
    });

    setAbsenceStudentId('');
    setAbsenceReason('');
    setShowAddAbsenceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Contrôle Continu & Suivi de l'Assiduité SVT
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Gestion des Évaluations & Notes · {currentClass?.name} ({currentClass?.level})
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Conforme au barème de notation officiel du MENPS et au système Massar.
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                if (currentClass) {
                  exportGradesToCSV(classStudents, classEvals, currentClass.name);
                }
              }}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Exporter notes CSV (Massar)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer relevé</span>
            </button>
            <button
              onClick={() => setShowAddEvalModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle évaluation</span>
            </button>
          </div>
        </div>

        {/* Classes and Semesters Selection */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
              Classe :
            </span>
            {state.classes.map((cls) => {
              const isSelected = cls.id === currentClass?.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cls.name} ({cls.level})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setSelectedSemester('S1')}
                className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  selectedSemester === 'S1'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semestre 1 (S1)
              </button>
              <button
                onClick={() => setSelectedSemester('S2')}
                className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  selectedSemester === 'S2'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semestre 2 (S2)
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('NOTES')}
                className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'NOTES'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Saisie & Notes
              </button>
              <button
                onClick={() => setActiveTab('ABSENCES')}
                className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'ABSENCES'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Absences ({classAbsences.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block p-4 border-b-2 border-slate-900 mb-4 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
          Royaume du Maroc · Ministère de l'Éducation Nationale
        </div>
        <div className="text-sm font-semibold mt-1">
          {state.teacher.academy} · {state.teacher.directorate}
        </div>
        <h2 className="text-lg font-bold mt-2 underline">
          RELEVÉ DES NOTES DE CONTRÔLE CONTINU · SVT ({selectedSemester})
        </h2>
        <div className="text-xs mt-1">
          Classe : <strong>{currentClass?.name} ({currentClass?.level})</strong> · Professeur : <strong>{state.teacher.name}</strong> · Année : <strong>{state.teacher.schoolYear}</strong>
        </div>
      </div>

      {activeTab === 'NOTES' ? (
        <div className="space-y-6">
          {/* Active Evaluation Switcher & Statistics Cards */}
          {classEvals.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Évaluation active :
                  </span>
                  {classEvals.map((ev) => {
                    const isSelected = (activeEvaluation?.id || activeEvalId) === ev.id;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setActiveEvalId(ev.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{ev.type}</span>
                        <span className="opacity-80 font-normal">· {ev.title}</span>
                      </button>
                    );
                  })}
                </div>

                {activeEvaluation && (
                  <div className="flex items-center gap-2 no-print">
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer l'évaluation "${activeEvaluation.title}" ?`)) {
                          deleteEvaluation(activeEvaluation.id);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Supprimer cette éval</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Statistics Strip for active evaluation */}
              {activeEvaluation && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Moyenne de classe</span>
                    <strong className="text-xl font-mono font-bold text-slate-900 mt-0.5 block">
                      {activeStats.average} <span className="text-xs font-normal text-slate-500">/20</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Taux de réussite (≥10)</span>
                    <strong className={`text-xl font-mono font-bold mt-0.5 block ${activeStats.successRate >= 60 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {activeStats.successRate}%
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Note la plus haute</span>
                    <strong className="text-xl font-mono font-bold text-emerald-800 mt-0.5 block">
                      {activeStats.max} <span className="text-xs font-normal text-slate-500">/20</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Note la plus basse</span>
                    <strong className="text-xl font-mono font-bold text-red-700 mt-0.5 block">
                      {activeStats.min} <span className="text-xs font-normal text-slate-500">/20</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-500 block">Élèves notés</span>
                    <strong className="text-xl font-mono font-bold text-slate-900 mt-0.5 block">
                      {activeStats.count} / {classStudents.length}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grades Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 no-print">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer un élève..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="text-xs text-slate-500">
                Saisissez directement les notes sur 20. Les moyennes sont recalculées automatiquement.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-3 text-center w-10">N°</th>
                    <th className="py-3 px-3">Code Massar</th>
                    <th className="py-3 px-3">Nom & Prénom</th>
                    <th className="py-3 px-2 text-center w-12">Grp</th>
                    {classEvals.map((ev) => (
                      <th
                        key={ev.id}
                        className={`py-3 px-3 text-center min-w-[110px] border-l border-slate-200 ${
                          ev.id === activeEvaluation?.id ? 'bg-emerald-50/60 text-emerald-950' : ''
                        }`}
                      >
                        <div>{ev.type}</div>
                        <div className="text-[10px] font-normal text-slate-500 truncate max-w-[120px]">
                          {ev.title} (x{ev.coefficient})
                        </div>
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center border-l-2 border-slate-300 bg-slate-200/50 font-mono">
                      Moyenne SVT /20
                    </th>
                    <th className="py-3 px-3 text-center border-l border-slate-200">
                      Mention
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5 + classEvals.length} className="py-8 text-center text-slate-500 text-xs">
                        Aucun élève trouvé pour cette classe.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      const avg = calculateStudentSemesterAverage(student.id);
                      let mention = '—';
                      let mentionColor = 'text-slate-400';
                      if (avg !== null) {
                        if (avg >= 16) { mention = 'Très Bien'; mentionColor = 'text-emerald-700 font-bold'; }
                        else if (avg >= 14) { mention = 'Bien'; mentionColor = 'text-teal-700 font-bold'; }
                        else if (avg >= 12) { mention = 'Assez Bien'; mentionColor = 'text-sky-700 font-medium'; }
                        else if (avg >= 10) { mention = 'Moyen'; mentionColor = 'text-slate-700'; }
                        else { mention = 'À soutenir'; mentionColor = 'text-red-600 font-bold'; }
                      }

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                            {student.massarCode}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {student.lastName.toUpperCase()} {student.firstName}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-semibold text-[11px] text-slate-600">
                            {student.group}
                          </td>

                          {/* Dynamic Columns for each Evaluation */}
                          {classEvals.map((ev) => {
                            const score = ev.grades[student.id];
                            const isAbsent = ev.absentees.includes(student.id);
                            const isActiveCol = ev.id === activeEvaluation?.id;

                            return (
                              <td
                                key={ev.id}
                                className={`py-2 px-2 text-center border-l border-slate-200 ${
                                  isActiveCol ? 'bg-emerald-50/30' : ''
                                }`}
                              >
                                {isActiveCol ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <input
                                      type="number"
                                      step="0.25"
                                      min="0"
                                      max="20"
                                      disabled={isAbsent}
                                      value={score !== null && score !== undefined ? score : ''}
                                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                      placeholder={isAbsent ? 'ABS' : '—'}
                                      className={`w-16 px-1.5 py-1 text-center font-mono text-xs border rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
                                        isAbsent
                                          ? 'bg-red-50 text-red-700 border-red-200 font-bold'
                                          : score !== null && score !== undefined && score < 10
                                          ? 'bg-red-50/40 text-red-700 border-red-300 font-bold'
                                          : score !== null && score !== undefined && score >= 15
                                          ? 'bg-emerald-50/40 text-emerald-900 border-emerald-300 font-bold'
                                          : 'border-slate-300 bg-white'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAbsentForEval(student.id)}
                                      title={isAbsent ? 'Annuler l’absence' : 'Marquer absent'}
                                      className={`p-1 rounded text-[10px] font-mono cursor-pointer transition-colors no-print ${
                                        isAbsent ? 'bg-red-100 text-red-800' : 'text-slate-400 hover:text-red-600'
                                      }`}
                                    >
                                      {isAbsent ? 'Abs' : 'A'}
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`font-mono text-xs ${
                                    isAbsent
                                      ? 'text-red-600 font-bold'
                                      : score !== null && score !== undefined && score < 10
                                      ? 'text-red-700 font-semibold'
                                      : score !== null && score !== undefined && score >= 15
                                      ? 'text-emerald-800 font-semibold'
                                      : 'text-slate-800'
                                  }`}>
                                    {isAbsent ? 'ABS' : score !== null && score !== undefined ? score.toFixed(2) : '—'}
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          {/* Calculated Average Column */}
                          <td className="py-2.5 px-3 text-center border-l-2 border-slate-300 bg-slate-50/80 font-mono font-bold text-sm">
                            {avg !== null ? (
                              <span className={avg >= 10 ? 'text-emerald-900' : 'text-red-600'}>
                                {avg.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">N/A</span>
                            )}
                          </td>

                          {/* Mention */}
                          <td className={`py-2.5 px-3 text-center text-xs ${mentionColor}`}>
                            {mention}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Absences & Tardiness View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registre des Absences et Retards SVT · {currentClass?.name}
              </h2>
              <div className="text-xs text-slate-500">
                Suivi de l'assiduité lors des séances de cours et des travaux pratiques en laboratoire.
              </div>
            </div>

            <button
              onClick={() => setShowAddAbsenceModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Signaler une absence / retard</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Créneau</th>
                  <th className="py-2.5 px-3">Élève</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                  <th className="py-2.5 px-3 text-center">Justification</th>
                  <th className="py-2.5 px-3">Motif / Pièce jointe</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {classAbsences.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      Aucune absence consignée pour cette classe. Excellente assiduité !
                    </td>
                  </tr>
                ) : (
                  classAbsences.map((abs) => {
                    const student = state.students.find((s) => s.id === abs.studentId);
                    return (
                      <tr key={abs.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                          {abs.date}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {abs.timeSlot}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {student ? `${student.lastName.toUpperCase()} ${student.firstName}` : 'Élève inconnu'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            abs.type === 'ABSENCE' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {abs.type === 'ABSENCE' ? 'Absence' : 'Retard'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            abs.isJustified ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'
                          }`}>
                            {abs.isJustified ? 'Justifiée' : 'Non justifiée'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {abs.reason || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm('Supprimer cette entrée d’absence ?')) {
                                deleteAbsence(abs.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Evaluation Modal */}
      {showAddEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Créer une évaluation</h3>
              <button
                onClick={() => setShowAddEvalModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEval} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Type d'évaluation *</label>
                <select
                  value={newEvalType}
                  onChange={(e) => setNewEvalType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="CC1">Contrôle Continu n°1 (CC1)</option>
                  <option value="CC2">Contrôle Continu n°2 (CC2)</option>
                  <option value="CC3">Contrôle Continu n°3 (CC3)</option>
                  <option value="ACTIVITES_TP">Activités intégrées, TP & Assiduité</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Titre de l'évaluation *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Devoir surveillé : Géologie interne et séismes"
                  value={newEvalTitle}
                  onChange={(e) => setNewEvalTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvalDate}
                    onChange={(e) => setNewEvalDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Coefficient</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newEvalCoeff}
                    onChange={(e) => setNewEvalCoeff(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEvalModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Créer l'évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Absence Modal */}
      {showAddAbsenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Signaler une absence / retard</h3>
              <button
                onClick={() => setShowAddAbsenceModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAbsence} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Élève *</label>
                <select
                  required
                  value={absenceStudentId}
                  onChange={(e) => setAbsenceStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="">Sélectionner un élève...</option>
                  {classStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.lastName.toUpperCase()} {s.firstName} ({s.group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type *</label>
                  <select
                    value={absenceType}
                    onChange={(e) => setAbsenceType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="ABSENCE">Absence</option>
                    <option value="RETARD">Retard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={absenceDate}
                    onChange={(e) => setAbsenceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Créneau horaire</label>
                <input
                  type="text"
                  value={absenceSlot}
                  onChange={(e) => setAbsenceSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="justifiedCheck"
                  checked={absenceJustified}
                  onChange={(e) => setAbsenceJustified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="justifiedCheck" className="text-slate-700 font-medium cursor-pointer">
                  Absence justifiée (certificat médical / convocation)
                </label>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Motif / Justification</label>
                <input
                  type="text"
                  placeholder="Ex: Certificat médical déposé à l'administration"
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAbsenceModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
