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
  ChevronRight,
  HelpCircle
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
  onOpenTour?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenSrsReview,
  onOpenTour,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRomaji, , toggleShowRomaji] = useShowRomaji();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuType, setMobileMenuType] = useState<'latihan' | 'pustaka' | null>(null);

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
                  id="tour-desktop-srs"
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
                  id="tour-desktop-srs"
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
                  id={`tour-nav-${item.id}`}
                  data-tour-target={item.id}
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
              id="tour-desktop-romaji"
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
              id="tour-desktop-romaji"
              type="button"
              onClick={toggleShowRomaji}
              className="w-full p-2 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-center text-xs font-mono font-bold"
              title={`Romaji ${showRomaji ? 'Aktif' : 'Mati'}`}
            >
              {showRomaji ? 'Aa' : 'あ'}
            </button>
          )}

          {/* Theme, Tour & Settings Buttons */}
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

            {onOpenTour && (
              <button
                type="button"
                onClick={onOpenTour}
                className="p-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer shrink-0"
                title="Panduan & Tur Pemula"
                aria-label="Buka Panduan Pemula"
              >
                <HelpCircle className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44]" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer shrink-0"
              title="Pengaturan & Backup Data"
              aria-label="Pengaturan"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR & BOTTOM DOCK (MOBILE PHONES) */}
      <div className="md:hidden">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-30 bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#27272a] px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <div 
            onClick={() => onSelectModule('roadmap')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded bg-[#c84b31] dark:bg-[#e05d44] flex items-center justify-center text-white font-jp font-bold text-sm shadow-xs">
              日
            </div>
            <span className="font-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
              日本語マスター
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Romaji Toggle on Mobile Header */}
            <button
              id="tour-header-romaji"
              type="button"
              onClick={toggleShowRomaji}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${
                showRomaji
                  ? 'bg-[#2e7d32]/10 border-[#2e7d32]/30 text-[#2e7d32] dark:text-[#4ade80]'
                  : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
              }`}
              title={`Bantuan Romaji: ${showRomaji ? 'Aktif' : 'Mati'}`}
              aria-label={`Bantuan Romaji ${showRomaji ? 'Aktif' : 'Mati'}`}
            >
              {showRomaji ? 'Aa' : 'あ'}
            </button>

            {onOpenSrsReview && (
              <button
                id="tour-header-srs"
                type="button"
                onClick={onOpenSrsReview}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold border border-[#c84b31]/30 bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44]"
                title="Sesi Review SRS Harian"
              >
                🔥 {dueCount}
              </button>
            )}

            {onOpenTour && (
              <button
                type="button"
                onClick={onOpenTour}
                className="p-1.5 sm:p-2 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-[#c84b31] dark:text-[#e05d44] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                title="Panduan Pemula"
                aria-label="Buka Panduan Pemula"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              aria-label={isDark ? 'Ganti ke tema terang Washi' : 'Ganti ke tema gelap Sumi'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 sm:p-2 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              aria-label="Buka Pengaturan"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Submenu Sheet (Modal/Drawer for Latihan & Pustaka) */}
        {mobileMenuType && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
              onClick={() => setMobileMenuType(null)}
            />
            <div className="relative bg-[#faf8f5] dark:bg-[#18181b] border-t border-[#e7e5e4] dark:border-[#27272a] rounded-t-2xl p-4 shadow-2xl z-50 mb-16 animate-slideUp">
              <div className="w-12 h-1 bg-[#d6d3d1] dark:bg-[#3f3f46] rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa]">
                  {mobileMenuType === 'latihan' ? '⚔️ Pilih Mode Latihan' : '📚 Pilih Modul Pustaka'}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuType(null)}
                  className="text-xs font-mono px-2 py-0.5 rounded text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]"
                >
                  Tutup
                </button>
              </div>

              {mobileMenuType === 'latihan' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectModule('quiz');
                      setMobileMenuType(null);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                      activeModule === 'quiz'
                        ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Trophy className="w-5 h-5 text-[#c84b31] dark:text-[#e05d44]" />
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">N5→N1</span>
                    </div>
                    <span className="font-bold text-sm">Pusat Ujian JLPT</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-normal">Simulasi mondai & kuis adaptif</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectModule('dojo');
                      setMobileMenuType(null);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                      activeModule === 'dojo'
                        ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Swords className="w-5 h-5 text-[#c84b31] dark:text-[#e05d44]" />
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">活用</span>
                    </div>
                    <span className="font-bold text-sm">Dojo Konjugasi</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-normal">Drill bentuk Te, Masu, Nai dll</span>
                  </button>
                </div>
              )}

              {mobileMenuType === 'pustaka' && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectModule('kanji');
                      setMobileMenuType(null);
                    }}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      activeModule === 'kanji'
                        ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-[#c84b31] dark:text-[#e05d44]" />
                    <span className="font-bold text-xs">Joyō Kanji</span>
                    <span className="font-mono text-[10px] text-[#78716c] dark:text-[#a1a1aa]">2.167 Kanji</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectModule('vocab');
                      setMobileMenuType(null);
                    }}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      activeModule === 'vocab'
                        ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <Layers className="w-5 h-5 text-[#c84b31] dark:text-[#e05d44]" />
                    <span className="font-bold text-xs">Kosakata</span>
                    <span className="font-mono text-[10px] text-[#78716c] dark:text-[#a1a1aa]">9.177 Kata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectModule('grammar');
                      setMobileMenuType(null);
                    }}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      activeModule === 'grammar'
                        ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                    }`}
                  >
                    <Award className="w-5 h-5 text-[#c84b31] dark:text-[#e05d44]" />
                    <span className="font-bold text-xs">Tata Bahasa</span>
                    <span className="font-mono text-[10px] text-[#78716c] dark:text-[#a1a1aa]">N5 & N4</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Floating Bottom Bar - 4 Ergonomic Primary Pillars (With Safe Area padding) */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border-t border-[#e7e5e4] dark:border-[#27272a] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around text-xs shadow-lg">
          {/* Tab 1: Belajar (Roadmap) */}
          <button
            id="tour-dock-roadmap"
            type="button"
            onClick={() => {
              setMobileMenuType(null);
              onSelectModule('roadmap');
            }}
            className={`flex-1 flex flex-col items-center py-1 transition cursor-pointer ${
              activeModule === 'roadmap' 
                ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' 
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917]'
            }`}
          >
            <Compass className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-sans">Belajar</span>
          </button>

          {/* Tab 2: Kana (Fondasi Aksara) */}
          <button
            id="tour-dock-kana"
            type="button"
            onClick={() => {
              setMobileMenuType(null);
              onSelectModule('kana');
            }}
            className={`flex-1 flex flex-col items-center py-1 transition cursor-pointer ${
              activeModule === 'kana' 
                ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' 
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917]'
            }`}
          >
            <span className="font-jp text-base font-bold leading-5 mb-1">あ</span>
            <span className="text-[11px] font-sans">Kana</span>
          </button>

          {/* Tab 3: Latihan (Ujian JLPT & Dojo Konjugasi) */}
          <button
            id="tour-dock-latihan"
            type="button"
            onClick={() => setMobileMenuType(prev => prev === 'latihan' ? null : 'latihan')}
            className={`flex-1 flex flex-col items-center py-1 transition cursor-pointer ${
              activeModule === 'quiz' || activeModule === 'dojo' || mobileMenuType === 'latihan'
                ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' 
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917]'
            }`}
          >
            <Swords className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-sans flex items-center gap-0.5">
              <span>{activeModule === 'dojo' ? 'Dojo' : 'Latihan'}</span>
              <span className="text-[9px] opacity-70">▾</span>
            </span>
          </button>

          {/* Tab 4: Pustaka (Kamus Kanji, Kosakata, Tata Bahasa) */}
          <button
            id="tour-dock-pustaka"
            type="button"
            onClick={() => setMobileMenuType(prev => prev === 'pustaka' ? null : 'pustaka')}
            className={`flex-1 flex flex-col items-center py-1 transition cursor-pointer ${
              activeModule === 'kanji' || activeModule === 'vocab' || activeModule === 'grammar' || mobileMenuType === 'pustaka'
                ? 'text-[#c84b31] dark:text-[#e05d44] font-bold' 
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917]'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-sans flex items-center gap-0.5">
              <span>{activeModule === 'kanji' ? 'Kanji' : activeModule === 'vocab' ? 'Kosakata' : activeModule === 'grammar' ? 'Tata Bahasa' : 'Pustaka'}</span>
              <span className="text-[9px] opacity-70">▾</span>
            </span>
          </button>
        </nav>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onOpenTour={onOpenTour}
      />
    </>
  );
};
export { SidebarNav as Navbar };
