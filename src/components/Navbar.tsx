import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, Award, Compass, Trophy, Swords, Settings, Flame, CheckCircle2 } from 'lucide-react';
import { SettingsModal } from './Settings/SettingsModal';
import { useShowRomaji } from '../hooks/useShowRomaji';
import { KANJI_DATA } from '../data/kanjiData';
import { VOCAB_DATA } from '../data/vocabData';
import { getDueSrsItems } from '../utils/srsEngine';
import { getUserProgress, subscribeToStorage } from '../utils/storage';

export type ActiveModule = 'kana' | 'kanji' | 'vocab' | 'grammar' | 'dojo' | 'quiz' | 'roadmap' | 'design-lab';

interface NavbarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenSrsReview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeModule, onSelectModule, onOpenSrsReview }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRomaji, , toggleShowRomaji] = useShowRomaji();

  const [dueCount, setDueCount] = useState<number>(() => getDueSrsItems().length);
  const [dailyStreak, setDailyStreak] = useState<number>(() => getUserProgress().dailyStreak || 0);

  useEffect(() => {
    const updateStats = () => {
      setDueCount(getDueSrsItems().length);
      setDailyStreak(getUserProgress().dailyStreak || 0);
    };

    const unsubscribe = subscribeToStorage(updateStats);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 dark:bg-[#18181b]/90 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#27272a] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand — Traditional Hanko Seal Stamp */}
          <div 
            onClick={() => onSelectModule('kana')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Hanko Square Stamp */}
            <div className="w-9 h-9 rounded bg-[#c84b31] dark:bg-[#e05d44] border border-[#a63a23] dark:border-[#c84b31] flex items-center justify-center text-white font-serif-jp font-black text-xl shadow-sm transition-transform duration-150 group-hover:scale-105 select-none">
              日
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-jp font-bold text-base tracking-tight text-[#1c1917] dark:text-[#f4f4f5]">
                  日本語マスター
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-[#c84b31]/30 dark:border-[#e05d44]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 dark:bg-[#e05d44]/10">
                  [0→N1]
                </span>
              </div>
              <p className="text-[11px] font-sans text-[#78716c] dark:text-[#a1a1aa] -mt-0.5">
                Studi Mandiri Bahasa Jepang
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) — Zen Editorial Clean Segment */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 p-1 rounded-lg border border-[#e7e5e4] dark:border-[#27272a]">
            <button
              onClick={() => onSelectModule('kana')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'kana'
                  ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-sm font-semibold'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              <span className="font-serif-jp text-sm leading-none font-bold">仮</span>
              <span>Kana</span>
            </button>

            <button
              onClick={() => onSelectModule('kanji')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'kanji'
                  ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-sm font-semibold'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kanji</span>
            </button>

            <button
              onClick={() => onSelectModule('vocab')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'vocab'
                  ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-sm font-semibold'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kosakata</span>
            </button>

            <button
              onClick={() => onSelectModule('grammar')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'grammar'
                  ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-sm font-semibold'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tata Bahasa</span>
            </button>

            <button
              onClick={() => onSelectModule('dojo')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'dojo'
                  ? 'bg-white dark:bg-[#27272a] text-[#c84b31] dark:text-[#e05d44] shadow-sm font-bold border border-[#c84b31]/20 dark:border-[#e05d44]/30'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#c84b31] dark:hover:text-[#e05d44]'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Dojo Konjugasi</span>
            </button>

            <button
              onClick={() => onSelectModule('quiz')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'quiz'
                  ? 'bg-white dark:bg-[#27272a] text-[#1e3a8a] dark:text-[#3b82f6] shadow-sm font-bold border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1e3a8a] dark:hover:text-[#3b82f6]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Pusat Ujian</span>
            </button>

            <button
              onClick={() => onSelectModule('roadmap')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeModule === 'roadmap'
                  ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-sm font-semibold'
                  : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Peta Jalan</span>
            </button>
          </nav>

          {/* Right Action Icons — Clean Monoline & Hanko Badges */}
          <div className="flex items-center gap-2">
            {/* Live Corpus Count Badge */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#78716c] dark:text-[#a1a1aa] font-mono select-none"
              title={`Total Basis Data: ${KANJI_DATA.length} Kanji + ${VOCAB_DATA.length} Kosakata aktif`}
            >
              <span className="font-serif-jp text-xs text-[#1c1917] dark:text-[#f4f4f5]">書</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                {(KANJI_DATA.length + VOCAB_DATA.length).toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] font-sans hidden 2xl:inline">Materi</span>
            </div>

            {/* Global Romaji Toggle Switch */}
            <button
              type="button"
              onClick={toggleShowRomaji}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition cursor-pointer select-none ${
                showRomaji
                  ? 'bg-[#2e7d32]/10 border-[#2e7d32]/30 text-[#2e7d32] dark:text-[#4ade80]'
                  : 'bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
              title={showRomaji ? 'Romaji Aktif. Klik untuk mematikan bantuan Romaji' : 'Romaji Mati. Klik untuk menyalakan bantuan Romaji'}
            >
              <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">
                {showRomaji ? 'Aa' : 'あ'}
              </span>
              <span className="hidden sm:inline font-sans">Romaji</span>
              <span className="font-mono text-[10px] font-bold">
                [{showRomaji ? 'ON' : 'OFF'}]
              </span>
            </button>

            {/* SRS Review Button — Calm Editorial State */}
            {onOpenSrsReview && (
              <button
                type="button"
                onClick={onOpenSrsReview}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition cursor-pointer select-none ${
                  dueCount > 0
                    ? 'bg-[#c84b31]/10 border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] hover:bg-[#c84b31]/15 font-semibold'
                    : 'bg-[#2e7d32]/10 border-[#2e7d32]/25 text-[#2e7d32] dark:text-[#4ade80] hover:bg-[#2e7d32]/15'
                }`}
                title="Buka Sesi SRS Review (Spaced Repetition System)"
              >
                {dueCount > 0 ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-[#c84b31] dark:text-[#e05d44]" />
                    <span className="font-mono font-bold">{dueCount}</span>
                    <span className="font-serif-jp hidden sm:inline">[復習]</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" />
                    <span className="font-sans hidden sm:inline">Tuntas</span>
                  </>
                )}
                {dailyStreak > 0 && (
                  <span className="ml-1 pl-1.5 border-l border-[#e7e5e4] dark:border-[#27272a] text-[11px] font-mono font-bold text-[#c84b31] dark:text-[#e05d44] hidden md:inline">
                    {dailyStreak}d
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-md bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              title="Pengaturan & Backup Data (JSON)"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar — Clean Zen Line */}
        <div className="xl:hidden flex items-center justify-around border-t border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5]/95 dark:bg-[#18181b]/95 px-2 py-2 text-[10px]">
          <button
            onClick={() => onSelectModule('kana')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'kana' ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <span className="font-serif-jp text-sm leading-none font-bold">仮</span>
            <span className="mt-0.5">Kana</span>
          </button>
          <button
            onClick={() => onSelectModule('kanji')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'kanji' ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <BookOpen className="w-3.5 h-3.5 mb-0.5" />
            <span>Kanji</span>
          </button>
          <button
            onClick={() => onSelectModule('vocab')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'vocab' ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <Layers className="w-3.5 h-3.5 mb-0.5" />
            <span>Vocab</span>
          </button>
          <button
            onClick={() => onSelectModule('grammar')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'grammar' ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <Award className="w-3.5 h-3.5 mb-0.5" />
            <span>Grammar</span>
          </button>
          <button
            onClick={() => onSelectModule('dojo')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'dojo' ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <Swords className="w-3.5 h-3.5 mb-0.5" />
            <span>Dojo</span>
          </button>
          <button
            onClick={() => onSelectModule('quiz')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'quiz' ? 'text-[#1e3a8a] dark:text-[#3b82f6] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <Trophy className="w-3.5 h-3.5 mb-0.5" />
            <span>Ujian</span>
          </button>
          <button
            onClick={() => onSelectModule('roadmap')}
            className={`flex flex-col items-center py-1 px-1 rounded-md transition ${activeModule === 'roadmap' ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
          >
            <Compass className="w-3.5 h-3.5 mb-0.5" />
            <span>0→N1</span>
          </button>
          {onOpenSrsReview && (
            <button
              onClick={onOpenSrsReview}
              className={`flex flex-col items-center py-1 px-1 rounded-md transition ${dueCount > 0 ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' : 'text-[#78716c] dark:text-[#a1a1aa]'}`}
            >
              <Flame className="w-3.5 h-3.5 mb-0.5" />
              <span className="font-mono">{dueCount > 0 ? dueCount : 'SRS'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Settings & Backup Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};
