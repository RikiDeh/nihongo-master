import { describe, it, expect } from 'bun:test';
import { runDataValidation } from '../scripts/validateData';
import { KANJI_DATA } from '../src/data/kanjiData';
import { VOCAB_DATA } from '../src/data/vocabData';
import { GRAMMAR_DATA } from '../src/data/grammarData';
import { VERBS_DATA } from '../src/data/verbsData';
import { JLPTLevel } from '../src/types';

describe('Benteng Anti-Rot & Ketahanan Data (SPK #10)', () => {
  const VALID_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

  it('memastikan 100% ID unik di seluruh database (0 cross-dataset ID collision)', () => {
    const report = runDataValidation();
    expect(report.duplicateIds).toBe(0);
    expect(report.totalItems).toBe(
      KANJI_DATA.length + VOCAB_DATA.length + GRAMMAR_DATA.length + VERBS_DATA.length
    );
  });

  it('memastikan dataset Kanji memiliki field wajib dan level yang valid', () => {
    for (const item of KANJI_DATA) {
      expect(item.id).toBeTruthy();
      expect(item.kanji).toBeTruthy();
      expect(item.meaningId).toBeTruthy();
      expect(VALID_LEVELS).toContain(item.level);
      expect(item.strokes).toBeGreaterThan(0);
      expect(Array.isArray(item.onyomi)).toBe(true);
      expect(Array.isArray(item.kunyomi)).toBe(true);
      expect(Array.isArray(item.radicals)).toBe(true);
    }
  });

  it('memastikan dataset Kosakata memiliki field wajib dan level yang valid', () => {
    for (const item of VOCAB_DATA) {
      expect(item.id).toBeTruthy();
      expect(item.kana).toBeTruthy();
      expect(item.romaji).toBeTruthy();
      expect(item.meaningId).toBeTruthy();
      expect(VALID_LEVELS).toContain(item.level);
      expect(item.category).toBeTruthy();
    }
  });

  it('memastikan dataset Tata Bahasa memiliki field wajib dan contoh kalimat', () => {
    for (const item of GRAMMAR_DATA) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.structure).toBeTruthy();
      expect(item.meaningId).toBeTruthy();
      expect(item.explanationId).toBeTruthy();
      expect(VALID_LEVELS).toContain(item.level);
      expect(Array.isArray(item.examples)).toBe(true);
      expect(item.examples.length).toBeGreaterThan(0);
    }
  });

  it('memastikan dataset Kata Kerja Dojo memiliki 6 konjugasi lengkap (termasuk potensial & pasif N4)', () => {
    const requiredForms = ['masu', 'te', 'nai', 'ta', 'potential', 'passive'] as const;
    for (const item of VERBS_DATA) {
      expect(item.id).toBeTruthy();
      expect(item.kanji).toBeTruthy();
      expect(item.kana).toBeTruthy();
      expect(item.romaji).toBeTruthy();
      expect(item.meaningId).toBeTruthy();
      expect(['godan', 'ichidan', 'irregular']).toContain(item.group);
      expect(item.forms).toBeDefined();

      for (const formKey of requiredForms) {
        const form = item.forms[formKey];
        expect(form).toBeDefined();
        expect(form.kanji).toBeTruthy();
        expect(form.kana).toBeTruthy();
        expect(form.romaji).toBeTruthy();
      }
    }
  });

  it('lulus audit otomatis: "Semua data valid 100%, 0 ID duplikat, 0 anomali field"', () => {
    const report = runDataValidation();
    expect(report.errors.length).toBe(0);
    expect(report.fieldAnomalies).toBe(0);
    expect(report.invalidLevels).toBe(0);
  });

  it('memverifikasi Storage Auto-Sanitizer (SPK 10.2) membersihkan ID hantu & meng-upgrade schema ke v2', async () => {
    const { sanitizeUserProgress } = await import('../src/utils/storage');
    const mockCorruptedData = {
      version: 1,
      bookmarkedKanjiIds: ['n5-1', 'GHOST-KANJI-X'],
      masteredKanjiIds: ['n5-2', 'GHOST-KANJI-Y'],
      bookmarkedVocabIds: ['vn5-greet-1', 'GHOST-VOCAB-A'],
      masteredVocabIds: ['vn5-greet-2', 'GHOST-VOCAB-B'],
      quizHistory: [],
      failedItemIds: ['n5-1', 'GHOST-FAILED-Z'],
    };

    const { sanitized, modified } = sanitizeUserProgress(mockCorruptedData);

    expect(modified).toBe(true);
    expect(sanitized.version).toBe(2);
    expect(sanitized.bookmarkedKanjiIds).toEqual(['n5-1']);
    expect(sanitized.masteredKanjiIds).toEqual(['n5-2']);
    expect(sanitized.bookmarkedVocabIds).toEqual(['vn5-greet-1']);
    expect(sanitized.failedItemIds).toEqual(['n5-1']);
    expect(sanitized.bookmarkedKanjiIds).not.toContain('GHOST-KANJI-X');
    expect(sanitized.failedItemIds).not.toContain('GHOST-FAILED-Z');
  });
});
