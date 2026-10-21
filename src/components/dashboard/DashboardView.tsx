import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { state, setActiveTab, setSelectedClassId } = useApp();

  const totalStudents = state.students.length;
  const count1AC = state.students.filter((s) => {
    const c = state.classes.find((cl) => cl.id === s.classId);
    return c?.level === '1AC';
  }).length;
  const count2AC = state.students.filter((s) => {
    const c = state.classes.find((cl) => cl.id === s.classId);
    return c?.level === '2AC';
  }).length;

  const totalClasses = state.classes.length;
  const totalFiches = state.fiches.length;
  const totalCahierEntries = state.cahierEntries.length;
  const pendingRemediations = state.remediations.filter((r) => !r.completed).length;

  // Day of week calculation
  const daysMap = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const currentDayName = daysMap[new Date().getDay()];
  const displayDay = currentDayName === 'Dimanche' ? 'Lundi' : currentDayName;

  const todaySlots = state.schedule.filter((s) => s.dayOfWeek === displayDay);

  // Curriculum progress calculation
  const totalHours1AC = state.progression
    .filter((u) => u.level === '1AC')
    .reduce((sum, u) => sum + u.totalHours, 0);
  const doneHours1AC = state.progression
    .filter((u) => u.level === '1AC')
    .flatMap((u) => u.chapters)
    .reduce((sum, ch) => sum + (ch.completedHours || 0), 0);
  const percent1AC = totalHours1AC > 0 ? Math.round((doneHours1AC / totalHours1AC) * 100) : 0;

  const totalHours2AC = state.progression
    .filter((u) => u.level === '2AC')
    .reduce((sum, u) => sum + u.totalHours, 0);
  const doneHours2AC = state.progression
    .filter((u) => u.level === '2AC')
    .flatMap((u) => u.chapters)
    .reduce((sum, ch) => sum + (ch.completedHours || 0), 0);
  const percent2AC = totalHours2AC > 0 ? Math.round((doneHours2AC / totalHours2AC) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Moroccan Institution Identity */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Royaume du Maroc · Ministère de l'Éducation Nationale
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Espace Pédagogique SVT · {state.teacher.name}
            </h1>
            <div className="text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{state.teacher.schoolName}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{state.teacher.directorate}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-xs">Année scolaire {state.teacher.schoolYear}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('cahier')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Saisir une séance</span>
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Numerical Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Élèves inscrits</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalStudents}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>1AC : {count1AC}</span>
            <span aria-hidden="true">·</span>
            <span>2AC : {count2AC}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Classes & Dédoublement</span>
            <GraduationCap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalClasses} <span className="text-xs font-normal text-slate-500">divisions</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Groupes TP G1 & G2 configurés
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cahier de textes</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {totalCahierEntries} <span className="text-xs font-normal text-slate-500">séances</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalFiches} fiches pédagogiques actives
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Soutien & Remédiation</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {pendingRemediations} <span className="text-xs font-normal text-slate-500">plans</span>
          </div>
          <div className="text-xs text-amber-800 mt-1 flex items-center gap-1 font-medium">
            <AlertTriangle className="w-3 h-3" />
            <span>Suivi ciblé des difficultés</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Schedule for Today & Quick Entry */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Séances du jour ({displayDay})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Emploi du temps complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaySlots.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              Aucune séance de cours ou de TP programmée pour ce jour.
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => {
                const targetClass = state.classes.find((c) => c.id === slot.classId);
                const isGroup = slot.group !== 'CE';

                return (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {slot.timeSlot}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {targetClass?.name} ({targetClass?.level})
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {isGroup ? `Dédoublement (${slot.group})` : 'Classe entière'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Lieu : {slot.room}</span>
                        {slot.note && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{slot.note}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedClassId(slot.classId);
                          setActiveTab('cahier');
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        Cahier de textes
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClassId(slot.classId);
                          setActiveTab('classes');
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer transition-colors"
                      >
                        Appel & Élèves
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Curriculum Advancement */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Avancement du Programme
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('progression')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Détails</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1AC Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Niveau 1AC (Sciences Naturelles)</span>
              <span className="font-mono text-slate-600">{doneHours1AC}h / {totalHours1AC}h ({percent1AC}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percent1AC}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500">
              Unité 1 (Relations & Milieu) en cours · Unité 2 (Géologie externe) S2
            </div>
          </div>

          {/* 2AC Progress */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Niveau 2AC (Géologie interne & Hérédité)</span>
              <span className="font-mono text-slate-600">{doneHours2AC}h / {totalHours2AC}h ({percent2AC}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percent2AC}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500">
              Unité 1 (Tectonique & Volcanisme) en cours · Unité 2 (Reproduction) S2
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-semibold text-slate-700">Raccourcis rapides</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('evaluations')}
                className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-emerald-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-800">Saisie des notes</div>
                <div className="text-[11px] text-slate-500 mt-0.5">CC1, CC2, CC3, TP</div>
              </button>
              <button
                onClick={() => setActiveTab('fiches')}
                className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-emerald-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-800">Fiche de prépa</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Modèles MEN SVT</div>
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-emerald-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-800">Schémas SVT</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Planches & TP</div>
              </button>
              <button
                onClick={() => setActiveTab('remediation')}
                className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-emerald-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-800">Remédiation</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Groupes de besoin</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cahier de Textes Entries */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Dernières séances consignées au cahier de textes
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('cahier')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Voir tout le cahier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {state.cahierEntries.slice(0, 3).map((entry) => {
            const cls = state.classes.find((c) => c.id === entry.classId);
            return (
              <div key={entry.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{entry.date}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-bold text-xs text-slate-900">{cls?.name} ({entry.group})</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-emerald-800">{entry.level}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{entry.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{entry.activities}</p>
                </div>
                {entry.homework && (
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 md:max-w-xs shrink-0 text-xs">
                    <span className="font-semibold text-slate-700">Devoir : </span>
                    <span className="text-slate-600">{entry.homework}</span>
                    {entry.homeworkDueDate && (
                      <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                        Pour le : {entry.homeworkDueDate}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
