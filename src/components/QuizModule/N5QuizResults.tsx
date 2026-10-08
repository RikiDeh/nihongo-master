import React from 'react';
import { MultipleChoiceQuestion } from '../../types';
import { Award, RotateCw, BookOpen, Volume2, ArrowLeft } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';

interface N5QuizResultsProps {
  categoryTitle: string;
  total: number;
  correct: number;
  questions: MultipleChoiceQuestion[];
  userAnswers: (number | null)[];
  onRetry: () => void;
  onBackToMenu: () => void;
}

export const N5QuizResults: React.FC<N5QuizResultsProps> = ({
  categoryTitle,
  total,
  correct,
  questions,
  userAnswers,
  onRetry,
  onBackToMenu,
}) => {
  const percentage = Math.round((correct / total) * 100);
  const isPassed = percentage >= 70;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Result Card Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl mb-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>Hasil Latihan: {categoryTitle}</span>
        </div>

        <div className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
          {percentage}%
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Benar <strong className="text-emerald-400 font-bold">{correct}</strong> dari <strong className="text-white">{total}</strong> soal
        </p>

        <div className="inline-block px-4 py-2 rounded-2xl text-xs font-bold border mb-6">
          {isPassed ? (
            <span className="text-emerald-300 bg-emerald-500/10 border-emerald-500/30 px-3 py-1 rounded-xl">
              🎉 Luar Biasa! Kamu Memenuhi Standar Kelulusan JLPT N5
            </span>
          ) : (
            <span className="text-amber-300 bg-amber-500/10 border-amber-500/30 px-3 py-1 rounded-xl">
              💪 Terus Berlatih! Ulangi materi dan coba kuis sekali lagi
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Coba Kuis Ini Lagi (Soal Acak)</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Kategori Lain</span>
          </button>
        </div>
      </div>

      {/* Review All Questions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span>Pembahasan & Evaluasi Soal</span>
        </h3>

        {questions.map((q, idx) => {
          const userAns = userAnswers[idx];
          const isCorrect = userAns === q.correctIndex;

          return (
            <div
              key={q.id || idx}
              className={`p-5 rounded-2xl border transition-all ${
                isCorrect 
                  ? 'bg-slate-900/60 border-slate-800' 
                  : 'bg-rose-950/20 border-rose-900/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white font-jp">
                    {q.question}
                  </h4>
                </div>

                {q.audioText && (
                  <button
                    onClick={() => speakJapanese(q.audioText!)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
                    title="Dengar suara"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                )}
              </div>

              {/* Status and selected option */}
              <div className="text-xs space-y-1 mb-3 pl-8.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Jawabanmu:</span>
                  <span className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400 line-through'}`}>
                    {userAns !== null && userAns !== undefined ? q.options[userAns] : 'Tidak dijawab'}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Kunci Jawaban:</span>
                    <span className="text-emerald-400 font-semibold font-jp">
                      {q.options[q.correctIndex]}
                    </span>
                  </div>
                )}
              </div>

              {/* Detailed explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed pl-4 ml-8.5">
                <strong className="text-slate-400 block mb-0.5">Penjelasan:</strong>
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
