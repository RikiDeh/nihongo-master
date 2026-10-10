import React, { useState } from 'react';
import { SrsItemRecord } from '../../types';
import { 
  getDueSrsItems, 
  recordSrsReviewResult, 
  getSrsOverviewStats,
  SRS_INTERVAL_HOURS 
} from '../../utils/srsEngine';
import { getUserProgress } from '../../utils/storage';
import { KANJI_DATA } from '../../data/kanjiData';
import { VOCAB_DATA } from '../../data/vocabData';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { playSuccessSound, playErrorSound, speakJapanese } from '../../utils/audio';
import { 
  X, 
  Flame, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SrsReviewSessionProps {
  onClose: () => void;
}

interface ResolvedItem {
  record: SrsItemRecord;
  mainText: string;
  subText: string;
  meaning: string;
  extraInfo?: string;
  furigana?: string;
}

const STAGE_NAMES: Record<number, string> = {
  1: 'Pemula I (4 jam)',
  2: 'Pemula II (8 jam)',
  3: 'Menengah I (1 hari)',
  4: 'Menengah II (3 hari)',
  5: 'Mahir (1 minggu)',
  6: 'Penguasaan Luhur (2 minggu)',
  7: 'Burned (Permanen)',
};

const STAGE_COLORS: Record<number, string> = {
  1: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  2: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
  3: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  4: 'text-blue-300 bg-blue-500/20 border-blue-500/40',
  5: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  6: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  7: 'text-amber-500 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-amber-500/50',
};

// Map lookup tables for fast item resolution
const kanjiMap = new Map(KANJI_DATA.map(k => [k.id, k]));
const vocabMap = new Map(VOCAB_DATA.map(v => [v.id, v]));
const grammarMap = new Map(GRAMMAR_DATA.map(g => [g.id, g]));

function resolveSrsItem(record: SrsItemRecord): ResolvedItem {
  if (record.itemType === 'kanji') {
    const kanji = kanjiMap.get(record.id);
    if (kanji) {
      return {
        record,
        mainText: kanji.kanji,
        subText: [
          kanji.onyomi.length > 0 ? `On: ${kanji.onyomi.join(', ')}` : '',
          kanji.kunyomi.length > 0 ? `Kun: ${kanji.kunyomi.join(', ')}` : '',
        ].filter(Boolean).join(' | '),
        meaning: kanji.meaningId,
        extraInfo: kanji.mnemonic ? `Mnemonic: ${kanji.mnemonic}` : undefined,
      };
    }
  } else if (record.itemType === 'vocab') {
    const vocab = vocabMap.get(record.id);
    if (vocab) {
      return {
        record,
        mainText: vocab.kanji || vocab.kana,
        subText: `${vocab.kana} (${vocab.romaji})`,
        meaning: vocab.meaningId,
        extraInfo: vocab.exampleSentence?.jp 
          ? `Contoh: ${vocab.exampleSentence.jp} — ${vocab.exampleSentence.id}` 
          : undefined,
        furigana: vocab.kana,
      };
    }
  } else if (record.itemType === 'grammar') {
    const grammar = grammarMap.get(record.id);
    if (grammar) {
      return {
        record,
        mainText: grammar.title,
        subText: grammar.structure,
        meaning: grammar.meaningId,
        extraInfo: grammar.explanationId,
      };
    }
  }

  // Fallback if item deleted or not found
  return {
    record,
    mainText: record.id,
    subText: `${record.itemType.toUpperCase()} - ${record.level}`,
    meaning: 'Item SRS dalam review',
  };
}

export const SrsReviewSession: React.FC<SrsReviewSessionProps> = ({ onClose }) => {
  const [dueRecords] = useState<SrsItemRecord[]>(() => getDueSrsItems());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => dueRecords.length === 0);
  
  // Tracking results in this session
  const [sessionResults, setSessionResults] = useState<{
    id: string;
    itemType: string;
    mainText: string;
    isSuccess: boolean;
    prevStage: number;
    newStage: number;
    isLeech: boolean;
  }[]>([]);

  const currentRecord = dueRecords[currentIndex];
  const resolvedItem = currentRecord ? resolveSrsItem(currentRecord) : null;
  const progressPercent = dueRecords.length > 0 
    ? Math.round((currentIndex / dueRecords.length) * 100) 
    : 100;

  const handleReveal = () => {
    setIsRevealed(true);
    if (resolvedItem?.furigana || resolvedItem?.mainText) {
      // Audio playback on reveal
      const textToSpeak = resolvedItem.furigana || resolvedItem.mainText;
      speakJapanese(textToSpeak);
    }
  };

  const handleAnswer = (isSuccess: boolean) => {
    if (!currentRecord || !resolvedItem) return;

    if (isSuccess) {
      playSuccessSound();
    } else {
      playErrorSound();
    }

    const updated = recordSrsReviewResult(currentRecord.id, isSuccess);
    const newStage = updated ? updated.stage : currentRecord.stage;
    const isLeech = updated ? updated.failCount >= 4 : false;

    setSessionResults(prev => [
      ...prev,
      {
        id: currentRecord.id,
        itemType: currentRecord.itemType,
        mainText: resolvedItem.mainText,
        isSuccess,
        prevStage: currentRecord.stage,
        newStage,
        isLeech,
      },
    ]);

    setIsRevealed(false);

    if (currentIndex + 1 < dueRecords.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      if (isSuccess) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const stats = getSrsOverviewStats();
  const userProgress = getUserProgress();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                SRS Spaced-Repetition Review
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Adaptive WaniKani
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isCompleted 
                  ? 'Sesi Ulasan Selesai' 
                  : `Kartu ${currentIndex + 1} dari ${dueRecords.length} yang jatuh tempo`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Daily Streak Indicator */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-amber-400"
              title="Daily Streak Belajar Harian"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{userProgress.dailyStreak} Hari</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && dueRecords.length > 0 && (
          <div className="w-full bg-slate-800 h-1.5">
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-1.5 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {isCompleted ? (
            /* Results & Overview View */
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Semua Review Hari Ini Tuntas!
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Kartu memori Anda telah diperbarui ke jadwal pengulangan optimal berikutnya.
                </p>
              </div>

              {/* Session Summary Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-xl font-black text-white">{sessionResults.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Ditinjau Hari Ini</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-xl font-black text-emerald-400">
                    {sessionResults.filter(r => r.isSuccess).length}
                  </div>
                  <div className="text-[11px] text-emerald-300/80 font-medium">Naik Stage</div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-xl font-black text-rose-400">
                    {sessionResults.filter(r => !r.isSuccess).length}
                  </div>
                  <div className="text-[11px] text-rose-300/80 font-medium">Turun / Remedial</div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-xl font-black text-amber-400">
                    {userProgress.dailyStreak}🔥
                  </div>
                  <div className="text-[11px] text-amber-300/80 font-medium">Daily Streak</div>
                </div>
              </div>

              {/* Overall SRS Mastery Distribution */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-left max-w-lg mx-auto">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Distribusi Tahapan Memori Jangka Panjang
                  </span>
                  <span className="text-slate-400">{stats.totalLearned} Kartu Total</span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="font-extrabold text-amber-400">{stats.apprentice}</div>
                    <div className="text-[10px] text-slate-400">Apprentice</div>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="font-extrabold text-blue-400">{stats.guru}</div>
                    <div className="text-[10px] text-slate-400">Guru</div>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="font-extrabold text-purple-400">{stats.master}</div>
                    <div className="text-[10px] text-slate-400">Master</div>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="font-extrabold text-indigo-400">{stats.enlightened}</div>
                    <div className="text-[10px] text-slate-400">Enlightened</div>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="font-extrabold text-rose-400">{stats.burned}</div>
                    <div className="text-[10px] text-slate-400">Burned 🔥</div>
                  </div>
                </div>

                {stats.leechCount > 0 && (
                  <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      Ada <strong>{stats.leechCount} materi Leech</strong> (gagal ≥4 kali). Sistem memprioritaskan kartu ini untuk remediation cepat!
                    </span>
                  </div>
                )}
              </div>

              {/* Session Detailed List */}
              {sessionResults.length > 0 && (
                <div className="max-w-lg mx-auto text-left">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Rincian Hasil Sesi Ini
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {sessionResults.map((res, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {res.isSuccess ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span className="font-bold text-white font-jp text-sm">{res.mainText}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                            {res.itemType}
                          </span>
                          {res.isLeech && (
                            <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Leech
                            </span>
                          )}
                        </div>

                        <div className="text-right text-[11px] font-medium text-slate-400">
                          Stage {res.prevStage} → <span className={res.isSuccess ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>Stage {res.newStage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:opacity-90 transition cursor-pointer"
                >
                  Tutup & Kembali Belajar
                </button>
              </div>
            </div>
          ) : resolvedItem ? (
            /* Active SRS Card Flashcard View */
            <div className="space-y-6">
              {/* Item Metadata Tags */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {resolvedItem.record.level} • {resolvedItem.record.itemType}
                  </span>
                  {resolvedItem.record.failCount >= 4 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      Leech ({resolvedItem.record.failCount}x salah)
                    </span>
                  )}
                </div>

                <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${STAGE_COLORS[resolvedItem.record.stage]}`}>
                  Tahap: {STAGE_NAMES[resolvedItem.record.stage]}
                </div>
              </div>

              {/* Main Card Prompt Box */}
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/60 border border-slate-800 text-center relative flex flex-col items-center justify-center min-h-[220px]">
                <div className="text-4xl sm:text-6xl font-black font-jp text-white tracking-wide">
                  {resolvedItem.mainText}
                </div>

                {isRevealed && (
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="text-lg sm:text-xl font-bold text-rose-400 font-jp">
                      {resolvedItem.subText}
                    </div>
                    <div className="text-base sm:text-lg font-medium text-slate-200 mt-2">
                      {resolvedItem.meaning}
                    </div>
                    {resolvedItem.extraInfo && (
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        {resolvedItem.extraInfo}
                      </p>
                    )}
                  </div>
                )}

                {/* Speaker Button */}
                {isRevealed && (
                  <button
                    onClick={() => {
                      const text = resolvedItem.furigana || resolvedItem.mainText;
                      speakJapanese(text);
                    }}
                    className="mt-3 p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                    title="Dengarkan Pengucapan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              {!isRevealed ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleReveal}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Buka Jawaban / Cek Pemahaman</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <div className="text-left">
                      <div>Lupa / Salah</div>
                      <div className="text-[10px] text-rose-400/80 font-normal">
                        Turun stage • Review 4 jam lagi
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAnswer(true)}
                    className="py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div className="text-left">
                      <div>Ingat / Benar</div>
                      <div className="text-[10px] text-emerald-400/80 font-normal">
                        Naik stage (+{SRS_INTERVAL_HOURS[Math.min(7, currentRecord.stage + 1) as 1]} jam)
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
