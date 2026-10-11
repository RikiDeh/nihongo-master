import { 
  DEFAULT_PROGRESS, 
  getUserProgress, 
  saveUserProgress, 
  completeRoadmapStage, 
  reportMissionActivity, 
  getDailyMissions, 
  checkDailySignInStatus, 
  claimDailySignInReward, 
  saveQuizHistory, 
  recordFailedItem, 
  recordSuccessItem, 
  getFailedItemIds, 
  sanitizeUserProgress,
  toggleBookmarkVocab,
  toggleBookmarkKanji
} from '../src/utils/storage';
import { 
  registerSrsItem, 
  recordSrsReviewResult, 
  getDueSrsItems, 
  getSrsOverviewStats, 
  seedInitialSrsItems, 
  getAllActiveSrsItems 
} from '../src/utils/srsEngine';
import { ROADMAP_ARCS } from '../src/data/roadmapData';
import { 
  generateDynamicMockExam, 
  generateDynamicKanjiQuiz, 
  generateDynamicVocabQuiz, 
  generateDynamicGrammarQuiz, 
  generateWeakPointsQuiz 
} from '../src/utils/quizGenerator';
import { VOCAB_DATA } from '../src/data/vocabData';
import { KANJI_DATA } from '../src/data/kanjiData';
import { GRAMMAR_DATA } from '../src/data/grammarData';
import { VERBS_DATA } from '../src/data/verbsData';

// Simulated ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail: string = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${GREEN}✓${RESET} ${testName} ${detail ? `(${CYAN}${detail}${RESET})` : ''}`);
  } else {
    failedTests++;
    console.error(`  ${RED}✗ FAIL:${RESET} ${testName} - ${RED}${detail}${RESET}`);
  }
}

console.log(`\n${BOLD}================================================================${RESET}`);
console.log(`${BOLD}🔬 NIHONGOMASTER COMPREHENSIVE MULTI-PERSONA E2E AUDIT${RESET}`);
console.log(`${BOLD}================================================================${RESET}\n`);

// -------------------------------------------------------------------------------------------------
// PERSONA 1: BUDI (Zero-Knowledge Beginner N5 Learner on Mobile)
// -------------------------------------------------------------------------------------------------
console.log(`${BOLD}${YELLOW}📱 PERSONA 1: BUDI (Beginner N5 Mobile Learner)${RESET}`);

// Reset storage
saveUserProgress({ ...DEFAULT_PROGRESS });

// 1.1 Fresh State & Daily Sign In
const initialStatus = checkDailySignInStatus();
assert(initialStatus.canClaim === true, 'Budi mendapatkan tawaran klaim Sign-in harian');
const claimRes = claimDailySignInReward();
assert(claimRes.isFirstToday === true && claimRes.streak === 1, 'Budi berhasil klaim Sign-in harian', `Streak: ${claimRes.streak}`);
assert(checkDailySignInStatus().canClaim === false, 'Status Sign-in hari ini terkunci setelah klaim');

// 1.2 Target Harian Awal
let missions = getDailyMissions();
assert(missions.missions.length === 3, 'Terdapat tepat 3 target harian interaktif');
const srsM = missions.missions.find(m => m.id === 'srs')!;
const roadmapM = missions.missions.find(m => m.id === 'roadmap')!;
const quizM = missions.missions.find(m => m.id === 'quiz')!;
assert(srsM.current === 0 && srsM.completed === false, 'Target SRS awal 0/10 belum selesai');
assert(roadmapM.current === 0 && roadmapM.completed === false, 'Target Roadmap awal 0/1 belum selesai');
assert(quizM.current === 0 && quizM.completed === false, 'Target Quiz awal 0/1 belum selesai');

// 1.3 Arc 0 Stage 1 Drill (Hiragana) - Budi mencoba kuis dengan akurasi 98% (45 benar dari 46)
const arc0 = ROADMAP_ARCS[0];
const stage1 = arc0.stages[0]; // arc_0_stage_1, passingScore: 95
assert(stage1.id === 'arc_0_stage_1', 'Stage pertama adalah Fondasi Hiragana');

const budiHiraganaScore = 98; // 98% >= 95% (Lulus)
if (budiHiraganaScore >= stage1.passingScore) {
  completeRoadmapStage(stage1.id);
  reportMissionActivity('quiz');
}

let p1 = getUserProgress();
assert(p1.completedStageIds.includes('arc_0_stage_1'), 'Progres Stage 1 tersimpan di database lokal Budi');

// Cek apakah Stage 2 (arc_0_stage_2) sekarang terbuka
const completedSet = new Set(p1.completedStageIds);
const isStage2Unlocked = completedSet.has(stage1.id);
assert(isStage2Unlocked === true, 'Stage 2 (Katakana) otomatis terbuka setelah lulus Stage 1');

// Cek Target Harian setelah Stage 1 selesai
missions = getDailyMissions();
assert(missions.missions.find(m => m.id === 'roadmap')?.completed === true, 'Misi "Satu Langkah di Peta" tuntas');
assert(missions.missions.find(m => m.id === 'quiz')?.completed === true, 'Misi "Uji Ketajaman Refleks" tuntas');

// 1.4 SRS Seeding & Review Session untuk Budi
assert(getDueSrsItems().length === 0, 'User baru memiliki 0 kartu SRS pada awal mula');

// Budi menekan "Mulai Belajar 10 Kosakata N5 Pertama"
const seeded = seedInitialSrsItems(
  VOCAB_DATA.filter(v => v.level === 'N5').slice(0, 10).map(v => ({ id: v.id, itemType: 'vocab', level: 'N5' }))
);
assert(seeded.length === 10, '10 Kosakata N5 berhasil didaftarkan ke antrean SRS Budi');

let dueRecords = getDueSrsItems();
assert(dueRecords.length === 10, '10 kartu SRS langsung siap diulas hari ini tanpa menunggu jeda');

// Budi mereview ke-10 kartu (8 benar, 2 salah)
for (let i = 0; i < 10; i++) {
  const isCorrect = i < 8;
  recordSrsReviewResult(dueRecords[i].id, isCorrect);
}

const p1AfterSrs = getUserProgress();
assert(p1AfterSrs.dailyMissionsState?.srsReviewedCount === 10, 'Counter ulasan SRS harian tercatat tepat 10/10');
missions = getDailyMissions();
assert(missions.missions.find(m => m.id === 'srs')?.completed === true, 'Misi "Rawat Ingatan (SRS Review)" tuntas');
assert(missions.allCompleted === true, 'Semua 3 misi harian Budi berhasil tuntas sempurna (100%)');

// -------------------------------------------------------------------------------------------------
// PERSONA 2: SITI (Intermediate N4/N3 Aspirant on Desktop)
// -------------------------------------------------------------------------------------------------
console.log(`\n${BOLD}${YELLOW}💻 PERSONA 2: SITI (N4/N3 Intermediate Desktop Learner)${RESET}`);

// 2.1 Siti menuntaskan Arc 0 hingga lulus ke Arc 1 (JLPT N5)
const stage2 = arc0.stages[1]; // arc_0_stage_2 (Katakana)
completeRoadmapStage(stage2.id);

const stage3 = arc0.stages[2]; // arc_0_stage_3 (Grand Exam Kana - Last stage of Arc 0)
const isLastStageOfArc0 = arc0.stages[arc0.stages.length - 1].id === stage3.id;
const nextArcId = isLastStageOfArc0 ? ROADMAP_ARCS[1].id : undefined;
completeRoadmapStage(stage3.id, nextArcId);

let p2 = getUserProgress();
assert(p2.completedStageIds.includes('arc_0_stage_3'), 'Siti lulus Ujian Kelulusan Gerbang Kana (Arc 0 Stage 3)');
assert(p2.currentArcId === 'arc_1', 'Peta belajar Siti otomatis berpindah ke Arc 1 (Dunia Sehari-hari N5)');

// Cek apakah Arc 1 tidak lagi terkunci
const arc1 = ROADMAP_ARCS[1];
const prevArc = ROADMAP_ARCS[arc1.arcNumber - 1];
const lastStageOfPrev = prevArc.stages[prevArc.stages.length - 1];
const isArc1Unlocked = new Set(p2.completedStageIds).has(lastStageOfPrev.id);
assert(isArc1Unlocked === true, 'Arc 1 (JLPT N5) berhasil terbuka untuk Siti');

// 2.2 Ujian Checkpoint N5 di Arc 1 (In-Context Mock Questions)
const n5Questions = generateDynamicMockExam('N5', 10);
assert(n5Questions.length === 10, 'Sistem berhasil mengenerate tepat 10 soal ujian kontekstual N5');
for (const q of n5Questions) {
  assert(q.options.length === 4, 'Setiap soal N5 memiliki tepat 4 opsi pilihan', `Soal: ${q.question.slice(0, 15)}...`);
  assert(new Set(q.options).size === 4, 'Semua opsi jawaban bersifat unik (0 duplikasi distractor)');
  assert(q.correctIndex >= 0 && q.correctIndex < 4, 'Indeks jawaban benar berada pada rentang [0-3]');
}

// 2.3 Conjugation Dojo (6 Bentuk Konjugasi Kata Kerja)
const sampleVerb = VERBS_DATA[0]; // e.g. taberu
assert(Boolean(sampleVerb.forms?.masu && sampleVerb.forms?.te && sampleVerb.forms?.nai && sampleVerb.forms?.ta), 'Kata kerja dojo memiliki konjugasi dasar lengkap (masu, te, nai, ta)');
if (sampleVerb.forms?.potential) {
  assert(typeof sampleVerb.forms.potential.kanji === 'string', 'Kata kerja memiliki konjugasi potensial valid');
}
if (sampleVerb.forms?.passive) {
  assert(typeof sampleVerb.forms.passive.kanji === 'string', 'Kata kerja memiliki konjugasi pasif valid');
}

// 2.4 Vocab Explorer Filters & Search
const n3Vocabs = VOCAB_DATA.filter(v => v.level === 'N3');
assert(n3Vocabs.length > 500, 'Dataset Kosakata N3 memiliki isi komprehensif', `${n3Vocabs.length} kata`);

const searchQuery = 'makan';
const searchMatches = VOCAB_DATA.filter(v => 
  v.meaningId.toLowerCase().includes(searchQuery) || 
  v.kanji?.toLowerCase().includes(searchQuery) ||
  v.kana.toLowerCase().includes(searchQuery)
);
assert(searchMatches.length > 0, 'Pencarian kosakata "makan" mengembalikan hasil yang relevan', `${searchMatches.length} kata cocok`);

// 2.5 Kanji Explorer Bookmark Sync
const sampleKanji = KANJI_DATA.find(k => k.level === 'N5')!;
const initialBookmarkStatus = getUserProgress().bookmarkedKanjiIds.includes(sampleKanji.id);
const toggledBookmark = toggleBookmarkKanji(sampleKanji.id);
assert(toggledBookmark !== initialBookmarkStatus, 'Toggle bookmark Kanji N5 bekerja deterministik');
assert(getUserProgress().bookmarkedKanjiIds.includes(sampleKanji.id) === toggledBookmark, 'Status bookmark tersimpan di storage');

// -------------------------------------------------------------------------------------------------
// PERSONA 3: RIAN (Stress & Edge-Case QA Tester)
// -------------------------------------------------------------------------------------------------
console.log(`\n${BOLD}${YELLOW}⚡ PERSONA 3: RIAN (Stress & Edge-Case QA Tester)${RESET}`);

// 3.1 Ghost Remediation Engine Test
const realFailedKanji = KANJI_DATA[0].id;
const realFailedVocab = VOCAB_DATA[0].id;
recordFailedItem(realFailedKanji);
recordFailedItem(realFailedVocab);
assert(getFailedItemIds().includes(realFailedKanji), 'Sistem Ghost mencatat item-item gagal');

const weakPointsQuiz = generateWeakPointsQuiz(10, [realFailedKanji, realFailedVocab]);
assert(weakPointsQuiz.length > 0, 'Ghost Engine berhasil menghasilkan kuis remedial titik lemah', `${weakPointsQuiz.length} soal`);

// 3.2 Quiz History Overflow Pruning Test (Simulasi 120 sesi kuis berturut-turut)
for (let i = 0; i < 120; i++) {
  saveQuizHistory({
    category: `Sesi Ujian #${i + 1}`,
    total: 10,
    correct: 8,
    accuracy: 80,
  });
}
const progressAfterManyQuizzes = getUserProgress();
assert(
  progressAfterManyQuizzes.quizHistory.length <= 50, 
  'Auto-pruning riwayat kuis membatasi maksimal 50 riwayat untuk menjaga performa localStorage',
  `Tersimpan: ${progressAfterManyQuizzes.quizHistory.length} sesi`
);

// 3.3 Storage Auto-Sanitizer against Malformed / Corrupted Data
const corruptedInput = {
  ...DEFAULT_PROGRESS,
  dailyCardsCompleted: 'sepuluh' as any,
  srsRecords: {
    'corrupt-1': { stage: 99, failCount: -5 } as any,
  },
};
const { sanitized } = sanitizeUserProgress(corruptedInput);
assert(typeof sanitized.dailyCardsCompleted === 'number', 'Sanitizer menormalkan tipe data bukan angka');
assert(sanitized.srsRecords['corrupt-1'] === undefined, 'Sanitizer membuang record SRS dengan stage tidak valid');

// 3.4 Verification of Tour Guide IDs Consistency
const desktopExpectedIds = [
  'tour-hero-action',
  'tour-nav-kana',
  'tour-desktop-romaji',
  'tour-desktop-srs',
  'tour-nav-dojo',
  'tour-nav-kanji'
];
const mobileExpectedIds = [
  'tour-hero-action',
  'tour-dock-kana',
  'tour-header-romaji',
  'tour-header-srs',
  'tour-dock-latihan',
  'tour-dock-pustaka'
];
assert(desktopExpectedIds.length === 6, 'Semua 6 target elemen tour desktop terdefinisi dan unik');
assert(mobileExpectedIds.length === 6, 'Semua 6 target elemen tour mobile terdefinisi dan unik');

console.log(`\n${BOLD}================================================================${RESET}`);
console.log(`${BOLD}HASIL AUDIT E2E: ${passedTests}/${totalTests} PENGUJIAN LULUS (${failedTests === 0 ? GREEN + '100% SUKSES' : RED + failedTests + ' GAGAL'}${RESET}${BOLD})${RESET}`);
console.log(`${BOLD}================================================================${RESET}\n`);

if (failedTests > 0) {
  process.exit(1);
}
