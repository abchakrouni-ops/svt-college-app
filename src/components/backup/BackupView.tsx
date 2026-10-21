import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  User,
  School,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { exportStudentsToCSV } from '../../services/storage';

export const BackupView: React.FC = () => {
  const {
    state,
    updateTeacher,
    downloadBackup,
    restoreBackup,
    resetToInitialData,
    addToast
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorePreview, setRestorePreview] = useState<{
    file: File;
    summary: string;
  } | null>(null);

  // Teacher Profile state
  const [teacherName, setTeacherName] = useState(state.teacher.name);
  const [schoolName, setSchoolName] = useState(state.teacher.schoolName);
  const [directorate, setDirectorate] = useState(state.teacher.directorate);
  const [academy, setAcademy] = useState(state.teacher.academy);
  const [schoolYear, setSchoolYear] = useState(state.teacher.schoolYear);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      name: teacherName.trim(),
      schoolName: schoolName.trim(),
      directorate: directorate.trim(),
      academy: academy.trim(),
      schoolYear: schoolYear.trim()
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.classes || !parsed.students) {
          addToast('Fichier non conforme : structure SVT Maroc introuvable.', 'error');
          return;
        }

        const summary = `${parsed.classes.length} classes, ${parsed.students.length} élèves, ${parsed.cahierEntries?.length || 0} séances cahier de textes, ${parsed.fiches?.length || 0} fiches pédagogiques`;
        setRestorePreview({ file, summary });
      } catch (err) {
        addToast('Fichier JSON corrompu ou illisible.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const confirmRestore = async () => {
    if (!restorePreview) return;
    setIsRestoring(true);
    const success = await restoreBackup(restorePreview.file);
    setIsRestoring(false);
    setRestorePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-emerald-800 tracking-wide uppercase">
              Sécurité des Données & Continuité Pédagogique
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              Sauvegarde, Restauration & Exportation des Données
            </h1>
            <div className="text-xs text-slate-500 mt-1">
              Stockage local persistant 100% autonome, sans frais d'abonnement ni risque de perte.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadBackup}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger la sauvegarde complète (.json)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Storage Health & Architecture Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Stockage IndexedDB</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Actif & Sécurisé
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Toutes vos fiches, élèves et notes sont enregistrés dans la base de données locale sécurisée de votre navigateur.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Dernière Sauvegarde Auto</span>
            <span className="text-slate-700 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
              {new Date(state.lastSavedAt).toLocaleTimeString('fr-FR')}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Chaque modification (note, présence, séance au cahier) est immédiatement enregistrée et dupliquée en mémoire locale.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Zéro Coût & Confidentialité</span>
            <span className="text-emerald-800 font-bold text-xs">100% Gratuit</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aucun abonnement externe n'est requis. Les données restent strictement privées sur votre ordinateur ou téléphone.
          </p>
        </div>
      </div>

      {/* Backup and Restore Action Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Exporter une Sauvegarde (.json)
              </h2>
              <div className="text-xs text-slate-500">
                Crée un fichier d'archive autonome contenant l'intégralité de vos cours et fiches.
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              Le fichier de sauvegarde comprend :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 font-mono text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
              <li>{state.classes.length} classes / divisions (1AC & 2AC)</li>
              <li>{state.students.length} élèves avec codes Massar et groupes TP</li>
              <li>{state.cahierEntries.length} séances au cahier de textes</li>
              <li>{state.fiches.length} fiches pédagogiques complètes</li>
              <li>{state.evaluations.length} contrôles continus avec toutes les notes</li>
              <li>{state.absences.length} relevés d'absences et assiduité</li>
              <li>{state.remediations.length} plans de remédiation ciblée</li>
              <li>{state.resources.length} ressources didactiques de la bibliothèque</li>
            </ul>
          </div>

          <button
            onClick={downloadBackup}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger l'archive maintenant</span>
          </button>
        </div>

        {/* Import & Restore Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Restaurer depuis un Fichier (.json)
              </h2>
              <div className="text-xs text-slate-500">
                Récupérez instantanément vos données sur un nouvel appareil ou après réinitialisation.
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            <p>
              Sélectionnez un fichier JSON de sauvegarde précédemment téléchargé depuis cette application :
            </p>
          </div>

          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileSelect}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
          />

          {/* Restore Confirmation Alert */}
          {restorePreview && (
            <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Confirmer la restauration :</span>
              </div>
              <p className="text-[11px]">
                Fichier valide détecté : <strong>{restorePreview.summary}</strong>.
                La restauration remplacera l'état actuel.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={confirmRestore}
                  disabled={isRestoring}
                  className="px-3 py-1.5 bg-amber-800 text-white rounded font-medium hover:bg-amber-900 transition-colors cursor-pointer text-xs disabled:opacity-50"
                >
                  {isRestoring ? 'Restauration en cours...' : 'Appliquer la restauration'}
                </button>
                <button
                  onClick={() => setRestorePreview(null)}
                  className="px-3 py-1.5 border border-amber-300 bg-white text-amber-900 rounded font-medium hover:bg-amber-100 transition-colors cursor-pointer text-xs"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Profile & Institutional Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Profil de l'Enseignant & Informations Institutionnelles
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Ces mentions apparaissent automatiquement sur vos fiches pédagogiques et relevés imprimés.
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Nom du professeur</label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Établissement (Collège)</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Direction Provinciale</label>
              <input
                type="text"
                required
                value={directorate}
                onChange={(e) => setDirectorate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Académie Régionale (AREF)</label>
              <input
                type="text"
                required
                value={academy}
                onChange={(e) => setAcademy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Année Scolaire</label>
              <input
                type="text"
                required
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            >
              Enregistrer les coordonnées
            </button>
          </div>
        </form>
      </div>

      {/* Dangerous Action: Reset Data */}
      <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Zone de Réinitialisation</span>
        </div>
        <p className="text-xs text-red-800 leading-relaxed">
          Si vous souhaitez réinitialiser l'application avec les données officielles marocaines par défaut pour 1AC et 2AC (exemples de fiches, classes modèles et programme MENPS), utilisez cette option :
        </p>
        <button
          onClick={() => {
            if (confirm('Attention : Cette action réinitialisera toutes vos données aux exemples officiels marocains par défaut. Pensez à télécharger une sauvegarde avant. Continuer ?')) {
              resetToInitialData();
            }
          }}
          className="px-3.5 py-1.5 rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 transition-colors font-medium text-xs cursor-pointer"
        >
          Réinitialiser aux données officielles 1AC/2AC par défaut
        </button>
      </div>
    </div>
  );
};
