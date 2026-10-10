import { describe, it, expect } from 'bun:test';
import { 
  generateDynamicMockExam, 
  generateWeakPointsQuiz,
  createMondai1KanjiYomiQuestion,
  createMondai2HyoukiQuestion,
  createMondai3BunmyakuKiteiQuestion,
  createMondai4BunpouClozeQuestion
} from '../src/utils/quizGenerator';
import { VOCAB_DATA } from '../src/data/vocabData';
import { JLPTLevel } from '../src/types';

describe('Authentic In-Context JLPT Exam & Ghost Remediation Suite (SPK #20)', () => {
  const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

  it('memastikan generateDynamicMockExam(level, count) menghasilkan tepat count soal', () => {
    for (const level of levels) {
      const exam10 = generateDynamicMockExam(level, 10);
      expect(exam10.length).toBe(10);

      const exam20 = generateDynamicMockExam(level, 20);
      expect(exam20.length).toBe(20);

      const exam25 = generateDynamicMockExam(level, 25);
      expect(exam25.length).toBe(25);
    }
  });

  it('memastikan seluruh soal Mondai 3 memiliki tanda rumpang 【　　】', () => {
    for (const level of levels) {
      const exam = generateDynamicMockExam(level, 20);
      const mondai3Questions = exam.filter(q => q.mondaiType === 'bunmyaku-kitei');
      expect(mondai3Questions.length).toBeGreaterThan(0);

      for (const q of mondai3Questions) {
        expect(q.question).toContain('【　　】');
        expect(q.question).toContain('入れるのに最も適切な言葉');
      }
    }
  });

  it('memastikan seluruh soal Mondai 1 & 2 memiliki kata bergaris bawah / tanda kurung 【...】', () => {
    for (const level of levels) {
      const exam = generateDynamicMockExam(level, 20);
      const m1m2Questions = exam.filter(
        q => q.mondaiType === 'kanji-yomi' || q.mondaiType === 'hyouki'
      );
      expect(m1m2Questions.length).toBeGreaterThan(0);

      for (const q of m1m2Questions) {
        expect(q.question).toMatch(/【.+?】/);
      }
    }
  });

  it('memastikan seluruh pertanyaan memiliki tepat 4 opsi unik dan 1 indeks jawaban benar yang valid', () => {
    for (const level of levels) {
      const exam = generateDynamicMockExam(level, 20);
      for (const q of exam) {
        expect(q.options.length).toBe(4);
        const uniqueOptions = new Set(q.options);
        expect(uniqueOptions.size).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.options[q.correctIndex]).toBeTruthy();
      }
    }
  });

  it('memastikan format soal di Mock Exam 100% berbasis kalimat tanpa soal mentah terisolasi', () => {
    for (const level of levels) {
      const exam = generateDynamicMockExam(level, 20);
      for (const q of exam) {
        // Larangan soal mentah terisolasi "Apa arti dari 【X】?"
        expect(q.question).not.toContain('Apa arti dari 【');
        expect(q.question).not.toContain('Manakah penulisan Kanji yang tepat untuk kata');
      }
    }
  });

  it('memverifikasi pembuatan kuis satuan Mondai 1 s/d 4 berfungsi dengan valid', () => {
    const vocabWithSentence = VOCAB_DATA.find(v => !!v.exampleSentence?.jp && !!v.kanji && v.kanji !== v.kana);
    expect(vocabWithSentence).toBeTruthy();

    if (vocabWithSentence) {
      const m1 = createMondai1KanjiYomiQuestion(vocabWithSentence, 'N5');
      expect(m1.mondaiType).toBe('kanji-yomi');
      expect(m1.question).toContain(`【${vocabWithSentence.kanji}】`);
      expect(m1.options.length).toBe(4);

      const m2 = createMondai2HyoukiQuestion(vocabWithSentence, 'N5');
      expect(m2.mondaiType).toBe('hyouki');
      expect(m2.question).toContain(`【${vocabWithSentence.kana}】`);
      expect(m2.options.length).toBe(4);

      const m3 = createMondai3BunmyakuKiteiQuestion(vocabWithSentence, 'N5');
      expect(m3.mondaiType).toBe('bunmyaku-kitei');
      expect(m3.question).toContain('【　　】');
      expect(m3.options.length).toBe(4);
    }

    const m4 = createMondai4BunpouClozeQuestion('N5');
    expect(m4.mondaiType).toBe('bunpou');
    expect(m4.options.length).toBe(4);
  });

  it('memastikan generateWeakPointsQuiz() berhasil membuat kuis remedial dari daftar failedItemIds spesifik', () => {
    // Ambil sampel 3 vocab ID dari VOCAB_DATA
    const sampleIds = [VOCAB_DATA[0].id, VOCAB_DATA[1].id, VOCAB_DATA[2].id];
    const weakQuiz = generateWeakPointsQuiz(3, sampleIds);

    expect(weakQuiz.length).toBeGreaterThan(0);
    expect(weakQuiz.length).toBeLessThanOrEqual(3);

    for (const q of weakQuiz) {
      expect(q.options.length).toBe(4);
      expect(sampleIds).toContain(q.itemId!);
    }
  });
});
