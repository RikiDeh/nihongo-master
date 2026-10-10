import React from 'react';
import { MultipleChoiceQuestion, JLPTLevel } from '../../types';
import { Award, RotateCw, BookOpen, Volume2, ArrowLeft, Flame } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';

interface N5QuizResultsProps {
  categoryTitle: string;
  total: number;
  correct: number;
  questions: MultipleChoiceQuestion[];
  userAnswers: (number | null)[];
  level?: JLPTLevel;
  onRetry: () => void;
  onBackToMenu: () => void;
  onDrillFailedItems?: (failedQuestions: MultipleChoiceQuestion[]) => void;
}

export const N5QuizResults: React.FC<N5QuizResultsProps> = ({
  categoryTitle,
  total,
  correct,
  questions,
  userAnswers,
  level = 'N5',
  onRetry,
  onBackToMenu,
  onDrillFailedItems,
}) => {
  const percentage = Math.round((correct / total) * 100);
  const isPassed = percentage >= 70;
  const failedCount = total - correct;
  const failedQuestions = questions.filter((q, idx) => userAnswers[idx] !== q.correctIndex);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Result Card Banner — Scholarly Score Sheet */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-8 text-center shadow-xs mb-8 relative">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] dark:text-[#a1a1aa] mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>HASIL EVALUASI: {categoryTitle.toUpperCase()}</span>
        </div>

        <div className="text-5xl sm:text-6xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          {percentage}%
        </div>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-xs sm:text-sm mb-4 font-mono">
          Benar <strong className="text-[#2e7d32] dark:text-[#4ade80] font-bold">{correct}</strong> dari <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{total}</strong> soal
        </p>

        <div className="inline-block px-3 py-1.5 rounded-lg text-xs font-serif-jp border mb-6">
          {isPassed ? (
            <span className="text-[#2e7d32] dark:text-[#4ade80] bg-[#2e7d32]/10 border border-[#2e7d32]/25 px-3 py-1 rounded">
              Memenuhi Standar Kelulusan JLPT {level} [合格]
            </span>
          ) : (
            <span className="text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/10 border border-[#c84b31]/25 px-3 py-1 rounded">
              Belum Memenuhi Ambang Batas Kelulusan JLPT {level} [不合格]
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {failedCount > 0 && onDrillFailedItems && (
            <button
              onClick={() => onDrillFailedItems(failedQuestions)}
              className="px-4 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white font-medium text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Drill Ulang {failedCount} Soal Salah</span>
            </button>
          )}

          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] hover:opacity-90 font-medium text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Coba Kuis Lagi</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] font-medium text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Menu Ujian</span>
          </button>
        </div>
      </div>

      {/* Review All Questions */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] flex items-center gap-2 mb-3 uppercase">
          <BookOpen className="w-4 h-4" />
          <span>Rincian Pembahasan Soal</span>
        </h3>

        {questions.map((q, idx) => {
          const userAns = userAnswers[idx];
          const isCorrect = userAns === q.correctIndex;

          return (
            <div
              key={q.id || idx}
              className={`p-4 rounded-lg border transition-all ${
                isCorrect 
                  ? 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a]' 
                  : 'bg-[#c84b31]/5 dark:bg-[#e05d44]/10 border-[#c84b31]/30 dark:border-[#e05d44]/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isCorrect ? 'bg-[#2e7d32]/10 text-[#2e7d32] dark:text-[#4ade80]' : 'bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44]'
                  }`}>
                    {idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif-jp font-semibold text-[#1c1917] dark:text-[#f4f4f5]">
                    {q.question}
                  </h4>
                </div>

                {q.audioText && (
                  <button
                    onClick={() => speakJapanese(q.audioText!)}
                    className="p-1 rounded border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition shrink-0"
                    title="Dengar suara"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and selected option */}
              <div className="text-xs space-y-1 mb-2.5 pl-7.5 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[#78716c] dark:text-[#a1a1aa]">Jawaban Anda:</span>
                  <span className={`font-medium ${isCorrect ? 'text-[#2e7d32] dark:text-[#4ade80]' : 'text-[#c84b31] dark:text-[#e05d44] line-through'}`}>
                    {userAns !== null && userAns !== undefined ? q.options[userAns] : 'Tidak dijawab'}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#78716c] dark:text-[#a1a1aa]">Kunci Jawaban:</span>
                    <span className="text-[#2e7d32] dark:text-[#4ade80] font-medium font-serif-jp">
                      {q.options[q.correctIndex]}
                    </span>
                  </div>
                )}
              </div>

              {/* Detailed explanation */}
              <div className="p-3 rounded border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b] text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed pl-3 ml-7.5 font-sans">
                <strong className="text-[#1c1917] dark:text-[#f4f4f5] block mb-0.5 font-serif-jp font-semibold">Penjelasan [解説]:</strong>
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
