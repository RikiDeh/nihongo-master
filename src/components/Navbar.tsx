import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, Award, Compass, Trophy, Swords, Settings } from 'lucide-react';
import { SettingsModal } from './Settings/SettingsModal';
import { useShowRomaji } from '../hooks/useShowRomaji';

export type ActiveModule = 'kana' | 'kanji' | 'vocab' | 'grammar' | 'dojo' | 'quiz' | 'roadmap';

interface NavbarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeModule, onSelectModule }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRomaji, , toggleShowRomaji] = useShowRomaji();

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div 
            onClick={() => onSelectModule('kana')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white font-jp font-black text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              日
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">NihongoMaster</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                  0→N1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">Belajar Bahasa Jepang Lengkap</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => onSelectModule('kana')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'kana'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kana</span>
            </button>

            <button
              onClick={() => onSelectModule('kanji')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'kanji'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kanji</span>
            </button>

            <button
              onClick={() => onSelectModule('vocab')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'vocab'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kosakata</span>
            </button>

            <button
              onClick={() => onSelectModule('grammar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'grammar'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tata Bahasa</span>
            </button>

            <button
              onClick={() => onSelectModule('dojo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'dojo'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'text-rose-400 hover:text-rose-200 hover:bg-rose-950/40'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Dojo Konjugasi</span>
            </button>

            <button
              onClick={() => onSelectModule('quiz')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/40'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Pusat Ujian & Kuis</span>
            </button>

            <button
              onClick={() => onSelectModule('roadmap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeModule === 'roadmap'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Peta Jalan 0→N1</span>
            </button>
          </nav>

          {/* Right Action Icons (Romaji Toggle, Dojo Shortcut & Settings) */}
          <div className="flex items-center gap-2">
            {/* Global Romaji Toggle Switch */}
            <button
              type="button"
              onClick={toggleShowRomaji}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer select-none ${
                showRomaji
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={showRomaji ? 'Romaji Aktif. Klik untuk mematikan bantuan Romaji (Mode Huruf Murni)' : 'Romaji Mati (Mode Murni). Klik untuk menyalakan bantuan Romaji'}
            >
              <span className={`text-[10px] font-mono px-1 py-0.5 rounded font-black ${
                showRomaji ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {showRomaji ? 'Aa' : 'あ'}
              </span>
              <span className="hidden sm:inline">Romaji:</span>
              <span className={showRomaji ? 'text-emerald-400 font-extrabold' : 'text-slate-400 font-bold'}>
                {showRomaji ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => onSelectModule('dojo')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500/30 text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-rose-400" />
              <span>Dojo Kata Kerja</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Pengaturan & Backup Data (JSON)"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="xl:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2 text-[10px]">
          <button
            onClick={() => onSelectModule('kana')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'kana' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            <Sparkles className="w-3.5 h-3.5 mb-0.5" />
            <span>Kana</span>
          </button>
          <button
            onClick={() => onSelectModule('kanji')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'kanji' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            <BookOpen className="w-3.5 h-3.5 mb-0.5" />
            <span>Kanji</span>
          </button>
          <button
            onClick={() => onSelectModule('vocab')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'vocab' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            <Layers className="w-3.5 h-3.5 mb-0.5" />
            <span>Vocab</span>
          </button>
          <button
            onClick={() => onSelectModule('grammar')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'grammar' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            <Award className="w-3.5 h-3.5 mb-0.5" />
            <span>Grammar</span>
          </button>
          <button
            onClick={() => onSelectModule('dojo')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'dojo' ? 'text-rose-400 font-bold' : 'text-rose-400/70'}`}
          >
            <Swords className="w-3.5 h-3.5 mb-0.5" />
            <span>Dojo</span>
          </button>
          <button
            onClick={() => onSelectModule('quiz')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'quiz' ? 'text-indigo-400 font-bold' : 'text-indigo-400/70'}`}
          >
            <Trophy className="w-3.5 h-3.5 mb-0.5" />
            <span>Kuis</span>
          </button>
          <button
            onClick={() => onSelectModule('roadmap')}
            className={`flex flex-col items-center py-1 px-1 rounded-lg ${activeModule === 'roadmap' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            <Compass className="w-3.5 h-3.5 mb-0.5" />
            <span>0→N1</span>
          </button>
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
