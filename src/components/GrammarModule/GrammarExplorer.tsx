import React, { useState } from 'react';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { JLPTLevel } from '../../types';
import { Award, Volume2, BookMarked, ChevronDown, ChevronUp, Trophy, Search } from 'lucide-react';
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
      case 'N5': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'N4': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'N3': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'N2': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'N1': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
  };

  if (subModule === 'particles') {
    return (
      <div>
        {/* Sub-module Switcher Bar */}
        <div className="w-full max-w-5xl mx-auto px-4 pt-6 flex justify-center">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setSubModule('patterns')}
              className="px-4 py-2 rounded-xl text-xs font-bold transition text-slate-400 hover:text-white cursor-pointer"
            >
              📖 Pola Kalimat N5→N1
            </button>
            <button
              onClick={() => setSubModule('particles')}
              className="px-4 py-2 rounded-xl text-xs font-bold transition bg-rose-500 text-white shadow-md shadow-rose-500/25 cursor-pointer"
            >
              🎯 Latihan Partikel N5
            </button>
          </div>
        </div>
        <ParticleDrill />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Sub-module Switcher Bar */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setSubModule('patterns')}
            className="px-4 py-2 rounded-xl text-xs font-bold transition bg-rose-500 text-white shadow-md shadow-rose-500/25 cursor-pointer"
          >
            📖 Pola Kalimat N5→N1
          </button>
          <button
            onClick={() => setSubModule('particles')}
            className="px-4 py-2 rounded-xl text-xs font-bold transition text-slate-400 hover:text-white cursor-pointer"
          >
            🎯 Latihan Partikel N5
          </button>
        </div>
      </div>
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Tata Bahasa (Grammar Dojo)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Pola Kalimat N5 s/d N1
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Pahami struktur kalimat, nuansa penggunaan, dan contoh kalimat nyata dalam percakapan dan ujian JLPT.
        </p>
      </div>

      {/* Filter Tabs & Search Bar & Quiz CTA */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Level Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {levels.map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  selectedLevel === lvl
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {lvl === 'ALL' ? 'Semua Level' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pola (misal: わけ, たら)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {onGoToQuiz && (
            <button
              onClick={onGoToQuiz}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{selectedLevel === 'ALL' ? 'Pusat Ujian JLPT' : `Kuis Ujian JLPT ${selectedLevel}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grammar Cards Accordion */}
      <div className="space-y-4">
        {filteredGrammar.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-900 border-slate-700 shadow-xl' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getLevelBadgeClass(item.level)}`}>
                    {item.level}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white mb-0.5 font-jp">
                      {item.title}
                    </h3>
                    <p className="text-xs text-rose-400 font-medium">
                      Arti: {item.meaningId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-slate-950 text-slate-300 font-mono text-xs border border-slate-800">
                    {item.structure}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 animate-pop">
                  {/* Formula banner */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Pola Pembentukan Kalimat (Structure Formula):
                    </span>
                    <span className="text-sm font-mono font-semibold text-emerald-300">
                      {item.structure}
                    </span>
                  </div>

                  {/* Explanation */}
                  <div className="mb-5 text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                    <strong className="text-white block mb-1">Penjelasan Nuansa:</strong>
                    {item.explanationId}
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-rose-400" />
                      <span>Contoh Kalimat & Cara Baca</span>
                    </h4>

                    <div className="space-y-2.5">
                      {item.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 group"
                        >
                          <div>
                            <div className="text-base font-jp font-bold text-white mb-0.5">
                              {ex.jp}
                            </div>
                            {showRomaji && (
                              <div className="text-xs font-mono text-rose-400/90 mb-1">
                                {ex.romaji}
                              </div>
                            )}
                            <div className="text-xs text-slate-300">
                              {ex.id}
                            </div>
                          </div>

                          <button
                            onClick={() => speakJapanese(ex.jp)}
                            title="Dengarkan pengucapan"
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer shrink-0 mt-0.5"
                          >
                            <Volume2 className="w-4 h-4 text-emerald-400" />
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
