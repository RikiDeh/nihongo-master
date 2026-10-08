import React, { useState } from 'react';
import { N5QuizCategory, MultipleChoiceQuestion } from '../../types';
import { 
  generateKanjiQuiz, 
  generateVocabQuiz, 
  generateGrammarQuiz, 
  generateMockExam 
} from '../../data/quizN5Data';
import {
  generateN4KanjiQuiz,
  generateN4VocabQuiz,
  generateN4GrammarQuiz,
  generateN4MockExam
} from '../../data/quizN4Data';
import {
  generateN3KanjiQuiz,
  generateN3VocabQuiz,
  generateN3GrammarQuiz,
  generateN3MockExam
} from '../../data/quizN3Data';
import {
  generateN2KanjiQuiz,
  generateN2VocabQuiz,
  generateN2GrammarQuiz,
  generateN2MockExam
} from '../../data/quizN2Data';
import { N5QuizSession } from './N5QuizSession';
import { N5QuizResults } from './N5QuizResults';
import { saveQuizHistory, getUserProgress } from '../../utils/storage';
import { 
  BookOpen, 
  Layers, 
  Award, 
  Trophy, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export const N5QuizCenter: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2'>('N5');
  const [stage, setStage] = useState<'menu' | 'session' | 'results'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<N5QuizCategory>('kanji');
  const [activeQuestions, setActiveQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<{
    total: number;
    correct: number;
    questions: MultipleChoiceQuestion[];
    userAnswers: (number | null)[];
  } | null>(null);

  const startQuiz = (category: N5QuizCategory) => {
    setSelectedCategory(category);
    let questions: MultipleChoiceQuestion[] = [];

    if (selectedLevel === 'N5') {
      switch (category) {
        case 'kanji':
          questions = generateKanjiQuiz(10);
          break;
        case 'vocab':
          questions = generateVocabQuiz(10);
          break;
        case 'grammar':
          questions = generateGrammarQuiz(8);
          break;
        case 'mock-exam':
          questions = generateMockExam(15);
          break;
      }
    } else if (selectedLevel === 'N4') {
      switch (category) {
        case 'kanji':
          questions = generateN4KanjiQuiz(10);
          break;
        case 'vocab':
          questions = generateN4VocabQuiz(10);
          break;
        case 'grammar':
          questions = generateN4GrammarQuiz(10);
          break;
        case 'mock-exam':
          questions = generateN4MockExam(15);
          break;
      }
    } else if (selectedLevel === 'N3') {
      switch (category) {
        case 'kanji':
          questions = generateN3KanjiQuiz(10);
          break;
        case 'vocab':
          questions = generateN3VocabQuiz(10);
          break;
        case 'grammar':
          questions = generateN3GrammarQuiz(10);
          break;
        case 'mock-exam':
          questions = generateN3MockExam(15);
          break;
      }
    } else {
      switch (category) {
        case 'kanji':
          questions = generateN2KanjiQuiz(10);
          break;
        case 'vocab':
          questions = generateN2VocabQuiz(10);
          break;
        case 'grammar':
          questions = generateN2GrammarQuiz(10);
          break;
        case 'mock-exam':
          questions = generateN2MockExam(15);
          break;
      }
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
      case 'mock-exam': return `Simulasi Ujian JLPT ${lvl} (Mini Mock Exam)`;
    }
  };

  const getCategoryBadge = (cat: N5QuizCategory) => {
    const lvl = selectedLevel;
    switch (cat) {
      case 'kanji': return `Kanji ${lvl}`;
      case 'vocab': return `Vocab ${lvl}`;
      case 'grammar': return `Grammar ${lvl}`;
      case 'mock-exam': return `Simulasi ${lvl}`;
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
              <Trophy className="w-3.5 h-3.5" />
              <span>Pusat Uji Kompetensi JLPT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Kuis Latihan & Simulasi Ujian JLPT
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
              Uji pemahamanmu dengan kuis pilihan ganda interaktif format ujian resmi. Progres dan hasil tersimpan otomatis.
            </p>

            {/* Level Switcher Tab */}
            <div className="inline-flex flex-wrap justify-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner gap-1">
              <button
                onClick={() => setSelectedLevel('N5')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedLevel === 'N5'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔰 JLPT N5 (Dasar)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N4')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedLevel === 'N4'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ JLPT N4 (Menengah Bawah)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N3')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedLevel === 'N3'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎯 JLPT N3 (Menengah)</span>
              </button>
              <button
                onClick={() => setSelectedLevel('N2')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedLevel === 'N2'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💼 JLPT N2 (Bisnis & Media)</span>
              </button>
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
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Kanji Favorit (⭐)</span>
              <span className="text-2xl font-bold text-amber-300">{progress.bookmarkedKanjiIds.length} <span className="text-xs font-normal text-slate-500">karakter</span></span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Kosakata Favorit (⭐)</span>
              <span className="text-2xl font-bold text-amber-300">{progress.bookmarkedVocabIds.length} <span className="text-xs font-normal text-slate-500">kata</span></span>
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
                    10 Soal Acak ({selectedLevel})
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  1. Kuis Kanji {selectedLevel} (Moji)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Tebak arti kanji, cara baca (Onyomi/Kunyomi), dan pemilihan kanji yang tepat dari kalimat kontekstual level {selectedLevel}.
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
                    10 Soal Acak ({selectedLevel})
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  2. Kuis Kosakata {selectedLevel} (Goi)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Tebak arti kosakata harian, pasangan kata kerja transitif/intransitif, adverbia, dan ungkapan esensial {selectedLevel}.
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
                    {selectedLevel === 'N5' ? '8 Soal Kunci' : '10 Soal Kunci'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  3. Kuis Tata Bahasa & Partikel {selectedLevel} (Bunpou)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Uji pemahaman pola pengandaian (〜たら, 〜ば, 〜なら), bentuk potensial, perlakuan izin/bantuan, dan partikel penting {selectedLevel}.
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
                    <span>Format Lengkap ({selectedLevel})</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-rose-300 transition-colors">
                  4. Simulasi Ujian JLPT {selectedLevel} (Mini Mock)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  15 soal campuran acak (Kanji + Vocab + Grammar {selectedLevel}) untuk menguji kesiapan mental menghadapi ujian resmi!
                </p>
              </div>

              <div className="pt-4 border-t border-rose-900/60 flex items-center justify-between text-xs font-bold text-rose-400">
                <span>Mulai Simulasi Ujian {selectedLevel}</span>
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
                    10 Soal Acak
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  2. Kuis Kosakata N5 (Goi)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Tebak arti kosakata harian, kalimat rumpang kata kerja, antonim kata sifat, dan ungkapan salam Jepang.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-400">
                <span>Mulai Kuis Kosakata</span>
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
                    8 Soal Kunci
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  3. Kuis Tata Bahasa & Partikel (Bunpou)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Uji pemahaman partikel krusial (は, を, に, で, が) dan pemilihan pola kalimat (-te kudasai, -tai desu, dll).
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Mulai Kuis Tata Bahasa</span>
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
                    <span>Format Lengkap</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-rose-300 transition-colors">
                  4. Simulasi Ujian JLPT N5 (Mini Mock)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  15 soal campuran acak (Kanji + Vocab + Grammar) untuk menguji kesiapan mental sebelum menghadapi ujian resmi!
                </p>
              </div>

              <div className="pt-4 border-t border-rose-900/60 flex items-center justify-between text-xs font-bold text-rose-400">
                <span>Mulai Simulasi Ujian</span>
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
            saveQuizHistory({
              category: getCategoryTitle(selectedCategory),
              total: result.total,
              correct: result.correct,
              accuracy: Math.round((result.correct / result.total) * 100),
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
