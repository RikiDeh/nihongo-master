import { UserProgressData, QuizHistoryEntry } from '../types';
import { KANJI_DATA } from '../data/kanjiData';
import { VOCAB_DATA } from '../data/vocabData';
import { GRAMMAR_DATA } from '../data/grammarData';

const STORAGE_KEY = 'nihongo_master_progress_v1';
export const CURRENT_STORAGE_VERSION = 2;

export const DEFAULT_PROGRESS: UserProgressData = {
  version: CURRENT_STORAGE_VERSION,
  bookmarkedKanjiIds: [],
  masteredKanjiIds: [],
  bookmarkedVocabIds: [],
  masteredVocabIds: [],
  quizHistory: [],
  failedItemIds: [],
  dailyStreak: 0,
  lastActiveDate: '',
  lastClaimedSignInDate: '',
  dailyGoalTarget: 15,
  dailyCardsCompleted: 0,
  srsRecords: {},
  currentArcId: 'arc_0',
  completedStageIds: [],
  dailyMissionsState: {
    date: '',
    srsReviewedCount: 0,
    roadmapStageCompleted: false,
    quickQuizCompleted: false,
  },
};

// Fallback in-memory storage for test/SSR environments (Bun test, Node)
let inMemoryStorage: UserProgressData = { ...DEFAULT_PROGRESS };

// Cached valid ID sets for O(1) membership checks
let validKanjiIds: Set<string> | null = null;
let validVocabIds: Set<string> | null = null;
let validGrammarIds: Set<string> | null = null;

function getValidKanjiIds(): Set<string> {
  if (!validKanjiIds) validKanjiIds = new Set(KANJI_DATA.map(k => k.id));
  return validKanjiIds;
}

function getValidVocabIds(): Set<string> {
  if (!validVocabIds) validVocabIds = new Set(VOCAB_DATA.map(v => v.id));
  return validVocabIds;
}

function getValidGrammarIds(): Set<string> {
  if (!validGrammarIds) validGrammarIds = new Set(GRAMMAR_DATA.map(g => g.id));
  return validGrammarIds;
}

export const MAX_QUIZ_HISTORY = 50;

/**
 * Format tanggal 'YYYY-MM-DD' lokal
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Pembersih otomatis untuk mencegah 'ID Hantu' dan pembengkakan memori di localStorage
 */
export function sanitizeUserProgress(data: UserProgressData): { sanitized: UserProgressData; modified: boolean } {
  const kanjiSet = getValidKanjiIds();
  const vocabSet = getValidVocabIds();
  const grammarSet = getValidGrammarIds();

  const cleanBookmarkedKanji = data.bookmarkedKanjiIds.filter(id => kanjiSet.has(id));
  const cleanMasteredKanji = data.masteredKanjiIds.filter(id => kanjiSet.has(id));
  const cleanBookmarkedVocab = data.bookmarkedVocabIds.filter(id => vocabSet.has(id));
  const cleanMasteredVocab = data.masteredVocabIds.filter(id => vocabSet.has(id));
  const cleanFailedItems = data.failedItemIds.filter(id => kanjiSet.has(id) || vocabSet.has(id) || grammarSet.has(id));
  
  // Batasi riwayat kuis maksimal 50 sesi terakhir (FIFO) demi mencegah QuotaExceededError
  const rawHistory = Array.isArray(data.quizHistory) ? data.quizHistory : [];
  const cleanQuizHistory = rawHistory.slice(0, MAX_QUIZ_HISTORY);

  // Sanitasi SRS records (pastikan hanya item valid)
  const cleanSrsRecords: Record<string, typeof data.srsRecords[string]> = {};
  if (data.srsRecords && typeof data.srsRecords === 'object') {
    for (const [id, rec] of Object.entries(data.srsRecords)) {
      if (kanjiSet.has(id) || vocabSet.has(id) || grammarSet.has(id)) {
        cleanSrsRecords[id] = rec;
      }
    }
  }

  const modified = 
    data.version !== CURRENT_STORAGE_VERSION ||
    cleanBookmarkedKanji.length !== data.bookmarkedKanjiIds.length ||
    cleanMasteredKanji.length !== data.masteredKanjiIds.length ||
    cleanBookmarkedVocab.length !== data.bookmarkedVocabIds.length ||
    cleanMasteredVocab.length !== data.masteredVocabIds.length ||
    cleanFailedItems.length !== data.failedItemIds.length ||
    cleanQuizHistory.length !== rawHistory.length ||
    typeof data.dailyStreak !== 'number' ||
    typeof data.dailyCardsCompleted !== 'number' ||
    typeof data.srsRecords !== 'object' ||
    Object.keys(cleanSrsRecords).length !== Object.keys(data.srsRecords || {}).length;

  return {
    sanitized: {
      version: CURRENT_STORAGE_VERSION,
      bookmarkedKanjiIds: cleanBookmarkedKanji,
      masteredKanjiIds: cleanMasteredKanji,
      bookmarkedVocabIds: cleanBookmarkedVocab,
      masteredVocabIds: cleanMasteredVocab,
      quizHistory: cleanQuizHistory,
      failedItemIds: cleanFailedItems,
      dailyStreak: typeof data.dailyStreak === 'number' ? data.dailyStreak : 0,
      lastActiveDate: typeof data.lastActiveDate === 'string' ? data.lastActiveDate : '',
      lastClaimedSignInDate: typeof data.lastClaimedSignInDate === 'string' ? data.lastClaimedSignInDate : '',
      dailyGoalTarget: typeof data.dailyGoalTarget === 'number' ? data.dailyGoalTarget : 15,
      dailyCardsCompleted: typeof data.dailyCardsCompleted === 'number' ? data.dailyCardsCompleted : 0,
      srsRecords: cleanSrsRecords,
      currentArcId: typeof data.currentArcId === 'string' ? data.currentArcId : 'arc_0',
      completedStageIds: Array.isArray(data.completedStageIds) ? data.completedStageIds : [],
      dailyMissionsState: (data.dailyMissionsState && typeof data.dailyMissionsState === 'object') ? data.dailyMissionsState : {
        date: '',
        srsReviewedCount: 0,
        roadmapStageCompleted: false,
        quickQuizCompleted: false,
      },
    },
    modified,
  };
}

/**
 * Operasi penyimpanan aman ke localStorage yang membungkus pemanggilan dalam try-catch
 * serta memiliki perlindungan darurat jika kuota penyimpanan browser penuh (QuotaExceededError).
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: unknown) {
    console.warn(`[Storage Safeguard] Penyimpanan gagal atau kuota browser penuh pada key "${key}":`, err);

    // Jika kuota penuh pada data utama, pangkas riwayat kuis lebih agresif ke 10 sesi terakhir
    if (key === STORAGE_KEY) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && Array.isArray(parsed.quizHistory) && parsed.quizHistory.length > 10) {
          parsed.quizHistory = parsed.quizHistory.slice(0, 10);
          localStorage.setItem(key, JSON.stringify(parsed));
          console.info('[Storage Safeguard] Berhasil melakukan pemangkasan darurat riwayat kuis ke 10 sesi.');
          return true;
        }
      } catch {
        // Gagal dalam pemangkasan darurat, kembalikan false tanpa melempar unhandled exception
      }
    }
    return false;
  }
}

// Dispatch custom event agar komponen React dapat bereaksi secara real-time
function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('nihongo_storage_updated'));
  }
}

/**
 * Mengambil seluruh data progress dari localStorage dengan sanitasi otomatis
 */
export function getUserProgress(): UserProgressData {
  if (typeof window === 'undefined') {
    return inMemoryStorage;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    const rawData: UserProgressData = {
      version: typeof parsed.version === 'number' ? parsed.version : 1,
      bookmarkedKanjiIds: Array.isArray(parsed.bookmarkedKanjiIds) ? parsed.bookmarkedKanjiIds : [],
      masteredKanjiIds: Array.isArray(parsed.masteredKanjiIds) ? parsed.masteredKanjiIds : [],
      bookmarkedVocabIds: Array.isArray(parsed.bookmarkedVocabIds) ? parsed.bookmarkedVocabIds : [],
      masteredVocabIds: Array.isArray(parsed.masteredVocabIds) ? parsed.masteredVocabIds : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
      failedItemIds: Array.isArray(parsed.failedItemIds) ? parsed.failedItemIds : [],
      dailyStreak: typeof parsed.dailyStreak === 'number' ? parsed.dailyStreak : 0,
      lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : '',
      lastClaimedSignInDate: typeof parsed.lastClaimedSignInDate === 'string' ? parsed.lastClaimedSignInDate : '',
      dailyGoalTarget: typeof parsed.dailyGoalTarget === 'number' ? parsed.dailyGoalTarget : 15,
      dailyCardsCompleted: typeof parsed.dailyCardsCompleted === 'number' ? parsed.dailyCardsCompleted : 0,
      srsRecords: typeof parsed.srsRecords === 'object' && parsed.srsRecords !== null ? parsed.srsRecords : {},
      currentArcId: typeof parsed.currentArcId === 'string' ? parsed.currentArcId : 'arc_0',
      completedStageIds: Array.isArray(parsed.completedStageIds) ? parsed.completedStageIds : [],
      dailyMissionsState: typeof parsed.dailyMissionsState === 'object' && parsed.dailyMissionsState !== null ? parsed.dailyMissionsState : undefined,
    };

    const { sanitized, modified } = sanitizeUserProgress(rawData);
    if (modified) {
      safeSetLocalStorage(STORAGE_KEY, JSON.stringify(sanitized));
    }

    return sanitized;
  } catch (err) {
    console.error('Gagal membaca user progress dari localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Menyimpan seluruh data progress ke localStorage
 */
export function saveUserProgress(data: UserProgressData): void {
  if (typeof window === 'undefined') {
    inMemoryStorage = data;
    return;
  }
  const success = safeSetLocalStorage(STORAGE_KEY, JSON.stringify(data));
  if (success) {
    notifyListeners();
  }
}

/**
 * Evaluasi & Update Daily Study Habit Tracker (TIKET 21.2)
 * - Jika tanggal sekarang == lastActiveDate: pertahankan streak, tambahkan dailyCardsCompleted +1
 * - Jika tanggal sekarang == kemarin (lastActiveDate == yesterday): dailyStreak bertambah +1, dailyCardsCompleted direset ke 1, lastActiveDate = hari ini
 * - Jika tanggal jeda > 1 hari: dailyStreak reset ke 1, dailyCardsCompleted = 1, lastActiveDate = hari ini
 */
export function evaluateDailyStreak(dateForTest?: Date): UserProgressData {
  const data = getUserProgress();
  const now = dateForTest || new Date();
  const todayStr = getLocalDateString(now);

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  let newStreak = data.dailyStreak;
  let newCardsCompleted = data.dailyCardsCompleted;

  if (!data.lastActiveDate) {
    // Pengguna baru belajar pertama kali
    newStreak = 1;
    newCardsCompleted = 1;
  } else if (data.lastActiveDate === todayStr) {
    // Belajar lagi di hari yang sama
    newCardsCompleted += 1;
  } else if (data.lastActiveDate === yesterdayStr) {
    // Belajar berturut-turut hari berikutnya (streak berlanjut)
    newStreak += 1;
    newCardsCompleted = 1;
  } else {
    // Jeda lebih dari 1 hari (streak terputus)
    newStreak = 1;
    newCardsCompleted = 1;
  }

  const updated: UserProgressData = {
    ...data,
    dailyStreak: newStreak,
    dailyCardsCompleted: newCardsCompleted,
    lastActiveDate: todayStr,
  };

  saveUserProgress(updated);
  return updated;
}

// ============================================================================
// KANJI HELPERS
// ============================================================================

export function isKanjiBookmarked(id: string): boolean {
  const data = getUserProgress();
  return data.bookmarkedKanjiIds.includes(id);
}

export function toggleBookmarkKanji(id: string): boolean {
  const data = getUserProgress();
  const exists = data.bookmarkedKanjiIds.includes(id);
  const updated = exists
    ? data.bookmarkedKanjiIds.filter(item => item !== id)
    : [...data.bookmarkedKanjiIds, id];

  saveUserProgress({ ...data, bookmarkedKanjiIds: updated });
  return !exists;
}

export function isKanjiMastered(id: string): boolean {
  const data = getUserProgress();
  return data.masteredKanjiIds.includes(id);
}

export function toggleMasteredKanji(id: string): boolean {
  const data = getUserProgress();
  const exists = data.masteredKanjiIds.includes(id);
  const updated = exists
    ? data.masteredKanjiIds.filter(item => item !== id)
    : [...data.masteredKanjiIds, id];

  saveUserProgress({ ...data, masteredKanjiIds: updated });
  return !exists;
}

// ============================================================================
// VOCAB HELPERS
// ============================================================================

export function isVocabBookmarked(id: string): boolean {
  const data = getUserProgress();
  return data.bookmarkedVocabIds.includes(id);
}

export function toggleBookmarkVocab(id: string): boolean {
  const data = getUserProgress();
  const exists = data.bookmarkedVocabIds.includes(id);
  const updated = exists
    ? data.bookmarkedVocabIds.filter(item => item !== id)
    : [...data.bookmarkedVocabIds, id];

  saveUserProgress({ ...data, bookmarkedVocabIds: updated });
  return !exists;
}

export function isVocabMastered(id: string): boolean {
  const data = getUserProgress();
  return data.masteredVocabIds.includes(id);
}

export function toggleMasteredVocab(id: string): boolean {
  const data = getUserProgress();
  const exists = data.masteredVocabIds.includes(id);
  const updated = exists
    ? data.masteredVocabIds.filter(item => item !== id)
    : [...data.masteredVocabIds, id];

  saveUserProgress({ ...data, masteredVocabIds: updated });
  return !exists;
}

// ============================================================================
// QUIZ HISTORY HELPERS
// ============================================================================

export function saveQuizHistory(entry: Omit<QuizHistoryEntry, 'id' | 'timestamp'>): void {
  const data = getUserProgress();
  const newEntry: QuizHistoryEntry = {
    ...entry,
    id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
  };

  // Simpan maksimal 50 riwayat kuis terakhir
  const updatedHistory = [newEntry, ...data.quizHistory].slice(0, 50);
  saveUserProgress({ ...data, quizHistory: updatedHistory });
}

// ============================================================================
// BACKUP & RESTORE (EXPORT / IMPORT JSON)
// ============================================================================

export function exportProgressJSON(): string {
  const data = getUserProgress();
  return JSON.stringify(data, null, 2);
}

export function importProgressJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) return false;

    const validated: UserProgressData = {
      version: typeof parsed.version === 'number' ? parsed.version : CURRENT_STORAGE_VERSION,
      bookmarkedKanjiIds: Array.isArray(parsed.bookmarkedKanjiIds) ? parsed.bookmarkedKanjiIds : [],
      masteredKanjiIds: Array.isArray(parsed.masteredKanjiIds) ? parsed.masteredKanjiIds : [],
      bookmarkedVocabIds: Array.isArray(parsed.bookmarkedVocabIds) ? parsed.bookmarkedVocabIds : [],
      masteredVocabIds: Array.isArray(parsed.masteredVocabIds) ? parsed.masteredVocabIds : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
      failedItemIds: Array.isArray(parsed.failedItemIds) ? parsed.failedItemIds : [],
      dailyStreak: typeof parsed.dailyStreak === 'number' ? parsed.dailyStreak : 0,
      lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : null,
      dailyGoalTarget: typeof parsed.dailyGoalTarget === 'number' ? parsed.dailyGoalTarget : 15,
      dailyCardsCompleted: typeof parsed.dailyCardsCompleted === 'number' ? parsed.dailyCardsCompleted : 0,
      srsRecords: (typeof parsed.srsRecords === 'object' && parsed.srsRecords !== null) ? parsed.srsRecords : {},
    };

    const { sanitized } = sanitizeUserProgress(validated);
    saveUserProgress(sanitized);
    return true;
  } catch (err) {
    console.error('Format JSON tidak valid saat import progress:', err);
    return false;
  }
}

// ============================================================================
// WEAK ITEMS / GHOST ENGINE HELPERS
// ============================================================================

export function getFailedItemIds(): string[] {
  return getUserProgress().failedItemIds;
}

export function recordFailedItem(id: string): void {
  const data = getUserProgress();
  if (!data.failedItemIds.includes(id)) {
    saveUserProgress({
      ...data,
      failedItemIds: [...data.failedItemIds, id],
    });
  }
}

export function recordSuccessItem(id: string): void {
  const data = getUserProgress();
  if (data.failedItemIds.includes(id)) {
    saveUserProgress({
      ...data,
      failedItemIds: data.failedItemIds.filter(item => item !== id),
    });
  }
}

export function clearFailedItems(): void {
  const data = getUserProgress();
  saveUserProgress({
    ...data,
    failedItemIds: [],
  });
}

// ============================================================================
// REACT HOOK / LISTENER HELPER
// ============================================================================

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('nihongo_storage_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('nihongo_storage_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

// ============================================================================
// GLOBAL ROMAJI PREFERENCE
// ============================================================================

const ROMAJI_STORAGE_KEY = 'nihongo_show_romaji_v1';

export function getShowRomaji(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(ROMAJI_STORAGE_KEY);
    if (raw === null) return true; // Default: ON (true)
    return raw === 'true';
  } catch {
    return true;
  }
}

export function setShowRomaji(show: boolean): void {
  if (typeof window === 'undefined') return;
  const success = safeSetLocalStorage(ROMAJI_STORAGE_KEY, show ? 'true' : 'false');
  if (success) {
    notifyListeners();
  }
}

export function toggleShowRomaji(): boolean {
  const current = getShowRomaji();
  const next = !current;
  setShowRomaji(next);
  return next;
}

// ============================================================================
// DAILY SIGN-IN & DAILY MISSIONS ENGINE
// ============================================================================

export function checkDailySignInStatus(): { canClaim: boolean; streak: number; todayStr: string } {
  const data = getUserProgress();
  const todayStr = getLocalDateString();
  const canClaim = data.lastClaimedSignInDate !== todayStr;
  return {
    canClaim,
    streak: data.dailyStreak,
    todayStr,
  };
}

export function claimDailySignInReward(): { streak: number; isFirstToday: boolean } {
  const data = getUserProgress();
  const todayStr = getLocalDateString();
  
  if (data.lastClaimedSignInDate === todayStr) {
    return { streak: data.dailyStreak, isFirstToday: false };
  }

  // Update streak (rekam kebiasaan)
  const lastActive = data.lastActiveDate;
  let newStreak = data.dailyStreak;

  if (!lastActive) {
    newStreak = 1;
  } else {
    const lastDate = new Date(lastActive);
    const todayDate = new Date(todayStr);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1; // reset streak jika bolong lebih dari 1 hari
    } else if (diffDays === 0 && newStreak === 0) {
      newStreak = 1;
    }
  }

  const updated: UserProgressData = {
    ...data,
    dailyStreak: newStreak,
    lastActiveDate: todayStr,
    lastClaimedSignInDate: todayStr,
  };

  saveUserProgress(updated);
  return { streak: newStreak, isFirstToday: true };
}

export function getDailyMissions(): {
  missions: Array<{
    id: 'srs' | 'roadmap' | 'quiz';
    title: string;
    description: string;
    target: number;
    current: number;
    completed: boolean;
  }>;
  allCompleted: boolean;
} {
  const data = getUserProgress();
  const todayStr = getLocalDateString();
  const state = (data.dailyMissionsState && data.dailyMissionsState.date === todayStr)
    ? data.dailyMissionsState
    : {
        date: todayStr,
        srsReviewedCount: 0,
        roadmapStageCompleted: false,
        quickQuizCompleted: false,
      };

  const srsMission = {
    id: 'srs' as const,
    title: 'Rawat Ingatan (SRS Review)',
    description: 'Selesaikan minimal 10 ulasan kartu SRS jatuh tempo hari ini.',
    target: 10,
    current: Math.min(10, state.srsReviewedCount),
    completed: state.srsReviewedCount >= 10,
  };

  const roadmapMission = {
    id: 'roadmap' as const,
    title: 'Satu Langkah di Peta',
    description: 'Selesaikan 1 stage atau checkpoint di bab Roadmap aktifmu.',
    target: 1,
    current: state.roadmapStageCompleted ? 1 : 0,
    completed: state.roadmapStageCompleted,
  };

  const quizMission = {
    id: 'quiz' as const,
    title: 'Uji Ketajaman Refleks',
    description: 'Ikuti 1 sesi kuis kilat atau bersihkan titik lemah.',
    target: 1,
    current: state.quickQuizCompleted ? 1 : 0,
    completed: state.quickQuizCompleted,
  };

  const missions = [srsMission, roadmapMission, quizMission];
  const allCompleted = missions.every(m => m.completed);

  return { missions, allCompleted };
}

export function reportMissionActivity(type: 'srs' | 'roadmap' | 'quiz', count = 1): void {
  const data = getUserProgress();
  const todayStr = getLocalDateString();
  const current = (data.dailyMissionsState && data.dailyMissionsState.date === todayStr)
    ? { ...data.dailyMissionsState }
    : {
        date: todayStr,
        srsReviewedCount: 0,
        roadmapStageCompleted: false,
        quickQuizCompleted: false,
      };

  if (type === 'srs') {
    current.srsReviewedCount += count;
  } else if (type === 'roadmap') {
    current.roadmapStageCompleted = true;
  } else if (type === 'quiz') {
    current.quickQuizCompleted = true;
  }

  saveUserProgress({
    ...data,
    dailyMissionsState: current,
  });
}

export function completeRoadmapStage(stageId: string, nextArcId?: string): void {
  const data = getUserProgress();
  const completed = new Set(data.completedStageIds || []);
  completed.add(stageId);

  const updated: UserProgressData = {
    ...data,
    completedStageIds: Array.from(completed),
    currentArcId: nextArcId || data.currentArcId || 'arc_0',
  };

  saveUserProgress(updated);
  reportMissionActivity('roadmap');
}
