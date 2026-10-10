import React, { useState } from 'react';
import { 
  HIRAGANA_GOJUUON_GROUPS, 
  HIRAGANA_DAKUTEN_GROUPS, 
  HIRAGANA_YOON_GROUPS, 
  KATAKANA_GOJUUON_GROUPS, 
  KATAKANA_DAKUTEN_GROUPS, 
  KATAKANA_YOON_GROUPS 
} from '../../data/kanaData';
import { KanaItem } from '../../types';
import { Play, RotateCcw, CheckSquare, Square, Sparkles } from 'lucide-react';

interface KanaSelectorProps {
  onStartQuiz: (selectedItems: KanaItem[], requeueMistakes: boolean, requireEnter: boolean) => void;
}

// 10 baris standar Gojuuon (A-I-U-E-O columns)
const GOJUUON_ROW_CONFIG = [
  { rowName: 'Vokal', romajiPrefix: '', vowels: ['a', 'i', 'u', 'e', 'o'] },
  { rowName: 'K-Row', romajiPrefix: 'k', vowels: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { rowName: 'S-Row', romajiPrefix: 's', vowels: ['sa', 'shi', 'su', 'se', 'so'] },
  { rowName: 'T-Row', romajiPrefix: 't', vowels: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { rowName: 'N-Row', romajiPrefix: 'n', vowels: ['na', 'ni', 'nu', 'ne', 'no'] },
  { rowName: 'H-Row', romajiPrefix: 'h', vowels: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { rowName: 'M-Row', romajiPrefix: 'm', vowels: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { rowName: 'Y-Row', romajiPrefix: 'y', vowels: ['ya', null, 'yu', null, 'yo'] },
  { rowName: 'R-Row', romajiPrefix: 'r', vowels: ['ra', 'ri', 'ru', 're', 'ro'] },
  { rowName: 'W-Row', romajiPrefix: 'w', vowels: ['wa', null, null, null, 'wo'] },
];

export const KanaSelector: React.FC<KanaSelectorProps> = ({ onStartQuiz }) => {
  const [requeueMistakes, setRequeueMistakes] = useState(true);
  const [requireEnter, setRequireEnter] = useState(true);

  // Store selected item IDs
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    HIRAGANA_GOJUUON_GROUPS[0].items.forEach(i => initial.add(i.id));
    return initial;
  });

  // Active script: 'hiragana' | 'katakana' | 'both'
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana'>('hiragana');
  // Matrix category view: 'gojuuon' (50 Sound Grid) | 'dakuten' | 'yoon'
  const [categoryView, setCategoryView] = useState<'gojuuon' | 'dakuten' | 'yoon'>('gojuuon');

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleItemsList = (items: KanaItem[]) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      const allSelected = items.every(i => next.has(i.id));
      if (allSelected) {
        items.forEach(i => next.delete(i.id));
      } else {
        items.forEach(i => next.add(i.id));
      }
      return next;
    });
  };

  const selectPreset = (type: 'all' | 'hiragana-all' | 'katakana-all' | 'gojuuon-both' | 'dakuten-both' | 'yoon-both' | 'clear') => {
    const next = new Set<string>();
    const allGroups = [
      ...HIRAGANA_GOJUUON_GROUPS, ...HIRAGANA_DAKUTEN_GROUPS, ...HIRAGANA_YOON_GROUPS,
      ...KATAKANA_GOJUUON_GROUPS, ...KATAKANA_DAKUTEN_GROUPS, ...KATAKANA_YOON_GROUPS
    ];

    if (type === 'all') {
      allGroups.forEach(g => g.items.forEach(i => next.add(i.id)));
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

  // Map items for Gojuuon table lookup
  const activeGojuuonGroups = scriptType === 'hiragana' ? HIRAGANA_GOJUUON_GROUPS : KATAKANA_GOJUUON_GROUPS;
  const itemsByRomaji = new Map<string, KanaItem>();
  activeGojuuonGroups.forEach(g => {
    g.items.forEach(i => {
      itemsByRomaji.set(i.romaji.toLowerCase(), i);
    });
  });

  // Special item 'n' / 'ん' / 'ン'
  const specialNItem = activeGojuuonGroups.find(g => g.id.includes('-w'))?.items.find(i => i.romaji === 'n');

  // Active Dakuten & Yoon groups
  const activeDakutenGroups = scriptType === 'hiragana' ? HIRAGANA_DAKUTEN_GROUPS : KATAKANA_DAKUTEN_GROUPS;
  const activeYoonGroups = scriptType === 'hiragana' ? HIRAGANA_YOON_GROUPS : KATAKANA_YOON_GROUPS;

  const selectedTotal = selectedItemIds.size;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 pb-36 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#e7e5e4] dark:border-[#27272a]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border border-[#c84b31]/30 bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44] mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[五十音図] MATRIKS 50 BUNYI KANA JEPANG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
            Pusat Latihan Aksara Kana
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mt-1 max-w-2xl font-sans">
            Tabel fonetis autentik Jepang (A-I-U-E-O × Baris Konsonan). Pilih aksara per-kolom vokal, per-baris, atau gunakan preset cepat.
          </p>
        </div>

        {/* Script Switcher: Hiragana vs Katakana */}
        <div className="flex items-center p-1 bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setScriptType('hiragana')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              scriptType === 'hiragana'
                ? 'bg-white dark:bg-[#27272a] text-[#c84b31] dark:text-[#e05d44] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46]'
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <span className="font-serif-jp text-sm font-bold">あ</span>
            <span>Hiragana (平仮名)</span>
          </button>
          <button
            type="button"
            onClick={() => setScriptType('katakana')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              scriptType === 'katakana'
                ? 'bg-white dark:bg-[#27272a] text-[#1e3a8a] dark:text-[#3b82f6] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46]'
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <span className="font-serif-jp text-sm font-bold">ア</span>
            <span>Katakana (片仮名)</span>
          </button>
        </div>
      </div>

      {/* Control Strip & Presets */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-4 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-[#e7e5e4] dark:border-[#27272a]">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-[#78716c] dark:text-[#a1a1aa] mr-1">Tabel:</span>
            {[
              { id: 'gojuuon', label: '50 Bunyi Dasar (Gojūon)' },
              { id: 'dakuten', label: 'Bunyi Keruh (Dakuten / Handakuten)' },
              { id: 'yoon', label: 'Bunyi Kombinasi (Yōon)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryView(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                  categoryView === tab.id
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#78716c] dark:text-[#a1a1aa]">Terpilih:</span>
            <span className="px-2.5 py-0.5 rounded border border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 font-bold">
              {selectedTotal} Karakter
            </span>
          </div>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-[#78716c] dark:text-[#a1a1aa] mr-1">Preset:</span>
          <button
            type="button"
            onClick={() => selectPreset('gojuuon-both')}
            className="px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] transition cursor-pointer"
          >
            Dasar 46 Keduanya
          </button>
          <button
            type="button"
            onClick={() => selectPreset(scriptType === 'hiragana' ? 'hiragana-all' : 'katakana-all')}
            className="px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] transition cursor-pointer"
          >
            Semua {scriptType === 'hiragana' ? 'Hiragana' : 'Katakana'}
          </button>
          <button
            type="button"
            onClick={() => selectPreset('all')}
            className="px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] transition cursor-pointer"
          >
            Pilih Seluruhnya (Hira + Kata)
          </button>
          <button
            type="button"
            onClick={() => selectPreset('clear')}
            className="px-2.5 py-1 rounded bg-transparent hover:bg-rose-500/10 border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-rose-600 text-xs transition cursor-pointer flex items-center gap-1 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GOJUUON 50-SOUND ORTHODOX MATRIX TABLE */}
      {categoryView === 'gojuuon' && (
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-4 sm:p-6 shadow-xs mb-8 overflow-x-auto">
          <div className="min-w-[620px]">
            {/* Table Header: Vowel Columns [A, I, U, E, O] */}
            <div className="grid grid-cols-6 gap-2 mb-2 pb-2 border-b border-[#e7e5e4] dark:border-[#27272a] text-center font-mono text-xs font-bold text-[#78716c] dark:text-[#a1a1aa]">
              <div className="text-left font-serif-jp text-xs uppercase text-[#1c1917] dark:text-[#f4f4f5] flex items-center">
                Baris \ Kolom
              </div>
              {['a (段)', 'i (段)', 'u (段)', 'e (段)', 'o (段)'].map((col, idx) => {
                const vowelChar = ['a', 'i', 'u', 'e', 'o'][idx];
                // Kumpulkan semua item di kolom ini
                const colItems: KanaItem[] = [];
                GOJUUON_ROW_CONFIG.forEach(r => {
                  const romaji = r.vowels[idx];
                  if (romaji) {
                    const item = itemsByRomaji.get(romaji);
                    if (item) colItems.push(item);
                  }
                });
                const isColAllSelected = colItems.length > 0 && colItems.every(i => selectedItemIds.has(i.id));

                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => toggleItemsList(colItems)}
                    className="p-1.5 rounded hover:bg-[#faf8f5] dark:hover:bg-[#18181b] transition cursor-pointer group flex flex-col items-center"
                    title={`Klik untuk memilih/membatalkan seluruh kolom -${vowelChar.toUpperCase()}`}
                  >
                    <span className="group-hover:text-[#c84b31] dark:group-hover:text-[#e05d44] transition-colors">
                      {col}
                    </span>
                    <span className="text-[10px] font-normal text-[#a8a29e] dark:text-[#71717a]">
                      {isColAllSelected ? '✓ Semua' : 'Pilih'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Matrix Body: 10 Rows */}
            <div className="space-y-2">
              {GOJUUON_ROW_CONFIG.map(row => {
                const rowItems: KanaItem[] = [];
                row.vowels.forEach(romaji => {
                  if (romaji) {
                    const item = itemsByRomaji.get(romaji);
                    if (item) rowItems.push(item);
                  }
                });
                const isRowAllSelected = rowItems.length > 0 && rowItems.every(i => selectedItemIds.has(i.id));

                return (
                  <div key={row.rowName} className="grid grid-cols-6 gap-2 items-center">
                    {/* Row Selector Label */}
                    <button
                      type="button"
                      onClick={() => toggleItemsList(rowItems)}
                      className="p-2 rounded-lg text-left text-xs font-mono font-medium hover:bg-[#faf8f5] dark:hover:bg-[#18181b] border border-transparent hover:border-[#e7e5e4] dark:hover:border-[#27272a] transition cursor-pointer flex items-center justify-between group"
                      title={`Klik untuk memilih/membatalkan baris ${row.rowName}`}
                    >
                      <span className="font-semibold text-[#1c1917] dark:text-[#f4f4f5] group-hover:text-[#c84b31] dark:group-hover:text-[#e05d44]">
                        {row.rowName}
                      </span>
                      {isRowAllSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#c84b31] dark:text-[#e05d44]" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#71717a]" />
                      )}
                    </button>

                    {/* 5 Cells in Row */}
                    {row.vowels.map((romaji, idx) => {
                      if (!romaji) {
                        return (
                          <div 
                            key={`empty-${idx}`} 
                            className="h-14 rounded-lg border border-dashed border-[#e7e5e4]/50 dark:border-[#27272a]/50 bg-black/[0.02] dark:bg-white/[0.01] flex items-center justify-center text-[#d6d3d1] dark:text-[#3f3f46] text-xs font-mono select-none"
                          >
                            —
                          </div>
                        );
                      }

                      const item = itemsByRomaji.get(romaji);
                      if (!item) return <div key={romaji} className="h-14" />;

                      const isSelected = selectedItemIds.has(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none active:translate-y-px ${
                            isSelected
                              ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] shadow-xs font-bold'
                              : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917] dark:hover:border-[#f4f4f5]'
                          }`}
                        >
                          <span className="text-xl sm:text-2xl font-serif-jp leading-none mb-1">
                            {item.character}
                          </span>
                          <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] leading-none">
                            {item.romaji}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {/* Special row for N 'ん' / 'ン' */}
              {specialNItem && (
                <div className="grid grid-cols-6 gap-2 items-center pt-2 border-t border-[#e7e5e4] dark:border-[#27272a]">
                  <div className="p-2 text-xs font-mono font-medium text-[#1c1917] dark:text-[#f4f4f5]">
                    Konsonan N
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleItem(specialNItem.id)}
                    className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none active:translate-y-px ${
                      selectedItemIds.has(specialNItem.id)
                        ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] shadow-xs font-bold'
                        : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917] dark:hover:border-[#f4f4f5]'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-serif-jp leading-none mb-1">
                      {specialNItem.character}
                    </span>
                    <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] leading-none">
                      {specialNItem.romaji}
                    </span>
                  </button>
                  <div className="col-span-4 p-3 text-xs text-[#78716c] dark:text-[#a1a1aa] font-sans flex items-center">
                    Hatsuon (拨音): Satu-satunya konsonan tunggal tanpa vokal dalam aksara Jepang.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DAKUTEN / HANDAKUTEN TILES */}
      {categoryView === 'dakuten' && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDakutenGroups.map(group => {
              const isGroupAllSelected = group.items.every(i => selectedItemIds.has(i.id));
              return (
                <div
                  key={group.id}
                  className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e7e5e4] dark:border-[#27272a]">
                    <span className="font-serif-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
                      {group.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleItemsList(group.items)}
                      className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] hover:text-[#c84b31] dark:hover:text-[#e05d44] cursor-pointer"
                    >
                      {isGroupAllSelected ? 'Batalkan' : 'Pilih Semua'}
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {group.items.map(item => {
                      const isSelected = selectedItemIds.has(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`h-14 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                              : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917]'
                          }`}
                        >
                          <span className="text-xl font-serif-jp leading-none mb-1">{item.character}</span>
                          <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa]">{item.romaji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: YOON COMBINATION TILES */}
      {categoryView === 'yoon' && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeYoonGroups.map(group => {
              const isGroupAllSelected = group.items.every(i => selectedItemIds.has(i.id));
              return (
                <div
                  key={group.id}
                  className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e7e5e4] dark:border-[#27272a]">
                    <span className="font-serif-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
                      {group.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleItemsList(group.items)}
                      className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] hover:text-[#c84b31] dark:hover:text-[#e05d44] cursor-pointer"
                    >
                      {isGroupAllSelected ? 'Batalkan' : 'Pilih Semua'}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {group.items.map(item => {
                      const isSelected = selectedItemIds.has(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`h-14 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                              : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917]'
                          }`}
                        >
                          <span className="text-xl font-serif-jp leading-none mb-1">{item.character}</span>
                          <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa]">{item.romaji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border-t border-[#e7e5e4] dark:border-[#27272a] p-3 sm:p-4 z-40 transition-colors">
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
