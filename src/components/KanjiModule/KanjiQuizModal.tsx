import React, { useState, useEffect, useRef } from 'react';
import { KanjiItem } from '../../types';
import { playSuccessSound, playErrorSound, speakJapanese } from '../../utils/audio';
import { X, Flame, Volume2, ArrowRight, CornerDownLeft, AlertTriangle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KanjiQuizModalProps {
  kanjiList: KanjiItem[];
  onClose: () => void;
}

export const KanjiQuizModal: React.FC<KanjiQuizModalProps> = ({ kanjiList, onClose }) => {
  // Quiz queue
  const [queue, setQueue] = useState<KanjiItem[]>(() => {
    return [...kanjiList].sort(() => Math.random() - 0.5);
  });

  const [initialCount] = useState(kanjiList.length);
  const [userInput, setUserInput] = useState('');
  const [inputState, setInputState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);

  // Mistakes tracking
  const [wrongItems, setWrongItems] = useState<{ kanji: KanjiItem; userTyped: string }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentKanji = queue[0];

  useEffect(() => {
    inputRef.current?.focus();
  }, [queue.length, inputState]);

  useEffect(() => {
    if (isFinished && correctCount >= initialCount * 0.7) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        console.debug('Confetti error:', e);
      }
    }
  }, [isFinished, correctCount, initialCount]);

  // Check if user input matches meaning or readings
  const checkAnswer = (input: string, item: KanjiItem): boolean => {
    const clean = input.trim().toLowerCase();
    if (!clean) return false;

    // Check Indonesian meaning (e.g. "satu", "buku", "matahari")
    const meaningKeywords = item.meaningId.toLowerCase().split(/[,/]/).map(s => s.trim());
    if (meaningKeywords.some(k => k === clean || clean.includes(k) || k.includes(clean))) {
      return true;
    }

    // Check English meaning
    const enKeywords = item.meaning.toLowerCase().split(/[,/]/).map(s => s.trim());
    if (enKeywords.some(k => k === clean)) {
      return true;
    }

    // Check On'yomi or Kun'yomi kana or romaji
    const cleanNoDash = clean.replace(/[-・]/g, '');
    for (const on of item.onyomi) {
      if (on === clean || on.toLowerCase() === clean) return true;
    }
    for (const kun of item.kunyomi) {
      const pureKun = kun.replace(/[-・]/g, '');
      if (pureKun === clean || pureKun === cleanNoDash) return true;
    }

    return false;
  };

  const handleSubmit = () => {
    if (inputState === 'wrong') {
      advanceAfterWrong();
      return;
    }

    if (inputState !== 'idle' || !userInput.trim() || !currentKanji) return;

    if (checkAnswer(userInput, currentKanji)) {
      // Correct
      setInputState('correct');
      setStreak(s => s + 1);
      setCorrectCount(c => c + 1);
      playSuccessSound();
      speakJapanese(currentKanji.kanji);

      setTimeout(() => {
        setQueue(prev => {
          const next = prev.slice(1);
          if (next.length === 0) {
            setIsFinished(true);
          }
          return next;
        });
        setUserInput('');
        setInputState('idle');
      }, 300);
    } else {
      // Wrong
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
      // Re-queue to end so learner masters it
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              Kuis Kanji N5 (Wajib Enter)
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished && currentKanji ? (
          <div className="flex flex-col items-center justify-center py-4 my-auto">
            {/* Progress indicator */}
            <div className="text-xs font-mono text-slate-400 mb-4">
              Sisa Antrean: <strong className="text-white">{queue.length}</strong> kanji
            </div>

            {/* Big Kanji Character */}
            <div
              className={`w-48 h-48 sm:w-56 sm:h-56 rounded-3xl flex items-center justify-center border transition-all duration-200 shadow-2xl select-none font-jp ${
                inputState === 'correct'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 scale-105'
                  : inputState === 'wrong'
                  ? 'bg-rose-950/40 border-rose-500 text-rose-300 animate-shake'
                  : 'bg-slate-950/80 border-slate-700 text-white'
              }`}
            >
              <span className="text-7xl sm:text-8xl font-bold">{currentKanji.kanji}</span>
            </div>

            {/* Clue button / audio */}
            <button
              onClick={() => speakJapanese(currentKanji.kanji)}
              className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-1 px-3 rounded-full bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dengarkan Bacaan</span>
            </button>

            {/* Revealed answer on mistake */}
            {inputState === 'wrong' && (
              <div className="mt-4 px-4 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-center animate-pop max-w-sm w-full">
                <span className="text-xs text-rose-300 font-semibold block">Jawaban yang benar:</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  {currentKanji.meaningId}
                </span>
                <span className="text-xs text-slate-300 font-mono block mt-1">
                  On: {currentKanji.onyomi.join(', ') || '—'} | Kun: {currentKanji.kunyomi.join(', ') || '—'}
                </span>
                {currentKanji.mnemonic && (
                  <p className="text-[11px] text-amber-300/90 italic mt-2 bg-slate-900/60 p-2 rounded-lg">
                    💡 Tips: {currentKanji.mnemonic}
                  </p>
                )}
                <span className="text-[11px] text-rose-300/80 block mt-2">
                  Tekan <kbd className="px-1.5 py-0.5 bg-rose-900/50 rounded border border-rose-500/30 text-white font-mono">Enter</kbd> untuk lanjut
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
                className={`w-full pl-4 pr-11 py-3 rounded-2xl text-center text-lg font-medium outline-none border-2 transition ${
                  inputState === 'correct'
                    ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                    : inputState === 'wrong'
                    ? 'bg-rose-950/30 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-rose-500'
                }`}
              />

              <button
                onClick={handleSubmit}
                disabled={inputState === 'idle' && userInput.trim().length === 0}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer"
              >
                {inputState === 'wrong' ? <ArrowRight className="w-4 h-4" /> : <CornerDownLeft className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Ketik arti Indonesia (misal: <code className="text-slate-300">satu</code>, <code className="text-slate-300">air</code>) lalu tekan <strong>Enter</strong>.
            </p>
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-6 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h2 className="text-2xl font-extrabold text-white mb-1">Kuis Kanji Selesai!</h2>
            <p className="text-xs text-slate-400 mb-6">
              Kamu berhasil menyelesaikan seluruh {initialCount} kanji dalam sesi ini.
            </p>

            {/* Score summary */}
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Benar Awal</span>
                <span className="text-2xl font-bold text-emerald-400">{correctCount}</span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sempat Salah</span>
                <span className="text-2xl font-bold text-rose-400">{wrongItems.length}</span>
              </div>
            </div>

            {/* Mistakes Breakdown */}
            {wrongItems.length > 0 && (
              <div className="mb-6 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Kanji yang Sempat Salah:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {wrongItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-jp font-bold text-white">{item.kanji.kanji}</span>
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">{item.kanji.meaningId}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.kanji.onyomi[0] || item.kanji.kunyomi[0]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => speakJapanese(item.kanji.kanji)}
                        className="p-1.5 text-slate-400 hover:text-white"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition cursor-pointer"
            >
              Kembali ke Modul Kanji
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
