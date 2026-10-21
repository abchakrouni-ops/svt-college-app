import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RemediationPlan, LevelType } from '../../types';
import {
  Sparkles,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Trash2,
  Edit2,
  HelpCircle,
  X
} from 'lucide-react';

const DOMAINS_CONFIG = {
  INVESTIGATION: {
    label: "Démarche d'investigation & Hypothèses",
    color: 'text-indigo-800 bg-indigo-50 border-indigo-200'
  },
  ANALYSE_DOCS: {
    label: 'Analyse de graphiques & Documents',
    color: 'text-sky-800 bg-sky-50 border-sky-200'
  },
  LEXIQUE_SCIENTIFIQUE: {
    label: 'Terminologie & Lexique scientifique',
    color: 'text-purple-800 bg-purple-50 border-purple-200'
  },
  SCHEMA_DESSIN: {
    label: 'Dessin d’observation & Schémas normés',
    color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
  },
  MANIPULATION_LABO: {
    label: 'Manipulations de laboratoire & Microscope',
    color: 'text-amber-800 bg-amber-50 border-amber-200'
  },
  RAISONNEMENT: {
    label: 'Raisonnement logique & Synthèse écrite',
    color: 'text-rose-800 bg-rose-50 border-rose-200'
  }
};

export const RemediationView: React.FC = () => {
  const { state, addRemediationPlan, updateRemediationPlan, deleteRemediationPlan } = useApp();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | LevelType>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activePlan, setActivePlan] = useState<RemediationPlan | null>(state.remediations[0] || null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formLevel, setFormLevel] = useState<LevelType>('1AC');
  const [formDomain, setFormDomain] = useState<RemediationPlan['domain']>('INVESTIGATION');
  const [formDescription, setFormDescription] = useState('');
  const [formActivities, setFormActivities] = useState('');
  const [formEvalMethod, setFormEvalMethod] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentObservations, setStudentObservations] = useState<Record<string, string>>({});

  const filteredPlans = state.remediations.filter(
    (p) => selectedLevelFilter === 'ALL' || p.level === selectedLevelFilter
  );

  const availableStudentsForLevel = state.students.filter((s) => {
    const cls = state.classes.find((c) => c.id === s.classId);
    return cls?.level === formLevel;
  });

  const handleToggleStudentSelection = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const targetStudents = selectedStudentIds.map((id) => {
      const student = state.students.find((s) => s.id === id);
      return {
        studentId: id,
        studentName: student ? `${student.lastName.toUpperCase()} ${student.firstName}` : 'Élève',
        classId: student?.classId || '',
        initialObservation: studentObservations[id] || 'Difficulté constatée lors des évaluations.',
        outcomeStatus: 'EN_COURS' as const
      };
    });

    addRemediationPlan({
      title: formTitle.trim(),
      level: formLevel,
      domain: formDomain,
      description: formDescription.trim(),
      plannedActivities: formActivities.trim(),
      evaluationMethod: formEvalMethod.trim(),
      datePlanned: formDate,
      completed: false,
      targetStudents
    });

    setFormTitle('');
    setFormDescription('');
    setFormActivities('');
    setFormEvalMethod('');
    setSelectedStudentIds([]);
    setStudentObservations({});
    setShowAddModal(false);
  };

  const handleToggleOutcome = (planId: string, studentId: string) => {
    const plan = state.remediations.find((p) => p.id === planId);
    if (!plan) return;

    const nextStatuses: Record<string, 'ACQUIS' | 'EN_COURS' | 'NON_ACQUIS'> = {
      EN_COURS: 'ACQUIS',
      ACQUIS: 'NON_ACQUIS',
      NON_ACQUIS: 'EN_COURS'
    };

    const updatedStudents = plan.targetStudents.map((st) => {
      if (st.studentId === studentId) {
        return { ...st, outcomeStatus: nextStatuses[st.outcomeStatus] };
      }
      return st;
    });

    updateRemediationPlan(planId, { targetStudents: updatedStudents });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Dispositif de Soutien Pédagogique & Remédiation SVT (الدعم والتقويم)
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Suivi des Difficultés & Ateliers de Remédiation (1AC & 2AC)
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Diagnostic ciblé des lacunes méthodologiques, expérimentales et conceptuelles avec plan d'action adapté.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              disabled={!activePlan}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer fiche de soutien</span>
            </button>
            <button
              onClick={() => {
                setFormTitle('');
                setFormDescription('');
                setFormActivities('');
                setFormEvalMethod('');
                setSelectedStudentIds([]);
                setShowAddModal(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau plan de remédiation</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
            Niveau :
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedLevelFilter('ALL')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedLevelFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({state.remediations.length})
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
        </div>
      </div>

      {/* Main split: List on Left, Active Plan Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Remediation Plans List */}
        <div className="lg:col-span-4 space-y-3 no-print">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Plans enregistrés ({filteredPlans.length})
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredPlans.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
                Aucun plan de remédiation enregistré pour ce filtre.
              </div>
            ) : (
              filteredPlans.map((plan) => {
                const isSelected = activePlan?.id === plan.id;
                const domainCfg = DOMAINS_CONFIG[plan.domain] || DOMAINS_CONFIG.INVESTIGATION;
                const acquiredCount = plan.targetStudents.filter((s) => s.outcomeStatus === 'ACQUIS').length;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setActivePlan(plan)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        {plan.level}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {plan.datePlanned}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                      {plan.title}
                    </h3>

                    <div className="mt-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${domainCfg.color}`}>
                        {domainCfg.label}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>
                        Élèves ciblés : <strong>{plan.targetStudents.length}</strong> (Acquis : {acquiredCount})
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Supprimer le plan "${plan.title}" ?`)) {
                            deleteRemediationPlan(plan.id);
                            if (activePlan?.id === plan.id) {
                              setActivePlan(null);
                            }
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Remediation Plan View / Printable Sheet */}
        <div className="lg:col-span-8">
          {activePlan ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:p-0">
              
              {/* Header Box */}
              <div className="border-2 border-slate-900 p-4 rounded-lg bg-slate-50/50 space-y-3">
                <div className="grid grid-cols-3 items-center text-center text-xs border-b border-slate-300 pb-2">
                  <div className="text-left font-serif leading-tight">
                    <div className="font-bold uppercase tracking-wider text-[11px]">Royaume du Maroc</div>
                    <div>Ministère de l'Éducation Nationale</div>
                    <div className="text-[10px] text-slate-600">{state.teacher.directorate}</div>
                  </div>
                  <div className="font-bold text-sm tracking-wide uppercase text-slate-900">
                    FICHE DE SOUTIEN & REMÉDIATION PÉDAGOGIQUE
                    <div className="text-xs font-normal capitalize">Sciences de la Vie et de la Terre</div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div>Prof : <strong>{state.teacher.name}</strong></div>
                    <div>Établissement : <strong>{state.teacher.schoolName}</strong></div>
                    <div>Date : <span className="font-mono">{activePlan.datePlanned}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Niveau</span>
                    <strong className="text-slate-900">{activePlan.level} (Collège)</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Domaine de compétence</span>
                    <strong className="text-slate-900">{DOMAINS_CONFIG[activePlan.domain]?.label}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-300">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Intitulé de l'atelier de remédiation :
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {activePlan.title}
                  </h2>
                </div>
              </div>

              {/* Description & Diagnostic */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Diagnostic & Nature des Difficultés Observées
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {activePlan.description}
                </p>
              </div>

              {/* Target Students Table with interactive outcome buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                    Groupe de Besoin : Élèves Bénéficiaires & Suivi des Acquis
                  </h3>
                  <span className="text-slate-500 text-xs no-print">
                    (Cliquez sur le statut pour valider l'acquisition)
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3 w-10 text-center">N°</th>
                        <th className="py-2.5 px-3">Nom & Prénom de l'élève</th>
                        <th className="py-2.5 px-3">Constat initial / Difficulté repérée</th>
                        <th className="py-2.5 px-3 text-center w-36">Résultat post-remédiation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {activePlan.targetStudents.map((st, idx) => {
                        const isAcquis = st.outcomeStatus === 'ACQUIS';
                        const isEnCours = st.outcomeStatus === 'EN_COURS';

                        return (
                          <tr key={st.studentId} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {st.studentName}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {st.initialObservation}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleToggleOutcome(activePlan.id, st.studentId)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                                  isAcquis
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : isEnCours
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-red-100 text-red-800 border border-red-300'
                                }`}
                                title="Cliquer pour changer de statut"
                              >
                                {isAcquis ? '✓ Acquis' : isEnCours ? '⏳ En cours' : '✗ Non acquis'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Planned Activities & Pedagogical Strategy */}
              <div className="p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Activités Pédagogiques de Soutien & Dispositif Didactique
                </h3>
                <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                  {activePlan.plannedActivities}
                </p>
              </div>

              {/* Evaluation method */}
              <div className="p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Modalité d'Évaluation de la Remédiation (Critères de réussite)
                </h3>
                <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                  {activePlan.evaluationMethod}
                </p>
              </div>

              {/* Signature block */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 text-xs text-center font-serif">
                <div>
                  <div className="font-bold">Professeur encadrant :</div>
                  <div className="h-14"></div>
                  <div className="text-slate-600">{state.teacher.name}</div>
                </div>
                <div>
                  <div className="font-bold">Administration / Conseil pédagogique :</div>
                  <div className="h-14"></div>
                  <div className="text-slate-400">Date et visa</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Sélectionnez un plan de remédiation dans la liste ou créez-en un nouveau.
            </div>
          )}
        </div>
      </div>

      {/* Add Remediation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Créer un plan de soutien & remédiation SVT
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Niveau *</label>
                  <select
                    value={formLevel}
                    onChange={(e) => {
                      setFormLevel(e.target.value as LevelType);
                      setSelectedStudentIds([]);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="1AC">1AC (1ère Année Collégiale)</option>
                    <option value="2AC">2AC (2ème Année Collégiale)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Domaine de compétence *</label>
                  <select
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {Object.entries(DOMAINS_CONFIG).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date prévue *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Intitulé du plan *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Remédiation sur la formulation d'hypothèses et l'interprétation des expériences"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diagnostic des difficultés observées *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explication précise des écueils rencontrés lors des contrôles continus..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Student selector for this level */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Sélectionner les élèves concernés ({selectedStudentIds.length} sélectionnés)
                </label>
                <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2.5 space-y-1 bg-slate-50/50">
                  {availableStudentsForLevel.map((st) => {
                    const isSelected = selectedStudentIds.includes(st.id);
                    return (
                      <label
                        key={st.id}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleStudentSelection(st.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-slate-900">
                          {st.lastName.toUpperCase()} {st.firstName}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          ({st.group})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Activités de soutien et démarches proposées</label>
                <textarea
                  rows={3}
                  placeholder="Exercices de renforcement, manipulation guidée, fiches d'auto-évaluation..."
                  value={formActivities}
                  onChange={(e) => setFormActivities(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Critères de validation et modalité d'évaluation</label>
                <input
                  type="text"
                  placeholder="Ex: Test rapide de 10 min portant sur la rédaction d'une conclusion expérimentale"
                  value={formEvalMethod}
                  onChange={(e) => setFormEvalMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
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
                  Créer le plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
