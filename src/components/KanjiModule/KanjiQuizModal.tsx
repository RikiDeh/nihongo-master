import React, { useState, useEffect, useRef } from 'react';
import { KanjiItem } from '../../types';
import { playSuccessSound, playErrorSound, speakJapanese } from '../../utils/audio';
import { X, Flame, Volume2, ArrowRight, CornerDownLeft, AlertTriangle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KanjiQuizModalProps {
  kanjiList: KanjiItem[];
  onClose: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const KanjiQuizModal: React.FC<KanjiQuizModalProps> = ({ kanjiList, onClose }) => {
  const [sessionLimit, setSessionLimit] = useState<number>(() => Math.min(10, kanjiList.length || 10));

  const initQueue = (limit: number) => {
    const shuffled = shuffleArray(kanjiList);
    return shuffled.slice(0, Math.min(limit, shuffled.length));
  };

  const [queue, setQueue] = useState<KanjiItem[]>(() => initQueue(10));
  const [initialCount, setInitialCount] = useState<number>(() => Math.min(10, kanjiList.length));
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [userInput, setUserInput] = useState('');
  const [inputState, setInputState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);

  // Mistakes tracking
  const [wrongItems, setWrongItems] = useState<{ kanji: KanjiItem; userTyped: string }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentKanji = queue[0];

  const handleRestart = (newLimit: number = sessionLimit) => {
    const newItems = initQueue(newLimit);
    setQueue(newItems);
    setInitialCount(newItems.length);
    setSessionLimit(newLimit);
    setAnsweredCount(0);
    setUserInput('');
    setInputState('idle');
    setStreak(0);
    setWrongItems([]);
    setCorrectCount(0);
    setIsFinished(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentKanji, inputState]);

  useEffect(() => {
    if (isFinished && correctCount >= initialCount * 0.8) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        console.debug('Confetti error:', e);
      }
    }
  }, [isFinished, correctCount, initialCount]);

  const handleSubmit = () => {
    if (inputState === 'wrong') {
      advanceAfterWrong();
      return;
    }

    const clean = userInput.trim().toLowerCase();
    if (clean.length === 0 || !currentKanji) return;

    const meanings = currentKanji.meaningId.toLowerCase().split(/[,;/]/).map(s => s.trim());
    const onReadings = currentKanji.onyomi.map(r => r.toLowerCase().trim());
    const kunReadings = currentKanji.kunyomi.map(r => r.toLowerCase().trim());

    const isMeaningMatch = meanings.some(m => {
      if (m === clean) return true;
      if (clean.length >= 3 && m.includes(clean)) return true;
      return false;
    });

    const isReadingMatch = 
      onReadings.some(r => r === clean) ||
      kunReadings.some(k => {
        const cleanK = k.replace(/[.-]/g, '');
        if (cleanK === clean) return true;
        if (clean.length >= 3 && cleanK.includes(clean)) return true;
        return false;
      });

    const isMatch = isMeaningMatch || isReadingMatch;

    if (isMatch) {
      setInputState('correct');
      setStreak(s => s + 1);
      playSuccessSound();

      if (!wrongItems.some(w => w.kanji.id === currentKanji.id)) {
        setCorrectCount(c => c + 1);
      }

      setTimeout(() => {
        setAnsweredCount(a => a + 1);
        setUserInput('');
        setInputState('idle');

        if (queue.length <= 1) {
          setIsFinished(true);
        } else {
          setQueue(prev => prev.slice(1));
        }
      }, 300);
    } else {
      setInputState('wrong');
      setStreak(0);
      playErrorSound();
      setWrongItems(prev => {
        if (!prev.some(w => w.kanji.id === currentKanji.id)) {
          return [...prev, { kanji: currentKanji, userTyped: userInput.trim() }];
        }
        return prev;
      });
    }
  };

  const advanceAfterWrong = () => {
    setQueue(prev => {
      const next = prev.slice(1);
      next.push(currentKanji);
      return next;
    });
    setUserInput('');
    setInputState('idle');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e4] dark:border-[#27272a] mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold border border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5">
              [漢字] {currentKanji ? `JLPT ${currentKanji.level}` : ''}
            </span>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 px-2 py-0.5 rounded border border-[#c84b31]/20">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-[#faf8f5] dark:bg-[#18181b] p-1 rounded-md border border-[#e7e5e4] dark:border-[#27272a] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => handleRestart(10)}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  sessionLimit === 10 ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold' : 'text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                10 Soal
              </button>
              <button
                type="button"
                onClick={() => handleRestart(20)}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  sessionLimit === 20 ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold' : 'text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                20 Soal
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isFinished && currentKanji ? (
          <div className="flex flex-col items-center justify-center py-4 my-auto">
            {/* Progress indicator */}
            <div className="w-full max-w-xs mb-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-1.5">
                <span>Kanji <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{Math.min(answeredCount + 1, initialCount)}</strong> dari <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{initialCount}</strong></span>
                <span>{Math.round((Math.min(answeredCount, initialCount) / initialCount) * 100)}%</span>
              </div>
              <div className="w-full bg-[#e7e5e4] dark:bg-[#27272a] rounded-full h-1 overflow-hidden">
                <div 
                  className="bg-[#c84b31] dark:bg-[#e05d44] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((Math.min(answeredCount, initialCount) / initialCount) * 100))}%` }}
                />
              </div>
            </div>

            {/* Big Kanji Character */}
            <div
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-xl flex items-center justify-center border transition-all duration-150 select-none font-jp ${
                inputState === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 scale-102'
                  : inputState === 'wrong'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-800 dark:text-rose-300 animate-shake'
                  : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
              }`}
            >
              <span className="text-7xl sm:text-8xl font-bold">{currentKanji.kanji}</span>
            </div>

            {/* Audio button */}
            <button
              type="button"
              onClick={() => speakJapanese(currentKanji.kanji)}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] py-1 px-3 rounded-md bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Dengarkan Bacaan</span>
            </button>

            {/* Revealed answer on mistake */}
            {inputState === 'wrong' && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 text-center animate-pop max-w-sm w-full">
                <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold block">Jawaban yang benar:</span>
                <span className="text-base font-bold text-rose-900 dark:text-white block mt-0.5">
                  {currentKanji.meaningId}
                </span>
                <span className="text-xs text-[#78716c] dark:text-[#a1a1aa] font-mono block mt-1">
                  On: {currentKanji.onyomi.join(', ') || '—'} | Kun: {currentKanji.kunyomi.join(', ') || '—'}
                </span>
                {currentKanji.mnemonic && (
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/90 italic mt-2 bg-white/60 dark:bg-black/20 p-2 rounded border border-amber-200 dark:border-amber-900/40">
                    Tips: {currentKanji.mnemonic}
                  </p>
                )}
                <span className="text-[11px] text-rose-600 dark:text-rose-300/80 block mt-2">
                  Tekan <kbd className="px-1.5 py-0.5 bg-white dark:bg-rose-900/50 rounded border border-rose-300 dark:border-rose-800 font-mono">Enter</kbd> untuk lanjut
                </span>
              </div>
            )}

            {/* Typing input */}
            <div className="mt-6 w-full max-w-xs relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={inputState === 'correct'}
                autoFocus
                placeholder={inputState === 'wrong' ? 'Tekan Enter...' : 'Ketik arti / bacaan...'}
                className={`w-full pl-4 pr-11 py-2.5 rounded-lg text-center text-base font-medium outline-none border transition ${
                  inputState === 'correct'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                    : inputState === 'wrong'
                    ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-900 dark:text-rose-200'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#d6d3d1] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] focus:border-[#c84b31]'
                }`}
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={inputState === 'idle' && userInput.trim().length === 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[#c84b31] hover:bg-[#b03d25] text-white transition cursor-pointer"
              >
                {inputState === 'wrong' ? <ArrowRight className="w-3.5 h-3.5" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] mt-2 font-mono">
              Ketik arti Indonesia (misal: satu, air) lalu tekan Enter.
            </p>
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-6 text-center">
            <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1">
              Sesi Kuis Kanji Selesai
            </h2>
            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-6">
              Kamu telah menyelesaikan seluruh {initialCount} kanji dalam sesi ini.
            </p>

            {/* Score summary */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
              <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
                <span className="text-[10px] text-[#78716c] block uppercase font-mono font-bold">Benar Awal</span>
                <span className="text-2xl font-bold font-mono text-[#2e7d32] dark:text-[#4ade80]">{correctCount}</span>
              </div>
              <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
                <span className="text-[10px] text-[#78716c] block uppercase font-mono font-bold">Sempat Salah</span>
                <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">{wrongItems.length}</span>
              </div>
            </div>

            {/* Mistakes Breakdown */}
            {wrongItems.length > 0 && (
              <div className="mb-6 text-left">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c84b31] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Kanji yang Sempat Salah:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {wrongItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">{item.kanji.kanji}</span>
                        <div>
                          <span className="text-xs font-bold text-[#1c1917] dark:text-[#f4f4f5] block">{item.kanji.meaningId}</span>
                          <span className="text-[10px] text-[#78716c] font-mono">
                            {item.kanji.onyomi[0] || item.kanji.kunyomi[0]}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakJapanese(item.kanji.kanji)}
                        className="p-1 text-[#78716c] hover:text-[#1c1917]"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => handleRestart(sessionLimit)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white font-semibold text-xs uppercase tracking-wider transition cursor-pointer shadow-xs active:translate-y-px"
              >
                Latihan {sessionLimit} Kanji Lagi
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] hover:border-[#1c1917] text-[#1c1917] dark:text-[#f4f4f5] font-semibold text-xs uppercase tracking-wider transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a]"
              >
                Kembali
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
