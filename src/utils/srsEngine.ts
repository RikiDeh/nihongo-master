import { SrsStage, SrsItemRecord, JLPTLevel } from '../types';
import { getUserProgress, saveUserProgress, evaluateDailyStreak, reportMissionActivity } from './storage';

/**
 * Durasi interval peninjauan SRS dalam hitungan jam
 * Stage 0: 0 jam (Belum Dipelajari)
 * Stage 1: 4 jam (Pemula I)
 * Stage 2: 8 jam (Pemula II)
 * Stage 3: 24 jam / 1 hari (Menengah I)
 * Stage 4: 72 jam / 3 hari (Menengah II)
 * Stage 5: 168 jam / 1 minggu (Mahir)
 * Stage 6: 336 jam / 2 minggu (Penguasaan Luhur)
 * Stage 7: 720 jam / 1 bulan (Burned / Permanen)
 */
export const SRS_INTERVAL_HOURS: Record<SrsStage, number> = {
  0: 0,
  1: 4,
  2: 8,
  3: 24,
  4: 72,
  5: 168,
  6: 336,
  7: 720,
};

export interface SrsOverviewStats {
  apprentice: number; // Stage 1 - 2
  guru: number;       // Stage 3 - 4
  master: number;     // Stage 5
  enlightened: number;// Stage 6
  burned: number;     // Stage 7
  totalLearned: number;
  totalDue: number;
  leechCount: number;
}

/**
 * Mendaftarkan kartu baru ke sistem SRS jika belum terdaftar.
 * Item baru dimulai pada Stage 1 dengan jatuh tempo review pertama 4 jam lagi.
 */
export function registerSrsItem(
  id: string,
  itemType: 'kanji' | 'vocab' | 'grammar',
  level: JLPTLevel
): SrsItemRecord {
  const data = getUserProgress();
  const existing = data.srsRecords[id];
  if (existing) {
    return existing;
  }

  const now = Date.now();
  const nextReview = now + SRS_INTERVAL_HOURS[1] * 60 * 60 * 1000;

  const newRecord: SrsItemRecord = {
    id,
    itemType,
    level,
    stage: 1,
    nextReviewTimestamp: nextReview,
    lastReviewedTimestamp: now,
    streak: 0,
    failCount: 0,
  };

  saveUserProgress({
    ...data,
    srsRecords: {
      ...data.srsRecords,
      [id]: newRecord,
    },
  });

  return newRecord;
}

/**
 * Mencatat hasil ulasan SRS (Adaptive WaniKani / SM-2)
 *
 * Logika Transisi:
 * - Jika BENAR:
 *   • stage naik +1 (maksimal 7 / Burned)
 *   • hitung nextReviewTimestamp berdasarkan interval jam stage baru
 *   • streak bertambah +1
 * - Jika SALAH:
 *   • stage turun: Jika stage >= 5 (Mahir), turun ke 3 (1 hari). Jika stage < 5, turun 1 level (minimal 1).
 *   • failCount bertambah +1 (failCount >= 4 dianggap Leech)
 *   • streak direset ke 0
 *   • nextReviewTimestamp diset ke 4 jam lagi (immediate remediation)
 */
export function recordSrsReviewResult(
  id: string,
  isSuccess: boolean
): SrsItemRecord | null {
  const data = getUserProgress();
  const current = data.srsRecords[id];
  if (!current) return null;

  const now = Date.now();
  let nextStage: SrsStage = current.stage;
  let nextReview = now;
  let nextStreak = current.streak;
  let nextFailCount = current.failCount;

  if (isSuccess) {
    nextStage = Math.min(7, current.stage + 1) as SrsStage;
    nextReview = now + SRS_INTERVAL_HOURS[nextStage] * 60 * 60 * 1000;
    nextStreak = current.streak + 1;
  } else {
    if (current.stage >= 5) {
      nextStage = 3; // Turun ke Menengah I (24 jam)
    } else {
      nextStage = Math.max(1, current.stage - 1) as SrsStage;
    }
    nextFailCount = current.failCount + 1;
    nextStreak = 0;
    nextReview = now + SRS_INTERVAL_HOURS[1] * 60 * 60 * 1000; // Immediate remediation 4 jam
  }

  const updatedRecord: SrsItemRecord = {
    ...current,
    stage: nextStage,
    nextReviewTimestamp: nextReview,
    lastReviewedTimestamp: now,
    streak: nextStreak,
    failCount: nextFailCount,
  };

  saveUserProgress({
    ...data,
    srsRecords: {
      ...data.srsRecords,
      [id]: updatedRecord,
    },
  });

  // Perbarui habit streak belajar harian & target harian
  evaluateDailyStreak();
  reportMissionActivity('srs', 1);

  return updatedRecord;
}

/**
 * Mendaftarkan kumpulan materi awal (misal 10 kosakata N5) untuk langsung dipelajari di SRS.
 * Jatuh tempo diset ke waktu sekarang agar dapat langsung diulas.
 */
export function seedInitialSrsItems(
  itemsToSeed: Array<{ id: string; itemType: 'kanji' | 'vocab' | 'grammar'; level: JLPTLevel }>
): SrsItemRecord[] {
  const data = getUserProgress();
  const records = { ...data.srsRecords };
  const seeded: SrsItemRecord[] = [];
  const now = Date.now();

  for (const item of itemsToSeed) {
    if (!records[item.id]) {
      const newRec: SrsItemRecord = {
        id: item.id,
        itemType: item.itemType,
        level: item.level,
        stage: 1,
        nextReviewTimestamp: now,
        lastReviewedTimestamp: now,
        streak: 0,
        failCount: 0,
      };
      records[item.id] = newRec;
      seeded.push(newRec);
    }
  }

  saveUserProgress({
    ...data,
    srsRecords: records,
  });

  return seeded;
}

/**
 * Mengambil semua kartu SRS aktif (stage 1 s/d 6)
 */
export function getAllActiveSrsItems(): SrsItemRecord[] {
  const data = getUserProgress();
  return Object.values(data.srsRecords).filter(item => item.stage > 0 && item.stage < 7);
}

/**
 * Mengambil seluruh item SRS yang sudah jatuh tempo (nextReviewTimestamp <= Date.now())
 */
export function getDueSrsItems(): SrsItemRecord[] {
  const data = getUserProgress();
  const now = Date.now();
  return Object.values(data.srsRecords).filter(
    item => item.stage > 0 && item.stage < 7 && item.nextReviewTimestamp <= now
  );
}

/**
 * Menghitung ringkasan statistik SRS berdasarkan stage WaniKani:
 * - Apprentice (Pemula): Stage 1 - 2
 * - Guru (Menengah): Stage 3 - 4
 * - Master (Mahir): Stage 5
 * - Enlightened (Penguasaan Luhur): Stage 6
 * - Burned (Permanen): Stage 7
 */
export function getSrsOverviewStats(): SrsOverviewStats {
  const data = getUserProgress();
  const items = Object.values(data.srsRecords);
  const now = Date.now();

  let apprentice = 0;
  let guru = 0;
  let master = 0;
  let enlightened = 0;
  let burned = 0;
  let totalDue = 0;
  let leechCount = 0;

  for (const item of items) {
    if (item.stage === 1 || item.stage === 2) apprentice++;
    else if (item.stage === 3 || item.stage === 4) guru++;
    else if (item.stage === 5) master++;
    else if (item.stage === 6) enlightened++;
    else if (item.stage === 7) burned++;

    if (item.stage > 0 && item.stage < 7 && item.nextReviewTimestamp <= now) {
      totalDue++;
    }

    if (item.failCount >= 4) {
      leechCount++;
    }
  }

  return {
    apprentice,
    guru,
    master,
    enlightened,
    burned,
    totalLearned: items.length,
    totalDue,
    leechCount,
  };
}
