export type KanaType = 'hiragana' | 'katakana';

export type KanaCategory = 'gojuuon' | 'dakuten' | 'yoon';

export interface KanaItem {
  id: string;              // e.g. "h-ka", "k-shi", "h-kya"
  character: string;       // e.g. "か", "シ", "きゃ"
  romaji: string;          // primary romaji, e.g. "ka", "shi", "kya"
  aliases: string[];       // alternative valid answers, e.g. ["si"] for "shi", ["tu"] for "tsu"
  type: KanaType;          // 'hiragana' | 'katakana'
  category: KanaCategory;  // 'gojuuon' | 'dakuten' | 'yoon'
  row: string;             // e.g. "k", "s", "t", "combo-k"
}

export interface KanaGroup {
  id: string;
  name: string;
  type: KanaType;
  category: KanaCategory;
  items: KanaItem[];
}

export interface QuizAttempt {
  kana: KanaItem;
  userInputs: string[];
  isCorrectFirstTry: boolean;
  failedAttempts: number;
}

export interface QuizSummary {
  totalQuestions: number;
  correctFirstTryCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  wrongItems: QuizAttempt[];
  allAttempts: QuizAttempt[];
}

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface RadicalItem {
  id: string;
  radical: string;
  nameId: string;
  meaningId: string;
  strokes: number;
  examples: string[]; // sample kanji using this radical
}

export interface KanjiItem {
  id: string;
  kanji: string;
  level: JLPTLevel;
  category?: string; // e.g. "Angka & Jumlah", "Waktu & Hari", "Alam & Arah", "Orang & Keluarga", "Aktivitas & Sekolah"
  meaning: string;
  meaningId: string; // Indonesian meaning
  mnemonic?: string; // Indonesian story mnemonic
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  radicals: string[];
  examples: { word: string; reading: string; meaning: string }[];
}


export interface VocabItem {
  id: string;
  kanji?: string;
  kana: string;
  romaji: string;
  meaningEn: string;
  meaningId: string; // Indonesian meaning
  level: JLPTLevel;
  category: string;
  partOfSpeech: string;
  exampleSentence?: {
    jp: string;
    furigana: string;
    id: string;
  };
}

export interface GrammarItem {
  id: string;
  title: string;
  level: JLPTLevel;
  structure: string;
  meaningId: string;
  explanationId: string;
  examples: {
    jp: string;
    romaji: string;
    id: string;
  }[];
}

export type N5QuizCategory = 'kanji' | 'vocab' | 'grammar' | 'mock-exam' | 'weak-points';

export interface MultipleChoiceQuestion {
  id: string;
  category: 'kanji' | 'vocab' | 'grammar';
  level: JLPTLevel;
  question: string;
  audioText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  itemId?: string; // ID item sumber (Kanji/Vocab) untuk pelacakan titik lemah
  vectorType?: 'phonetic' | 'semantic' | 'symbol' | 'listening';
}

export interface QuizHistoryEntry {
  id: string;
  category: string;
  timestamp: number;
  total: number;
  correct: number;
  accuracy: number;
}

export interface UserProgressData {
  version: number; // Schema version (v2)
  bookmarkedKanjiIds: string[];
  masteredKanjiIds: string[];
  bookmarkedVocabIds: string[];
  masteredVocabIds: string[];
  quizHistory: QuizHistoryEntry[];
  failedItemIds: string[]; // Daftar ID kanji/kata yang pernah salah dijawab
}

export type VerbGroup = 'godan' | 'ichidan' | 'irregular';
export type ConjugationForm = 'masu' | 'te' | 'nai' | 'ta' | 'potential' | 'passive';

export interface VerbFormDetail {
  kanji: string;
  kana: string;
  romaji: string;
}

export interface VerbItem {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaningId: string;
  group: VerbGroup;
  level: JLPTLevel;
  ruleExplanation?: string; // Penjelasan aturan bunyi spesifik
  forms: Record<ConjugationForm, VerbFormDetail>;
}

export interface ParticleQuestion {
  id: string;
  sentenceWithBlank: string;    // e.g. "わたし___ がくせいです。"
  sentenceComplete: string;     // e.g. "わたしはがくせいです。"
  translationId: string;        // e.g. "Saya adalah seorang siswa."
  correctParticle: string;      // e.g. "は"
  options: string[];            // e.g. ["は", "が", "を", "に"]
  explanation: string;          // Penjelasan logis kenapa pakai 'は' bukan 'が'
  audioText: string;
}
