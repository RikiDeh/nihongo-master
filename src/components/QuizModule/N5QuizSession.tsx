import React, { useState } from 'react';
import { MultipleChoiceQuestion } from '../../types';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';

interface N5QuizSessionProps {
  title: string;
  categoryBadge: string;
  questions: MultipleChoiceQuestion[];
  onFinishQuiz: (score: { total: number; correct: number; questions: MultipleChoiceQuestion[]; userAnswers: (number | null)[] }) => void;
  onExit: () => void;
}

export const N5QuizSession: React.FC<N5QuizSessionProps> = ({
  title,
  categoryBadge,
  questions,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, index]);

    // Bunyikan audio jika ada teksnya
    if (currentQ.audioText) {
      speakJapanese(currentQ.audioText);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Selesai kuis
      const finalAnswers = [...userAnswers];
      onFinishQuiz({
        total: questions.length,
        correct: correctCount,
        questions,
        userAnswers: finalAnswers,
      });
    }
  };

  if (!currentQ) return null;

  const isCurrentCorrect = selectedOption === currentQ.correctIndex;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-800 text-rose-400 font-bold text-xs border border-slate-700">
            {categoryBadge}
          </span>
          <span className="text-sm font-semibold text-slate-300">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
          {title && <span className="text-xs text-slate-400 font-medium hidden sm:inline">• {title}</span>}
        </div>

        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer font-medium"
        >
          Keluar Kuis ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden">
        {/* Category Accent */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed font-jp tracking-wide">
            {currentQ.question}
          </h2>

          {currentQ.audioText && (
            <button
              onClick={() => speakJapanese(currentQ.audioText!)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition cursor-pointer"
              title="Dengarkan pengucapan"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Suara</span>
            </button>
          )}
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80';
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-500/10';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 text-sm sm:text-base text-left font-medium transition duration-150 flex items-center justify-between cursor-pointer select-none ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-jp">{opt}</span>
                </div>

                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Box */}
        {isAnswered && (
          <div className={`p-4 sm:p-5 rounded-2xl border animate-pop mb-4 ${
            isCurrentCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isCurrentCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm block mb-1">
                  {isCurrentCorrect ? 'Jawaban Benar! 🎉' : 'Jawaban Kurang Tepat! 💡'}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer animate-pop"
            >
              <span>{currentIndex + 1 < questions.length ? 'Soal Berikutnya' : 'Lihat Hasil Kuis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
