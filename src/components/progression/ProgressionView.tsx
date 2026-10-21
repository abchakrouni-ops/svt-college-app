import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LevelType, SemesterType } from '../../types';
import {
  Clock,
  Printer,
  CheckCircle2,
  PlayCircle,
  CircleDashed,
  Plus,
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ProgressionView: React.FC = () => {
  const { state, updateChapterStatus, setActiveTab } = useApp();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<LevelType>('1AC');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<'ALL' | SemesterType>('ALL');

  const filteredUnits = state.progression.filter((u) => {
    const matchesLevel = u.level === selectedLevelFilter;
    const matchesSem = selectedSemesterFilter === 'ALL' || u.semester === selectedSemesterFilter;
    return matchesLevel && matchesSem;
  });

  // Calculate totals
  const totalLevelHours = state.progression
    .filter((u) => u.level === selectedLevelFilter)
    .reduce((sum, u) => sum + u.totalHours, 0);

  const doneLevelHours = state.progression
    .filter((u) => u.level === selectedLevelFilter)
    .flatMap((u) => u.chapters)
    .reduce((sum, ch) => sum + (ch.completedHours || 0), 0);

  const globalPercentage = totalLevelHours > 0 ? Math.round((doneLevelHours / totalLevelHours) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Banner & Level Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Curriculum & Instructions Officielles MEN Maroc
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Progression Pédagogique Annuelle SVT ({selectedLevelFilter})
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Répartition des unités didactiques, chapitres, volumes horaires et situations d'investigation.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer la progression</span>
            </button>
          </div>
        </div>

        {/* Level and Semester Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Niveau :
            </span>
            <button
              onClick={() => setSelectedLevelFilter('1AC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedLevelFilter === '1AC'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              1AC (1ère Année Collégiale)
            </button>
            <button
              onClick={() => setSelectedLevelFilter('2AC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedLevelFilter === '2AC'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              2AC (2ème Année Collégiale)
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedSemesterFilter('ALL')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedSemesterFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous les semestres
            </button>
            <button
              onClick={() => setSelectedSemesterFilter('S1')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedSemesterFilter === 'S1'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semestre 1 (S1)
            </button>
            <button
              onClick={() => setSelectedSemesterFilter('S2')}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedSemesterFilter === 'S2'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semestre 2 (S2)
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-slate-700">
              Avancement global {selectedLevelFilter} : {doneLevelHours}h réalisées sur {totalLevelHours}h préconisées
            </span>
            <span className="font-mono font-bold text-emerald-700">{globalPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${globalPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Printable Header */}
      <div className="hidden print:block p-4 border-b-2 border-slate-900 mb-4 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
          Royaume du Maroc · Ministère de l'Éducation Nationale
        </div>
        <div className="text-sm font-semibold mt-1">
          {state.teacher.academy} · {state.teacher.directorate}
        </div>
        <h2 className="text-lg font-bold mt-2 underline">
          PROGRESSION PÉDAGOGIQUE ANNUELLE · SVT NIVEAU {selectedLevelFilter}
        </h2>
        <div className="text-xs mt-1">
          Enseignant : <strong>{state.teacher.name}</strong> · Année scolaire : <strong>{state.teacher.schoolYear}</strong>
        </div>
      </div>

      {/* Units & Chapters List */}
      <div className="space-y-6">
        {filteredUnits.map((unit) => {
          const unitDoneHours = unit.chapters.reduce((sum, ch) => sum + (ch.completedHours || 0), 0);
          const unitPercent = Math.round((unitDoneHours / unit.totalHours) * 100);

          return (
            <div
              key={unit.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Unit Header */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                    {unit.level} · {unit.semester === 'S1' ? 'Premier Semestre' : 'Deuxième Semestre'}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold mt-0.5">
                    {unit.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-300">
                      {unitDoneHours}h / {unit.totalHours}h
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {unitPercent}% réalisé
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters list */}
              <div className="divide-y divide-slate-100">
                {unit.chapters.map((ch) => {
                  const isDone = ch.status === 'TERMINE';
                  const isInProgress = ch.status === 'EN_COURS';

                  return (
                    <div key={ch.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                              {ch.code}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              {ch.title}
                            </h3>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="font-mono text-xs text-slate-500">
                              Volume alloué : {ch.allocatedHours} heures
                            </span>
                          </div>

                          {/* Key concepts */}
                          <div className="pt-1">
                            <span className="text-xs font-semibold text-slate-600">Concepts clés : </span>
                            <span className="text-xs text-slate-600">
                              {ch.keyConcepts.join(' · ')}
                            </span>
                          </div>

                          {/* Investigation Situations */}
                          {ch.investigationSituations.length > 0 && (
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
                              <span className="font-semibold text-slate-800 block">
                                Situations d'investigation & Travaux pratiques préconisés :
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                                {ch.investigationSituations.map((sit, i) => (
                                  <li key={i}>{sit}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Status Switcher & Hours Stepper */}
                        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0 no-print">
                          {/* Segmented status buttons */}
                          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                            <button
                              onClick={() => updateChapterStatus(unit.id, ch.id, 'TERMINE')}
                              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                                isDone
                                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Terminé</span>
                            </button>
                            <button
                              onClick={() => updateChapterStatus(unit.id, ch.id, 'EN_COURS')}
                              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                                isInProgress
                                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <PlayCircle className="w-3 h-3" />
                              <span>En cours</span>
                            </button>
                            <button
                              onClick={() => updateChapterStatus(unit.id, ch.id, 'A_VENIR', 0)}
                              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                                ch.status === 'A_VENIR'
                                  ? 'bg-slate-700 text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <CircleDashed className="w-3 h-3" />
                              <span>À venir</span>
                            </button>
                          </div>

                          {/* Hours Stepper */}
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-slate-500">Heures faites :</span>
                            <div className="flex items-center border border-slate-200 rounded-md bg-white">
                              <button
                                onClick={() => {
                                  const current = ch.completedHours || 0;
                                  if (current > 0) {
                                    updateChapterStatus(unit.id, ch.id, current - 1 === 0 ? 'A_VENIR' : 'EN_COURS', current - 1);
                                  }
                                }}
                                className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 rounded-l cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2.5 py-0.5 font-bold text-slate-900">
                                {ch.completedHours || 0}h
                              </span>
                              <button
                                onClick={() => {
                                  const current = ch.completedHours || 0;
                                  const next = current + 1;
                                  const nextStatus = next >= ch.allocatedHours ? 'TERMINE' : 'EN_COURS';
                                  updateChapterStatus(unit.id, ch.id, nextStatus, next);
                                }}
                                className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 rounded-r cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-slate-400">/ {ch.allocatedHours}h</span>
                          </div>

                          {/* Quick shortcuts */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveTab('fiches')}
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <GraduationCap className="w-3 h-3" />
                              <span>Fiche de prépa</span>
                            </button>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <button
                              onClick={() => setActiveTab('cahier')}
                              className="text-[11px] text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Cahier</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
