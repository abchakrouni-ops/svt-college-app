import { AppDataState, Student, Evaluation } from '../types';
import { INITIAL_STATE } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'svt_maroc_carnet_pedagogique_v1';
const DB_NAME = 'SVT_Maroc_Offline_DB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

// IndexedDB Helper
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB non supporté'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Load state: checks LocalStorage first for instant synchronous load, then verifies with IndexedDB
export async function loadPersistedState(): Promise<AppDataState> {
  let state: AppDataState | null = null;

  // 1. Try LocalStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Erreur lecture LocalStorage:', err);
  }

  // 2. Try IndexedDB if LocalStorage was empty
  if (!state) {
    try {
      const db = await openIndexedDB();
      state = await new Promise<AppDataState | null>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('current_state');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('Erreur lecture IndexedDB:', err);
    }
  }

  // 3. Fallback to authentic initial data if nothing found
  if (!state || !state.classes || state.classes.length === 0) {
    state = INITIAL_STATE;
    await savePersistedState(state);
  }

  return state;
}

// Save state both to LocalStorage and IndexedDB
export async function savePersistedState(state: AppDataState): Promise<void> {
  const updatedState: AppDataState = {
    ...state,
    lastSavedAt: new Date().toISOString()
  };

  // Synchronous LocalStorage write
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedState));
  } catch (err) {
    console.warn('LocalStorage plein ou inaccessible:', err);
  }

  // Asynchronous IndexedDB write
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(updatedState, 'current_state');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }
}

// Export complete state to a downloaded JSON file
export function exportBackupToFile(state: AppDataState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const dateStr = new Date().toISOString().split('T')[0];
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `Sauvegarde_SVT_Maroc_1AC_2AC_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Read and validate a backup JSON file from disk
export function importBackupFromFile(file: File): Promise<AppDataState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as AppDataState;

        // Basic structural validation
        if (!parsed.classes || !parsed.students || !parsed.cahierEntries) {
          throw new Error('Le fichier de sauvegarde ne contient pas la structure attendue pour SVT Maroc.');
        }

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsText(file);
  });
}

// Export student list to Excel/CSV with UTF-8 BOM
export function exportStudentsToCSV(students: Student[], className: string): void {
  const headers = ['Code Massar', 'Nom', 'Prénom', 'Sexe', 'Classe', 'Groupe TP', 'Date Naissance', 'Téléphone Parent', 'Remarques Médicales'];
  const rows = students.map(s => [
    s.massarCode,
    s.lastName,
    s.firstName,
    s.gender,
    className,
    s.group,
    s.birthDate || '',
    s.parentPhone || '',
    `"${(s.medicalNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Eleves_${className}_SVT_Maroc.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Export Class Grades & Massar Averages to CSV
export function exportGradesToCSV(students: Student[], evaluations: Evaluation[], className: string): void {
  const evalTitles = evaluations.map(e => `${e.type} (${e.title})`);
  const headers = ['Code Massar', 'Nom', 'Prénom', 'Groupe', ...evalTitles, 'Moyenne SVT /20', 'Mention'];

  const rows = students.map(student => {
    let totalScore = 0;
    let totalWeight = 0;
    const gradeValues = evaluations.map(ev => {
      const score = ev.grades[student.id];
      if (score !== undefined && score !== null) {
        totalScore += score * ev.coefficient;
        totalWeight += ev.coefficient;
        return score.toFixed(2);
      }
      return 'N/A';
    });

    const average = totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : 'N/A';
    const numAvg = totalWeight > 0 ? totalScore / totalWeight : 0;
    let mention = 'À renforcer';
    if (numAvg >= 16) mention = 'Très Bien';
    else if (numAvg >= 14) mention = 'Bien';
    else if (numAvg >= 12) mention = 'Assez Bien';
    else if (numAvg >= 10) mention = 'Moyen';

    return [
      student.massarCode,
      student.lastName,
      student.firstName,
      student.group,
      ...gradeValues,
      average,
      mention
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Releve_Notes_${className}_SVT_Maroc.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
