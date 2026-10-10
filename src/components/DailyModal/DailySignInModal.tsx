import React, { useState } from 'react';
import { Flame, Sparkles, Check, X, Calendar } from 'lucide-react';
import { claimDailySignInReward } from '../../utils/storage';

interface DailySignInModalProps {
  isOpen: boolean;
  currentStreak: number;
  onClose: () => void;
}

const JAPANESE_PROVERBS = [
  { jp: '継続は力なり', romaji: 'Keizoku wa chikara nari', id: 'Konsistensi adalah kunci kekuatan.' },
  { jp: '石の上にも三年', romaji: 'Ishi no ue ni mo sannen', id: 'Ketekunan dan kesabaran selalu membuahkan hasil.' },
  { jp: '千里の道も一歩から', romaji: 'Senri no michi mo ippo kara', id: 'Perjalanan ribuan mil selalu dimulai dari satu langkah.' },
  { jp: '七転び八起き', romaji: 'Nana korobi ya oki', id: 'Jatuh tujuh kali, bangkit delapan kali.' },
  { jp: '一期一会', romaji: 'Ichigo ichie', id: 'Hargai setiap kesempatan belajar hari ini.' },
];

export const DailySignInModal: React.FC<DailySignInModalProps> = ({
  isOpen,
  currentStreak,
  onClose,
}) => {
  const [hasClaimed, setHasClaimed] = useState(false);
  const [streakResult, setStreakResult] = useState<number>(currentStreak);
  const [dayIndex] = useState(() => new Date().getDate() % JAPANESE_PROVERBS.length);
  const [currentDayOfWeek] = useState(() => (new Date().getDay() + 6) % 7); // 0 = Senin, 6 = Minggu

  if (!isOpen) return null;

  const proverb = JAPANESE_PROVERBS[dayIndex];

  const handleClaim = () => {
    const res = claimDailySignInReward();
    setStreakResult(res.streak);
    setHasClaimed(true);
  };

  const handleFinish = () => {
    onClose();
  };

  const daysName = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#faf8f5] dark:bg-[#18181b] border-2 border-[#c84b31]/40 dark:border-[#e05d44]/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c84b31]/15 dark:bg-[#e05d44]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Japanese Hanko Badge Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 rounded bg-[#c84b31] dark:bg-[#e05d44] border border-[#a63a23] flex items-center justify-center text-white font-jp font-bold text-sm shadow-xs">
            皆勤
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-[#78716c] dark:text-[#a1a1aa] uppercase">
            HANKO SIGN-IN HARIAN
          </span>
        </div>

        {/* Fiery Streak Flame Illustration */}
        <div className="my-5 flex flex-col items-center justify-center relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-t from-[#c84b31]/20 to-amber-500/10 dark:from-[#e05d44]/30 dark:to-amber-500/20 flex items-center justify-center border border-[#c84b31]/30 relative animate-pulse">
            <Flame className="w-14 h-14 text-[#c84b31] dark:text-[#e05d44] fill-current drop-shadow-md" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
          </div>

          {/* Big Number of Days */}
          <div className="mt-3">
            <div className="text-4xl font-mono font-black text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
              {streakResult} <span className="text-xl font-bold text-[#c84b31] dark:text-[#e05d44]">HARI</span>
            </div>
            <div className="text-xs font-medium text-[#78716c] dark:text-[#a1a1aa]">
              {streakResult > 1 ? 'Api belajar membara berturut-turut!' : 'Langkah awal perjalanan belajarmu!'}
            </div>
          </div>
        </div>

        {/* 7-Day Mini Attendance Track */}
        <div className="p-3 my-4 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2 px-1">
            <span className="flex items-center gap-1 font-semibold">
              <Calendar className="w-3 h-3 text-[#c84b31] dark:text-[#e05d44]" />
              <span>Minggu Ini</span>
            </span>
            <span>{hasClaimed ? 'Hari Ini Terstempel ✓' : 'Siap Ditutup'}</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {daysName.map((day, idx) => {
              const isPast = idx < currentDayOfWeek;
              const isToday = idx === currentDayOfWeek;
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono text-[#78716c] dark:text-[#a1a1aa]">{day}</span>
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition ${
                      isToday
                        ? hasClaimed
                          ? 'bg-[#c84b31] text-white shadow-xs'
                          : 'bg-[#c84b31]/20 border-2 border-[#c84b31] text-[#c84b31] animate-pulse'
                        : isPast
                        ? 'bg-[#e7e5e4] dark:bg-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
                        : 'bg-[#faf8f5] dark:bg-[#18181b] border border-dashed border-[#e7e5e4] dark:border-[#27272a] text-[#a8a29e]'
                    }`}
                  >
                    {isToday && hasClaimed ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : isPast ? (
                      <Check className="w-3 h-3 text-[#78716c]" />
                    ) : isToday ? (
                      '🔥'
                    ) : (
                      '·'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Japanese Proverb of the Day */}
        <div className="p-3 mb-5 rounded-lg bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/60 border border-[#e7e5e4] dark:border-[#27272a] text-xs">
          <div className="font-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
            {proverb.jp}
          </div>
          <div className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
            {proverb.romaji}
          </div>
          <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] mt-1 italic">
            "{proverb.id}"
          </div>
        </div>

        {/* Action Button */}
        {!hasClaimed ? (
          <button
            type="button"
            onClick={handleClaim}
            className="w-full py-3 px-4 rounded-xl bg-[#c84b31] hover:bg-[#b03d25] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:translate-y-px"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Klaim Api Belajar Hari Ini</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-3 px-4 rounded-xl bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:translate-y-px"
          >
            <Check className="w-4 h-4" />
            <span>Masuk ke Arena Belajar</span>
          </button>
        )}
      </div>
    </div>
  );
};
