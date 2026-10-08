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

    const candidateDistractors = sameLevelKanji.flatMap(item => 
      item.examples ? item.examples.map(e => e.reading) : [...item.kunyomi, ...item.onyomi]
    );
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
      explanation: `Kata 【${chosenEx.word}】 dibaca "${chosenEx.reading}" yang berarti "${chosenEx.meaning}". Kanji 【${k.kanji}】 bermakna "${k.meaningId}".`,
    };
  }

  // Fallback: Isolated kanji reading
  const cleanKun = k.kunyomi[0]?.replace('・', '') || '';
  const correctAnswer = cleanKun || k.onyomi[0] || '—';

  const candidateDistractors = sameLevelKanji.map(item => 
    item.kunyomi[0]?.replace('・', '') || item.onyomi[0] || ''
  );
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
    question: `Bagaimana cara baca (furigana) dari kanji 【${k.kanji}】 (${k.meaningId})?`,
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

  const correctAnswer = k.meaningId;
  const candidateDistractors = sameLevelKanji.map(item => item.meaningId);
  const fallbackDistractors = globalKanji.map(item => item.meaningId);

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
    explanation: `Kanji 【${k.kanji}】 berarti "${k.meaningId}". Bacaan: ${[...k.onyomi, ...k.kunyomi].join(', ') || '-'}.`,
  };
}

export function createKanjiSymbolQuestion(
  k: KanjiItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelKanji = KANJI_DATA.filter(item => item.level === level && item.id !== k.id);
  const globalKanji = KANJI_DATA.filter(item => item.id !== k.id);

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
    question: `Manakah karakter Kanji yang tepat untuk kata/makna "${k.meaningId}"?`,
    audioText: k.kanji,
    options,
    correctIndex,
    explanation: `Kanji untuk "${k.meaningId}" adalah 【${k.kanji}】. Onyomi: ${k.onyomi.join(', ') || '-'} • Kunyomi: ${k.kunyomi.join(', ') || '-'}.`,
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
  const correctAnswer = `${primaryWord} (${k.meaningId})`;

  const candidateDistractors = sameLevelKanji.map(item => {
    const w = item.examples && item.examples.length > 0 ? item.examples[0].word : item.kanji;
    return `${w} (${item.meaningId})`;
  });
  const fallbackDistractors = globalKanji.map(item => {
    const w = item.examples && item.examples.length > 0 ? item.examples[0].word : item.kanji;
    return `${w} (${item.meaningId})`;
  });

  const { options, correctIndex } = buildOptions(correctAnswer, candidateDistractors, fallbackDistractors);

  return {
    id: `gen-k-list-${k.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: 'kanji',
    level,
    itemId: k.id,
    vectorType: 'listening',
    question: '🎧 Dengarkan audionya! Kanji/kosakata apa yang diucapkan?',
    audioText: primaryWord,
    options,
    correctIndex,
    explanation: `🔊 Suara yang diperdengarkan adalah 【${primaryWord}】 (${primaryReading}) dengan makna "${k.meaningId}".`,
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
    const candidateDistractors = sameLevelVocab.map(item => item.kana);
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
      explanation: `Kosakata 【${v.kanji}】 dibaca "${v.kana}" (${v.romaji}) yang berarti "${v.meaningId}".`,
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
    explanation: `Kata 【${v.kana}】 dilafalkan "${v.romaji}" dan berarti "${v.meaningId}".`,
  };
}

export function createVocabSemanticQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id);

  const correctAnswer = v.meaningId;
  const candidateDistractors = sameLevelVocab.map(item => item.meaningId);
  const fallbackDistractors = globalVocab.map(item => item.meaningId);

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
    explanation: `Kosakata 【${displayWord}】 (${v.romaji}) berarti "${v.meaningId}". ${v.exampleSentence ? `Contoh: "${v.exampleSentence.jp}" (${v.exampleSentence.id})` : ''}`,
  };
}

export function createVocabSymbolQuestion(
  v: VocabItem,
  level: JLPTLevel
): MultipleChoiceQuestion {
  const sameLevelVocab = VOCAB_DATA.filter(item => item.level === level && item.id !== v.id && !!item.kanji && item.kanji !== item.kana);
  const globalVocab = VOCAB_DATA.filter(item => item.id !== v.id && !!item.kanji && item.kanji !== item.kana);

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
      question: `Manakah penulisan Kanji yang tepat untuk kata "${v.kana}" (${v.meaningId})?`,
      audioText: v.kanji,
      options,
      correctIndex,
      explanation: `Kata "${v.kana}" (${v.meaningId}) ditulis dengan kanji 【${v.kanji}】 (${v.romaji}).`,
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

  const displayWord = v.kanji ? `${v.kanji} (${v.kana})` : v.kana;
  const correctAnswer = `${displayWord} — ${v.meaningId}`;

  const candidateDistractors = sameLevelVocab.map(item => {
    const dWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;
    return `${dWord} — ${item.meaningId}`;
  });
  const fallbackDistractors = globalVocab.map(item => {
    const dWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;
    return `${dWord} — ${item.meaningId}`;
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
// 4. GENERATORS BY CATEGORY
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
  // Use curated grammar pool as base, supplemented with procedural grammar questions
  let curatedList: MultipleChoiceQuestion[] = [];
  switch (level) {
    case 'N5': curatedList = [...CURATED_GRAMMAR_QUIZ]; break;
    case 'N4': curatedList = [...CURATED_N4_GRAMMAR_QUIZ]; break;
    case 'N3': curatedList = [...CURATED_N3_GRAMMAR_QUIZ]; break;
    case 'N2': curatedList = [...CURATED_N2_GRAMMAR_QUIZ]; break;
    case 'N1': curatedList = [...CURATED_N1_GRAMMAR_QUIZ]; break;
  }

  // Also build procedural questions from GRAMMAR_DATA for this level
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

export function generateDynamicMockExam(
  level: JLPTLevel,
  count: number = 15
): MultipleChoiceQuestion[] {
  // Balanced mock exam distribution:
  // ~35% Kanji, ~35% Vocab (including Listening), ~30% Grammar
  const kanjiCount = Math.max(2, Math.round(count * 0.35));
  const vocabCount = Math.max(2, Math.round(count * 0.35));
  const grammarCount = Math.max(1, count - kanjiCount - vocabCount);

  const kanjiQuestions = generateDynamicKanjiQuiz(level, kanjiCount);
  const vocabQuestions = generateDynamicVocabQuiz(level, vocabCount);
  const grammarQuestions = generateDynamicGrammarQuiz(level, grammarCount);

  return fisherYatesShuffle([...kanjiQuestions, ...vocabQuestions, ...grammarQuestions]);
}

// ============================================================================
// 5. GHOST / WEAK ITEMS REVIEW ENGINE
// ============================================================================

export function generateWeakPointsQuiz(
  count: number = 10
): MultipleChoiceQuestion[] {
  const failedIds = getFailedItemIds();
  if (failedIds.length === 0) return [];

  // Find all items in KANJI_DATA and VOCAB_DATA that match failedIds
  const matchedKanji = KANJI_DATA.filter(k => failedIds.includes(k.id));
  const matchedVocab = VOCAB_DATA.filter(v => failedIds.includes(v.id));

  const allMatched: (KanjiItem | VocabItem)[] = [
    ...matchedKanji,
    ...matchedVocab,
  ];

  if (allMatched.length === 0) {
    // If IDs were from another source, fallback
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
    const item = shuffledMatched[i % shuffledMatched.length] as (KanjiItem | VocabItem);
    const vector = vectors[i % vectors.length];
    questions.push(generateQuestionFromItem(item, item.level, vector));
  }

  return questions.slice(0, count);
}
