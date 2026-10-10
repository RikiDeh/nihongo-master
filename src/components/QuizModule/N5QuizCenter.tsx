import React, { useState, useEffect } from 'react';
import { N5QuizCategory, MultipleChoiceQuestion } from '../../types';
import { 
  generateDynamicKanjiQuiz, 
  generateDynamicVocabQuiz, 
  generateDynamicGrammarQuiz, 
  generateDynamicMockExam,
  generateWeakPointsQuiz
} from '../../utils/quizGenerator';
import { N5QuizSession } from './N5QuizSession';
import { N5QuizResults } from './N5QuizResults';
import { 
  saveQuizHistory, 
  getUserProgress, 
  recordFailedItem, 
  recordSuccessItem, 
  subscribeToStorage 
} from '../../utils/storage';
import { 
  BookOpen, 
  Layers, 
  Award, 
  Trophy, 
  ArrowRight,
  Flame,
  Star
} from 'lucide-react';

interface QuizCenterProps {
  initialLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'ALL';
}

export const N5QuizCenter: React.FC<QuizCenterProps> = ({ initialLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>(
    initialLevel && initialLevel !== 'ALL' ? initialLevel : 'N5'
  );
  const [stage, setStage] = useState<'menu' | 'session' | 'results'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<N5QuizCategory>('kanji');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [activeQuestions, setActiveQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [, setStorageTick] = useState(0);
  const [quizResults, setQuizResults] = useState<{
    total: number;
    correct: number;
    questions: MultipleChoiceQuestion[];
    userAnswers: (number | null)[];
  } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setStorageTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number | undefined>(undefined);

  const startQuiz = (category: N5QuizCategory, countOverride?: number) => {
    setSelectedCategory(category);
    const count = countOverride || questionCount;
    let questions: MultipleChoiceQuestion[] = [];

    switch (category) {
      case 'kanji':
        questions = generateDynamicKanjiQuiz(selectedLevel, count);
        setSessionDurationMinutes(undefined);
        break;
      case 'vocab':
        questions = generateDynamicVocabQuiz(selectedLevel, count);
        setSessionDurationMinutes(undefined);
        break;
      case 'grammar':
        questions = generateDynamicGrammarQuiz(selectedLevel, count);
        setSessionDurationMinutes(undefined);
        break;
      case 'mock-exam':
        questions = generateDynamicMockExam(selectedLevel, count);
        setSessionDurationMinutes(count >= 25 ? 25 : count === 20 ? 20 : 10);
        break;
      case 'weak-points':
        questions = generateWeakPointsQuiz(count);
        setSessionDurationMinutes(undefined);
        break;
    }

    if (questions.length === 0) {
      return;
    }

    setActiveQuestions(questions);
    setStage('session');
  };

  const startRemediationSession = (failedQuestions: MultipleChoiceQuestion[]) => {
    setSelectedCategory('weak-points');
    setSessionDurationMinutes(undefined);
    setActiveQuestions(failedQuestions);
    setStage('session');
  };

  const getCategoryTitle = (cat: N5QuizCategory) => {
    const lvl = selectedLevel;
    switch (cat) {
      case 'kanji': return `Kuis Kanji ${lvl} (Moji)`;
      case 'vocab': return `Kuis Kosakata ${lvl} (Goi)`;
      case 'grammar': return `Kuis Tata Bahasa ${lvl} (Bunpou)`;
      case 'mock-exam': return `Simulasi Ujian JLPT ${lvl}`;
      case 'weak-points': return `Drill Titik Lemah (Ghost Engine)`;
    }
  };

  const getCategoryBadge = (cat: N5QuizCategory) => {
    const lvl = selectedLevel;
    switch (cat) {
      case 'kanji': return `Kanji ${lvl}`;
      case 'vocab': return `Vocab ${lvl}`;
      case 'grammar': return `Grammar ${lvl}`;
      case 'mock-exam': return `Simulasi ${lvl}`;
      case 'weak-points': return `Titik Lemah`;
    }
  };

  const progress = getUserProgress();
  const totalQuizzes = progress.quizHistory.length;
  const avgAccuracy = totalQuizzes > 0
    ? Math.round(progress.quizHistory.reduce((acc, cur) => acc + cur.accuracy, 0) / totalQuizzes)
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {stage === 'menu' && (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/25 text-[#1e3a8a] dark:text-[#3b82f6] text-xs font-mono font-medium mb-3 select-none">
              <Trophy className="w-3.5 h-3.5" />
              <span>[試] PUSAT UJIAN & TRYOUT JLPT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
              Pusat Ujian & Tryout JLPT (N5→N1)
            </h1>
            <p className="text-[#78716c] dark:text-[#a1a1aa] text-xs sm:text-sm max-w-2xl mx-auto mb-6 font-sans">
              Simulasi ujian berbasis format otentik JLPT: Moji (Kanji Yomi & Hyouki), Goi (Kosakata Rumpang), Bunpou (Tata Bahasa), dan Choukai (Audio Menyimak).
            </p>

            {/* Level Switcher Tab — Clean Zen Segments */}
            <div className="inline-flex flex-wrap justify-center p-1 bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] rounded-lg gap-1 mb-6">
              {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedLevel === lvl
                      ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-sm border border-[#d6d3d1] dark:border-[#3f3f46]'
                      : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                  }`}
                >
                  <span className="font-serif-jp text-xs">級</span>
                  <span>{lvl}</span>
                </button>
              ))}
            </div>

            {/* Question Count & Simulation Mode Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mr-1 uppercase">Format:</span>
              {[
                { count: 10, label: 'Mini Mock (10 Soal)' },
                { count: 20, label: 'Standar JLPT (20 Soal)' },
                { count: 25, label: 'Tryout Penuh (25 Soal • 25 Menit)' },
              ].map(({ count, label }) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`px-3 py-1 rounded-md text-xs font-sans font-medium transition cursor-pointer border ${
                    questionCount === count
                      ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent shadow-sm'
                      : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Learning Stats Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] block mb-1">TOTAL LATIHAN</span>
              <span className="text-xl font-bold font-mono text-[#1c1917] dark:text-[#f4f4f5]">
                {totalQuizzes} <span className="text-xs font-sans font-normal text-[#a8a29e] dark:text-[#71717a]">sesi</span>
              </span>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] block mb-1">RATA-RATA AKURASI</span>
              <span className={`text-xl font-bold font-mono ${avgAccuracy >= 70 ? 'text-[#2e7d32] dark:text-[#4ade80]' : 'text-[#c84b31] dark:text-[#e05d44]'}`}>
                {avgAccuracy}%
              </span>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] block mb-1 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-[#c84b31] dark:text-[#e05d44]" />
                <span>FAVORIT</span>
              </span>
              <span className="text-xl font-bold font-mono text-[#1c1917] dark:text-[#f4f4f5]">
                {progress.bookmarkedKanjiIds.length + progress.bookmarkedVocabIds.length} <span className="text-xs font-sans font-normal text-[#a8a29e] dark:text-[#71717a]">item</span>
              </span>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] block mb-1 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-[#c84b31] dark:text-[#e05d44]" />
                <span>TITIK LEMAH</span>
              </span>
              <span className={`text-xl font-bold font-mono ${progress.failedItemIds.length > 0 ? 'text-[#c84b31] dark:text-[#e05d44]' : 'text-[#2e7d32] dark:text-[#4ade80]'}`}>
                {progress.failedItemIds.length} <span className="text-xs font-sans font-normal text-[#a8a29e] dark:text-[#71717a]">item</span>
              </span>
            </div>
          </div>

          {/* Special Card: Drill Titik Lemah (Ghost Engine) */}
          <div 
            onClick={() => {
              if (progress.failedItemIds.length > 0) {
                startQuiz('weak-points');
              }
            }}
            className={`rounded-xl p-5 mb-8 transition-all border ${
              progress.failedItemIds.length > 0
                ? 'bg-[#c84b31]/5 dark:bg-[#e05d44]/10 border-[#c84b31]/30 dark:border-[#e05d44]/40 hover:border-[#c84b31] dark:hover:border-[#e05d44] cursor-pointer'
                : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] opacity-80 cursor-default'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border border-[#c84b31]/30 dark:border-[#e05d44]/30 flex items-center justify-center text-[#c84b31] dark:text-[#e05d44]">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                    Drill Titik Lemah (Ghost Remediation)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#c84b31]/30 dark:border-[#e05d44]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/10 dark:bg-[#e05d44]/15">
                  [{progress.failedItemIds.length} Item Tersimpan]
                </span>
              </div>

              <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed mb-4 font-sans">
                {progress.failedItemIds.length > 0
                  ? `Tersedia ${progress.failedItemIds.length} materi yang pernah salah dijawab. Latih ulang sekarang dengan format soal autentik sampai tuntas!`
                  : 'Seluruh materi telah terjawab dengan benar. Tidak ada butir titik lemah yang terdeteksi.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between text-xs font-medium">
              {progress.failedItemIds.length > 0 ? (
                <>
                  <span className="text-[#c84b31] dark:text-[#e05d44] font-semibold">
                    Mulai Drill Titik Lemah ({Math.min(questionCount, progress.failedItemIds.length)} Soal)
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44]" />
                </>
              ) : (
                <span className="text-[#a8a29e] dark:text-[#71717a]">Semua Catatan Bersih</span>
              )}
            </div>
          </div>

          {/* 4 Cards Grid — Zen Editorial Paper Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Card 1: Kanji */}
            <div 
              onClick={() => startQuiz('kanji')}
              className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1e3a8a] dark:hover:border-[#3b82f6] rounded-xl p-5 transition cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 flex items-center justify-center text-[#1e3a8a] dark:text-[#3b82f6]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                    [{selectedLevel}] {questionCount} Soal
                  </span>
                </div>

                <h3 className="text-base font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                  1. Kuis Kanji {selectedLevel} (Moji)
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed mb-4 font-sans">
                  Format resmi JLPT: Kanji Yomi (bacaan furigana dalam konteks kalimat) dan Hyouki (penulisan kanji).
                </p>
              </div>

              <div className="pt-3 border-t border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#1e3a8a] dark:text-[#3b82f6]">
                <span>Mulai Kuis Kanji</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2: Vocab */}
            <div 
              onClick={() => startQuiz('vocab')}
              className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1e3a8a] dark:hover:border-[#3b82f6] rounded-xl p-5 transition cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 flex items-center justify-center text-[#1e3a8a] dark:text-[#3b82f6]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                    [{selectedLevel}] {questionCount} Soal
                  </span>
                </div>

                <h3 className="text-base font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                  2. Kuis Kosakata {selectedLevel} (Goi)
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed mb-4 font-sans">
                  Mondai 3: Kosakata rumpang dalam kalimat utuh. Menguji kelayakan semantik dan konteks penggunaan.
                </p>
              </div>

              <div className="pt-3 border-t border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#1e3a8a] dark:text-[#3b82f6]">
                <span>Mulai Kuis Kosakata</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 3: Grammar */}
            <div 
              onClick={() => startQuiz('grammar')}
              className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1e3a8a] dark:hover:border-[#3b82f6] rounded-xl p-5 transition cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 flex items-center justify-center text-[#1e3a8a] dark:text-[#3b82f6]">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                    [{selectedLevel}] {questionCount} Soal
                  </span>
                </div>

                <h3 className="text-base font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                  3. Kuis Tata Bahasa {selectedLevel} (Bunpou)
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed mb-4 font-sans">
                  Mondai 4: Analisis struktur tata bahasa, partikel, konjugasi sambung, dan nuansa ungkapan formal.
                </p>
              </div>

              <div className="pt-3 border-t border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#1e3a8a] dark:text-[#3b82f6]">
                <span>Mulai Kuis Tata Bahasa</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 4: Mock Exam */}
            <div 
              onClick={() => startQuiz('mock-exam')}
              className="bg-white dark:bg-[#1f1f23] border-2 border-[#c84b31]/40 dark:border-[#e05d44]/50 hover:border-[#c84b31] dark:hover:border-[#e05d44] rounded-xl p-5 transition cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border border-[#c84b31]/30 dark:border-[#e05d44]/30 flex items-center justify-center text-[#c84b31] dark:text-[#e05d44]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#c84b31]/30 dark:border-[#e05d44]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 dark:bg-[#e05d44]/10">
                    [MOCK EXAM]
                  </span>
                </div>

                <h3 className="text-base font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                  4. Simulasi Ujian JLPT {selectedLevel}
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed mb-4 font-sans">
                  Tryout lengkap multi-vektor: Kanji Yomi, Hyouki, Kosakata Rumpang, Tata Bahasa, dan Soal Menyimak Choukai.
                </p>
              </div>

              <div className="pt-3 border-t border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between text-xs font-bold text-[#c84b31] dark:text-[#e05d44]">
                <span>Mulai Simulasi ({questionCount} Soal)</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </>
      )}

      {stage === 'session' && (
        <N5QuizSession
          title={getCategoryTitle(selectedCategory)}
          categoryBadge={getCategoryBadge(selectedCategory)}
          questions={activeQuestions}
          durationMinutes={sessionDurationMinutes}
          onFinishQuiz={(result) => {
            saveQuizHistory({
              category: getCategoryTitle(selectedCategory),
              total: result.total,
              correct: result.correct,
              accuracy: Math.round((result.correct / result.total) * 100),
            });

            result.questions.forEach((q, idx) => {
              if (q.itemId) {
                if (result.userAnswers[idx] === q.correctIndex) {
                  recordSuccessItem(q.itemId);
                } else {
                  recordFailedItem(q.itemId);
                }
              }
            });

            setQuizResults(result);
            setStage('results');
          }}
          onExit={() => setStage('menu')}
        />
      )}

      {stage === 'results' && quizResults && (
        <N5QuizResults
          categoryTitle={getCategoryTitle(selectedCategory)}
          total={quizResults.total}
          correct={quizResults.correct}
          questions={quizResults.questions}
          userAnswers={quizResults.userAnswers}
          level={selectedLevel}
          onRetry={() => startQuiz(selectedCategory)}
          onBackToMenu={() => setStage('menu')}
          onDrillFailedItems={(failedQuestions) => startRemediationSession(failedQuestions)}
        />
      )}
    </div>
  );
};

export { N5QuizCenter as QuizCenter };
