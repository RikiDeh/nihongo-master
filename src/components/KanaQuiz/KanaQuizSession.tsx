import React, { useState, useEffect, useRef } from 'react';
import { KanaItem, QuizAttempt, QuizSummary } from '../../types';
import { playSuccessSound, playErrorSound, speakJapanese } from '../../utils/audio';
import { Volume2, VolumeX, Flame, X, ArrowRight, CornerDownLeft, Type, RotateCcw, Keyboard } from 'lucide-react';

interface KanaQuizSessionProps {
  items: KanaItem[];
  requeueMistakes?: boolean;
  requireEnter?: boolean;
  onFinishQuiz: (summary: QuizSummary) => void;
  onExit: () => void;
}

export const KanaQuizSession: React.FC<KanaQuizSessionProps> = ({ 
  items, 
  requeueMistakes = true, 
  requireEnter = true,
  onFinishQuiz, 
  onExit 
}) => {
  // Shuffle items initially
  const [queue, setQueue] = useState<KanaItem[]>(() => {
    return [...items].sort(() => Math.random() - 0.5);
  });

  const [initialCount] = useState(items.length);
  const [userInput, setUserInput] = useState('');
  const [inputState, setInputState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);

  // Mode: Wajib tekan Enter (Anti-tebak) vs Auto-submit
  const [requireEnterMode, setRequireEnterMode] = useState<boolean>(requireEnter);

  // Transition & debouncing lock to prevent rapid double-processing
  const isTransitioningRef = useRef(false);

  // Stats
  const [streak, setStreak] = useState(0);
  const [_maxStreak, setMaxStreak] = useState(0);
  const startTimeRef = useRef<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [useSerifFont, setUseSerifFont] = useState(true); // Default true for Japanese Zen Mincho
  const [retriedItemIds, setRetriedItemIds] = useState<Set<string>>(() => new Set());

  // Tracking attempts by kana item id
  const attemptsMapRef = useRef<Map<string, QuizAttempt>>(new Map());

  // Input ref to keep focus
  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = queue[0];

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const isCurrentItemRetried = currentItem 
    ? retriedItemIds.has(currentItem.id) 
    : false;

  useEffect(() => {
    if (currentItem && attemptsMapRef.current) {
      if (!attemptsMapRef.current.has(currentItem.id)) {
        attemptsMapRef.current.set(currentItem.id, {
          kana: currentItem,
          userInputs: [],
          isCorrectFirstTry: true,
          failedAttempts: 0,
        });
      }
    }
  }, [currentItem]);

  useEffect(() => {
    if (currentItem && soundEnabled) {
      speakJapanese(currentItem.character);
    }
    setUserInput('');
    setInputState('idle');
    setRevealedAnswer(null);
    isTransitioningRef.current = false;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [currentItem, soundEnabled]);

  const handleCorrectAnswer = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setInputState('correct');
    if (soundEnabled) playSuccessSound();

    setStreak(s => {
      const next = s + 1;
      setMaxStreak(m => Math.max(m, next));
      return next;
    });

    const attempt = attemptsMapRef.current.get(currentItem.id);
    if (attempt) {
      attempt.userInputs.push(userInput.trim().toLowerCase());
    }

    setTimeout(() => {
      setQueue(prev => {
        const nextQueue = prev.slice(1);
        if (nextQueue.length === 0) {
          finishSession();
        }
        return nextQueue;
      });
    }, 350);
  };

  const handleWrongAnswer = () => {
    if (isTransitioningRef.current) return;

    setInputState('wrong');
    if (soundEnabled) playErrorSound();
    setStreak(0);

    const attempt = attemptsMapRef.current.get(currentItem.id);
    if (attempt) {
      attempt.isCorrectFirstTry = false;
      attempt.failedAttempts += 1;
      attempt.userInputs.push(userInput.trim().toLowerCase());
    }

    setRetriedItemIds(prev => new Set(prev).add(currentItem.id));
    setRevealedAnswer(currentItem.romaji);
  };

  const proceedAfterMistake = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (requeueMistakes) {
      setQueue(prev => {
        const [failed, ...rest] = prev;
        const insertIndex = Math.min(Math.floor(Math.random() * 3) + 3, rest.length);
        const nextQueue = [...rest];
        nextQueue.splice(insertIndex, 0, failed);
        return nextQueue;
      });
    } else {
      setQueue(prev => {
        const nextQueue = prev.slice(1);
        if (nextQueue.length === 0) {
          finishSession();
        }
        return nextQueue;
      });
    }
  };

  const finishSession = () => {
    const attempts = Array.from(attemptsMapRef.current.values());
    const totalQuestions = attempts.length;
    const correctFirstTryCount = attempts.filter(a => a.isCorrectFirstTry).length;
    const wrongItems = attempts.filter(a => !a.isCorrectFirstTry);
    const accuracy = totalQuestions > 0 ? Math.round((correctFirstTryCount / totalQuestions) * 100) : 0;
    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    const summary: QuizSummary = {
      totalQuestions,
      correctFirstTryCount,
      accuracy,
      timeSpentSeconds,
      wrongItems,
      allAttempts: attempts,
    };

    onFinishQuiz(summary);
  };

  const checkAnswerStrict = (val: string): boolean => {
    const clean = val.trim().toLowerCase();
    if (!clean || !currentItem) return false;

    if (clean === currentItem.romaji.toLowerCase()) {
      return true;
    }

    if (currentItem.character === 'ぢ' || currentItem.character === 'ヂ') {
      if (clean === 'di' || clean === 'ji') return true;
    }
    if (currentItem.character === 'づ' || currentItem.character === 'ヅ') {
      if (clean === 'du' || clean === 'zu') return true;
    }

    if (currentItem.character === 'し' || currentItem.character === 'シ') {
      if (clean === 'si' || clean === 'shi') return true;
    }
    if (currentItem.character === 'ち' || currentItem.character === 'チ') {
      if (clean === 'ti' || clean === 'chi') return true;
    }
    if (currentItem.character === 'つ' || currentItem.character === 'ツ') {
      if (clean === 'tu' || clean === 'tsu') return true;
    }
    if (currentItem.character === 'ふ' || currentItem.character === 'フ') {
      if (clean === 'hu' || clean === 'fu') return true;
    }

    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (inputState === 'wrong' || isTransitioningRef.current) return;
    setUserInput(val);

    if (!requireEnterMode && val.trim().length > 0) {
      if (checkAnswerStrict(val)) {
        handleCorrectAnswer();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputState === 'wrong') {
        proceedAfterMistake();
      } else {
        handleSubmitAnswer();
      }
    } else if (e.key === 'Escape') {
      onExit();
    }
  };

  const handleSubmitAnswer = () => {
    if (isTransitioningRef.current || !currentItem) return;
    const clean = userInput.trim().toLowerCase();
    if (clean.length === 0) return;

    if (checkAnswerStrict(clean)) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#c84b31] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const itemsCompleted = initialCount - queue.length;
  const progressPercentage = initialCount > 0 ? Math.round((itemsCompleted / initialCount) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 min-h-[85vh] flex flex-col justify-between">
      {/* Top Zen Navigation Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#e7e5e4] dark:border-[#27272a]">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] text-xs font-mono font-medium text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRequireEnterMode(m => !m)}
              title={requireEnterMode ? 'Mode Anti-Tebak Aktif: Wajib Enter' : 'Mode Auto-Submit Aktif'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition cursor-pointer ${
                requireEnterMode
                  ? 'bg-white dark:bg-[#1f1f23] border-[#d6d3d1] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5]'
                  : 'bg-[#f4f0e8] dark:bg-[#27272a] border-[#e7e5e4] dark:border-[#3f3f46] text-[#78716c] dark:text-[#a1a1aa]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{requireEnterMode ? 'Enter: ON' : 'Auto: ON'}</span>
            </button>

            {/* Streak Counter */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
              streak > 0 
                ? 'bg-[#c84b31]/10 border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44]' 
                : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
            }`}>
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'fill-current' : ''}`} />
              <span>{streak}</span>
            </div>

            {/* Font Style Toggle */}
            <button
              type="button"
              onClick={() => setUseSerifFont(f => !f)}
              title="Ganti font (Mincho Kuas vs Gothic Modern)"
              className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                useSerifFont 
                  ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent' 
                  : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(s => !s)}
              title={soundEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
              className="p-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Progress Bar Hairline */}
        <div className="w-full bg-[#e7e5e4] dark:bg-[#27272a] rounded-full h-1.5 mb-2 overflow-hidden">
          <div 
            className="bg-[#c84b31] dark:bg-[#e05d44] h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
          <span>Antrean: <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{queue.length}</strong> tersisa</span>
          <span>Progres: <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{progressPercentage}%</strong></span>
        </div>
      </div>

      {/* Main Flashcard / Quiz Stage */}
      <div className="flex flex-col items-center justify-center my-auto py-6">
        {/* Character Type Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider border border-[#c84b31]/30 bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44]">
            {currentItem.type === 'hiragana' ? '[平仮名] HIRAGANA' : '[片仮名] KATAKANA'}
          </span>

          <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] px-2 py-0.5 rounded bg-[#f4f0e8] dark:bg-[#27272a] border border-[#e7e5e4] dark:border-[#3f3f46]">
            {currentItem.category === 'gojuuon' ? 'Gojūon' : currentItem.category === 'dakuten' ? 'Dakuten' : 'Yōon'}
          </span>

          <button
            type="button"
            onClick={() => speakJapanese(currentItem.character)}
            title="Dengarkan pengucapan asli"
            className="p-1 text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notice for Re-queue */}
        {isCurrentItemRetried && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#c84b31]/5 border border-[#c84b31]/20 text-[#c84b31] dark:text-[#e05d44] text-xs font-mono animate-pop">
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Remediasi: Huruf ini diulang karena tadi salah</span>
          </div>
        )}

        {/* Big Kana Character Display Card */}
        <div 
          className={`w-64 h-64 sm:w-72 sm:h-72 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm relative select-none ${
            useSerifFont ? 'font-serif-jp' : 'font-sans'
          } ${
            inputState === 'correct'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 scale-102'
              : inputState === 'wrong'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-800 dark:text-rose-300 animate-shake'
              : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
          }`}
        >
          <span className="text-8xl sm:text-9xl font-bold tracking-tight">
            {currentItem.character}
          </span>
        </div>

        {/* Revealed correct answer on mistake */}
        {inputState === 'wrong' && revealedAnswer && (
          <div className="mt-4 px-5 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 text-center animate-pop">
            <span className="text-xs text-rose-700 dark:text-rose-300 font-medium block">Jawaban yang benar:</span>
            <span className="text-xl font-mono font-bold text-rose-900 dark:text-white tracking-widest uppercase">
              {revealedAnswer}
            </span>
            <span className="text-[11px] text-rose-600 dark:text-rose-300/80 block mt-1">
              Tekan <kbd className="px-1.5 py-0.5 bg-white dark:bg-rose-900/50 rounded border border-rose-300 dark:border-rose-800 font-mono text-xs">Enter</kbd> untuk melanjutkan
            </span>
          </div>
        )}

        {/* Fast Romaji Typing Input */}
        <div className="mt-8 w-full max-w-xs relative">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={inputState === 'correct'}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder={
              inputState === 'wrong'
                ? 'Tekan Enter...'
                : requireEnterMode
                ? 'Ketik romaji lalu Enter...'
                : 'Ketik romaji...'
            }
            className={`w-full pl-5 pr-12 py-3 rounded-xl text-center text-xl font-mono font-semibold tracking-wider transition-all duration-150 outline-none border ${
              inputState === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                : inputState === 'wrong'
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20'
                : 'bg-white dark:bg-[#1f1f23] border-[#d6d3d1] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] focus:border-[#c84b31] dark:focus:border-[#e05d44] focus:ring-2 focus:ring-[#c84b31]/10'
            }`}
          />

          {/* Submit / Next Button */}
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={inputState === 'idle' && userInput.trim().length === 0}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition cursor-pointer ${
              inputState === 'wrong'
                ? 'bg-[#c84b31] hover:bg-[#b03d25] text-white shadow-xs'
                : userInput.trim().length > 0
                ? 'bg-[#c84b31] hover:bg-[#b03d25] text-white shadow-xs'
                : 'text-[#a8a29e] dark:text-[#71717a] cursor-not-allowed'
            }`}
            title={inputState === 'wrong' ? 'Lanjut (Enter)' : 'Kirim Jawaban (Enter)'}
          >
            {inputState === 'wrong' ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <CornerDownLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="mt-3 text-xs text-[#78716c] dark:text-[#a1a1aa]">
          {requireEnterMode ? (
            <span>
              Ketik jawaban lalu tekan <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#27272a] rounded border border-[#d6d3d1] dark:border-[#3f3f46] font-mono text-[11px]">Enter</kbd> (Anti-Tebak)
            </span>
          ) : (
            <span>
              Auto-Submit: Jawaban langsung dinilai saat karakter cocok
            </span>
          )}
        </p>
      </div>

      {/* Footer hint */}
      <div className="text-center text-xs text-[#a8a29e] dark:text-[#71717a] pb-2 font-mono">
        Tekan [Esc] kapan saja untuk mengakhiri sesi lebih awal
      </div>
    </div>
  );
};
