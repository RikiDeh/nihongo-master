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
  mondaiType?: 'kanji-yomi' | 'hyouki' | 'bunmyaku-kitei' | 'bunpou' | 'choukai';
}

export interface QuizHistoryEntry {
  id: string;
  category: string;
  timestamp: number;
  total: number;
  correct: number;
  accuracy: number;
}

export type SrsStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
// 0: Belum Dipelajari
// 1: Pemula I (4 jam)
// 2: Pemula II (8 jam)
// 3: Menengah I (24 jam / 1 hari)
// 4: Menengah II (72 jam / 3 hari)
// 5: Mahir (168 jam / 1 minggu)
// 6: Penguasaan Luhur (336 jam / 2 minggu)
// 7: Burned / Permanen (720 jam / 1 bulan)

export interface SrsItemRecord {
  id: string; // ID unik kosakata/kanji/grammar
  itemType: 'kanji' | 'vocab' | 'grammar';
  level: JLPTLevel;
  stage: SrsStage;
  nextReviewTimestamp: number; // Unix timestamp kapan kartu jatuh tempo
  lastReviewedTimestamp: number;
  streak: number;
  failCount: number; // Jika failCount >= 4, status menjadi 'leech'
}

export interface DailyMissionsState {
  date: string;
  srsReviewedCount: number;
  roadmapStageCompleted: boolean;
  quickQuizCompleted: boolean;
}

export interface UserProgressData {
  version: number; // Schema version (v2)
  bookmarkedKanjiIds: string[];
  masteredKanjiIds: string[];
  bookmarkedVocabIds: string[];
  masteredVocabIds: string[];
  quizHistory: QuizHistoryEntry[];
  failedItemIds: string[]; // Daftar ID kanji/kata yang pernah salah dijawab
  dailyStreak: number; // rekor hari belajar berturut-turut
  lastActiveDate: string; // format 'YYYY-MM-DD'
  lastClaimedSignInDate?: string; // Tanggal terakhir klaim popup sign-in
  dailyGoalTarget: number; // default: 15 kartu per hari
  dailyCardsCompleted: number; // jumlah kartu/kuis yang diselesaikan hari ini
  srsRecords: Record<string, SrsItemRecord>; // menyimpan status seluruh kartu SRS
  currentArcId?: string; // Arc aktif saat ini ('arc_0_kana', 'arc_1_n5', dll)
  completedStageIds?: string[]; // Daftar ID stage/bab yang sudah lulus
  dailyMissionsState?: DailyMissionsState; // Status 3 misi harian
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
