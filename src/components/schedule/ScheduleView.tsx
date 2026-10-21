import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleSlot, GroupType } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  Printer,
  Edit2,
  Trash2,
  BookOpen,
  Users,
  MapPin,
  X
} from 'lucide-react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;
const TIME_SLOTS = [
  '08h30 - 10h20',
  '10h40 - 12h30',
  '14h30 - 16h20',
  '16h40 - 18h30'
];

export const ScheduleView: React.FC = () => {
  const {
    state,
    setSelectedClassId,
    setActiveTab,
    addScheduleSlot,
    updateScheduleSlot,
    deleteScheduleSlot
  } = useApp();

  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState<ScheduleSlot | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);

  // Form states
  const [formDay, setFormDay] = useState<typeof DAYS[number]>('Lundi');
  const [formTime, setFormTime] = useState('08h30 - 10h20');
  const [formClassId, setFormClassId] = useState(state.classes[0]?.id || '');
  const [formGroup, setFormGroup] = useState<GroupType>('G1');
  const [formRoom, setFormRoom] = useState('Labo Sciences');
  const [formNote, setFormNote] = useState('Séance TP - Dédoublement');

  const handleOpenAdd = (day?: typeof DAYS[number], time?: string) => {
    setEditingSlot(null);
    if (day) setFormDay(day);
    if (time) setFormTime(time);
    setFormClassId(state.classes[0]?.id || '');
    setFormGroup('G1');
    setFormRoom('Labo Sciences');
    setFormNote('Séance TP - Dédoublement');
    setShowSlotModal(true);
  };

  const handleOpenEdit = (slot: ScheduleSlot) => {
    setEditingSlot(slot);
    setFormDay(slot.dayOfWeek);
    setFormTime(slot.timeSlot);
    setFormClassId(slot.classId);
    setFormGroup(slot.group);
    setFormRoom(slot.room);
    setFormNote(slot.note || '');
    setShowSlotModal(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClassId) return;

    if (editingSlot) {
      updateScheduleSlot(editingSlot.id, {
        dayOfWeek: formDay,
        timeSlot: formTime,
        classId: formClassId,
        group: formGroup,
        room: formRoom,
        note: formNote.trim() || undefined
      });
    } else {
      addScheduleSlot({
        dayOfWeek: formDay,
        timeSlot: formTime,
        classId: formClassId,
        group: formGroup,
        room: formRoom,
        note: formNote.trim() || undefined
      });
    }

    setShowSlotModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Organisation du service d'enseignement
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Emploi du Temps Hebdomadaire SVT (1AC & 2AC)
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Collège {state.teacher.schoolName} · Laboratoire & Salle de sciences · Dédoublement TP
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer l'emploi du temps</span>
            </button>
            <button
              onClick={() => handleOpenAdd()}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un créneau</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Title Block */}
      <div className="hidden print:block p-4 border-b-2 border-slate-900 mb-4 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
          Royaume du Maroc · Ministère de l'Éducation Nationale
        </div>
        <div className="text-sm font-semibold mt-1">
          {state.teacher.academy} · {state.teacher.directorate} · {state.teacher.schoolName}
        </div>
        <h2 className="text-lg font-bold mt-2 underline">
          EMPLOI DU TEMPS HEBDOMADAIRE · PROFESSEUR DE SVT
        </h2>
        <div className="text-xs mt-1">
          Professeur : <strong>{state.teacher.name}</strong> · Année scolaire : <strong>{state.teacher.schoolYear}</strong>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
        <table className="w-full border-collapse min-w-[700px] text-xs">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="py-3 px-3 text-left w-28 uppercase text-[11px] tracking-wider">
                Horaire
              </th>
              {DAYS.map((day) => (
                <th key={day} className="py-3 px-3 text-center border-l border-slate-200 uppercase text-[11px] tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {TIME_SLOTS.map((slotTime) => (
              <tr key={slotTime} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3 font-mono font-semibold text-slate-700 bg-slate-50/70 whitespace-nowrap">
                  {slotTime}
                </td>
                {DAYS.map((day) => {
                  const matchingSlots = state.schedule.filter(
                    (s) => s.dayOfWeek === day && s.timeSlot === slotTime
                  );

                  return (
                    <td
                      key={`${day}-${slotTime}`}
                      className="p-1.5 border-l border-slate-200 align-top h-24 min-w-[130px]"
                    >
                      {matchingSlots.length === 0 ? (
                        <div
                          onClick={() => handleOpenAdd(day, slotTime)}
                          className="h-full w-full rounded border border-dashed border-transparent hover:border-slate-300 hover:bg-slate-50/70 flex items-center justify-center cursor-pointer text-slate-300 hover:text-slate-500 transition-colors"
                          title="Cliquer pour programmer une séance"
                        >
                          <Plus className="w-3.5 h-3.5 opacity-0 hover:opacity-100" />
                        </div>
                      ) : (
                        <div className="space-y-1.5 h-full">
                          {matchingSlots.map((slot) => {
                            const cls = state.classes.find((c) => c.id === slot.classId);
                            const is1AC = cls?.level === '1AC';
                            const isGroup = slot.group !== 'CE';

                            return (
                              <div
                                key={slot.id}
                                onClick={() => setSelectedSlotForDetail(slot)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all shadow-2xs hover:shadow-sm ${
                                  is1AC
                                    ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400'
                                    : 'bg-teal-50/70 border-teal-200 hover:border-teal-400'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                  <span>{cls?.name}</span>
                                  <span className={`text-[10px] px-1 rounded font-mono font-bold ${
                                    slot.group === 'G1'
                                      ? 'bg-emerald-200 text-emerald-900'
                                      : slot.group === 'G2'
                                      ? 'bg-indigo-200 text-indigo-900'
                                      : 'bg-slate-200 text-slate-800'
                                  }`}>
                                    {slot.group}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{slot.room}</span>
                                </div>
                                {slot.note && (
                                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                                    {slot.note}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slot Details Drawer / Modal */}
      {selectedSlotForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            {(() => {
              const cls = state.classes.find((c) => c.id === selectedSlotForDetail.classId);
              return (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {cls?.name} ({cls?.level})
                      </h3>
                      <div className="text-xs text-slate-500">
                        {selectedSlotForDetail.dayOfWeek} · {selectedSlotForDetail.timeSlot}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSlotForDetail(null)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Modalité :</span>
                      <strong className="text-slate-900">
                        {selectedSlotForDetail.group === 'CE' ? 'Classe Entière' : `Dédoublement (${selectedSlotForDetail.group})`}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Lieu d'enseignement :</span>
                      <strong className="text-slate-900">{selectedSlotForDetail.room}</strong>
                    </div>
                    {selectedSlotForDetail.note && (
                      <div className="py-1 border-b border-slate-100">
                        <span className="text-slate-500 block mb-0.5">Note pédagogique :</span>
                        <p className="text-slate-800 font-medium">{selectedSlotForDetail.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions for this slot */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => {
                        setSelectedClassId(selectedSlotForDetail.classId);
                        setActiveTab('cahier');
                        setSelectedSlotForDetail(null);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ouvrir le cahier de textes</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedClassId(selectedSlotForDetail.classId);
                        setActiveTab('classes');
                        setSelectedSlotForDetail(null);
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Voir la liste des élèves ({selectedSlotForDetail.group})</span>
                    </button>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          const slot = selectedSlotForDetail;
                          setSelectedSlotForDetail(null);
                          handleOpenEdit(slot);
                        }}
                        className="flex-1 py-1.5 px-3 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Supprimer ce créneau de l’emploi du temps ?')) {
                            deleteScheduleSlot(selectedSlotForDetail.id);
                            setSelectedSlotForDetail(null);
                          }
                        }}
                        className="py-1.5 px-3 rounded border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add / Edit Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSlot ? 'Modifier le créneau' : 'Ajouter un créneau'}
              </h3>
              <button
                onClick={() => setShowSlotModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jour *</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Horaire *</label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Groupe *</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as GroupType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="G1">Groupe 1 (G1)</option>
                    <option value="G2">Groupe 2 (G2)</option>
                    <option value="CE">Classe Entière (CE)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Salle / Labo</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Remarque / Nature de séance</label>
                <input
                  type="text"
                  placeholder="Ex: Séance TP - Dédoublement"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  {editingSlot ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
