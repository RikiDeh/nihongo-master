import React, { useEffect } from 'react';
import { QuizSummary, KanaItem } from '../../types';
import confetti from 'canvas-confetti';
import { playCompletionSound, speakJapanese } from '../../utils/audio';
import { 
  RotateCcw, 
  ListFilter, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target, 
  ArrowRight
} from 'lucide-react';

interface KanaResultsProps {
  summary: QuizSummary;
  onRetryMissed: (missedItems: KanaItem[]) => void;
  onRetryAll: () => void;
  onBackToSelector: () => void;
  onGoToKanji?: () => void;
}

export const KanaResults: React.FC<KanaResultsProps> = ({
  summary,
  onRetryMissed,
  onRetryAll,
  onBackToSelector,
  onGoToKanji,
}) => {
  useEffect(() => {
    playCompletionSound();
    if (summary.accuracy >= 75) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.debug('Confetti error:', e);
      }
    }
  }, [summary.accuracy]);

  const wrongCount = summary.wrongItems.length;
  const missedKanaList = summary.wrongItems.map(w => w.kana);

  const getScoreMessage = (acc: number) => {
    if (acc === 100) return 'Luar Biasa Sempurna (完璧 - Kanpeki)';
    if (acc >= 85) return 'Hasil Sangat Baik (優秀 - Yuushuu)';
    if (acc >= 70) return 'Capaian Bagus (良好 - Ryoukou)';
    return 'Terus Berlatih (継続 - Keizoku)';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Header Result Card — Japanese Editorial Certificate */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 text-center shadow-xs mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#c84b31]/30 bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44] text-xs font-mono font-medium mb-3">
          <span>[成績発表] EVALUASI SESI KANA</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] mb-2 tracking-wide">
          {getScoreMessage(summary.accuracy)}
        </h1>
        <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mb-6 max-w-lg mx-auto">
          Kamu telah menuntaskan seluruh antrean kuis sampai semua karakter berhasil dikuasai secara refleks.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
          <div className="p-3.5 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold uppercase text-[#78716c] dark:text-[#a1a1aa] mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Akurasi</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#c84b31] dark:text-[#e05d44]">
              {summary.accuracy}%
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold uppercase text-[#78716c] dark:text-[#a1a1aa] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Benar Awal</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#2e7d32] dark:text-[#4ade80]">
              {summary.correctFirstTryCount}
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold uppercase text-[#78716c] dark:text-[#a1a1aa] mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Salah/Ulang</span>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {wrongCount}
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold uppercase text-[#78716c] dark:text-[#a1a1aa] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>Durasi</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#1c1917] dark:text-[#f4f4f5]">
              {summary.timeSpentSeconds}s
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {wrongCount > 0 && (
            <button
              type="button"
              onClick={() => onRetryMissed(missedKanaList)}
              className="px-5 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-xs active:translate-y-px"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Drill {wrongCount} Huruf Salah</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRetryAll}
            className="px-4 py-2.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Seluruh Sesi</span>
          </button>

          <button
            type="button"
            onClick={onBackToSelector}
            className="px-4 py-2.5 rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Pilih Huruf Lain</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MISTAKE REVIEW */}
      {wrongCount > 0 && (
        <div className="bg-white dark:bg-[#1f1f23] border border-rose-200 dark:border-rose-950/60 rounded-xl p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                [要復習] PERLU REVIEW
              </span>
              <h2 className="text-sm font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                Daftar Huruf yang Sempat Salah
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onRetryMissed(missedKanaList)}
              className="px-3 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Drill {wrongCount} Ini</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {summary.wrongItems.map((attempt) => {
              const wrongInputs = attempt.userInputs.filter(
                inp => inp.toLowerCase() !== attempt.kana.romaji.toLowerCase() && 
                       !attempt.kana.aliases.includes(inp.toLowerCase())
              );

              return (
                <div
                  key={attempt.kana.id}
                  className="bg-[#faf8f5] dark:bg-[#18181b] border border-stone-200 dark:border-zinc-800 rounded-lg p-3.5 flex flex-col items-center justify-center text-center transition-all group relative"
                >
                  <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] mb-1">
                    [{attempt.kana.type === 'hiragana' ? '平' : '片'}]
                  </span>

                  <span className="text-4xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-2">
                    {attempt.kana.character}
                  </span>

                  <div className="w-full bg-white dark:bg-[#1f1f23] border border-stone-200 dark:border-zinc-800 rounded py-1 px-2 mb-2">
                    <span className="text-[10px] font-mono text-[#78716c] block">Romaji Benar</span>
                    <span className="text-base font-mono font-bold text-[#c84b31] dark:text-[#e05d44]">
                      {attempt.kana.romaji}
                    </span>
                  </div>

                  {wrongInputs.length > 0 && (
                    <div className="text-[10px] font-mono text-[#78716c] mb-2 truncate max-w-full">
                      Ketik: <span className="line-through text-rose-600">{wrongInputs[0]}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => speakJapanese(attempt.kana.character)}
                    title="Dengarkan pelafalan"
                    className="p-1 rounded text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ALL PRACTICED CHARACTERS GRID */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5 sm:p-6 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e7e5e4] dark:border-[#27272a]">
          <div>
            <h2 className="text-sm font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5]">
              Seluruh Karakter yang Dilatih Sesi Ini
            </h2>
          </div>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
            {summary.allAttempts.length} Karakter
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {summary.allAttempts.map((attempt) => {
            const isCorrect = attempt.isCorrectFirstTry;
            return (
              <div
                key={attempt.kana.id}
                onClick={() => speakJapanese(attempt.kana.character)}
                title="Klik untuk dengarkan suara"
                className={`p-2 rounded-lg border text-center cursor-pointer transition ${
                  isCorrect
                    ? 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917]'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="text-xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                  {attempt.kana.character}
                </div>
                <div className={`text-[11px] font-mono font-medium ${isCorrect ? 'text-[#78716c]' : 'text-rose-600'}`}>
                  {attempt.kana.romaji}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: NEXT STEP IN LEARNING JOURNEY */}
      {onGoToKanji && (
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#1e3a8a]/30 text-[#1e3a8a] dark:text-[#60a5fa] bg-[#1e3a8a]/5 mb-2 inline-block">
              [次へ] LANGKAH SELANJUTNYA
            </span>
            <h3 className="text-base font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1">
              Sudah Lancar Kana? Beralih ke Kanji & Kosakata N5
            </h3>
            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa]">
              Lanjutkan kurikulum bertahap ke aksara Kanji, Kosakata kontekstual, dan Tata Bahasa.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToKanji}
            className="px-5 py-2.5 rounded-lg bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] hover:opacity-90 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition cursor-pointer"
          >
            <span>Buka Modul Kanji N5</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
