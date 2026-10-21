import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CahierEntry, GroupType, LevelType } from '../../types';
import {
  BookOpen,
  Plus,
  Printer,
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

export const CahierTextesView: React.FC = () => {
  const {
    state,
    selectedClassId,
    setSelectedClassId,
    addCahierEntry,
    updateCahierEntry,
    deleteCahierEntry
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<'ALL' | GroupType>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CahierEntry | null>(null);

  // Form State
  const [formClassId, setFormClassId] = useState(selectedClassId);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTimeSlot, setFormTimeSlot] = useState('08h30 - 10h20');
  const [formGroup, setFormGroup] = useState<GroupType>('CE');
  const [formUnitId, setFormUnitId] = useState('1ac-u1');
  const [formChapterId, setFormChapterId] = useState('1ac-u1-ch1');
  const [formTitle, setFormTitle] = useState('');
  const [formActivities, setFormActivities] = useState('');
  const [formDocuments, setFormDocuments] = useState('');
  const [formHomework, setFormHomework] = useState('');
  const [formHomeworkDueDate, setFormHomeworkDueDate] = useState('');
  const [formStatus, setFormStatus] = useState<'FAIT' | 'REPORTE' | 'PLANIFIE'>('FAIT');

  const currentClass = state.classes.find((c) => c.id === selectedClassId) || state.classes[0];
  const classEntries = state.cahierEntries.filter((e) => e.classId === currentClass?.id);

  // Filtered Entries
  const filteredEntries = classEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.activities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.homework && entry.homework.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = selectedGroupFilter === 'ALL' || entry.group === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  // When class changes in modal, auto-update level & unit options
  const targetClassForForm = state.classes.find((c) => c.id === formClassId) || currentClass;
  const targetUnits = state.progression.filter((u) => u.level === targetClassForForm?.level);
  const selectedUnit = targetUnits.find((u) => u.id === formUnitId) || targetUnits[0];

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormClassId(currentClass?.id || state.classes[0].id);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTimeSlot('08h30 - 10h20');
    setFormGroup('CE');
    const defaultUnit = state.progression.find((u) => u.level === currentClass?.level) || state.progression[0];
    setFormUnitId(defaultUnit?.id || '');
    setFormChapterId(defaultUnit?.chapters[0]?.id || '');
    setFormTitle('');
    setFormActivities('');
    setFormDocuments('');
    setFormHomework('');
    setFormHomeworkDueDate('');
    setFormStatus('FAIT');
    setShowAddModal(true);
  };

  const handleOpenEdit = (entry: CahierEntry) => {
    setEditingEntry(entry);
    setFormClassId(entry.classId);
    setFormDate(entry.date);
    setFormTimeSlot(entry.timeSlot);
    setFormGroup(entry.group);
    setFormUnitId(entry.unitId);
    setFormChapterId(entry.chapterId);
    setFormTitle(entry.title);
    setFormActivities(entry.activities);
    setFormDocuments(entry.documents);
    setFormHomework(entry.homework || '');
    setFormHomeworkDueDate(entry.homeworkDueDate || '');
    setFormStatus(entry.status);
    setShowAddModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formActivities.trim()) return;

    const payload = {
      classId: formClassId,
      level: targetClassForForm?.level || '1AC',
      group: formGroup,
      date: formDate,
      timeSlot: formTimeSlot,
      unitId: formUnitId,
      chapterId: formChapterId,
      title: formTitle.trim(),
      activities: formActivities.trim(),
      documents: formDocuments.trim(),
      homework: formHomework.trim() || undefined,
      homeworkDueDate: formHomeworkDueDate || undefined,
      status: formStatus
    };

    if (editingEntry) {
      updateCahierEntry(editingEntry.id, payload);
    } else {
      addCahierEntry(payload);
    }

    setShowAddModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Cahier de Textes Numérique Officiel
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Suivi des séances et activités SVT · {currentClass?.name}
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Enregistrement des leçons, travaux pratiques en dédoublement et devoirs à domicile.
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer le registre</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle séance</span>
            </button>
          </div>
        </div>

        {/* Class Selection Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
              Classe :
            </span>
            {state.classes.map((cls) => {
              const isSelected = cls.id === currentClass?.id;
              const entriesCount = state.cahierEntries.filter((e) => e.classId === cls.id).length;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cls.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                    {entriesCount} séances
                  </span>
                </button>
              );
            })}
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedGroupFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedGroupFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedGroupFilter('CE')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedGroupFilter === 'CE'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classe entière (CE)
            </button>
            <button
              onClick={() => setSelectedGroupFilter('G1')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedGroupFilter === 'G1'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Groupe 1 (G1)
            </button>
            <button
              onClick={() => setSelectedGroupFilter('G2')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedGroupFilter === 'G2'
                  ? 'bg-white text-indigo-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Groupe 2 (G2)
            </button>
          </div>
        </div>
      </div>

      {/* Printable Header (Visible only when printing) */}
      <div className="hidden print:block p-4 border-b-2 border-slate-900 mb-4 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
          Royaume du Maroc · Ministère de l'Éducation Nationale
        </div>
        <div className="text-sm font-semibold mt-1">
          {state.teacher.academy} · {state.teacher.directorate}
        </div>
        <h2 className="text-lg font-bold mt-2 underline">
          CAHIER DE TEXTES DE SCIENCES DE LA VIE ET DE LA TERRE
        </h2>
        <div className="text-xs mt-1 flex justify-center gap-6">
          <span>Classe : <strong>{currentClass?.name} ({currentClass?.level})</strong></span>
          <span>Enseignant : <strong>{state.teacher.name}</strong></span>
          <span>Année scolaire : <strong>{state.teacher.schoolYear}</strong></span>
        </div>
      </div>

      {/* Cahier Entries Timeline List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Aucune séance enregistrée pour cette sélection.</p>
            <p className="text-xs mt-1">Cliquez sur « Nouvelle séance » pour consigner une leçon ou un TP.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isG1 = entry.group === 'G1';
            const isG2 = entry.group === 'G2';

            return (
              <div
                key={entry.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {entry.date}
                    </span>
                    <span className="font-mono text-xs text-slate-600">
                      {entry.timeSlot}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isG1
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isG2
                        ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {entry.group === 'CE' ? 'Classe Entière' : `Dédoublement (${entry.group})`}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`text-[11px] font-semibold ${
                      entry.status === 'FAIT'
                        ? 'text-emerald-700'
                        : entry.status === 'REPORTE'
                        ? 'text-amber-700'
                        : 'text-sky-700'
                    }`}>
                      {entry.status === 'FAIT' ? 'Séance Réalisée' : entry.status === 'REPORTE' ? 'Reportée' : 'Planifiée'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 no-print">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                      title="Modifier la séance"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Confirmer la suppression de cette séance du cahier de textes ?')) {
                          deleteCahierEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer transition-colors"
                      title="Supprimer la séance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-3.5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <strong className="text-slate-900">Activités & Déroulement didactique : </strong>
                      <p className="mt-0.5 leading-relaxed text-slate-700 whitespace-pre-line">
                        {entry.activities}
                      </p>
                    </div>

                    {entry.documents && (
                      <div className="pt-1 text-slate-600">
                        <strong className="text-slate-800">Supports & Matériel exploité : </strong>
                        <span>{entry.documents}</span>
                      </div>
                    )}
                  </div>

                  {entry.homework && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <span>Devoir / Travail à faire pour la séance suivante :</span>
                        </span>
                        {entry.homeworkDueDate && (
                          <span className="font-mono text-[11px] font-semibold text-amber-800">
                            Échéance : {entry.homeworkDueDate}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-amber-950 leading-relaxed">{entry.homework}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingEntry ? 'Modifier la séance' : 'Consigner une nouvelle séance'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Classe *</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {state.classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Créneau horaire *</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="08h30 - 10h20">08h30 - 10h20</option>
                    <option value="10h40 - 12h30">10h40 - 12h30</option>
                    <option value="14h30 - 16h20">14h30 - 16h20</option>
                    <option value="16h40 - 18h30">16h40 - 18h30</option>
                    <option value="08h30 - 09h30">08h30 - 09h30</option>
                    <option value="09h30 - 10h30">09h30 - 10h30</option>
                    <option value="10h40 - 11h40">10h40 - 11h40</option>
                    <option value="11h40 - 12h30">11h40 - 12h30</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Groupe d'élèves *</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as GroupType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="CE">Classe Entière (CE)</option>
                    <option value="G1">Dédoublement TP - Groupe 1 (G1)</option>
                    <option value="G2">Dédoublement TP - Groupe 2 (G2)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Statut de la séance</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="FAIT">Réalisée</option>
                    <option value="PLANIFIE">Planifiée</option>
                    <option value="REPORTE">Reportée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unité du programme officiel</label>
                  <select
                    value={formUnitId}
                    onChange={(e) => {
                      setFormUnitId(e.target.value);
                      const unit = targetUnits.find((u) => u.id === e.target.value);
                      if (unit && unit.chapters.length > 0) {
                        setFormChapterId(unit.chapters[0].id);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none truncate"
                  >
                    {targetUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Chapitre</label>
                  <select
                    value={formChapterId}
                    onChange={(e) => setFormChapterId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none truncate"
                  >
                    {selectedUnit?.chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.code} : {ch.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Intitulé de la séance / Objet de la leçon *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TP : Dissection d'une branchie de poisson et mise en évidence de la respiration aquatique"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Activités réalisées & démarche d'investigation *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Description détaillée : démarche suivie, manipulations TP en binômes, observations au microscope, formulation d'hypothèses, synthèse et traces écrites..."
                  value={formActivities}
                  onChange={(e) => setFormActivities(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Supports & Matériel didactique exploités</label>
                <input
                  type="text"
                  placeholder="Ex: Manuel de SVT p.28, cuvette de dissection, loupe binoculaire, eau de chaux..."
                  value={formDocuments}
                  onChange={(e) => setFormDocuments(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/60 p-3 rounded-lg border border-amber-200/80">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-amber-900 mb-1">Devoirs & Travail à faire pour la prochaine séance</label>
                  <input
                    type="text"
                    placeholder="Ex: Répondre aux questions 1 et 2 p. 30 du manuel sur le cahier de recherche"
                    value={formHomework}
                    onChange={(e) => setFormHomework(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg focus:ring-1 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-amber-900 mb-1">Échéance</label>
                  <input
                    type="date"
                    value={formHomeworkDueDate}
                    onChange={(e) => setFormHomeworkDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg font-mono focus:ring-1 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  {editingEntry ? 'Mettre à jour' : 'Enregistrer au cahier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
