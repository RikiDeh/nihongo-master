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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between bg-white dark:bg-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c84b31] flex items-center justify-center text-white shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] flex items-center gap-2">
                SRS Spaced-Repetition Review
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                  Adaptive WaniKani
                </span>
              </h2>
              <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] font-mono">
                {isCompleted 
                  ? 'Sesi Ulasan Selesai' 
                  : `Kartu ${currentIndex + 1} dari ${dueRecords.length} yang jatuh tempo`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Daily Streak Indicator */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-mono font-bold text-[#c84b31]"
              title="Daily Streak Belajar Harian"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{userProgress.dailyStreak} Hari</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && dueRecords.length > 0 && (
          <div className="w-full bg-[#e7e5e4] dark:bg-[#27272a] h-1">
            <div 
              className="bg-[#c84b31] h-1 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {isCompleted ? (
            /* Results & Overview View */
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex p-4 rounded-xl bg-[#2e7d32]/10 border border-[#2e7d32]/20 text-[#2e7d32] mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5]">
                  Semua Review Hari Ini Tuntas!
                </h3>
                <p className="text-sm text-[#78716c] dark:text-[#a1a1aa] mt-1 font-sans">
                  Kartu memori Anda telah diperbarui ke jadwal pengulangan optimal berikutnya.
                </p>
              </div>

              {/* Session Summary Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                  <div className="text-xl font-bold font-mono text-[#1c1917] dark:text-[#f4f4f5]">{sessionResults.length}</div>
                  <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-medium font-sans">Ditinjau Hari Ini</div>
                </div>

                <div className="p-3 rounded-lg bg-[#2e7d32]/5 border border-[#2e7d32]/20">
                  <div className="text-xl font-bold font-mono text-[#2e7d32]">
                    {sessionResults.filter(r => r.isSuccess).length}
                  </div>
                  <div className="text-[11px] text-[#2e7d32] font-medium font-sans">Naik Stage</div>
                </div>

                <div className="p-3 rounded-lg bg-[#c84b31]/5 border border-[#c84b31]/20">
                  <div className="text-xl font-bold font-mono text-[#c84b31]">
                    {sessionResults.filter(r => !r.isSuccess).length}
                  </div>
                  <div className="text-[11px] text-[#c84b31] font-medium font-sans">Turun / Remedial</div>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                  <div className="text-xl font-bold font-mono text-[#c84b31]">
                    {userProgress.dailyStreak} d
                  </div>
                  <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-medium font-sans">Daily Streak</div>
                </div>
              </div>

              {/* Overall SRS Mastery Distribution */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-left max-w-lg mx-auto">
                <div className="flex items-center justify-between text-xs font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-3">
                  <span className="flex items-center gap-1.5 font-sans">
                    <Award className="w-4 h-4 text-[#c84b31]" />
                    Distribusi Tahapan Memori Jangka Panjang
                  </span>
                  <span className="text-[#78716c] dark:text-[#a1a1aa] font-mono">{stats.totalLearned} Total</span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold font-mono text-[#1c1917] dark:text-[#f4f4f5]">{stats.apprentice}</div>
                    <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa]">Apprentice</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold font-mono text-[#1e3a8a] dark:text-[#60a5fa]">{stats.guru}</div>
                    <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa]">Guru</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold font-mono text-[#7c3aed]">{stats.master}</div>
                    <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa]">Master</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold font-mono text-[#0284c7]">{stats.enlightened}</div>
                    <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa]">Enlightened</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold font-mono text-[#c84b31]">{stats.burned}</div>
                    <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa]">Burned</div>
                  </div>
                </div>

                {stats.leechCount > 0 && (
                  <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-[#c84b31]/5 border border-[#c84b31]/20 text-[#c84b31] text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Ada <strong>{stats.leechCount} materi Leech</strong> (gagal ≥4 kali). Sistem memprioritaskan kartu ini untuk remediation cepat.
                    </span>
                  </div>
                )}
              </div>

              {/* Session Detailed List */}
              {sessionResults.length > 0 && (
                <div className="max-w-lg mx-auto text-left">
                  <h4 className="text-xs font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider mb-2">
                    Rincian Hasil Sesi Ini
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {sessionResults.map((res, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {res.isSuccess ? (
                            <TrendingUp className="w-4 h-4 text-[#2e7d32] shrink-0" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-[#c84b31] shrink-0" />
                          )}
                          <span className="font-bold font-jp text-sm text-[#1c1917] dark:text-[#f4f4f5]">{res.mainText}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] uppercase font-mono">
                            {res.itemType}
                          </span>
                          {res.isLeech && (
                            <span className="text-[9px] px-1 rounded bg-[#c84b31]/10 text-[#c84b31] border border-[#c84b31]/20">
                              Leech
                            </span>
                          )}
                        </div>

                        <div className="text-right text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
                          Stage {res.prevStage} → <span className={res.isSuccess ? 'text-[#2e7d32] font-bold' : 'text-[#c84b31] font-bold'}>Stage {res.newStage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white font-bold text-sm shadow-xs transition cursor-pointer"
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
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]">
                    {resolvedItem.record.level} • {resolvedItem.record.itemType}
                  </span>
                  {resolvedItem.record.failCount >= 4 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c84b31]/10 text-[#c84b31] border border-[#c84b31]/20">
                      <AlertTriangle className="w-3 h-3" />
                      Leech ({resolvedItem.record.failCount}x salah)
                    </span>
                  )}
                </div>

                <div className="px-2.5 py-1 rounded text-xs font-mono font-bold border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] dark:text-[#a1a1aa]">
                  Tahap: {STAGE_NAMES[resolvedItem.record.stage]}
                </div>
              </div>

              {/* Main Card Prompt Box */}
              <div className="p-8 sm:p-12 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-center relative flex flex-col items-center justify-center min-h-[220px] shadow-xs">
                <div className="text-4xl sm:text-6xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-wide">
                  {resolvedItem.mainText}
                </div>

                {isRevealed && (
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="text-lg sm:text-xl font-bold text-[#c84b31] font-jp">
                      {resolvedItem.subText}
                    </div>
                    <div className="text-base sm:text-lg font-medium text-[#1c1917] dark:text-[#f4f4f5] mt-2">
                      {resolvedItem.meaning}
                    </div>
                    {resolvedItem.extraInfo && (
                      <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] max-w-md mx-auto mt-3 bg-[#faf8f5] dark:bg-[#18181b] p-3 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] font-jp">
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
                    className="mt-3 p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] border border-[#e7e5e4] dark:border-[#27272a] transition cursor-pointer"
                    title="Dengarkan Pengucapan"
                  >
                    <Volume2 className="w-4 h-4 text-[#2e7d32]" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              {!isRevealed ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleReveal}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] hover:opacity-90 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Buka Jawaban / Cek Pemahaman</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="py-3 px-4 rounded-lg bg-white dark:bg-[#1f1f23] hover:bg-[#c84b31]/5 border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#c84b31] text-[#c84b31] font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <XCircle className="w-5 h-5 text-[#c84b31]" />
                    <div className="text-left">
                      <div>Lupa / Salah</div>
                      <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] font-mono">
                        Turun stage • Review 4 jam lagi
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAnswer(true)}
                    className="py-3 px-4 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <div className="text-left">
                      <div>Ingat / Benar</div>
                      <div className="text-[10px] text-white/80 font-mono">
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
