import React, { useState } from 'react';
import { MultipleChoiceQuestion } from '../../types';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';

interface N5QuizSessionProps {
  title: string;
  categoryBadge: string;
  questions: MultipleChoiceQuestion[];
  durationMinutes?: number;
  onFinishQuiz: (score: { total: number; correct: number; questions: MultipleChoiceQuestion[]; userAnswers: (number | null)[] }) => void;
  onExit: () => void;
}

export const N5QuizSession: React.FC<N5QuizSessionProps> = ({
  title: _title,
  categoryBadge,
  questions,
  durationMinutes,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    durationMinutes ? durationMinutes * 60 : null
  );

  // Timer countdown
  React.useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      const filledAnswers = [...userAnswers];
      while (filledAnswers.length < questions.length) {
        filledAnswers.push(null);
      }
      onFinishQuiz({
        total: questions.length,
        correct: correctCount,
        questions,
        userAnswers: filledAnswers,
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions, correctCount, userAnswers, onFinishQuiz]);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  const getMondaiBadge = (q: MultipleChoiceQuestion) => {
    if (q.mondaiType) {
      switch (q.mondaiType) {
        case 'kanji-yomi': return { label: 'Mondai 1: Kanji Yomi' };
        case 'hyouki': return { label: 'Mondai 2: Hyouki' };
        case 'bunmyaku-kitei': return { label: 'Mondai 3: Kosakata Rumpang' };
        case 'bunpou': return { label: 'Mondai 4: Tata Bahasa' };
        case 'choukai': return { label: 'Mondai 5: Choukai' };
      }
    }
    if (q.vectorType === 'listening') {
      return { label: 'Mondai 5: Choukai' };
    }
    return null;
  };

  const mondaiBadge = currentQ ? getMondaiBadge(currentQ) : null;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, index]);

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
      onFinishQuiz({
        total: questions.length,
        correct: correctCount,
        questions,
        userAnswers,
      });
    }
  };

  // Keyboard shortcut listener (1-4 to select option, Enter/Space to proceed)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (!isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx >= 0 && idx < currentQ.options.length) {
            e.preventDefault();
            handleSelectOption(idx);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ, currentIndex, questions.length, correctCount, userAnswers]);

  if (!currentQ) return null;

  const isCurrentCorrect = selectedOption === currentQ.correctIndex;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Session Top Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e7e5e4] dark:border-[#27272a]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#f4f0e8] dark:bg-[#1f1f23] text-[#1c1917] dark:text-[#f4f4f5] border border-[#e7e5e4] dark:border-[#27272a]">
            [{categoryBadge}]
          </span>
          {mondaiBadge && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] border border-[#e7e5e4] dark:border-[#27272a]">
              {mondaiBadge.label}
            </span>
          )}
          <span className="text-xs font-mono font-medium text-[#78716c] dark:text-[#a1a1aa]">
            Soal {String(currentIndex + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {timeLeft !== null && (
            <div className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
              timeLeft < 300 
                ? 'bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] border-[#c84b31]/30 animate-pulse' 
                : 'bg-[#f4f0e8] dark:bg-[#1f1f23] text-[#1c1917] dark:text-[#f4f4f5] border-[#e7e5e4] dark:border-[#27272a]'
            }`}>
              <span>⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-xs text-[#78716c] dark:text-[#a1a1aa] hover:text-[#c84b31] dark:hover:text-[#e05d44] transition cursor-pointer font-sans px-2 py-1 rounded border border-transparent hover:border-[#e7e5e4] dark:hover:border-[#27272a]"
          >
            Keluar ✕
          </button>
        </div>
      </div>

      {/* Hairline Progress Rule */}
      <div className="w-full h-1 bg-[#e7e5e4] dark:bg-[#27272a] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#1c1917] dark:bg-[#f4f4f5] transition-all duration-200 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Surface — Washi Card with Hairline 1px */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs mb-6 relative">
        {/* Question Prompt Area */}
        <div className="text-center mb-6">
          {currentQ.vectorType === 'listening' ? (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 text-[#1e3a8a] dark:text-[#3b82f6] mb-3">
                <Volume2 className="w-3.5 h-3.5" />
                <span>[聴解] SOAL MENYIMAK</span>
              </span>
              <h2 className="text-lg sm:text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed mb-4">
                {currentQ.question}
              </h2>
              <button
                onClick={() => speakJapanese(currentQ.audioText!)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-medium text-xs shadow-xs transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Putar Audio Percakapan</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#faf8f5] dark:bg-[#18181b]/50 border border-[#e7e5e4] dark:border-[#27272a] rounded-lg p-5 mb-4">
              <h2 className="text-lg sm:text-2xl font-jp font-semibold text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed tracking-wide whitespace-pre-line">
                {currentQ.question}
              </h2>

              {currentQ.audioText && (
                <button
                  onClick={() => speakJapanese(currentQ.audioText!)}
                  className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] text-xs font-sans transition cursor-pointer"
                  title="Dengarkan pengucapan"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengar Pelafalan</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 4 Choices — Hairline Ruled Option Cards with Monospace [1..4] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917] dark:hover:border-[#f4f4f5]';
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-[#2e7d32]/10 dark:bg-[#4ade80]/15 border-[#2e7d32] dark:border-[#4ade80] text-[#2e7d32] dark:text-[#4ade80] font-bold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold';
              } else {
                btnStyle = 'bg-black/5 dark:bg-white/5 border-transparent text-[#a8a29e] dark:text-[#71717a] opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-3.5 rounded-lg border text-sm sm:text-base text-left transition duration-150 flex items-center justify-between cursor-pointer select-none active:translate-y-px ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b] flex items-center justify-center text-xs font-mono font-bold text-[#78716c] dark:text-[#a1a1aa]">
                    {idx + 1}
                  </span>
                  <span className="font-jp">{opt}</span>
                </div>

                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-[#2e7d32] dark:text-[#4ade80] shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation Box — Scholarly Commentary Style */}
        {isAnswered && (
          <div className={`p-4 rounded-lg border mb-4 font-sans ${
            isCurrentCorrect 
              ? 'bg-[#2e7d32]/5 dark:bg-[#4ade80]/10 border-[#2e7d32]/30 dark:border-[#4ade80]/30 text-[#1c1917] dark:text-[#f4f4f5]' 
              : 'bg-[#c84b31]/5 dark:bg-[#e05d44]/10 border-[#c84b31]/30 dark:border-[#e05d44]/30 text-[#1c1917] dark:text-[#f4f4f5]'
          }`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isCurrentCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2e7d32] dark:text-[#4ade80]" />
                ) : (
                  <Lightbulb className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44]" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-jp font-bold text-sm block mb-1">
                  {isCurrentCorrect ? 'Jawaban Tepat [正解]' : 'Evaluasi Jawaban [解説]'}
                </span>
                <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] leading-relaxed whitespace-pre-line">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button — Hanko Vermilion Primary Action */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-lg bg-[#c84b31] dark:bg-[#e05d44] hover:bg-[#b03f27] text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer active:translate-y-px"
            >
              <span>{currentIndex + 1 < questions.length ? 'Soal Berikutnya' : 'Rangkuman Ujian'}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">Enter ↵</kbd>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Konfirmasi Keluar Modal Dialog (Mencegah salah sentuh di mobile) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#faf8f5] dark:bg-[#18181b] border-2 border-[#c84b31]/40 dark:border-[#e05d44]/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center animate-slideUp">
            <div className="w-12 h-12 rounded-full bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1.5">
              Keluar dari Sesi Ujian?
            </h3>
            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-6 leading-relaxed">
              Progres soal yang sudah kamu jawab saat ini tidak akan disimpan ke riwayat skor jika keluar sebelum selesai.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] text-xs font-semibold text-[#1c1917] dark:text-[#f4f4f5] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                Lanjutkan Ujian
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#c84b31] dark:bg-[#e05d44] hover:bg-[#a63a23] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
