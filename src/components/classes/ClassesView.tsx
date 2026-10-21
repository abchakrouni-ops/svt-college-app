import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, ClassRoom, LevelType } from '../../types';
import { exportStudentsToCSV } from '../../services/storage';
import {
  Users,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const {
    state,
    selectedClassId,
    setSelectedClassId,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    batchImportStudents,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<'ALL' | 'G1' | 'G2'>('ALL');
  
  // Modals state
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState<LevelType>('1AC');
  const [newClassRoom, setNewClassRoom] = useState('Salle SVT 1');

  // New Student Form State
  const [studentForm, setStudentForm] = useState<Omit<Student, 'id' | 'classId'>>({
    massarCode: '',
    lastName: '',
    firstName: '',
    gender: 'M',
    group: 'G1',
    birthDate: '',
    parentPhone: '',
    medicalNotes: ''
  });

  // Import raw text state
  const [importCSVText, setImportCSVText] = useState('');

  const currentClass = state.classes.find((c) => c.id === selectedClassId) || state.classes[0];
  const classStudents = state.students.filter((s) => s.classId === currentClass?.id);

  // Filtered students
  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch =
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.massarCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'ALL' || student.group === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  const g1Count = classStudents.filter((s) => s.group === 'G1').length;
  const g2Count = classStudents.filter((s) => s.group === 'G2').length;
  const maleCount = classStudents.filter((s) => s.gender === 'M').length;
  const femaleCount = classStudents.filter((s) => s.gender === 'F').length;

  // Handle Add Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClass({
      name: newClassName.trim(),
      level: newClassLevel,
      academicYear: state.teacher.schoolYear || '2025/2026',
      roomName: newClassRoom.trim() || 'Salle SVT'
    });
    setNewClassName('');
    setShowAddClassModal(false);
  };

  // Handle Add Student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.lastName.trim() || !studentForm.firstName.trim() || !currentClass) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...studentForm,
        massarCode: studentForm.massarCode || `M${Math.floor(100000000 + Math.random() * 900000000)}`
      });
      setEditingStudent(null);
    } else {
      addStudent({
        ...studentForm,
        classId: currentClass.id,
        massarCode: studentForm.massarCode || `M${Math.floor(100000000 + Math.random() * 900000000)}`
      });
    }

    setStudentForm({
      massarCode: '',
      lastName: '',
      firstName: '',
      gender: 'M',
      group: 'G1',
      birthDate: '',
      parentPhone: '',
      medicalNotes: ''
    });
    setShowAddStudentModal(false);
  };

  // Handle Quick Group Toggle (G1 <-> G2)
  const toggleStudentGroup = (student: Student) => {
    const nextGroup = student.group === 'G1' ? 'G2' : 'G1';
    updateStudent(student.id, { group: nextGroup });
  };

  // Handle CSV Batch Import
  const handleProcessImport = () => {
    if (!importCSVText.trim() || !currentClass) return;
    const lines = importCSVText.trim().split('\n');
    const newStudents: Omit<Student, 'id'>[] = [];

    lines.forEach((line) => {
      const parts = line.split(/[;,]/).map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        // Assume format: CodeMassar; Nom; Prénom; Sexe; Groupe; ...
        const massar = parts[0] || `K${Math.floor(100000000 + Math.random() * 900000000)}`;
        const lastName = parts[1] || 'Nom';
        const firstName = parts[2] || 'Prénom';
        const gender = parts[3]?.toUpperCase() === 'F' ? 'F' : 'M';
        const group = parts[4]?.toUpperCase() === 'G2' ? 'G2' : 'G1';

        newStudents.push({
          classId: currentClass.id,
          massarCode: massar,
          lastName,
          firstName,
          gender,
          group,
          parentPhone: parts[5] || '',
          medicalNotes: parts[6] || ''
        });
      }
    });

    if (newStudents.length > 0) {
      batchImportStudents(newStudents);
      setShowImportModal(false);
      setImportCSVText('');
    } else {
      addToast('Format non reconnu. Assurez-vous d’avoir au moins Nom et Prénom.', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Class Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
              Divisions :
            </span>
            {state.classes.map((cls) => {
              const isSelected = cls.id === currentClass?.id;
              const studentNum = state.students.filter((s) => s.classId === cls.id).length;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cls.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                    {cls.level} · {studentNum}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setShowAddClassModal(true)}
              className="p-1.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer"
              title="Ajouter une division"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                if (currentClass) {
                  exportStudentsToCSV(classStudents, currentClass.name);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Exporter CSV (Massar)</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Importer liste</span>
            </button>

            <button
              onClick={() => {
                setEditingStudent(null);
                setStudentForm({
                  massarCode: '',
                  lastName: '',
                  firstName: '',
                  gender: 'M',
                  group: 'G1',
                  birthDate: '',
                  parentPhone: '',
                  medicalNotes: ''
                });
                setShowAddStudentModal(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvel élève</span>
            </button>
          </div>
        </div>

        {/* Selected Class Summary Bar */}
        {currentClass && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">
                Classe {currentClass.name}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Niveau {currentClass.level}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Salle : {currentClass.roomName}</span>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <span>Total : <strong className="text-slate-900">{classStudents.length}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Groupe 1 (G1) : <strong className="text-emerald-700">{g1Count}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Groupe 2 (G2) : <strong className="text-indigo-700">{g2Count}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Garçons : {maleCount} / Filles : {femaleCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Student List & Search / Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou Code Massar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          {/* Group Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setSelectedGroupFilter('ALL')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedGroupFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({classStudents.length})
            </button>
            <button
              onClick={() => setSelectedGroupFilter('G1')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedGroupFilter === 'G1'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Groupe 1 ({g1Count})
            </button>
            <button
              onClick={() => setSelectedGroupFilter('G2')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedGroupFilter === 'G2'
                  ? 'bg-white text-indigo-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Groupe 2 ({g2Count})
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">N°</th>
                <th className="py-3 px-4">Code Massar</th>
                <th className="py-3 px-4">Nom & Prénom</th>
                <th className="py-3 px-4 text-center">Sexe</th>
                <th className="py-3 px-4 text-center">Dédoublement TP</th>
                <th className="py-3 px-4">Contact Tuteur</th>
                <th className="py-3 px-4">Observations / Santé</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    Aucun élève trouvé pour cette sélection.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isG1 = student.group === 'G1';
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {student.massarCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student.lastName.toUpperCase()} {student.firstName}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono font-semibold ${student.gender === 'F' ? 'text-pink-600' : 'text-blue-600'}`}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStudentGroup(student)}
                          title="Cliquer pour basculer de groupe (G1 / G2)"
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                            isG1
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
                          }`}
                        >
                          {student.group} (clic pour changer)
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {student.parentPhone || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {student.medicalNotes ? (
                          <span className="text-amber-700 font-medium">{student.medicalNotes}</span>
                        ) : (
                          <span className="text-slate-400">R.A.S</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setStudentForm({
                                massarCode: student.massarCode,
                                lastName: student.lastName,
                                firstName: student.firstName,
                                gender: student.gender,
                                group: student.group,
                                birthDate: student.birthDate || '',
                                parentPhone: student.parentPhone || '',
                                medicalNotes: student.medicalNotes || ''
                              });
                              setShowAddStudentModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Confirmer la suppression de ${student.firstName} ${student.lastName} ?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Modifier la fiche élève' : 'Ajouter un élève'}
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Code Massar</label>
                <input
                  type="text"
                  placeholder="Ex: K131092001 (ou laisser vide pour générer)"
                  value={studentForm.massarCode}
                  onChange={(e) => setStudentForm({ ...studentForm, massarCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bennani"
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Youssef"
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sexe</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Groupe TP</label>
                  <select
                    value={studentForm.group}
                    onChange={(e) => setStudentForm({ ...studentForm, group: e.target.value as 'G1' | 'G2' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="G1">Groupe 1 (G1)</option>
                    <option value="G2">Groupe 2 (G2)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={studentForm.birthDate}
                    onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tél. Parent/Tuteur</label>
                  <input
                    type="tel"
                    placeholder="06XXXXXXXX"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Remarques médicales & Laboratoire SVT</label>
                <input
                  type="text"
                  placeholder="Ex: Port de lunettes pour microscope, asthme, etc."
                  value={studentForm.medicalNotes}
                  onChange={(e) => setStudentForm({ ...studentForm, medicalNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  {editingStudent ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ajouter une division</h3>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom de la classe *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 1AC-3 ou 2AC-3"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Niveau d'enseignement *</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value as LevelType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="1AC">1AC (Première Année Collégiale)</option>
                  <option value="2AC">2AC (Deuxième Année Collégiale)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Salle / Laboratoire</label>
                <input
                  type="text"
                  placeholder="Ex: Salle SVT 2 ou Labo Biologie"
                  value={newClassRoom}
                  onChange={(e) => setNewClassRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Créer la classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Importer une liste d'élèves (Massar / CSV)
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Collez les lignes d'élèves séparées par un point-virgule (;) ou une virgule (,).
                Format attendu :
              </p>
              <div className="bg-slate-100 p-2.5 rounded font-mono text-[11px] text-slate-800">
                CodeMassar; Nom; Prénom; Sexe(M/F); Groupe(G1/G2); Tél
                <br />
                K1340192; Amrani; Youssef; M; G1; 0661234567
                <br />
                K1340193; Berrada; Salma; F; G2; 0662345678
              </div>

              <textarea
                rows={6}
                value={importCSVText}
                onChange={(e) => setImportCSVText(e.target.value)}
                placeholder="Collez ici les données copiées depuis Excel ou votre fichier CSV Massar..."
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer text-xs"
              >
                Importer dans {currentClass?.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
