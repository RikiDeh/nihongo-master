import React, { useEffect } from 'react';
import { QuizSummary, KanaItem } from '../../types';
import confetti from 'canvas-confetti';
import { playCompletionSound, speakJapanese } from '../../utils/audio';
import { 
  Trophy, 
  RotateCcw, 
  ListFilter, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target, 
  Sparkles,
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.debug('Confetti error:', e);
      }
    }
  }, [summary.accuracy]);

  const wrongCount = summary.wrongItems.length;
  const missedKanaList = summary.wrongItems.map(w => w.kana);

  const getScoreColor = (acc: number) => {
    if (acc >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (acc >= 75) return 'text-sky-400 border-sky-500/40 bg-sky-500/10';
    if (acc >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreMessage = (acc: number) => {
    if (acc === 100) return 'Luar Biasa Sempurna! (完璧 - Kanpeki)';
    if (acc >= 85) return 'Hebat Banget! Sedikit lagi 100%';
    if (acc >= 70) return 'Kerja Bagus! Terus latih huruf yang terlewat.';
    return 'Jangan Menyerah! Terus ulangi huruf yang salah di bawah.';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header Result Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-4">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Kuis Selesai!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {getScoreMessage(summary.accuracy)}
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Kamu telah menyelesaikan seluruh antrean kuis sampai semua huruf berhasil dikuasai!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
          <div className={`p-4 rounded-2xl border ${getScoreColor(summary.accuracy)}`}>
            <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
              <Target className="w-3.5 h-3.5" />
              <span>Akurasi</span>
            </div>
            <div className="text-3xl font-extrabold font-mono">
              {summary.accuracy}%
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Benar Awal</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              {summary.correctFirstTryCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Salah/Ulang</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-rose-400">
              {wrongCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Waktu</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-sky-400">
              {summary.timeSpentSeconds}s
            </div>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {wrongCount > 0 && (
            <button
              onClick={() => onRetryMissed(missedKanaList)}
              className="px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Latih Ulang {wrongCount} Huruf yang Salah Saja
            </button>
          )}

          <button
            onClick={onRetryAll}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Semua Huruf Sesi Ini
          </button>

          <button
            onClick={onBackToSelector}
            className="px-5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <ListFilter className="w-4 h-4" />
            Pilih Huruf Lain
          </button>
        </div>
      </div>

      {/* SECTION 1: MISTAKE REVIEW WITH ROMAJI (User Request!) */}
      {wrongCount > 0 ? (
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-3xl p-6 sm:p-7 mb-8 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-rose-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Huruf yang Salah & Romajinya</h2>
                <p className="text-xs text-slate-400">
                  Berikut huruf yang sempat salah dijawab beserta cara baca Romaji resminya di bawah:
                </p>
              </div>
            </div>

            <button
              onClick={() => onRetryMissed(missedKanaList)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Latih {wrongCount} Ini
            </button>
          </div>

          {/* Grid of Mistake Cards with Big Kana + Romaji Clearly Underneath */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {summary.wrongItems.map((attempt) => {
              const wrongInputs = attempt.userInputs.filter(
                inp => inp.toLowerCase() !== attempt.kana.romaji.toLowerCase() && 
                       !attempt.kana.aliases.includes(inp.toLowerCase())
              );

              return (
                <div
                  key={attempt.kana.id}
                  className="bg-slate-950/80 border-2 border-rose-500/40 hover:border-rose-400/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all group relative shadow-md"
                >
                  {/* Badge Kana Type */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${
                    attempt.kana.type === 'hiragana' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {attempt.kana.type === 'hiragana' ? 'Hiragana' : 'Katakana'}
                  </span>

                  {/* Big Kana Display */}
                  <span className="text-5xl font-jp font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                    {attempt.kana.character}
                  </span>

                  {/* ROMAJI CLEARLY UNDERNEATH (User explicit request!) */}
                  <div className="w-full bg-rose-950/60 border border-rose-500/40 rounded-xl py-1 px-2.5 mb-2">
                    <span className="text-xs text-rose-300/80 block text-[10px] uppercase font-semibold">Romaji Benar:</span>
                    <span className="text-lg font-mono font-extrabold text-white tracking-wider">
                      {attempt.kana.romaji}
                    </span>
                  </div>

                  {/* What user typed wrong */}
                  {wrongInputs.length > 0 && (
                    <div className="text-[11px] text-slate-400 mb-2 truncate max-w-full">
                      Ketik: <span className="line-through text-rose-400 font-mono font-medium">{wrongInputs[0]}</span>
                    </div>
                  )}

                  {/* Audio Button */}
                  <button
                    onClick={() => speakJapanese(attempt.kana.character)}
                    title="Dengarkan suara"
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 text-center mb-8">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-emerald-300 mb-1">Hebat! Tidak Ada Huruf yang Salah</h2>
          <p className="text-xs text-slate-400">
            Kamu menjawab semua karakter dengan benar pada kesempatan pertama!
          </p>
        </div>
      )}

      {/* SECTION 2: ALL PRACTICED CHARACTERS GRID (With Romaji Underneath Every Character) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Semua Huruf dalam Sesi Kuis</h2>
            <p className="text-xs text-slate-400">
              Daftar lengkap seluruh karakter dengan Romaji di bawahnya:
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {summary.allAttempts.length} Total
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {summary.allAttempts.map((attempt) => {
            const isCorrect = attempt.isCorrectFirstTry;
            return (
              <div
                key={attempt.kana.id}
                onClick={() => speakJapanese(attempt.kana.character)}
                title="Klik untuk dengarkan suara"
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 ${
                  isCorrect
                    ? 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    {attempt.kana.type === 'hiragana' ? 'H' : 'K'}
                  </span>
                  {isCorrect ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                  )}
                </div>

                <span className="text-2xl font-jp font-bold text-white mb-0.5">
                  {attempt.kana.character}
                </span>

                {/* Romaji underneath */}
                <span className={`text-xs font-mono font-semibold ${isCorrect ? 'text-slate-300' : 'text-rose-300'}`}>
                  {attempt.kana.romaji}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: NEXT STEP IN LEARNING JOURNEY (Path to N1) */}
      {onGoToKanji && (
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Langkah Selanjutnya: Jalur JLPT N5 - N1</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Sudah Lancar Kana? Saatnya Belajar Kanji & Vocab!</h3>
            <p className="text-xs text-slate-300">
              Lanjutkan perjalanan belajarmu dari dasar N5 hingga mahir N1 dengan modul Kanji, Kosakata, dan Tata Bahasa.
            </p>
          </div>

          <button
            onClick={onGoToKanji}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <span>Buka Modul Kanji & Vocab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
