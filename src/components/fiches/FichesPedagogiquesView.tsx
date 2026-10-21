import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FichePedagogique, LevelType } from '../../types';
import {
  GraduationCap,
  Plus,
  Printer,
  Copy,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  FileText,
  Search,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

export const FichesPedagogiquesView: React.FC = () => {
  const { state, addFiche, updateFiche, deleteFiche, addToast } = useApp();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | LevelType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFiche, setActiveFiche] = useState<FichePedagogique | null>(state.fiches[0] || null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<FichePedagogique, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    level: '1AC',
    unit: 'Unité 1',
    chapter: 'Chapitre 1',
    duration: '2 heures',
    targetCompetencies: [''],
    prerequisites: [''],
    learningObjectives: [''],
    didacticMaterials: [''],
    startingProblem: '',
    phases: [
      {
        stage: '1. Situation déclenchante & Problématisation',
        teacherActivity: '',
        studentActivity: '',
        duration: '15 min',
        modality: 'Collectif'
      },
      {
        stage: '2. Démarche d’investigation & Manipulation TP',
        teacherActivity: '',
        studentActivity: '',
        duration: '50 min',
        modality: 'Binômes en laboratoire'
      },
      {
        stage: '3. Structuration & Trace écrite',
        teacherActivity: '',
        studentActivity: '',
        duration: '35 min',
        modality: 'Collectif'
      },
      {
        stage: '4. Évaluation formative',
        teacherActivity: '',
        studentActivity: '',
        duration: '20 min',
        modality: 'Individuel'
      }
    ],
    writtenTrace: '',
    formativeAssessment: ''
  });

  const filteredFiches = state.fiches.filter((fiche) => {
    const matchesLevel = selectedLevelFilter === 'ALL' || fiche.level === selectedLevelFilter;
    const matchesSearch =
      fiche.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fiche.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fiche.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleOpenNew = () => {
    setIsEditingExisting(false);
    setFormData({
      title: '',
      level: '1AC',
      unit: 'Unité 1 : Les relations entre les êtres vivants et leur milieu',
      chapter: 'Chapitre 1 : Découverte d’un milieu naturel',
      duration: '2 heures (Séance TP)',
      targetCompetencies: [
        'Pratiquer une démarche d’investigation scientifique.',
        'Utiliser le matériel de laboratoire (microscopes, lames, pinces).'
      ],
      prerequisites: ['Notion d’être vivant et milieu de vie.'],
      learningObjectives: ['Identifier les caractéristiques cellulaires.'],
      didacticMaterials: ['Microscopes optiques', 'Lames et lamelles', 'Manuels scolaires'],
      startingProblem: 'Constat de départ suscitant le questionnement des élèves...',
      phases: [
        {
          stage: '1. Situation déclenchante & Problème scientifique',
          teacherActivity: 'Propose la situation-problème et guide le questionnement.',
          studentActivity: 'Expriment leurs conceptions initiales et formulent des hypothèses.',
          duration: '15 min',
          modality: 'Collectif'
        },
        {
          stage: '2. Recherche & Démarche d’investigation',
          teacherActivity: 'Donne les consignes du protocole expérimental et supervise le travail.',
          studentActivity: 'Manipulent en laboratoire, observent et recueillent les résultats.',
          duration: '55 min',
          modality: 'Binômes en TP'
        },
        {
          stage: '3. Structuration & Traces écrites',
          teacherActivity: 'Anime la confrontation des résultats et valide le bilan notionnel.',
          studentActivity: 'Participent à l’élaboration de la synthèse et notent le résumé au cahier.',
          duration: '30 min',
          modality: 'Collectif / Individuel'
        },
        {
          stage: '4. Évaluation formative',
          teacherActivity: 'Propose un exercice d’application immédiate pour vérifier la maîtrise.',
          studentActivity: 'Résolvent la tâche d’évaluation.',
          duration: '20 min',
          modality: 'Individuel'
        }
      ],
      writtenTrace: 'Bilan de la séance à retenir par les élèves...',
      formativeAssessment: 'Critères d’évaluation et exercice test...'
    });
    setShowEditorModal(true);
  };

  const handleOpenEdit = (fiche: FichePedagogique) => {
    setIsEditingExisting(true);
    setFormData({
      title: fiche.title,
      level: fiche.level,
      unit: fiche.unit,
      chapter: fiche.chapter,
      duration: fiche.duration,
      targetCompetencies: [...fiche.targetCompetencies],
      prerequisites: [...fiche.prerequisites],
      learningObjectives: [...fiche.learningObjectives],
      didacticMaterials: [...fiche.didacticMaterials],
      startingProblem: fiche.startingProblem,
      phases: fiche.phases.map((p) => ({ ...p })),
      writtenTrace: fiche.writtenTrace,
      formativeAssessment: fiche.formativeAssessment
    });
    setShowEditorModal(true);
  };

  const handleDuplicate = (fiche: FichePedagogique) => {
    addFiche({
      ...fiche,
      title: `${fiche.title} (Copie)`
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (isEditingExisting && activeFiche) {
      updateFiche(activeFiche.id, formData);
      setActiveFiche({ ...activeFiche, ...formData, updatedAt: new Date().toISOString().split('T')[0] });
    } else {
      addFiche(formData);
    }

    setShowEditorModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Préparation Didactique & Approche par Compétences (APC)
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Fiches Pédagogiques SVT Collège Maroc (1AC & 2AC)
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Conformes aux orientations pédagogiques officielles du Ministère de l'Éducation Nationale.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              disabled={!activeFiche}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer la fiche active</span>
            </button>
            <button
              onClick={handleOpenNew}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle fiche pédagogique</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedLevelFilter('ALL')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedLevelFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous les niveaux ({state.fiches.length})
            </button>
            <button
              onClick={() => setSelectedLevelFilter('1AC')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedLevelFilter === '1AC'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Niveau 1AC
            </button>
            <button
              onClick={() => setSelectedLevelFilter('2AC')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedLevelFilter === '2AC'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Niveau 2AC
            </button>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une fiche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar List + Right Full Fiche Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fiches List (hidden during print) */}
        <div className="lg:col-span-4 space-y-3 no-print">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Fiches disponibles ({filteredFiches.length})
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredFiches.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
                Aucune fiche trouvée.
              </div>
            ) : (
              filteredFiches.map((fiche) => {
                const isSelected = activeFiche?.id === fiche.id;
                return (
                  <div
                    key={fiche.id}
                    onClick={() => setActiveFiche(fiche)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        {fiche.level}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {fiche.duration}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                      {fiche.title}
                    </h3>

                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {fiche.chapter}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Màj : {fiche.updatedAt}</span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDuplicate(fiche)}
                          title="Dupliquer"
                          className="p-1 hover:text-slate-900 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveFiche(fiche);
                            handleOpenEdit(fiche);
                          }}
                          title="Modifier"
                          className="p-1 hover:text-slate-900 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer la fiche "${fiche.title}" ?`)) {
                              deleteFiche(fiche.id);
                              if (activeFiche?.id === fiche.id) {
                                setActiveFiche(null);
                              }
                            }
                          }}
                          title="Supprimer"
                          className="p-1 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Fiche Pedagogique Document (Printable) */}
        <div className="lg:col-span-8">
          {activeFiche ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:p-0">
              
              {/* Official Moroccan Ministerial Header for Fiche Pédagogique */}
              <div className="border-2 border-slate-900 p-4 rounded-lg bg-slate-50/50 space-y-3">
                <div className="grid grid-cols-3 items-center text-center text-xs border-b border-slate-300 pb-2">
                  <div className="text-left font-serif leading-tight">
                    <div className="font-bold uppercase tracking-wider text-[11px]">Royaume du Maroc</div>
                    <div>Ministère de l'Éducation Nationale</div>
                    <div className="text-[10px] text-slate-600">{state.teacher.academy}</div>
                    <div className="text-[10px] text-slate-600">{state.teacher.directorate}</div>
                  </div>
                  <div className="font-bold text-sm tracking-wide uppercase text-slate-900">
                    FICHE PÉDAGOGIQUE
                    <div className="text-xs font-normal capitalize">Sciences de la Vie et de la Terre</div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div>Prof : <strong>{state.teacher.name}</strong></div>
                    <div>Établissement : <strong>{state.teacher.schoolName}</strong></div>
                    <div>Année : <span className="font-mono">{state.teacher.schoolYear}</span></div>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Niveau</span>
                    <strong className="text-slate-900">{activeFiche.level} (Collège)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Durée allouée</span>
                    <strong className="text-slate-900 font-mono">{activeFiche.duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Unité</span>
                    <span className="text-slate-900 font-medium truncate block">{activeFiche.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Chapitre</span>
                    <span className="text-slate-900 font-medium truncate block">{activeFiche.chapter}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-300">
                  <div className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider">
                    Sujet de la leçon / Activité didactique :
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {activeFiche.title}
                  </h2>
                </div>
              </div>

              {/* Competencies, Prerequisites, Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1">
                    Compétences Visées
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {activeFiche.targetCompetencies.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1">
                    Prérequis Nécessaires
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {activeFiche.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1">
                    Objectifs Opérationnels
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {activeFiche.learningObjectives.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Matériel Didactique & Situation-Problème */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1.5">
                    Matériel didactique & Supports d'apprentissage
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeFiche.didacticMaterials.map((mat, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40">
                  <h3 className="font-bold text-amber-950 uppercase text-[11px] tracking-wider mb-1">
                    Situation-Problème de départ (وضعية الانطلاق)
                  </h3>
                  <p className="text-amber-950 leading-relaxed italic">
                    « {activeFiche.startingProblem} »
                  </p>
                </div>
              </div>

              {/* 4-Columns Phases Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                  Déroulement Didactique des Activités d'Apprentissage
                </h3>

                <div className="border border-slate-300 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3 w-1/4 border-r border-slate-300">Étape Didactique</th>
                        <th className="py-2.5 px-3 w-1/3 border-r border-slate-300">Activités du Professeur</th>
                        <th className="py-2.5 px-3 w-1/3 border-r border-slate-300">Activités des Apprenants</th>
                        <th className="py-2.5 px-3 w-28 text-center">Modalité & Durée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {activeFiche.phases.map((phase, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200 align-top">
                            {phase.stage}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 align-top leading-relaxed">
                            {phase.teacherActivity}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 align-top leading-relaxed">
                            {phase.studentActivity}
                          </td>
                          <td className="py-2.5 px-3 text-center align-top font-mono text-[11px]">
                            <div className="font-semibold text-slate-800">{phase.duration}</div>
                            <div className="text-slate-500 font-sans text-[10px] mt-0.5">{phase.modality}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Traces Écrites / Bilan */}
              <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/70 space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Traces Écrites & Bilan Notuel (الحصيلة المعرفية)
                </h3>
                <p className="leading-relaxed text-slate-800 whitespace-pre-line">
                  {activeFiche.writtenTrace}
                </p>
              </div>

              {/* Évaluation formative */}
              <div className="p-4 rounded-lg border border-slate-300 space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Évaluation Formative & Critères de Réussite (التقويم التكويني)
                </h3>
                <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                  {activeFiche.formativeAssessment}
                </p>
              </div>

              {/* Signatures Block for Print */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 text-xs text-center font-serif">
                <div>
                  <div className="font-bold">Signature de l'Enseignant :</div>
                  <div className="h-16"></div>
                  <div className="text-slate-600">{state.teacher.name}</div>
                </div>
                <div>
                  <div className="font-bold">Visa de l'Inspection Pédagogique :</div>
                  <div className="h-16"></div>
                  <div className="text-slate-400">Date et signature</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Sélectionnez une fiche pédagogique dans la liste à gauche ou créez-en une nouvelle.
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal for creating/updating a Fiche */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isEditingExisting ? 'Modifier la fiche pédagogique' : 'Créer une fiche pédagogique (Modèle MEN SVT)'}
              </h3>
              <button
                onClick={() => setShowEditorModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Niveau *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as LevelType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="1AC">1AC (Première Année Collégiale)</option>
                    <option value="2AC">2AC (Deuxième Année Collégiale)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Durée allouée *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2 heures"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Titre de la leçon / séance didactique *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: La respiration branchiale chez le poisson et la mise en évidence des échanges gazeux"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Situation-problème de départ</label>
                <textarea
                  rows={2}
                  placeholder="Situation motivante posant un paradoxe scientifique pour déclencher l'investigation..."
                  value={formData.startingProblem}
                  onChange={(e) => setFormData({ ...formData, startingProblem: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Compétences visées (une par ligne)</label>
                  <textarea
                    rows={3}
                    value={formData.targetCompetencies.join('\n')}
                    onChange={(e) => setFormData({ ...formData, targetCompetencies: e.target.value.split('\n') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Objectifs d'apprentissage opérationnels</label>
                  <textarea
                    rows={3}
                    value={formData.learningObjectives.join('\n')}
                    onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value.split('\n') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Prérequis</label>
                  <input
                    type="text"
                    value={formData.prerequisites.join(', ')}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value.split(',').map((s) => s.trim()) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Matériel didactique & supports</label>
                  <input
                    type="text"
                    value={formData.didacticMaterials.join(', ')}
                    onChange={(e) => setFormData({ ...formData, didacticMaterials: e.target.value.split(',').map((s) => s.trim()) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Traces écrites / Bilan notionnel</label>
                <textarea
                  rows={3}
                  value={formData.writtenTrace}
                  onChange={(e) => setFormData({ ...formData, writtenTrace: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Évaluation formative & Critères</label>
                <textarea
                  rows={2}
                  value={formData.formativeAssessment}
                  onChange={(e) => setFormData({ ...formData, formativeAssessment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  {isEditingExisting ? 'Mettre à jour la fiche' : 'Enregistrer la fiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
