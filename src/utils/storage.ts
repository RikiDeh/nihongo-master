import { UserProgressData, QuizHistoryEntry } from '../types';

const STORAGE_KEY = 'nihongo_master_progress_v1';

const DEFAULT_PROGRESS: UserProgressData = {
  bookmarkedKanjiIds: [],
  masteredKanjiIds: [],
  bookmarkedVocabIds: [],
  masteredVocabIds: [],
  quizHistory: [],
  failedItemIds: [],
};

// Dispatch custom event agar komponen React dapat bereaksi secara real-time
function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('nihongo_storage_updated'));
  }
}

/**
 * Mengambil seluruh data progress dari localStorage
 */
export function getUserProgress(): UserProgressData {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      bookmarkedKanjiIds: Array.isArray(parsed.bookmarkedKanjiIds) ? parsed.bookmarkedKanjiIds : [],
      masteredKanjiIds: Array.isArray(parsed.masteredKanjiIds) ? parsed.masteredKanjiIds : [],
      bookmarkedVocabIds: Array.isArray(parsed.bookmarkedVocabIds) ? parsed.bookmarkedVocabIds : [],
      masteredVocabIds: Array.isArray(parsed.masteredVocabIds) ? parsed.masteredVocabIds : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
      failedItemIds: Array.isArray(parsed.failedItemIds) ? parsed.failedItemIds : [],
    };
  } catch (err) {
    console.error('Gagal membaca user progress dari localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Menyimpan seluruh data progress ke localStorage
 */
function saveUserProgress(data: UserProgressData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    notifyListeners();
  } catch (err) {
    console.error('Gagal menyimpan user progress ke localStorage:', err);
  }
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
      bookmarkedKanjiIds: Array.isArray(parsed.bookmarkedKanjiIds) ? parsed.bookmarkedKanjiIds : [],
      masteredKanjiIds: Array.isArray(parsed.masteredKanjiIds) ? parsed.masteredKanjiIds : [],
      bookmarkedVocabIds: Array.isArray(parsed.bookmarkedVocabIds) ? parsed.bookmarkedVocabIds : [],
      masteredVocabIds: Array.isArray(parsed.masteredVocabIds) ? parsed.masteredVocabIds : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
      failedItemIds: Array.isArray(parsed.failedItemIds) ? parsed.failedItemIds : [],
    };

    saveUserProgress(validated);
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
  try {
    localStorage.setItem(ROMAJI_STORAGE_KEY, show ? 'true' : 'false');
    notifyListeners();
  } catch (err) {
    console.error('Gagal menyimpan preferensi romaji:', err);
  }
}

export function toggleShowRomaji(): boolean {
  const current = getShowRomaji();
  const next = !current;
  setShowRomaji(next);
  return next;
}
