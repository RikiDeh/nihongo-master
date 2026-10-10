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
import { Play, CheckSquare, Square, RotateCcw } from 'lucide-react';

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

  // Active tab in selector: 'both' | 'hiragana' | 'katakana'
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

  const renderGroupSection = (title: string, groups: KanaGroup[], badgeLabel: string) => {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-[#e7e5e4] dark:border-[#27272a]">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] bg-[#f4f0e8]/60 dark:bg-[#1f1f23]/60">
            [{badgeLabel}]
          </span>
          <h3 className="text-base font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-wide">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {groups.map(group => {
            const isGroupFullySelected = group.items.every(i => selectedItemIds.has(i.id));
            const selectedCount = group.items.filter(i => selectedItemIds.has(i.id)).length;

            return (
              <div 
                key={group.id} 
                className={`p-4 rounded-xl border transition-all duration-150 ${
                  selectedCount > 0 
                    ? 'bg-white dark:bg-[#1f1f23] border-[#d6d3d1] dark:border-[#3f3f46] shadow-xs' 
                    : 'bg-[#ffffff]/50 dark:bg-[#18181b]/50 border-[#e7e5e4] dark:border-[#27272a] hover:border-[#d6d3d1] dark:hover:border-[#3f3f46]'
                }`}
              >
                {/* Header row for group toggle */}
                <div className="flex items-center justify-between mb-3">
                  <button 
                    onClick={() => toggleGroup(group)}
                    className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
                  >
                    {isGroupFullySelected ? (
                      <CheckSquare className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44] shrink-0" />
                    ) : selectedCount > 0 ? (
                      <div className="w-4 h-4 rounded border border-[#c84b31] dark:border-[#e05d44] bg-[#c84b31]/20 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-[#c84b31] dark:bg-[#e05d44] rounded-xs" />
                      </div>
                    ) : (
                      <Square className="w-4 h-4 text-[#a8a29e] dark:text-[#71717a] group-hover:text-[#78716c] shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-[#1c1917] dark:text-[#f4f4f5] group-hover:text-[#c84b31] dark:group-hover:text-[#e05d44] transition-colors">
                      {group.name}
                    </span>
                  </button>
                  <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
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
                            ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] ring-1 ring-[#c84b31]/30 font-bold' 
                            : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:border-[#d6d3d1] dark:hover:border-[#3f3f46] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                        }`}
                      >
                        <span className="text-lg font-serif-jp leading-none mb-1">
                          {item.character}
                        </span>
                        <span className="text-[10px] font-mono opacity-80">
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 pb-32">
      {/* Editorial Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#c84b31]/25 bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44] text-xs font-mono font-medium mb-3">
          <span>[仮名選択] KANA GATEWAY • 0 KE N5</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Pilih Aksara Hiragana & Katakana
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Kuasai fondasi aksara Jepang secara simultan. Uji Hiragana dan Katakana dalam satu sesi terpadu, mencakup Gojūon dasar, Dakuten, dan varian kombinasi Yōon.
        </p>
      </div>

      {/* Preset Quick Selectors Tray */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#e7e5e4] dark:border-[#27272a]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa]">
              Pintasan Pilihan Cepat
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716c] dark:text-[#a1a1aa]">Total Terpilih:</span>
            <span className="px-2.5 py-0.5 rounded border border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 font-mono font-bold text-xs">
              {selectedTotal} Karakter
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectPreset('all')}
            className="px-3 py-1.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
          >
            Pilih Semua (Hiragana + Katakana)
          </button>
          <button
            type="button"
            onClick={() => selectPreset('hiragana-all')}
            className="px-3 py-1.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
          >
            Semua Hiragana
          </button>
          <button
            type="button"
            onClick={() => selectPreset('katakana-all')}
            className="px-3 py-1.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
          >
            Semua Katakana
          </button>
          <button
            type="button"
            onClick={() => selectPreset('gojuuon-both')}
            className="px-3 py-1.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
          >
            Dasar 46 (Gojūon Keduanya)
          </button>
          <button
            type="button"
            onClick={() => selectPreset('dakuten-both')}
            className="px-3 py-1.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
          >
            Dakuten & Handakuten
          </button>
          <button
            type="button"
            onClick={() => selectPreset('yoon-both')}
            className="px-3 py-1.5 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] dark:hover:bg-[#3f3f46] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
          >
            Kombinasi (Yōon)
          </button>
          <button
            type="button"
            onClick={() => selectPreset('clear')}
            className="px-3 py-1.5 rounded-lg bg-transparent hover:bg-rose-500/10 border border-[#e7e5e4] dark:border-[#27272a] hover:border-rose-400 text-[#78716c] hover:text-rose-600 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Tabs Filter for View */}
      <div className="flex border-b border-[#e7e5e4] dark:border-[#27272a] mb-8 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('both')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'both' 
              ? 'border-[#c84b31] text-[#c84b31] dark:text-[#e05d44]' 
              : 'border-transparent text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
          }`}
        >
          Semua (Hiragana & Katakana)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hiragana')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'hiragana' 
              ? 'border-[#c84b31] text-[#c84b31] dark:text-[#e05d44]' 
              : 'border-transparent text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
          }`}
        >
          Hiragana Saja
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('katakana')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'katakana' 
              ? 'border-[#c84b31] text-[#c84b31] dark:text-[#e05d44]' 
              : 'border-transparent text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
          }`}
        >
          Katakana Saja
        </button>
      </div>

      {/* Group Lists */}
      <div>
        {(activeTab === 'both' || activeTab === 'hiragana') && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#c84b31] shrink-0" />
              <h2 className="text-xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                Aksara Hiragana (平仮名)
              </h2>
            </div>
            {renderGroupSection('Hiragana Standar 46 Huruf (Gojūon)', HIRAGANA_GOJUUON_GROUPS, '平仮名')}
            {renderGroupSection('Hiragana Dakuten & Handakuten', HIRAGANA_DAKUTEN_GROUPS, '平仮名')}
            {renderGroupSection('Hiragana Kombinasi (Yōon)', HIRAGANA_YOON_GROUPS, '平仮名')}
          </div>
        )}

        {(activeTab === 'both' || activeTab === 'katakana') && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#1e3a8a] dark:bg-[#3b82f6] shrink-0" />
              <h2 className="text-xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                Aksara Katakana (片仮名)
              </h2>
            </div>
            {renderGroupSection('Katakana Standar 46 Huruf (Gojūon)', KATAKANA_GOJUUON_GROUPS, '片仮名')}
            {renderGroupSection('Katakana Dakuten & Handakuten', KATAKANA_DAKUTEN_GROUPS, '片仮名')}
            {renderGroupSection('Katakana Kombinasi (Yōon)', KATAKANA_YOON_GROUPS, '片仮名')}
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar (Washi Dock) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border-t border-[#e7e5e4] dark:border-[#27272a] p-4 z-40 transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#d6d3d1] dark:border-[#3f3f46] flex items-center justify-center font-mono font-bold text-[#c84b31] dark:text-[#e05d44]">
              {selectedTotal}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1c1917] dark:text-[#f4f4f5]">
                {selectedTotal > 0 ? `${selectedTotal} Karakter Dipilih` : 'Belum Ada Huruf Terpilih'}
              </div>
              <div className="text-xs text-[#78716c] dark:text-[#a1a1aa]">
                {selectedTotal === 0 ? 'Pilih minimal 1 huruf untuk memulai' : 'Siap untuk sesi kuis'}
              </div>
            </div>
          </div>

          {/* Mode Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Enter Requirement Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1f1f23] p-1 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-xs">
              <button
                type="button"
                onClick={() => setRequireEnter(true)}
                title="Wajib tekan Enter untuk mengirim jawaban (anti-tebak)."
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  requireEnter
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold shadow-xs'
                    : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                Wajib Enter
              </button>
              <button
                type="button"
                onClick={() => setRequireEnter(false)}
                title="Jawaban langsung dinilai otomatis saat huruf cocok."
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  !requireEnter
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold shadow-xs'
                    : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                Auto-Submit
              </button>
            </div>

            {/* Re-queue Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1f1f23] p-1 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] text-xs">
              <button
                type="button"
                onClick={() => setRequeueMistakes(true)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  requeueMistakes
                    ? 'bg-[#c84b31] text-white font-bold shadow-xs'
                    : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                Ulangi Salah
              </button>
              <button
                type="button"
                onClick={() => setRequeueMistakes(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  !requeueMistakes
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold shadow-xs'
                    : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                1x Putaran
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={selectedTotal === 0}
            className={`px-6 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
              selectedTotal > 0
                ? 'bg-[#c84b31] hover:bg-[#b03d25] text-white shadow-xs active:translate-y-px'
                : 'bg-[#e7e5e4] dark:bg-[#27272a] text-[#a8a29e] dark:text-[#71717a] cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Mulai Sesi Kuis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
