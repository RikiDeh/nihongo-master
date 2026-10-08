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
  Sparkles, 
  ArrowRight,
  Flame
} from 'lucide-react';

export const N5QuizCenter: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
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

  const startQuiz = (category: N5QuizCategory) => {
    setSelectedCategory(category);
    let questions: MultipleChoiceQuestion[] = [];

    switch (category) {
      case 'kanji':
        questions = generateDynamicKanjiQuiz(selectedLevel, questionCount);
        break;
      case 'vocab':
        questions = generateDynamicVocabQuiz(selectedLevel, questionCount);
        break;
      case 'grammar':
        questions = generateDynamicGrammarQuiz(selectedLevel, questionCount);
        break;
      case 'mock-exam':
        questions = generateDynamicMockExam(selectedLevel, questionCount);
        break;
      case 'weak-points':
        questions = generateWeakPointsQuiz(questionCount);
        break;
    }

    if (questions.length === 0) {
      return;
    }

    setActiveQuestions(questions);
    setStage('session');
  };

  const getCategoryTitle = (cat: N5QuizCategory) => {
    const lvl = selectedLevel;
    switch (cat) {
      case 'kanji': return `Kuis Kanji ${lvl}`;
      case 'vocab': return `Kuis Kosakata ${lvl}`;
      case 'grammar': return `Kuis Tata Bahasa & Partikel ${lvl}`;
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
      case 'weak-points': return `Titik Lemah 🔥`;
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
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pusat Uji Kompetensi JLPT Multi-Vector</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Kuis Dinamis & Simulasi Ujian JLPT
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
              Soal diracik otomatis via Multi-Vector Generator (Fonetik, Semantik, Simbol, & Menyimak Choukai). Dilengkapi Ghost Engine untuk melatih titik lemah.
            </p>

            {/* Level Switcher Tab */}
            <div className="inline-flex flex-wrap justify-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner gap-1 mb-6">
              <button
                onClick={() => setSelectedLevel('N5')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLevel === 'N5'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔰 N5 (Dasar)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N4')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLevel === 'N4'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ N4 (Menengah Bawah)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N3')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLevel === 'N3'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎯 N3 (Menengah)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N2')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLevel === 'N2'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💼 N2 (Bisnis & Media)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N1')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLevel === 'N1'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>👑 N1 (Mahir & Native)</span>
              </button>
            </div>

            {/* Question Count Selector (Tiket 9.3) */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider">Durasi Sesi:</span>
              {[
                { count: 10, label: '⚡ 10 Soal (Latihan Kilat)' },
                { count: 25, label: '📝 25 Soal (Standar Ujian)' },
                { count: 50, label: '🏆 50 Soal (Maraton / Tryout Penuh)' },
              ].map(({ count, label }) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    questionCount === count
                      ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-md shadow-rose-500/20 ring-1 ring-white/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Learning Stats Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Total Latihan</span>
              <span className="text-2xl font-bold text-white">{totalQuizzes} <span className="text-xs font-normal text-slate-500">sesi</span></span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Rata-rata Akurasi</span>
              <span className={`text-2xl font-bold ${avgAccuracy >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{avgAccuracy}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Favorit (⭐)</span>
              <span className="text-2xl font-bold text-amber-300">
                {progress.bookmarkedKanjiIds.length + progress.bookmarkedVocabIds.length} <span className="text-xs font-normal text-slate-500">item</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Titik Lemah (🔥)</span>
              <span className={`text-2xl font-bold ${progress.failedItemIds.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {progress.failedItemIds.length} <span className="text-xs font-normal text-slate-500">item</span>
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
            className={`group bg-gradient-to-br from-amber-950/40 via-slate-900 to-rose-950/30 border-2 rounded-3xl p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between mb-8 shadow-xl ${
              progress.failedItemIds.length > 0
                ? 'border-amber-500/50 hover:border-amber-400 cursor-pointer hover:shadow-amber-500/10'
                : 'border-slate-800/80 opacity-80 cursor-default'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6 fill-amber-500 text-amber-400" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  progress.failedItemIds.length > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  <span>Ghost Engine ({progress.failedItemIds.length} Item Tersimpan)</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                <span>Drill Titik Lemah (Ghost Items Review)</span>
                {progress.failedItemIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white text-xs font-mono font-bold">
                    {progress.failedItemIds.length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {progress.failedItemIds.length > 0
                  ? `Kamu memiliki ${progress.failedItemIds.length} kata atau kanji yang pernah salah dijawab. Latih ulang sekarang dengan 4 Vektor Soal acak sampai kamu menguasainya!`
                  : 'Hebat! Tidak ada kata atau kanji di daftar titik lemah saat ini. Pertahankan akurasi 100% saat mengerjakan kuis.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
              {progress.failedItemIds.length > 0 ? (
                <>
                  <span className="text-amber-400">Mulai Drill Titik Lemah ({Math.min(questionCount, progress.failedItemIds.length)} Soal)</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <span className="text-slate-500">Belum Ada Titik Lemah Terdeteksi ✨</span>
              )}
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* Card 1: Kanji */}
            <div 
              onClick={() => startQuiz('kanji')}
              className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {questionCount} Soal Acak ({selectedLevel})
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  1. Kuis Kanji {selectedLevel} (Moji)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Diramu dinamis dari 4 Vektor Soal: Tebak Furigana kata, Arti Bahasa Indonesia, Penulisan Kanji, dan Menyimak Choukai.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Mulai Kuis Kanji {selectedLevel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Vocab */}
            <div 
              onClick={() => startQuiz('vocab')}
              className="group bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-sky-500/5 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                    {questionCount} Soal Acak ({selectedLevel})
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  2. Kuis Kosakata {selectedLevel} (Goi)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Uji pemahaman arti kosakata, pasangan kanji-kana, pelafalan romaji, dan pendengaran suara audio dari seluruh kata {selectedLevel}.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-400">
                <span>Mulai Kuis Kosakata {selectedLevel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Grammar */}
            <div 
              onClick={() => startQuiz('grammar')}
              className="group bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-purple-500/5 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                    {questionCount} Soal Acak ({selectedLevel})
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  3. Kuis Tata Bahasa & Partikel {selectedLevel} (Bunpou)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Uji pemahaman rumus pola kalimat, partikel krusial, dan analisis makna kontekstual level {selectedLevel}.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Mulai Kuis Tata Bahasa {selectedLevel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Mock Exam */}
            <div 
              onClick={() => startQuiz('mock-exam')}
              className="group bg-gradient-to-br from-rose-950/40 to-slate-900 border-2 border-rose-500/40 hover:border-rose-400 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-rose-500/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Tryout Multi-Vector ({selectedLevel})</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-rose-300 transition-colors">
                  4. Simulasi Ujian JLPT {selectedLevel} (Mock Exam)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Campuran dinamis Kanji + Vocab + Audio Choukai + Grammar {selectedLevel} untuk menguji kesiapan mental menghadapi ujian resmi!
                </p>
              </div>

              <div className="pt-4 border-t border-rose-900/60 flex items-center justify-between text-xs font-bold text-rose-400">
                <span>Mulai Simulasi Ujian ({questionCount} Soal)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          onFinishQuiz={(result) => {
            // Simpan riwayat kuis
            saveQuizHistory({
              category: getCategoryTitle(selectedCategory),
              total: result.total,
              correct: result.correct,
              accuracy: Math.round((result.correct / result.total) * 100),
            });

            // Update status Ghost / Weak items
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
          onRetry={() => startQuiz(selectedCategory)}
          onBackToMenu={() => setStage('menu')}
        />
      )}
    </div>
  );
};
