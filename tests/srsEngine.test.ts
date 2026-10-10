import { describe, it, expect, beforeEach } from 'bun:test';
import { 
  registerSrsItem, 
  recordSrsReviewResult, 
  getDueSrsItems, 
  getSrsOverviewStats,
  SRS_INTERVAL_HOURS 
} from '../src/utils/srsEngine';
import { 
  getUserProgress, 
  saveUserProgress, 
  evaluateDailyStreak, 
  DEFAULT_PROGRESS 
} from '../src/utils/storage';

describe('SRS Spaced-Repetition Core Engine & Daily Habit Tracker (SPK #21)', () => {
  beforeEach(() => {
    // Reset local user progress storage to pristine default before each test
    saveUserProgress({
      ...DEFAULT_PROGRESS,
      srsRecords: {},
      dailyStreak: 0,
      lastActiveDate: null,
      dailyCardsCompleted: 0,
    });
  });

  describe('TIKET 21.1: Registrasi dan Interval Progresi SRS', () => {
    it('mendaftarkan item baru pada Stage 1 dengan interval review awal 4 jam', () => {
      const record = registerSrsItem('k-n5-1', 'kanji', 'N5');
      expect(record).toBeDefined();
      expect(record.id).toBe('k-n5-1');
      expect(record.itemType).toBe('kanji');
      expect(record.level).toBe('N5');
      expect(record.stage).toBe(1);
      expect(record.streak).toBe(0);
      expect(record.failCount).toBe(0);

      const fourHoursMs = SRS_INTERVAL_HOURS[1] * 60 * 60 * 1000;
      expect(record.nextReviewTimestamp).toBeGreaterThanOrEqual(Date.now() + fourHoursMs - 1000);
      expect(record.nextReviewTimestamp).toBeLessThanOrEqual(Date.now() + fourHoursMs + 1000);
    });

    it('tidak menduplikasi item jika ID sudah pernah didaftarkan', () => {
      const first = registerSrsItem('vn5-1', 'vocab', 'N5');
      const second = registerSrsItem('vn5-1', 'vocab', 'N5');
      expect(first.nextReviewTimestamp).toBe(second.nextReviewTimestamp);
      expect(Object.keys(getUserProgress().srsRecords).length).toBe(1);
    });

    it('menaikkan stage bertahap dari 1 hingga 7 (Burned) saat ulasan sukses berturut-turut', () => {
      registerSrsItem('k-test-progress', 'kanji', 'N5');

      // Stage 1 -> 2 (8 jam)
      let res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(2);
      expect(res?.streak).toBe(1);

      // Stage 2 -> 3 (24 jam)
      res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(3);
      expect(res?.streak).toBe(2);

      // Stage 3 -> 4 (72 jam)
      res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(4);
      expect(res?.streak).toBe(3);

      // Stage 4 -> 5 (168 jam)
      res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(5);
      expect(res?.streak).toBe(4);

      // Stage 5 -> 6 (336 jam)
      res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(6);
      expect(res?.streak).toBe(5);

      // Stage 6 -> 7 (720 jam / Burned)
      res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(7);
      expect(res?.streak).toBe(6);

      // Success saat sudah Burned (Stage 7) tetap mentok di Stage 7
      res = recordSrsReviewResult('k-test-progress', true);
      expect(res?.stage).toBe(7);
      expect(res?.streak).toBe(7);
    });

    it('menurunkan stage saat ulasan gagal: jika stage < 5 turun 1 stage, jika stage >= 5 jatuh ke stage 3', () => {
      registerSrsItem('k-demote-test', 'kanji', 'N5');

      // Naik ke stage 3
      recordSrsReviewResult('k-demote-test', true); // stage 2
      recordSrsReviewResult('k-demote-test', true); // stage 3
      expect(getUserProgress().srsRecords['k-demote-test'].stage).toBe(3);

      // Gagal di stage 3 (< 5) -> turun 1 stage ke stage 2
      let res = recordSrsReviewResult('k-demote-test', false);
      expect(res?.stage).toBe(2);
      expect(res?.streak).toBe(0);
      expect(res?.failCount).toBe(1);

      // Naik ke stage 5 (Mahir)
      recordSrsReviewResult('k-demote-test', true); // stage 3
      recordSrsReviewResult('k-demote-test', true); // stage 4
      recordSrsReviewResult('k-demote-test', true); // stage 5
      expect(getUserProgress().srsRecords['k-demote-test'].stage).toBe(5);

      // Gagal di stage 5 (>= 5) -> jatuh ke stage 3 (Menengah I)
      res = recordSrsReviewResult('k-demote-test', false);
      expect(res?.stage).toBe(3);
      expect(res?.streak).toBe(0);
      expect(res?.failCount).toBe(2);

      // Naik ke stage 6 (Penguasaan Luhur)
      recordSrsReviewResult('k-demote-test', true); // stage 4
      recordSrsReviewResult('k-demote-test', true); // stage 5
      recordSrsReviewResult('k-demote-test', true); // stage 6
      expect(getUserProgress().srsRecords['k-demote-test'].stage).toBe(6);

      // Gagal di stage 6 (>= 5) -> jatuh ke stage 3
      res = recordSrsReviewResult('k-demote-test', false);
      expect(res?.stage).toBe(3);
    });

    it('memastikan batas bawah stage adalah 1 (tidak pernah turun ke 0 atau negatif)', () => {
      registerSrsItem('k-bottom-test', 'kanji', 'N5'); // stage 1
      const res = recordSrsReviewResult('k-bottom-test', false);
      expect(res?.stage).toBe(1);
    });

    it('mendeteksi materi Leech saat akumulasi failCount mencapai >= 4', () => {
      registerSrsItem('k-leech-test', 'kanji', 'N5');

      // Gagal 4 kali berturut-turut
      recordSrsReviewResult('k-leech-test', false);
      recordSrsReviewResult('k-leech-test', false);
      recordSrsReviewResult('k-leech-test', false);
      const res = recordSrsReviewResult('k-leech-test', false);

      expect(res?.failCount).toBe(4);
      const stats = getSrsOverviewStats();
      expect(stats.leechCount).toBe(1);
    });
  });

  describe('TIKET 21.2 & 21.3: Due Timestamp Filtering & Habit Tracker', () => {
    it('memfilter item jatuh tempo (nextReviewTimestamp <= Date.now()) dengan getDueSrsItems', () => {
      registerSrsItem('k-due-1', 'kanji', 'N5');
      registerSrsItem('k-not-due', 'kanji', 'N5');

      const data = getUserProgress();
      // Simulasikan k-due-1 sudah jatuh tempo (1 jam yang lalu)
      data.srsRecords['k-due-1'].nextReviewTimestamp = Date.now() - 3600000;
      // k-not-due jatuh tempo 2 jam lagi
      data.srsRecords['k-not-due'].nextReviewTimestamp = Date.now() + 7200000;
      saveUserProgress(data);

      const dueItems = getDueSrsItems();
      expect(dueItems.map(item => item.id)).toContain('k-due-1');
      expect(dueItems.map(item => item.id)).not.toContain('k-not-due');
    });

    it('menghitung distribusi SRS overview stats dengan akurat', () => {
      registerSrsItem('k-apprentice', 'kanji', 'N5'); // stage 1
      registerSrsItem('k-guru', 'kanji', 'N4');
      registerSrsItem('k-master', 'kanji', 'N3');

      // Dorong ke stage masing-masing
      recordSrsReviewResult('k-guru', true); // stage 2
      recordSrsReviewResult('k-guru', true); // stage 3 (Guru)

      recordSrsReviewResult('k-master', true); // 2
      recordSrsReviewResult('k-master', true); // 3
      recordSrsReviewResult('k-master', true); // 4
      recordSrsReviewResult('k-master', true); // 5 (Master)

      const stats = getSrsOverviewStats();
      expect(stats.apprentice).toBe(1);
      expect(stats.guru).toBe(1);
      expect(stats.master).toBe(1);
      expect(stats.totalLearned).toBe(3);
    });

    it('mengevaluasi daily streak belajar harian secara deterministik', () => {
      // Hari 1: 2026-10-01
      const day1 = new Date('2026-10-01T10:00:00');
      let progress = evaluateDailyStreak(day1);
      expect(progress.dailyStreak).toBe(1);
      expect(progress.dailyCardsCompleted).toBe(1);
      expect(progress.lastActiveDate).toBe('2026-10-01');

      // Hari 1 lagi (sesi kedua pada tanggal yang sama): streak tetap, kartu bertambah
      progress = evaluateDailyStreak(day1);
      expect(progress.dailyStreak).toBe(1);
      expect(progress.dailyCardsCompleted).toBe(2);

      // Hari 2 (hari berikutnya berturut-turut): 2026-10-02 -> streak naik jadi 2
      const day2 = new Date('2026-10-02T10:00:00');
      progress = evaluateDailyStreak(day2);
      expect(progress.dailyStreak).toBe(2);
      expect(progress.dailyCardsCompleted).toBe(1);
      expect(progress.lastActiveDate).toBe('2026-10-02');

      // Bolos belajar (gap > 1 hari): 2026-10-05 -> streak reset ke 1
      const dayGap = new Date('2026-10-05T10:00:00');
      progress = evaluateDailyStreak(dayGap);
      expect(progress.dailyStreak).toBe(1);
      expect(progress.dailyCardsCompleted).toBe(1);
      expect(progress.lastActiveDate).toBe('2026-10-05');
    });
  });
});
