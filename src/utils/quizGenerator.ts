import { KANJI_DATA } from '../data/kanjiData';
import { VOCAB_DATA } from '../data/vocabData';
import { GRAMMAR_DATA } from '../data/grammarData';
import { CURATED_GRAMMAR_QUIZ } from '../data/quizN5Data';
import { CURATED_N4_GRAMMAR_QUIZ } from '../data/quizN4Data';
import { CURATED_N3_GRAMMAR_QUIZ } from '../data/quizN3Data';
import { CURATED_N2_GRAMMAR_QUIZ } from '../data/quizN2Data';
import { CURATED_N1_GRAMMAR_QUIZ } from '../data/quizN1Data';
import { 
  MultipleChoiceQuestion, 
  JLPTLevel, 
  KanjiItem, 
  VocabItem 
} from '../types';
import { getFailedItemIds } from './storage';

/**
 * Pure Fisher-Yates shuffle algorithm to eliminate statistical bias
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Helper to build 4 unique options with zero statistical bias
 */
function buildOptions(
  correctAnswer: string,
  candidateDistractors: string[],
  fallbackPool: string[] = []
): { options: string[]; correctIndex: number } {
  const cleanCorrect = correctAnswer.trim();
  const uniqueDistractors = Array.from(
    new Set(
      candidateDistractors
        .map(d => d.trim())
        .filter(d => d.length > 0 && d !== cleanCorrect)
    )
  );

  let pool = fisherYatesShuffle(uniqueDistractors);

  // If level pool has fewer than 3 unique distractors, supplement from global fallback pool
  if (pool.length < 3) {
    const supplement = fisherYatesShuffle(
      Array.from(
        new Set(
          fallbackPool
            .map(f => f.trim())
            .filter(f => f.length > 0 && f !== cleanCorrect && !pool.includes(f))
        )
      )
    );
    pool = [...pool, ...supplement];
  }

  const selectedDistractors = pool.slice(0, 3);
  const finalOptions = fisherYatesShuffle([cleanCorrect, ...selectedDistractors]);

  return {
    options: finalOptions,
    correctIndex: finalOptions.indexOf(cleanCorrect),
  };
}

/**
 * Peta pertukaran bunyi dakuten / handakuten untuk simulasi jebakan fonetik JLPT
 */
const DAKUTEN_TOGGLE: Record<string, string> = {
  'か':'が','き':'ぎ','く':'ぐ','け':'げ','こ':'ご',
  'が':'か','ぎ':'き','ぐ':'く','げ':'け','ご':'こ',
  'さ':'ざ','し':'じ','す':'ず','せ':'ぜ','そ':'ぞ',
  'ざ':'さ','じ':'し','ず':'す','ぜ':'せ','ぞ':'そ',
  'た':'だ','ち':'ぢ','つ':'づ','て':'で','と':'ど',
  'だ':'た','ぢ':'ち','づ':'つ','で':'て','ど':'と',
  'は':'ば','ひ':'び','ふ':'ぶ','へ':'べ','ほ':'ぼ',
  'ば':'ぱ','び':'ぴ','ぶ':'ぷ','べ':'ぺ','ぼ':'ぽ',
  'ぱ':'は','ぴ':'ひ','ぷ':'ふ','ぺ':'へ','ぽ':'ほ',
};

/**
 * Generator Jebakan Fonetik Cerdas (Smart Phonetic Trap):
 * Menghasilkan variasi bunyi mirip (dakuten/handakuten, chouon/vokal panjang, sokuon/っ)
 * sebagaimana pola soal resmi JLPT.
 */
export function generatePhoneticTraps(kana: string): string[] {
  const traps = new Set<string>();
  const clean = kana.trim();
  if (clean.length === 0) return [];

  // Trap 1: Dakuten / Handakuten toggle
  for (let i = 0; i < Math.min(3, clean.length); i++) {
    const char = clean[i];
    if (DAKUTEN_TOGGLE[char]) {
      const swapped = clean.slice(0, i) + DAKUTEN_TOGGLE[char] + clean.slice(i + 1);
      if (swapped !== clean) traps.add(swapped);
    }
  }

  // Trap 2: Chouon (vowel lengthening)
  if (clean.includes('う') && clean.length > 2) {
    traps.add(clean.replace(/う/g, ''));
  } else if (clean.length >= 2) {
    traps.add(clean.slice(0, -1) + 'う' + clean.slice(-1));
  }
  if (clean.includes('い') && clean.length > 2) {
    traps.add(clean.replace(/い/g, ''));
  }

  // Trap 3: Sokuon (っ)
  if (clean.includes('っ')) {
    traps.add(clean.replace(/っ/g, ''));
    traps.add(clean.replace(/っ/g, 'つ'));
  } else if (clean.length >= 3) {
    traps.add(clean.slice(0, 1) + 'っ' + clean.slice(1));
  }

  // Trap 4: Vowel flip di suku kata terakhir
  const lastChar = clean[clean.length - 1];
  const vowelSwaps: Record<string, string> = {
    'る': 'り', 'り': 'る', 'す': 'し', 'し': 'す',
    'う': 'お', 'お': 'う', 'い': 'え', 'え': 'い',
    'く': 'き', 'き': 'く', 'む': 'み', 'み': 'む'
  };
  if (vowelSwaps[lastChar]) {
    traps.add(clean.slice(0, -1) + vowelSwaps[lastChar]);
  }

  traps.delete(clean);
  return Array.from(traps);
}

const EN_TO_ID_DICTIONARY: [RegExp, string][] = [
  [/melakukan propose/gi, 'Mengusulkan'],
  [/melakukan suggest/gi, 'Menyarankan'],
  [/melakukan discuss/gi, 'Mendiskusikan'],
  [/melakukan explain/gi, 'Menjelaskan'],
  [/melakukan investigate/gi, 'Menyelidiki'],
  [/melakukan decide/gi, 'Memutuskan'],
  [/melakukan plan/gi, 'Merencanakan'],
  [/\bscholarship\b/gi, 'Beasiswa'],
  [/\bscholar\b/gi, 'Cendekiawan / Ilmuwan'],
  [/\bstrife\b/gi, 'Pertikaian'],
  [/\bdispute\b/gi, 'Perselisihan'],
  [/\briot\b/gi, 'Kerusuhan'],
  [/\brebellion\b/gi, 'Pemberontakan'],
  [/\bdifficulty\b/gi, 'Kesulitan'],
  [/\bhardships?\b/gi, 'Kesusahan'],
  [/\bdefects?\b/gi, 'Cacat / Kekurangan'],
  [/\bsubjects?\b/gi, 'Mata pelajaran'],
  [/\bcurriculum\b/gi, 'Kurikulum'],
  [/\bcourses?\b/gi, 'Kursus / Mata kuliah'],
  [/\blearning\b/gi, 'Pembelajaran'],
  [/\bscience\b/gi, 'Ilmu pengetahuan'],
  [/\bknowledge\b/gi, 'Pengetahuan'],
  [/\btroubles?\b/gi, 'Masalah / Gangguan'],
  [/\bproposals?\b/gi, 'Usulan'],
  [/\bsuggestions?\b/gi, 'Saran'],
  [/\bagreements?\b/gi, 'Kesepakatan'],
  [/\bcontracts?\b/gi, 'Kontrak / Perjanjian'],
  [/\brules?\b/gi, 'Aturan'],
  [/\blaws?\b/gi, 'Hukum'],
  [/melakukan\s+be\s+([a-zA-Z]+)/gi, 'Menjadi $1'],
  [/melakukan\s+dress\s+up/gi, 'Berdandan rapi'],
  [/\bcontrary\b/gi, 'Sebaliknya / Bertolak belakang'],
  [/\bappearance\b/gi, 'Penampilan / Pemuatan'],
  [/\bbarely\b/gi, 'Nyaris / Pas-pasan'],
  [/\bsquare\b/gi, 'Persegi'],
  [/\buprising\b/gi, 'Pemberontakan'],
  [/\brevolt\b/gi, 'Pemberontakan'],
  [/\binspection\b/gi, 'Inspeksi / Pemeriksaan'],
  [/\bbrowse\b/gi, 'Meramban'],
  [/\bnormal\b/gi, 'Normal'],
  [/\busual\b/gi, 'Biasa'],
  [/\btransitive\s+verb\b/gi, 'Kata kerja transitif'],
  [/\bintransitive\s+verb\b/gi, 'Kata kerja intransitif'],
  [/\beuphemistic\b/gi, 'Penghalusan kata / Eufemisme'],
  [/\bindirect\b/gi, 'Tidak langsung'],
  [/\binsinuating\b/gi, 'Menyindir'],
  [/\bticklish\b/gi, 'Geli'],
];

/**
 * Sanitasi arti Bahasa Indonesia agar bersih dari translasi mentah bahasa Inggris
 */
export function sanitizeIndonesianMeaning(text: string): string {
  if (!text) return '';
  let clean = text.trim();

  // Bersihkan kamus kata serapan / kamus dwibahasa mentah
  for (const [pattern, repl] of EN_TO_ID_DICTIONARY) {
    clean = clean.replace(pattern, repl);
  }

  // Bersihkan partikel to, pronouns, dan kurung berisi teks inggris murni
  clean = clean
    .replace(/\bto\s+/gi, '')
    .replace(/\b(something|someone|somebody|etc\.?)\b/gi, '')
    .replace(/\([a-zA-Z\s,/-]+\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  return clean || text;
}

/**
 * Mengambil arti ringkas untuk opsi kuis Choukai (listening)
 */
export function getConciseMeaning(text: string, maxWords: number = 3): string {
  const sanitized = sanitizeIndonesianMeaning(text);
  const firstPart = sanitized.split(/[,;/]/)[0].trim();
  const words = firstPart.split(/\s+/);
  if (words.length <= maxWords) return firstPart;
  return words.slice(0, maxWords).join(' ');
}

// ============================================================================
// 1. MULTI-VECTOR QUESTION BUILDERS (KANJI)
// ============================================================================

export function createKanjiPhoneticQuestion(
  k: KanjiItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelKanji = KANJI_DATA.filter(item => item.level === level && item.id !== k.id);
  const globalKanji = KANJI_DATA.filter(item => item.id !== k.id);

  // Contextual word reading if examples available, otherwise isolated reading
  if (k.examples && k.examples.length > 0) {
    const chosenEx = k.examples[Math.floor(Math.random() * k.examples.length)];
    const correctAnswer = chosenEx.reading;
    const phoneticTraps = generatePhoneticTraps(correctAnswer);

    const sameLevelReadings = sameLevelKanji.flatMap(item => 
      item.examples ? item.examples.map(e => e.reading) : [...item.kunyomi, ...item.onyomi]
    );
    const candidateDistractors = [...phoneticTraps, ...sameLevelReadings];
    const fallbackDistractors = globalKanji.flatMap(item => 
      item.examples ? item.examples.map(e => e.reading) : [...item.kunyomi, ...item.onyomi]
    );

    const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

    return {
      id: `gen-k-phon-${k.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'kanji',
      level,
      itemId: k.id,
      vectorType: 'phonetic',
      question: `Bagaimana cara baca kanji 【${k.kanji}】 pada kata 【${chosenEx.word}】?`,
      audioText: chosenEx.word,
      options,
      correctIndex,
      explanation: `Kata 【${chosenEx.word}】 dibaca "${chosenEx.reading}" yang berarti "${sanitizeIndonesianMeaning(chosenEx.meaning)}". Kanji 【${k.kanji}】 bermakna "${sanitizeIndonesianMeaning(k.meaningId)}".`,
    };
  }

  // Fallback: Isolated kanji reading
  const cleanKun = k.kunyomi[0]?.replace('・', '') || '';
  const correctAnswer = cleanKun || k.onyomi[0] || '—';
  const phoneticTraps = generatePhoneticTraps(correctAnswer);

  const candidateDistractors = [
    ...phoneticTraps,
    ...sameLevelKanji.map(item => item.kunyomi[0]?.replace('・', '') || item.onyomi[0] || '')
  ];
  const fallbackDistractors = globalKanji.map(item => 
    item.kunyomi[0]?.replace('・', '') || item.onyomi[0] || ''
  );

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-k-phon-${k.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'kanji',
    level,
    itemId: k.id,
    vectorType: 'phonetic',
    question: `Bagaimana cara baca (furigana) dari kanji 【${k.kanji}】 (${sanitizeIndonesianMeaning(k.meaningId)})?`,
    audioText: k.kanji,
    options,
    correctIndex,
    explanation: `Kanji 【${k.kanji}】 memiliki Onyomi: ${k.onyomi.join(', ') || '-'} dan Kunyomi: ${k.kunyomi.join(', ') || '-'}.`,
  };
}

export function createKanjiSemanticQuestion(
  k: KanjiItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelKanji = KANJI_DATA.filter(item => item.level === level && item.id !== k.id);
  const globalKanji = KANJI_DATA.filter(item => item.id !== k.id);

  const correctAnswer = sanitizeIndonesianMeaning(k.meaningId);
  const candidateDistractors = sameLevelKanji.map(item => sanitizeIndonesianMeaning(item.meaningId));
  const fallbackDistractors = globalKanji.map(item => sanitizeIndonesianMeaning(item.meaningId));

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-k-sem-${k.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'kanji',
    level,
    itemId: k.id,
    vectorType: 'semantic',
    question: `Apa arti bahasa Indonesia dari kanji 【${k.kanji}】?`,
    audioText: k.kanji,
    options,
    correctIndex,
    explanation: `Kanji 【${k.kanji}】 berarti "${correctAnswer}". Bacaan: ${[...k.onyomi, ...k.kunyomi].join(', ') || '-'}.`,
  };
}

export function createKanjiSymbolQuestion(
  k: KanjiItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelKanji = KANJI_DATA.filter(item => item.level === level && item.id !== k.id);
  const globalKanji = KANJI_DATA.filter(item => item.id !== k.id);

  const cleanMeaning = sanitizeIndonesianMeaning(k.meaningId);
  const correctAnswer = k.kanji;
  const candidateDistractors = sameLevelKanji.map(item => item.kanji);
  const fallbackDistractors = globalKanji.map(item => item.kanji);

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-k-sym-${k.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'kanji',
    level,
    itemId: k.id,
    vectorType: 'symbol',
    question: `Manakah karakter Kanji yang tepat untuk kata/makna "${cleanMeaning}"?`,
    audioText: k.kanji,
    options,
    correctIndex,
    explanation: `Kanji untuk "${cleanMeaning}" adalah 【${k.kanji}】. Onyomi: ${k.onyomi.join(', ') || '-'} • Kunyomi: ${k.kunyomi.join(', ') || '-'}.`,
  };
}

export function createKanjiListeningQuestion(
  k: KanjiItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelKanji = KANJI_DATA.filter(item => item.level === level && item.id !== k.id);
  const globalKanji = KANJI_DATA.filter(item => item.id !== k.id);

  const primaryWord = k.examples && k.examples.length > 0 ? k.examples[0].word : k.kanji;
  const primaryReading = k.examples && k.examples.length > 0 ? k.examples[0].reading : (k.kunyomi[0] || k.onyomi[0] || '');
  const cleanMeaning = getConciseMeaning(k.meaningId);

  // Opsi listening bersih dan ringkas (murni tes pendengaran)
  const correctAnswer = `${primaryReading} — ${cleanMeaning}`;

  const candidateDistractors = sameLevelKanji.map(item => {
    const reading = item.examples && item.examples.length > 0 ? item.examples[0].reading : (item.kunyomi[0] || item.onyomi[0] || '');
    return `${reading} — ${getConciseMeaning(item.meaningId)}`;
  });
  const fallbackDistractors = globalKanji.map(item => {
    const reading = item.examples && item.examples.length > 0 ? item.examples[0].reading : (item.kunyomi[0] || item.onyomi[0] || '');
    return `${reading} — ${getConciseMeaning(item.meaningId)}`;
  });

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-k-list-${k.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'kanji',
    level,
    itemId: k.id,
    vectorType: 'listening',
    question: '🎧 Dengarkan audionya! Kosakata apa yang diucapkan?',
    audioText: primaryWord,
    options,
    correctIndex,
    explanation: `🔊 Suara yang diperdengarkan adalah 【${primaryWord}】 (${primaryReading}) dengan makna "${cleanMeaning}".`,
  };
}

// ============================================================================
// 2. MULTI-VECTOR QUESTION BUILDERS (VOCAB)
// ============================================================================

export function createVocabPhoneticQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id);

  if (v.kanji && v.kanji !== v.kana) {
    const correctAnswer = v.kana;
    const phoneticTraps = generatePhoneticTraps(correctAnswer);

    const candidateDistractors = [...phoneticTraps, ...sameLevelVocab.map(item => item.kana)];
    const fallbackDistractors = globalVocab.map(item => item.kana);

    const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

    return {
      id: `gen-v-phon-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level,
      itemId: v.id,
      vectorType: 'phonetic',
      question: `Bagaimana cara membaca (furigana) dari kosakata 【${v.kanji}】?`,
      audioText: v.kanji,
      options,
      correctIndex,
      explanation: `Kosakata 【${v.kanji}】 dibaca "${v.kana}" (${v.romaji}) yang berarti "${sanitizeIndonesianMeaning(v.meaningId)}".`,
    };
  }

  // Kana-only word: Test romaji reading
  const correctAnswer = v.romaji;
  const candidateDistractors = sameLevelVocab.map(item => item.romaji);
  const fallbackDistractors = globalVocab.map(item => item.romaji);

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-v-phon-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'vocab',
    level,
    itemId: v.id,
    vectorType: 'phonetic',
    question: `Bagaimana pelafalan romaji dari kata 【${v.kana}】?`,
    audioText: v.kana,
    options,
    correctIndex,
    explanation: `Kata 【${v.kana}】 dilafalkan "${v.romaji}" dan berarti "${sanitizeIndonesianMeaning(v.meaningId)}".`,
  };
}

export function createVocabSemanticQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id);

  const correctAnswer = sanitizeIndonesianMeaning(v.meaningId);
  const candidateDistractors = sameLevelVocab.map(item => sanitizeIndonesianMeaning(item.meaningId));
  const fallbackDistractors = globalVocab.map(item => sanitizeIndonesianMeaning(item.meaningId));

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);
  const displayWord = v.kanji ? `${v.kanji} (${v.kana})` : v.kana;

  return {
    id: `gen-v-sem-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'vocab',
    level,
    itemId: v.id,
    vectorType: 'semantic',
    question: `Apa arti dari kosakata 【${displayWord}】?`,
    audioText: v.kanji || v.kana,
    options,
    correctIndex,
    explanation: `Kosakata 【${displayWord}】 (${v.romaji}) berarti "${correctAnswer}". ${v.exampleSentence ? `Contoh: "${v.exampleSentence.jp}" (${sanitizeIndonesianMeaning(v.exampleSentence.id)})` : ''}`,
  };
}

export function createVocabSymbolQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id && !!item.kanji && item.kanji !== item.kana);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id && !!item.kanji && item.kanji !== item.kana);

  const cleanMeaning = sanitizeIndonesianMeaning(v.meaningId);

  if (v.kanji && v.kanji !== v.kana) {
    const correctAnswer = v.kanji;
    const candidateDistractors = sameLevelVocab.map(item => item.kanji!);
    const fallbackDistractors = globalVocab.map(item => item.kanji!);

    const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

    return {
      id: `gen-v-sym-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level,
      itemId: v.id,
      vectorType: 'symbol',
      question: `Manakah penulisan Kanji yang tepat untuk kata "${v.kana}" (${cleanMeaning})?`,
      audioText: v.kanji,
      options,
      correctIndex,
      explanation: `Kata "${v.kana}" (${cleanMeaning}) ditulis dengan kanji 【${v.kanji}】 (${v.romaji}).`,
    };
  }

  // Fallback to semantic question if no kanji available
  return createVocabSemanticQuestion(v, level);
}

export function createVocabListeningQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id);

  const cleanMeaning = getConciseMeaning(v.meaningId);
  // Opsi listening bersih dan ringkas (murni menguji pendengaran kana / arti)
  const correctAnswer = `${v.kana} — ${cleanMeaning}`;

  const candidateDistractors = sameLevelVocab.map(item => {
    return `${item.kana} — ${getConciseMeaning(item.meaningId)}`;
  });
  const fallbackDistractors = globalVocab.map(item => {
    return `${item.kana} — ${getConciseMeaning(item.meaningId)}`;
  });

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-v-list-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'vocab',
    level,
    itemId: v.id,
    vectorType: 'listening',
    question: '🎧 Dengarkan audionya! Kosakata apa yang diucapkan?',
    audioText: v.kanji || v.kana,
    options,
    correctIndex,
    explanation: `🔊 Kata yang diucapkan adalah 【${v.kanji || v.kana}】 (${v.romaji}) yang berarti "${v.meaningId}". ${v.exampleSentence ? `Contoh: "${v.exampleSentence.jp}"` : ''}`,
  };
}

// ============================================================================
// 3. MULTI-VECTOR DISPATCHER FOR ANY ITEM
// ============================================================================

export function generateQuestionFromItem(
  item: KanjiItem | VocabItem,
  level: JLPTLevel,
  preferredVector?: 'phonetic' | 'semantic' | 'symbol' | 'listening'
): MultipleChoiceQuestion {
  const isKanji = 'radicals' in item;
  const vectors: ('phonetic' | 'semantic' | 'symbol' | 'listening')[] = [
    'phonetic',
    'semantic',
    'symbol',
    'listening',
  ];
  const vector = preferredVector || vectors[Math.floor(Math.random() * vectors.length)];

  if (isKanji) {
    const k = item as KanjiItem;
    switch (vector) {
      case 'phonetic': return createKanjiPhoneticQuestion(k, level);
      case 'semantic': return createKanjiSemanticQuestion(k, level);
      case 'symbol': return createKanjiSymbolQuestion(k, level);
      case 'listening': return createKanjiListeningQuestion(k, level);
    }
  } else {
    const v = item as VocabItem;
    switch (vector) {
      case 'phonetic': return createVocabPhoneticQuestion(v, level);
      case 'semantic': return createVocabSemanticQuestion(v, level);
      case 'symbol': return createVocabSymbolQuestion(v, level);
      case 'listening': return createVocabListeningQuestion(v, level);
    }
  }
}

// ============================================================================
// 4. AUTHENTIC JEES JLPT IN-CONTEXT QUESTION GENERATORS (SPK #20)
// ============================================================================

/**
 * Mondai 1: Kanji Yomi (Bacaan Kanji dalam Kalimat)
 * Format Soal: Ambil kalimat exampleSentence.jp. Bungkus kata kanji target dengan tanda kurung tebal: 【漢字】
 * Prompt: __ の言葉（漢字）の読み方として最も適切なものを一つ選んでください。
 * Opsi: 4 bacaan kana unik diproteksi jebakan fonetik (dakuten, vokal panjang, sokuon).
 */
export function createMondai1KanjiYomiQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id);

  const word = v.kanji && v.kanji !== v.kana ? v.kanji : v.kana;
  const sentenceJp = v.exampleSentence?.jp || `${word}について考えています。`;

  // Bungkus target dengan 【...】
  const sentenceWithTarget = sentenceJp.includes(word)
    ? sentenceJp.replace(word, `【${word}】`)
    : `【${word}】`;

  const prompt = `${sentenceWithTarget}\n__ の言葉（漢字）の読み方として最も適切なものを一つ選んでください。`;
  const correctAnswer = v.kana;
  const phoneticTraps = generatePhoneticTraps(correctAnswer);

  const candidateDistractors = [
    ...phoneticTraps,
    ...sameLevelVocab.map(item => item.kana)
  ];
  const fallbackDistractors = globalVocab.map(item => item.kana);

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `jlpt-m1-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'vocab',
    level,
    itemId: v.id,
    vectorType: 'phonetic',
    mondaiType: 'kanji-yomi',
    question: prompt,
    audioText: sentenceJp,
    options,
    correctIndex,
    explanation: `Kata 【${word}】 dibaca 「${v.kana}」 (${v.romaji}) yang berarti "${sanitizeIndonesianMeaning(v.meaningId)}".\nKalimat: ${v.exampleSentence ? `"${v.exampleSentence.jp}" (${sanitizeIndonesianMeaning(v.exampleSentence.id)})` : `"${sentenceJp}"`}`,
  };
}

/**
 * Mondai 2: Hyouki / Notasi (Ejaan Kanji dalam Kalimat)
 * Format Soal: Kalimat contoh dengan kata target ditulis dalam kana: 【かな】
 * Prompt: __ の言葉を漢字で書くとき、最も適切なものを一つ選んでください。
 * Opsi: 4 kanji berlevel sama / berkarakter mirip.
 */
export function createMondai2HyoukiQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocabWithKanji = VOCAB_DATA.filter(
    item => item.level === level && item.id !== v.id && !!item.kanji && item.kanji !== item.kana
  );
  const globalVocabWithKanji = VOCAB_DATA.filter(
    item => item.id !== v.id && !!item.kanji && item.kanji !== item.kana
  );

  const kanjiTarget = v.kanji || v.kana;
  const sentenceJp = v.exampleSentence?.jp || `${kanjiTarget}について考えています。`;

  // Kalimat contoh dengan target ditulis dalam kana dibungkus kurung tebal
  const sentenceWithKana = sentenceJp.includes(kanjiTarget)
    ? sentenceJp.replace(kanjiTarget, `【${v.kana}】`)
    : sentenceJp.includes(v.kana)
      ? sentenceJp.replace(v.kana, `【${v.kana}】`)
      : `【${v.kana}】`;

  const prompt = `${sentenceWithKana}\n__ の言葉を漢字で書くとき、最も適切なものを一つ選んでください。`;
  const correctAnswer = kanjiTarget;

  const candidateDistractors = sameLevelVocabWithKanji.map(item => item.kanji!);
  const fallbackDistractors = globalVocabWithKanji.map(item => item.kanji!);

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `jlpt-m2-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'kanji',
    level,
    itemId: v.id,
    vectorType: 'symbol',
    mondaiType: 'hyouki',
    question: prompt,
    audioText: sentenceJp,
    options,
    correctIndex,
    explanation: `Kata 「${v.kana}」 ditulis dengan Kanji 【${kanjiTarget}】 yang berarti "${sanitizeIndonesianMeaning(v.meaningId)}".\nKalimat: ${v.exampleSentence ? `"${v.exampleSentence.jp}" (${sanitizeIndonesianMeaning(v.exampleSentence.id)})` : `"${sentenceJp}"`}`,
  };
}

/**
 * Mondai 3: Bunmyaku Kitei (Kosakata Rumpang Kontekstual - Cloze Sentence)
 * Format Soal: Kosongkan kata target di dalam kalimat contoh menjadi tanda rumpang
 * Prompt: Pilihlah kata yang paling tepat untuk mengisi tanda kurung rumpang.
 * Opsi: 4 kosakata selevel yang gramatikal namun berbeda nuansa/arti.
 */
export function createMondai3BunmyakuKiteiQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id);

  const word = v.kanji || v.kana;
  const sentenceJp = v.exampleSentence?.jp || `${word}について考えています。`;

  const clozeSentence = sentenceJp.includes(word)
    ? sentenceJp.replace(word, '【　　】')
    : sentenceJp.includes(v.kana)
      ? sentenceJp.replace(v.kana, '【　　】')
      : `【　　】`;

  const prompt = `${clozeSentence}\n（　）に入れるのに最も適切な言葉を一つ選んでください。`;
  const correctAnswer = word;

  const candidateDistractors = sameLevelVocab.map(item => item.kanji || item.kana);
  const fallbackDistractors = globalVocab.map(item => item.kanji || item.kana);

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `jlpt-m3-${v.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'vocab',
    level,
    itemId: v.id,
    vectorType: 'semantic',
    mondaiType: 'bunmyaku-kitei',
    question: prompt,
    audioText: sentenceJp,
    options,
    correctIndex,
    explanation: `Jawaban tepat: 【${word}】 (${v.kana}).\nArti kalimat: "${v.exampleSentence ? sanitizeIndonesianMeaning(v.exampleSentence.id) : sanitizeIndonesianMeaning(v.meaningId)}".`,
  };
}

/**
 * Mondai 4: Bunpou Cloze (Tata Bahasa & Partikel Rumpang)
 * Format Soal: Kalimat rumpang dari kumpulan kurikulum tata bahasa / curated grammar
 * Prompt: Pilihlah pola tata bahasa/konjugasi yang paling tepat.
 * Opsi: 4 variasi konjugasi / partikel pembeda nuansa.
 */
export function createMondai4BunpouClozeQuestion(
  level: JLPTLevel
): MultipleChoiceQuestion {
  // Ambil dari curated pool yang sesuai level
  let curatedList: MultipleChoiceQuestion[] = [];
  switch (level) {
    case 'N5': curatedList = [...CURATED_GRAMMAR_QUIZ]; break;
    case 'N4': curatedList = [...CURATED_N4_GRAMMAR_QUIZ]; break;
    case 'N3': curatedList = [...CURATED_N3_GRAMMAR_QUIZ]; break;
    case 'N2': curatedList = [...CURATED_N2_GRAMMAR_QUIZ]; break;
    case 'N1': curatedList = [...CURATED_N1_GRAMMAR_QUIZ]; break;
  }

  // Jika curated list ada, adaptasikan ke format standar rumpang
  if (curatedList.length > 0) {
    const raw = curatedList[Math.floor(Math.random() * curatedList.length)];
    const cleanPrompt = raw.question
      .replace(/【_+】/g, '【　　】')
      .replace(/Pilihlah partikel yang tepat:\s*/gi, '')
      .replace(/Pilihlah yang tepat:\s*/gi, '');

    const finalQuestion = cleanPrompt.includes('【　　】')
      ? `${cleanPrompt}\n（　）に入れるのに最も適切な文法・活用を選んでください。`
      : `【　　】\n${cleanPrompt}`;

    return {
      ...raw,
      id: `jlpt-m4-${raw.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      mondaiType: 'bunpou',
      question: finalQuestion,
    };
  }

  // Procedural fallback dari GRAMMAR_DATA
  const grammarItems = GRAMMAR_DATA.filter(g => g.level === level);
  const g = grammarItems[Math.floor(Math.random() * grammarItems.length)] || GRAMMAR_DATA[0];
  const ex = g.examples[0] || { jp: '雨が降ったら、行きません。', romaji: '', id: 'Jika hujan, tidak pergi.' };
  
  const titleClean = g.title.replace(/[~〜()a-zA-Z\s]/g, '').trim() || 'たら';
  const cloze = ex.jp.includes(titleClean)
    ? ex.jp.replace(titleClean, '【　　】')
    : `雨が【　　】、出かけません。`;

  const otherGrammar = GRAMMAR_DATA.filter(o => o.level === level && o.id !== g.id);
  const candidateDistractors = otherGrammar.map(o => o.title.replace(/[~〜()a-zA-Z\s]/g, '').trim()).filter(Boolean);
  const { options, correctIndex } = buildOptions(titleClean, candidateDistractors, ['たら', 'なら', 'ば', 'と']);

  return {
    id: `jlpt-m4-${g.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'grammar',
    level,
    itemId: g.id,
    mondaiType: 'bunpou',
    question: `${cloze}\n（　）に入れるのに最も適切な文法・活用を選んでください。`,
    audioText: ex.jp,
    options,
    correctIndex,
    explanation: `Pola: 【${g.title}】 (${g.structure}). Makna: "${g.meaningId}". ${g.explanationId}`,
  };
}

// ============================================================================
// 5. GENERATORS BY CATEGORY
// ============================================================================

export function generateDynamicKanjiQuiz(
  level: JLPTLevel,
  count: number = 10
): MultipleChoiceQuestion[] {
  const pool = KANJI_DATA.filter(k => k.level === level);
  if (pool.length === 0) return [];

  const shuffled = fisherYatesShuffle(pool);
  const questions: MultipleChoiceQuestion[] = [];
  const vectors: ('phonetic' | 'semantic' | 'symbol' | 'listening')[] = [
    'phonetic',
    'semantic',
    'symbol',
    'listening',
  ];

  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const vector = vectors[i % vectors.length];
    questions.push(generateQuestionFromItem(item, level, vector));
  }

  return questions;
}

export function generateDynamicVocabQuiz(
  level: JLPTLevel,
  count: number = 10
): MultipleChoiceQuestion[] {
  const pool = VOCAB_DATA.filter(v => v.level === level);
  if (pool.length === 0) return [];

  const shuffled = fisherYatesShuffle(pool);
  const questions: MultipleChoiceQuestion[] = [];
  const vectors: ('phonetic' | 'semantic' | 'symbol' | 'listening')[] = [
    'semantic',
    'phonetic',
    'listening',
    'symbol',
  ];

  for (let i = 0; i < count; i++) {
    const item = shuffled[i % shuffled.length];
    const vector = vectors[i % vectors.length];
    questions.push(generateQuestionFromItem(item, level, vector));
  }

  return questions;
}

export function generateDynamicGrammarQuiz(
  level: JLPTLevel,
  count: number = 10
): MultipleChoiceQuestion[] {
  let curatedList: MultipleChoiceQuestion[] = [];
  switch (level) {
    case 'N5': curatedList = [...CURATED_GRAMMAR_QUIZ]; break;
    case 'N4': curatedList = [...CURATED_N4_GRAMMAR_QUIZ]; break;
    case 'N3': curatedList = [...CURATED_N3_GRAMMAR_QUIZ]; break;
    case 'N2': curatedList = [...CURATED_N2_GRAMMAR_QUIZ]; break;
    case 'N1': curatedList = [...CURATED_N1_GRAMMAR_QUIZ]; break;
  }

  const grammarItems = GRAMMAR_DATA.filter(g => g.level === level);
  const otherGrammar = GRAMMAR_DATA.filter(g => g.level === level);

  const proceduralGrammar: MultipleChoiceQuestion[] = grammarItems.map(g => {
    const correctAnswer = g.meaningId;
    const candidateDistractors = otherGrammar.filter(o => o.id !== g.id).map(o => o.meaningId);
    const fallbackDistractors = GRAMMAR_DATA.filter(o => o.id !== g.id).map(o => o.meaningId);
    const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

    return {
      id: `gen-g-${g.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'grammar',
      level,
      itemId: g.id,
      mondaiType: 'bunpou',
      question: `Pola tata bahasa 【${g.title}】 digunakan untuk menyatakan fungsi apa?`,
      options,
      correctIndex,
      explanation: `Rumus 【${g.title}】 (${g.structure}) berarti "${g.meaningId}". Penjelasan: ${g.explanationId}`,
    };
  });

  const fullPool = fisherYatesShuffle([...curatedList, ...proceduralGrammar]);
  const result: MultipleChoiceQuestion[] = [];

  for (let i = 0; i < count; i++) {
    result.push(fullPool[i % fullPool.length]);
  }

  return result;
}

/**
 * Simulasi Ujian Resmi JLPT Berbasis Kalimat In-Context (TIKET 20.1 & TIKET 20.3)
 * Menjamin 100% soal berakar dari format kalimat utuh (In-Context Cloze Test)
 */
export function generateDynamicMockExam(
  level: JLPTLevel,
  count: number = 20
): MultipleChoiceQuestion[] {
  // Ambil vocabulary ber-exampleSentence untuk Mondai 1, 2, 3
  const vocabPool = VOCAB_DATA.filter(
    v => v.level === level && !!v.exampleSentence?.jp && !!v.kanji && v.kanji !== v.kana
  );
  const fallbackVocabPool = VOCAB_DATA.filter(v => v.level === level && !!v.exampleSentence?.jp);
  const finalPool = vocabPool.length >= 10 ? vocabPool : fallbackVocabPool;
  const shuffledVocab = fisherYatesShuffle(finalPool.length > 0 ? finalPool : VOCAB_DATA.filter(v => v.level === level));

  let m1Count: number;
  let m2Count: number;
  let m3Count: number;
  let m4Count: number;

  if (count <= 10) {
    // ⚡ Mini Mock (10 Soal): 3 M1, 3 M2, 2 M3, 2 M4
    m1Count = 3;
    m2Count = 3;
    m3Count = 2;
    m4Count = 2;
  } else if (count <= 20) {
    // 📝 Standar JLPT (20 Soal): 5 M1, 5 M2, 5 M3, 5 M4
    m1Count = 5;
    m2Count = 5;
    m3Count = 5;
    m4Count = count - 15;
  } else {
    // 🏆 Tryout Penuh (25 Soal atau lebih): Pembagian proporsional
    m1Count = Math.round(count * 0.28);
    m2Count = Math.round(count * 0.24);
    m3Count = Math.round(count * 0.24);
    m4Count = count - (m1Count + m2Count + m3Count);
  }

  const questions: MultipleChoiceQuestion[] = [];
  let vocabIdx = 0;

  // Mondai 1: Kanji Yomi
  for (let i = 0; i < m1Count; i++) {
    const v = shuffledVocab[vocabIdx % shuffledVocab.length];
    vocabIdx++;
    questions.push(createMondai1KanjiYomiQuestion(v, level));
  }

  // Mondai 2: Hyouki
  for (let i = 0; i < m2Count; i++) {
    const v = shuffledVocab[vocabIdx % shuffledVocab.length];
    vocabIdx++;
    questions.push(createMondai2HyoukiQuestion(v, level));
  }

  // Mondai 3: Bunmyaku Kitei
  for (let i = 0; i < m3Count; i++) {
    const v = shuffledVocab[vocabIdx % shuffledVocab.length];
    vocabIdx++;
    questions.push(createMondai3BunmyakuKiteiQuestion(v, level));
  }

  // Mondai 4: Bunpou Cloze
  for (let i = 0; i < m4Count; i++) {
    questions.push(createMondai4BunpouClozeQuestion(level));
  }

  // Pastikan tepat count soal
  return questions.slice(0, count);
}

// ============================================================================
// 6. GHOST / WEAK ITEMS REVIEW ENGINE (TIKET 20.2)
// ============================================================================

export function generateWeakPointsQuiz(
  count: number = 10,
  specificFailedIds?: string[]
): MultipleChoiceQuestion[] {
  const targetIds = specificFailedIds && specificFailedIds.length > 0 
    ? specificFailedIds 
    : getFailedItemIds();

  if (targetIds.length === 0) return [];

  // Find all items in KANJI_DATA and VOCAB_DATA that match targetIds
  const matchedKanji = KANJI_DATA.filter(k => targetIds.includes(k.id));
  const matchedVocab = VOCAB_DATA.filter(v => targetIds.includes(v.id));

  const allMatched: (KanjiItem | VocabItem)[] = [
    ...matchedKanji,
    ...matchedVocab,
  ];

  if (allMatched.length === 0) {
    return [];
  }

  const shuffledMatched = fisherYatesShuffle(allMatched);
  const questions: MultipleChoiceQuestion[] = [];
  const vectors: ('phonetic' | 'semantic' | 'symbol' | 'listening')[] = [
    'phonetic',
    'semantic',
    'symbol',
    'listening',
  ];

  for (let i = 0; i < Math.min(count, allMatched.length * 4); i++) {
    const item = shuffledMatched[i % shuffledMatched.length];
    const vector = vectors[i % vectors.length];
    questions.push(generateQuestionFromItem(item, item.level, vector));
  }

  return questions.slice(0, count);
}
