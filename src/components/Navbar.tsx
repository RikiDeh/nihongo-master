import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Award, 
  Compass, 
  Trophy, 
  Swords, 
  Settings, 
  Flame, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SettingsModal } from './Settings/SettingsModal';
import { useShowRomaji } from '../hooks/useShowRomaji';
import { getDueSrsItems } from '../utils/srsEngine';
import { getUserProgress, subscribeToStorage } from '../utils/storage';

export type ActiveModule = 'kana' | 'kanji' | 'vocab' | 'grammar' | 'dojo' | 'quiz' | 'roadmap' | 'design-lab';

interface SidebarNavProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenSrsReview?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenSrsReview,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRomaji, , toggleShowRomaji] = useShowRomaji();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nihongo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nihongo_theme', 'light');
    }
  };

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

  const navItems: { id: ActiveModule; label: string; jp: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'roadmap', label: 'Peta Belajar', jp: '道程', icon: <Compass className="w-4 h-4" />, badge: 'Utama' },
    { id: 'kana', label: 'Kana Matrix', jp: '仮名', icon: <span className="font-jp text-sm font-bold">あ</span>, badge: '50音' },
    { id: 'kanji', label: 'Joyō Kanji', jp: '漢字', icon: <BookOpen className="w-4 h-4" />, badge: '2.167' },
    { id: 'vocab', label: 'Kosakata', jp: '語彙', icon: <Layers className="w-4 h-4" />, badge: '9.177' },
    { id: 'grammar', label: 'Tata Bahasa', jp: '文法', icon: <Award className="w-4 h-4" /> },
    { id: 'dojo', label: 'Dojo Konjugasi', jp: '活用', icon: <Swords className="w-4 h-4" /> },
    { id: 'quiz', label: 'Pusat Ujian JLPT', jp: '試験', icon: <Trophy className="w-4 h-4" />, badge: 'N5→N1' },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (MD AND UP) */}
      <aside 
        className={`hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 bg-[#faf8f5] dark:bg-[#18181b] border-r border-[#e7e5e4] dark:border-[#27272a] transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className={`p-4 flex items-center border-b border-[#e7e5e4] dark:border-[#27272a] ${
            isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'
          }`}>
            <div 
              onClick={() => onSelectModule('roadmap')}
              className="flex items-center gap-3 cursor-pointer group select-none overflow-hidden"
              title="NihongoMaster — Kembali ke Beranda Peta Belajar"
            >
              {/* Hanko Stamp */}
              <div className="w-10 h-10 rounded-md bg-[#c84b31] dark:bg-[#e05d44] border border-[#a63a23] dark:border-[#c84b31] flex items-center justify-center text-white font-jp font-black text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                日
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <div className="font-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
                    日本語マスター
                  </div>
                  <div className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
                    NihongoMaster 0→N1
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed(c => !c)}
              className="p-1.5 rounded-md hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] text-[#78716c] dark:text-[#a1a1aa] transition cursor-pointer"
              title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Habit / SRS Banner */}
          {!isCollapsed ? (
            <div className="p-3 mx-3 mt-3 rounded-lg bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#78716c] dark:text-[#a1a1aa]">
                  HABIT BELAJAR
                </span>
                <span className="font-mono font-bold text-[#c84b31] dark:text-[#e05d44]">
                  🔥 {dailyStreak} Hari
                </span>
              </div>
              {onOpenSrsReview && (
                <button
                  type="button"
                  onClick={onOpenSrsReview}
                  className={`w-full py-1.5 px-2.5 rounded-md text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                    dueCount > 0
                      ? 'bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] border border-[#c84b31]/30 font-bold'
                      : 'bg-[#2e7d32]/10 text-[#2e7d32] dark:text-[#4ade80] border border-[#2e7d32]/25'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>SRS Review</span>
                  </span>
                  <span className="font-mono">{dueCount > 0 ? `${dueCount} Butir` : 'Tuntas'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-2 flex justify-center mt-2">
              {onOpenSrsReview && (
                <button
                  type="button"
                  onClick={onOpenSrsReview}
                  className={`p-2 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                    dueCount > 0
                      ? 'bg-[#c84b31]/10 border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44]'
                      : 'bg-[#2e7d32]/10 border-[#2e7d32]/25 text-[#2e7d32] dark:text-[#4ade80]'
                  }`}
                  title={`SRS Review: ${dueCount} materi jatuh tempo`}
                >
                  <Flame className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map(item => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectModule(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full p-2.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46] font-bold'
                      : 'text-[#78716c] dark:text-[#a1a1aa] hover:bg-[#f4f0e8]/80 dark:hover:bg-[#1f1f23]/80 hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                          {item.badge}
                        </span>
                      )}
                      <span className="font-jp text-xs opacity-60">{item.jp}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className="p-3 border-t border-[#e7e5e4] dark:border-[#27272a] space-y-2">
          {/* Romaji toggle */}
          {!isCollapsed ? (
            <button
              type="button"
              onClick={toggleShowRomaji}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                showRomaji
                  ? 'bg-[#2e7d32]/10 border-[#2e7d32]/30 text-[#2e7d32] dark:text-[#4ade80]'
                  : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
              }`}
            >
              <span className="font-sans">Bantuan Romaji</span>
              <span className="font-mono text-[10px] font-bold">[{showRomaji ? 'ON' : 'OFF'}]</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleShowRomaji}
              className="w-full p-2 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-center text-xs font-mono font-bold"
              title={`Romaji ${showRomaji ? 'Aktif' : 'Mati'}`}
            >
              {showRomaji ? 'Aa' : 'あ'}
            </button>
          )}

          {/* Theme & Settings Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex-1 py-2 px-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-medium text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer flex items-center justify-center gap-1.5"
              title={isDark ? 'Ganti ke Mode Terang (Kertas Washi)' : 'Ganti ke Mode Gelap (Tinta Sumi)'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
              {!isCollapsed && <span>{isDark ? 'Washi' : 'Sumi'}</span>}
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer shrink-0"
              title="Pengaturan & Backup Data"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR & BOTTOM DOCK (MOBILE PHONES) */}
      <div className="md:hidden">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-30 bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#27272a] px-4 py-2.5 flex items-center justify-between">
          <div 
            onClick={() => onSelectModule('roadmap')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-7 h-7 rounded bg-[#c84b31] dark:bg-[#e05d44] flex items-center justify-center text-white font-jp font-bold text-sm">
              日
            </div>
            <span className="font-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
              日本語マスター
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSrsReview && (
              <button
                type="button"
                onClick={onOpenSrsReview}
                className="px-2 py-1 rounded text-xs font-mono font-bold border border-[#c84b31]/30 bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44]"
              >
                🔥 {dueCount}
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c]"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c]"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Mobile Floating Bottom Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border-t border-[#e7e5e4] dark:border-[#27272a] px-2 py-1.5 flex items-center justify-around text-[10px]">
          {navItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center py-1 px-1 transition ${
                activeModule === item.id 
                  ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' 
                  : 'text-[#78716c] dark:text-[#a1a1aa]'
              }`}
            >
              <span className="mb-0.5">{item.icon}</span>
              <span>{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};
export { SidebarNav as Navbar };
