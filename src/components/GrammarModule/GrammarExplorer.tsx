import React, { useState } from 'react';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { JLPTLevel } from '../../types';
import { Volume2, BookMarked, ChevronDown, ChevronUp, Search, Trophy } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';
import { ParticleDrill } from '../ParticleModule/ParticleDrill';
import { useShowRomaji } from '../../hooks/useShowRomaji';

interface GrammarExplorerProps {
  onGoToQuiz?: () => void;
  initialLevel?: JLPTLevel | 'ALL';
}

export const GrammarExplorer: React.FC<GrammarExplorerProps> = ({ onGoToQuiz, initialLevel }) => {
  const [showRomaji] = useShowRomaji();
  const [subModule, setSubModule] = useState<'patterns' | 'particles'>('patterns');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>(initialLevel || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(GRAMMAR_DATA[0]?.id || null);

  const levels: (JLPTLevel | 'ALL')[] = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

  const filteredGrammar = GRAMMAR_DATA.filter(item => {
    const matchesLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) ||
      item.meaningId.toLowerCase().includes(q) ||
      item.structure.toLowerCase().includes(q) ||
      item.explanationId.toLowerCase().includes(q);

    return matchesLevel && matchesSearch;
  });

  const getLevelBadgeClass = (level: JLPTLevel) => {
    switch (level) {
      case 'N5': return 'border-emerald-500/30 text-[#2e7d32] dark:text-[#4ade80] bg-[#2e7d32]/5';
      case 'N4': return 'border-sky-500/30 text-sky-700 dark:text-sky-300 bg-sky-500/5';
      case 'N3': return 'border-indigo-500/30 text-[#1e3a8a] dark:text-[#60a5fa] bg-[#1e3a8a]/5';
      case 'N2': return 'border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/5';
      case 'N1': return 'border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5';
    }
  };

  if (subModule === 'particles') {
    return (
      <div>
        {/* Sub-module Switcher Bar */}
        <div className="w-full max-w-5xl mx-auto px-4 pt-6 flex justify-center">
          <div className="bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] p-1 rounded-xl flex items-center gap-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setSubModule('patterns')}
              className="px-4 py-2 rounded-lg text-xs font-mono transition cursor-pointer text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]"
            >
              [文法] Pola Kalimat N5→N1
            </button>
            <button
              type="button"
              onClick={() => setSubModule('particles')}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46] cursor-pointer"
            >
              [助詞] Latihan Partikel N5•N4•N3
            </button>
          </div>
        </div>
        <ParticleDrill />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Sub-module Switcher Bar */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] p-1 rounded-xl flex items-center gap-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setSubModule('patterns')}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46] cursor-pointer"
          >
            [文法] Pola Kalimat N5→N1
          </button>
          <button
            type="button"
            onClick={() => setSubModule('particles')}
            className="px-4 py-2 rounded-lg text-xs font-mono transition cursor-pointer text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]"
          >
            [助詞] Latihan Partikel N5•N4•N3
          </button>
        </div>
      </div>

      {/* Editorial Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#1e3a8a]/25 bg-[#1e3a8a]/5 text-[#1e3a8a] dark:text-[#60a5fa] text-xs font-mono font-medium mb-3">
          <span>[文法道場] TATA BAHASA & RUMUS BENTUK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Kamus Pola Kalimat JLPT N5 s/d N1
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-sm max-w-xl mx-auto leading-relaxed">
          Pahami pembentukan kalimat, nuansa makna kontekstual, dan contoh kalimat nyata standar ujian JLPT.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Level Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {levels.map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer shrink-0 border flex items-center justify-center ${
                  selectedLevel === lvl
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                    : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:border-[#d6d3d1]'
                }`}
              >
                {lvl === 'ALL' ? 'Semua Level' : `[${lvl}]`}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pola (misal: わけ, たら)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] placeholder-[#a8a29e] focus:outline-none focus:border-[#c84b31]"
              />
            </div>

            {onGoToQuiz && (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs active:translate-y-px"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{selectedLevel === 'ALL' ? 'Pusat Ujian' : `Kuis ${selectedLevel}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grammar Cards Accordion */}
      <div className="space-y-3">
        {filteredGrammar.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                isExpanded 
                  ? 'bg-white dark:bg-[#1f1f23] border-[#d6d3d1] dark:border-[#3f3f46] shadow-xs' 
                  : 'bg-white/60 dark:bg-[#1f1f23]/60 border-[#e7e5e4] dark:border-[#27272a] hover:border-[#d6d3d1] dark:hover:border-[#3f3f46]'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLevelBadgeClass(item.level)}`}>
                    [{item.level}]
                  </span>
                  <div>
                    <h3 className="text-base font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#c84b31] dark:text-[#e05d44] font-medium">
                      Arti: {item.meaningId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] dark:text-[#a1a1aa] font-mono text-xs border border-[#e7e5e4] dark:border-[#27272a]">
                    {item.structure}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#78716c]" /> : <ChevronDown className="w-4 h-4 text-[#78716c]" />}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-[#e7e5e4] dark:border-[#27272a] animate-pop">
                  {/* Formula banner */}
                  <div className="p-3.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] block mb-1">
                      Pola Pembentukan (Formula):
                    </span>
                    <span className="text-sm font-mono font-semibold text-[#1e3a8a] dark:text-[#60a5fa]">
                      {item.structure}
                    </span>
                  </div>

                  {/* Explanation */}
                  <div className="mb-5 text-sm text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed bg-[#faf8f5]/50 dark:bg-[#18181b]/50 p-4 rounded-lg border border-[#e7e5e4] dark:border-[#27272a]">
                    <strong className="block mb-1 text-xs font-mono font-bold uppercase text-[#78716c] dark:text-[#a1a1aa]">
                      Penjelasan Nuansa:
                    </strong>
                    {item.explanationId}
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="text-xs font-bold font-mono text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-[#c84b31]" />
                      <span>Contoh Kalimat Nyata</span>
                    </h4>

                    <div className="space-y-2">
                      {item.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] flex items-start justify-between gap-3 group"
                        >
                          <div>
                            <div className="text-base font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                              {ex.jp}
                            </div>
                            {showRomaji && (
                              <div className="text-xs font-mono text-[#c84b31] dark:text-[#e05d44] mb-1">
                                {ex.romaji}
                              </div>
                            )}
                            <div className="text-xs text-[#78716c] dark:text-[#a1a1aa]">
                              {ex.id}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => speakJapanese(ex.jp)}
                            title="Dengarkan pengucapan"
                            className="p-1.5 rounded text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer shrink-0 mt-0.5"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
