import React, { useState, useEffect, useRef } from 'react';
import { KanaItem, QuizAttempt, QuizSummary } from '../../types';
import { playSuccessSound, playErrorSound, speakJapanese } from '../../utils/audio';
import { Volume2, VolumeX, Flame, X, ArrowRight, CornerDownLeft, Type, RotateCcw, Keyboard, Zap } from 'lucide-react';

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
  const [maxStreak, setMaxStreak] = useState(0);
  const startTimeRef = useRef<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [useSerifFont, setUseSerifFont] = useState(false);
  const [retriedItemIds, setRetriedItemIds] = useState<Set<string>>(() => new Set());

  // Tracking attempts by kana item id
  const attemptsMapRef = useRef<Map<string, QuizAttempt>>(new Map());

  // Input ref to keep focus
  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = queue[0];

  // Inisialisasi waktu mulai di effect agar render murni/deterministik
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Check if current item was previously answered wrong (re-queued item)
  const isCurrentItemRetried = currentItem 
    ? retriedItemIds.has(currentItem.id) 
    : false;

  // Ensure input is focused
  useEffect(() => {
    inputRef.current?.focus();
  }, [queue.length, inputState]);

  // Helper to check answer
  const isAnswerValid = (input: string, item: KanaItem): boolean => {
    const clean = input.trim().toLowerCase();
    if (!clean) return false;
    if (clean === item.romaji.toLowerCase()) return true;
    return item.aliases.some(alias => alias.toLowerCase() === clean);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If locked or in wrong/correct state, ignore
    if (isTransitioningRef.current || inputState === 'wrong' || inputState === 'correct') return;

    const val = e.target.value;
    setUserInput(val);

    // If auto-submit is allowed, check immediately
    if (!requireEnterMode) {
      if (currentItem && isAnswerValid(val, currentItem)) {
        handleCorrect();
      }
    }
  };

  const handleSubmitAnswer = () => {
    if (isTransitioningRef.current) return;

    if (inputState === 'wrong') {
      advanceAfterWrong();
    } else if (inputState === 'idle' && userInput.trim().length > 0) {
      if (currentItem && isAnswerValid(userInput, currentItem)) {
        handleCorrect();
      } else {
        handleWrong();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const handleCorrect = () => {
    if (!currentItem || isTransitioningRef.current || inputState === 'correct') return;
    isTransitioningRef.current = true;

    // Record stats
    const currentAttempt = attemptsMapRef.current.get(currentItem.id) || {
      kana: currentItem,
      userInputs: [],
      isCorrectFirstTry: true,
      failedAttempts: 0,
    };
    currentAttempt.userInputs.push(userInput.trim().toLowerCase());
    attemptsMapRef.current.set(currentItem.id, currentAttempt);

    setInputState('correct');
    setStreak(s => {
      const next = s + 1;
      if (next > maxStreak) setMaxStreak(next);
      return next;
    });

    if (soundEnabled) {
      playSuccessSound();
      speakJapanese(currentItem.character);
    }

    setTimeout(() => {
      setQueue(prevQueue => {
        const remaining = prevQueue.slice(1);
        if (remaining.length === 0) {
          // Quiz completed!
          finishQuiz();
        }
        return remaining;
      });

      setUserInput('');
      setInputState('idle');
      setRevealedAnswer(null);
      isTransitioningRef.current = false;
    }, 280);
  };

  const handleWrong = () => {
    if (!currentItem || isTransitioningRef.current || inputState === 'wrong') return;

    const currentAttempt = attemptsMapRef.current.get(currentItem.id) || {
      kana: currentItem,
      userInputs: [],
      isCorrectFirstTry: false,
      failedAttempts: 0,
    };
    currentAttempt.isCorrectFirstTry = false;
    currentAttempt.failedAttempts += 1;
    currentAttempt.userInputs.push(userInput.trim().toLowerCase());
    attemptsMapRef.current.set(currentItem.id, currentAttempt);

    setRetriedItemIds(prev => {
      const next = new Set(prev);
      next.add(currentItem.id);
      return next;
    });

    setInputState('wrong');
    setRevealedAnswer(currentItem.romaji);
    setStreak(0);

    if (soundEnabled) {
      playErrorSound();
    }
  };

  const advanceAfterWrong = () => {
    if (!currentItem || isTransitioningRef.current || inputState !== 'wrong') return;
    isTransitioningRef.current = true;

    setQueue(prevQueue => {
      const remaining = prevQueue.slice(1);

      if (requeueMistakes) {
        // Put current item further back so user masters it (at least 4 items away or at end)
        const insertPosition = Math.min(4, remaining.length);
        const newQueue = [...remaining];
        newQueue.splice(insertPosition, 0, currentItem);
        return newQueue;
      } else {
        // In 1-pass mode, do not re-queue
        if (remaining.length === 0) {
          finishQuiz();
        }
        return remaining;
      }
    });

    setUserInput('');
    setInputState('idle');
    setRevealedAnswer(null);
    isTransitioningRef.current = false;
  };

  const finishQuiz = () => {
    const elapsed = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 1;
    const timeSpentSeconds = Math.max(1, elapsed);
    const allAttempts = Array.from(attemptsMapRef.current.values());
    const wrongItems = allAttempts.filter(a => !a.isCorrectFirstTry);
    const correctFirstTryCount = allAttempts.filter(a => a.isCorrectFirstTry).length;
    const accuracy = allAttempts.length > 0 
      ? Math.round((correctFirstTryCount / allAttempts.length) * 100) 
      : 100;

    const summary: QuizSummary = {
      totalQuestions: allAttempts.length,
      correctFirstTryCount,
      accuracy,
      timeSpentSeconds,
      wrongItems,
      allAttempts,
    };

    onFinishQuiz(summary);
  };

  if (!currentItem) {
    return null;
  }

  const progressPercentage = Math.round(((initialCount - queue.length) / initialCount) * 100);

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-4xl mx-auto px-4 py-6">
      {/* Top Header / Stats Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            Keluar Sesi
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle Require Enter (Anti-Tebak) */}
            <button
              onClick={() => setRequireEnterMode(prev => !prev)}
              title={requireEnterMode ? 'Mode: Wajib Tekan Enter (Anti-Tebak). Klik untuk beralih ke Auto-submit.' : 'Mode: Auto-Submit (Cepat). Klik untuk mewajibkan Enter.'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                requireEnterMode
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {requireEnterMode ? (
                <>
                  <Keyboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Wajib Enter (Anti-Tebak)</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Auto-Submit</span>
                </>
              )}
            </button>

            {/* Streak Counter */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              streak > 0 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'fill-current' : ''}`} />
              <span>{streak}</span>
            </div>

            {/* Font Style Toggle */}
            <button
              onClick={() => setUseSerifFont(f => !f)}
              title="Ganti font (Gothic vs Mincho/Serif)"
              className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                useSerifFont 
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(s => !s)}
              title={soundEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Antrean Kuis: <strong className="text-slate-200">{queue.length}</strong> pertanyaan tersisa</span>
          <span>Progres: <strong className="text-slate-200">{progressPercentage}%</strong></span>
        </div>
      </div>

      {/* Main Flashcard / Quiz Stage */}
      <div className="flex flex-col items-center justify-center my-auto py-8">
        {/* Character Type Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm ${
            currentItem.type === 'hiragana'
              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
              : 'bg-sky-500/30 text-sky-300 border border-sky-500/50'
          }`}>
            {currentItem.type === 'hiragana' ? '🌸 HIRAGANA' : '🔷 KATAKANA'}
          </span>

          <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            {currentItem.category === 'gojuuon' ? 'Standar' : currentItem.category === 'dakuten' ? 'Dakuten' : 'Kombinasi (Yōon)'}
          </span>

          {/* Ambiguity hints for duplicate sound characters */}
          {(currentItem.character === 'ぢ' || currentItem.character === 'ヂ') && (
            <span className="text-[11px] text-amber-400/90 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              Baris-D (da, ji, zu, de, do)
            </span>
          )}
          {(currentItem.character === 'づ' || currentItem.character === 'ヅ') && (
            <span className="text-[11px] text-amber-400/90 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              Baris-D (da, ji, zu, de, do)
            </span>
          )}

          <button
            onClick={() => speakJapanese(currentItem.character)}
            title="Dengarkan pengucapan asli"
            className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear Notice if this item is a RE-QUEUE because user previously missed it */}
        {isCurrentItemRetried && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium animate-pop">
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Pengulangan: Huruf ini muncul lagi karena tadi sempat salah dijawab</span>
          </div>
        )}

        {/* Big Kana Character Display */}
        <div 
          className={`w-64 h-64 sm:w-72 sm:h-72 rounded-3xl flex items-center justify-center border transition-all duration-200 shadow-2xl relative select-none ${
            useSerifFont ? 'font-serif-jp' : 'font-jp'
          } ${
            inputState === 'correct'
              ? 'bg-emerald-950/40 border-emerald-500/80 shadow-emerald-500/20 text-emerald-300 scale-105'
              : inputState === 'wrong'
              ? 'bg-rose-950/40 border-rose-500/80 shadow-rose-500/20 text-rose-300 animate-shake'
              : 'bg-slate-900/90 border-slate-700/80 text-white'
          }`}
        >
          <span className="text-8xl sm:text-9xl font-bold tracking-tight">
            {currentItem.character}
          </span>
        </div>

        {/* Revealed correct answer on mistake */}
        {inputState === 'wrong' && revealedAnswer && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-center animate-pop">
            <span className="text-xs text-rose-300 font-medium block">Jawaban yang benar:</span>
            <span className="text-xl font-mono font-bold text-white tracking-widest uppercase">
              {revealedAnswer}
            </span>
            <span className="text-[11px] text-rose-300/80 block mt-1">
              Tekan <kbd className="px-1.5 py-0.5 bg-rose-900/50 rounded border border-rose-500/30 text-white font-mono">Enter</kbd> untuk melanjutkan
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
            className={`w-full pl-5 pr-12 py-3.5 rounded-2xl text-center text-xl font-mono font-semibold tracking-wider transition-all duration-150 outline-none border-2 ${
              inputState === 'correct'
                ? 'bg-emerald-900/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                : inputState === 'wrong'
                ? 'bg-rose-900/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                : 'bg-slate-900 border-slate-700 text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
            }`}
          />

          {/* Submit / Next Button */}
          <button
            onClick={handleSubmitAnswer}
            disabled={inputState === 'idle' && userInput.trim().length === 0}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition cursor-pointer ${
              inputState === 'wrong'
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                : userInput.trim().length > 0
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                : 'text-slate-600 cursor-not-allowed'
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

        <p className="mt-3 text-xs text-slate-400">
          {requireEnterMode ? (
            <span>
              Ketik jawabanmu lalu tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Enter</kbd> untuk menilai (Anti-Tebak)
            </span>
          ) : (
            <span>
              Mode Auto-Submit: Jawaban langsung dinilai saat karakter cocok
            </span>
          )}
        </p>
      </div>

      {/* Footer explanation */}
      <div className="text-center text-xs text-slate-500 pb-2 flex items-center justify-center gap-3">
        <span>
          {requireEnterMode ? '🛡️ Mode Ujian Aktif: Jawaban salah akan langsung dicatat saat menekan Enter.' : '⚡ Mode Cepat Aktif'}
        </span>
      </div>
    </div>
  );
};
