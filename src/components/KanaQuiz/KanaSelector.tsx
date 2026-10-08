import React, { useState } from 'react';
import { 
  HIRAGANA_GOJUUON_GROUPS, 
  HIRAGANA_DAKUTEN_GROUPS, 
  HIRAGANA_YOON_GROUPS, 
  KATAKANA_GOJUUON_GROUPS, 
  KATAKANA_DAKUTEN_GROUPS, 
  KATAKANA_YOON_GROUPS 
} from '../../data/kanaData';
import { KanaGroup, KanaItem } from '../../types';
import { Play, CheckSquare, Square, Sparkles, Zap, RotateCcw } from 'lucide-react';

interface KanaSelectorProps {
  onStartQuiz: (selectedItems: KanaItem[], requeueMistakes: boolean, requireEnter: boolean) => void;
}

export const KanaSelector: React.FC<KanaSelectorProps> = ({ onStartQuiz }) => {
  // Mode: true = requeue mistakes (Tofugu style), false = single pass (each letter exactly once)
  const [requeueMistakes, setRequeueMistakes] = useState(true);
  // Mode: true = require pressing Enter to answer (anti-guessing), false = auto-submit on typing
  const [requireEnter, setRequireEnter] = useState(true);


  // Store selected item IDs
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => {
    // Default select Hiragana Vowels + K row for a quick quickstart
    const initial = new Set<string>();

    HIRAGANA_GOJUUON_GROUPS[0].items.forEach(i => initial.add(i.id));
    return initial;
  });

  // Active tab in selector: 'all', 'hiragana', 'katakana'
  const [activeTab, setActiveTab] = useState<'both' | 'hiragana' | 'katakana'>('both');

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGroup = (group: KanaGroup) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      const allSelected = group.items.every(item => next.has(item.id));
      if (allSelected) {
        group.items.forEach(item => next.delete(item.id));
      } else {
        group.items.forEach(item => next.add(item.id));
      }
      return next;
    });
  };

  const selectPreset = (type: 'all' | 'hiragana-all' | 'katakana-all' | 'gojuuon-both' | 'dakuten-both' | 'yoon-both' | 'clear') => {
    const next = new Set<string>();

    if (type === 'all') {
      [
        ...HIRAGANA_GOJUUON_GROUPS, ...HIRAGANA_DAKUTEN_GROUPS, ...HIRAGANA_YOON_GROUPS,
        ...KATAKANA_GOJUUON_GROUPS, ...KATAKANA_DAKUTEN_GROUPS, ...KATAKANA_YOON_GROUPS
      ].forEach(g => g.items.forEach(i => next.add(i.id)));
    } else if (type === 'hiragana-all') {
      [...HIRAGANA_GOJUUON_GROUPS, ...HIRAGANA_DAKUTEN_GROUPS, ...HIRAGANA_YOON_GROUPS]
        .forEach(g => g.items.forEach(i => next.add(i.id)));
    } else if (type === 'katakana-all') {
      [...KATAKANA_GOJUUON_GROUPS, ...KATAKANA_DAKUTEN_GROUPS, ...KATAKANA_YOON_GROUPS]
        .forEach(g => g.items.forEach(i => next.add(i.id)));
    } else if (type === 'gojuuon-both') {
      [...HIRAGANA_GOJUUON_GROUPS, ...KATAKANA_GOJUUON_GROUPS]
        .forEach(g => g.items.forEach(i => next.add(i.id)));
    } else if (type === 'dakuten-both') {
      [...HIRAGANA_DAKUTEN_GROUPS, ...KATAKANA_DAKUTEN_GROUPS]
        .forEach(g => g.items.forEach(i => next.add(i.id)));
    } else if (type === 'yoon-both') {
      [...HIRAGANA_YOON_GROUPS, ...KATAKANA_YOON_GROUPS]
        .forEach(g => g.items.forEach(i => next.add(i.id)));
    } else if (type === 'clear') {
      // empty
    }

    setSelectedItemIds(next);
  };

  // Find all items selected
  const getAllKanaItems = (): KanaItem[] => {
    const all = [
      ...HIRAGANA_GOJUUON_GROUPS, ...HIRAGANA_DAKUTEN_GROUPS, ...HIRAGANA_YOON_GROUPS,
      ...KATAKANA_GOJUUON_GROUPS, ...KATAKANA_DAKUTEN_GROUPS, ...KATAKANA_YOON_GROUPS
    ];
    const items: KanaItem[] = [];
    all.forEach(g => {
      g.items.forEach(item => {
        if (selectedItemIds.has(item.id)) {
          items.push(item);
        }
      });
    });
    return items;
  };

  const handleStart = () => {
    const items = getAllKanaItems();
    if (items.length === 0) return;
    onStartQuiz(items, requeueMistakes, requireEnter);
  };



  const renderGroupSection = (title: string, groups: KanaGroup[], accentColor: string, badgeLabel: string) => {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${badgeLabel === 'Hiragana' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
            {badgeLabel}
          </span>
          <h3 className="text-base font-bold text-slate-200">{title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {groups.map(group => {
            const isGroupFullySelected = group.items.every(i => selectedItemIds.has(i.id));
            const selectedCount = group.items.filter(i => selectedItemIds.has(i.id)).length;

            return (
              <div 
                key={group.id} 
                className={`p-3.5 rounded-xl border transition-all duration-150 ${
                  selectedCount > 0 
                    ? 'bg-slate-900/90 border-slate-700 shadow-md' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header row for group toggle */}
                <div className="flex items-center justify-between mb-2.5">
                  <button 
                    onClick={() => toggleGroup(group)}
                    className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
                  >
                    {isGroupFullySelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : selectedCount > 0 ? (
                      <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-400 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-emerald-400 rounded-xs" />
                      </div>
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {group.name}
                    </span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedCount}/{group.items.length}
                  </span>
                </div>

                {/* Kana items grid */}
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map(item => {
                    const isSelected = selectedItemIds.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`group relative flex flex-col items-center justify-center px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer min-w-[42px] ${
                          isSelected 
                            ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-sm ring-1 ring-rose-500/30' 
                            : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-lg font-jp font-medium leading-none mb-1">
                          {item.character}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                          {item.romaji}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const selectedTotal = selectedItemIds.size;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kuis Kana Interaktif — Gabungan Hiragana & Katakana</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Pilih Huruf untuk Kuis
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Berbeda dengan Tofugu yang harus dipilih terpisah, di sini kamu bisa menguji 
          <span className="text-rose-400 font-semibold"> Hiragana</span> dan 
          <span className="text-sky-400 font-semibold"> Katakana</span> sekaligus bersamaan, termasuk varian 
          <span className="text-amber-400 font-semibold"> Dakuten</span> dan 
          <span className="text-emerald-400 font-semibold"> Kombinasi (Yōon)</span>!
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Pintasan Pilihan Cepat</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Terpilih:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs">
              {selectedTotal} Karakter
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectPreset('all')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium transition cursor-pointer"
          >
            🌟 Pilih Semua (Hiragana + Katakana)
          </button>
          <button
            onClick={() => selectPreset('hiragana-all')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-medium transition cursor-pointer"
          >
            Semua Hiragana
          </button>
          <button
            onClick={() => selectPreset('katakana-all')}
            className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-medium transition cursor-pointer"
          >
            Semua Katakana
          </button>
          <button
            onClick={() => selectPreset('gojuuon-both')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Dasar 46 (Gojūon Keduanya)
          </button>
          <button
            onClick={() => selectPreset('dakuten-both')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Dakuten & Handakuten
          </button>
          <button
            onClick={() => selectPreset('yoon-both')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Kombinasi (Yōon)
          </button>
          <button
            onClick={() => selectPreset('clear')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Tabs Filter for View */}
      <div className="flex border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('both')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'both' 
              ? 'border-rose-500 text-rose-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Semua (Hiragana & Katakana)
        </button>
        <button
          onClick={() => setActiveTab('hiragana')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'hiragana' 
              ? 'border-rose-500 text-rose-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Hiragana Saja
        </button>
        <button
          onClick={() => setActiveTab('katakana')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'katakana' 
              ? 'border-sky-500 text-sky-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Katakana Saja
        </button>
      </div>

      {/* Group Lists */}
      <div>
        {(activeTab === 'both' || activeTab === 'hiragana') && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <h2 className="text-xl font-bold text-white">Modul Hiragana (ひらがな)</h2>
            </div>
            {renderGroupSection('Hiragana Standar 46 Huruf (Gojūon)', HIRAGANA_GOJUUON_GROUPS, 'rose', 'Hiragana')}
            {renderGroupSection('Hiragana Dakuten & Handakuten (だくてん)', HIRAGANA_DAKUTEN_GROUPS, 'rose', 'Hiragana')}
            {renderGroupSection('Hiragana Kombinasi (Yōon / ようおん)', HIRAGANA_YOON_GROUPS, 'rose', 'Hiragana')}
          </div>
        )}

        {(activeTab === 'both' || activeTab === 'katakana') && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              <h2 className="text-xl font-bold text-white">Modul Katakana (カタカナ)</h2>
            </div>
            {renderGroupSection('Katakana Standar 46 Huruf (Gojūon)', KATAKANA_GOJUUON_GROUPS, 'sky', 'Katakana')}
            {renderGroupSection('Katakana Dakuten & Handakuten (ダクテン)', KATAKANA_DAKUTEN_GROUPS, 'sky', 'Katakana')}
            {renderGroupSection('Katakana Kombinasi (Yōon / ヨウオン)', KATAKANA_YOON_GROUPS, 'sky', 'Katakana')}
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-bold text-rose-400">
              {selectedTotal}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {selectedTotal > 0 ? `${selectedTotal} Karakter Dipilih` : 'Belum Ada Huruf Terpilih'}
              </div>
              <div className="text-xs text-slate-400">
                {selectedTotal === 0 ? 'Pilih minimal 1 huruf untuk memulai' : 'Siap untuk sesi kuis'}
              </div>
            </div>
          </div>

          {/* Mode Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Enter Requirement Switcher (Anti-Tebak) */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setRequireEnter(true)}
                title="Wajib tekan Enter untuk mengirim jawaban. Mengetik huruf tidak akan langsung dinilai (mencegah tebak-tebakan)."
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  requireEnter
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🛡️ Wajib Enter (Anti-Tebak)
              </button>
              <button
                type="button"
                onClick={() => setRequireEnter(false)}
                title="Jawaban langsung dinilai otomatis saat huruf cocok."
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  !requireEnter
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Auto-Submit
              </button>
            </div>

            {/* Re-queue Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setRequeueMistakes(true)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  requeueMistakes
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔁 Ulangi Salah
              </button>
              <button
                type="button"
                onClick={() => setRequeueMistakes(false)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  !requeueMistakes
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎯 1x Putaran
              </button>
            </div>
          </div>


          <button
            onClick={handleStart}
            disabled={selectedTotal === 0}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg ${
              selectedTotal > 0
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            Mulai Kuis Sekarang
          </button>
        </div>
      </div>

    </div>
  );
};
