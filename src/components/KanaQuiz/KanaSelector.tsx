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
  onStartQuiz: (selectedItems: KanaItem[], requeueMistakes?: boolean) => void;
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
    onStartQuiz(items, requeueMistakes);
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

  // Helper function to check if all items in a group set are selected
  const areAllItemsSelected = (items: KanaItem[]) => {
    return items.length > 0 && items.every(i => selectedItemIds.has(i.id));
  };

  // Group definitions for presets
  const hiraganaAllItems = [
    ...HIRAGANA_GOJUUON_GROUPS, ...HIRAGANA_DAKUTEN_GROUPS, ...HIRAGANA_YOON_GROUPS
  ].flatMap(g => g.items);

  const katakanaAllItems = [
    ...KATAKANA_GOJUUON_GROUPS, ...KATAKANA_DAKUTEN_GROUPS, ...KATAKANA_YOON_GROUPS
  ].flatMap(g => g.items);

  const gojuuonBothItems = [
    ...HIRAGANA_GOJUUON_GROUPS, ...KATAKANA_GOJUUON_GROUPS
  ].flatMap(g => g.items);

  const allItemsList = [
    ...hiraganaAllItems, ...katakanaAllItems
  ];

  // Active status for presets
  const isGojuuonBothActive = areAllItemsSelected(gojuuonBothItems);
  const isHiraganaAllActive = areAllItemsSelected(hiraganaAllItems);
  const isKatakanaAllActive = areAllItemsSelected(katakanaAllItems);
  const isAllActive = areAllItemsSelected(allItemsList);

  const togglePresetItems = (targetItems: KanaItem[]) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      const allSelected = targetItems.every(i => next.has(i.id));
      if (allSelected) {
        targetItems.forEach(i => next.delete(i.id));
      } else {
        targetItems.forEach(i => next.add(i.id));
      }
      return next;
    });
  };

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
          <h1 className="text-2xl sm:text-3xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
            Pusat Latihan Aksara Kana
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mt-1 max-w-2xl font-sans">
            Tabel fonetis autentik Jepang (A-I-U-E-O × Baris Konsonan). Pilih aksara per-kolom vokal, per-baris, atau gunakan preset cepat.
          </p>
        </div>

        {/* Script Switcher: Hiragana vs Katakana (Full-width on mobile) */}
        <div className="flex items-center p-1 bg-[#f4f0e8]/80 dark:bg-[#1f1f23]/80 border border-[#e7e5e4] dark:border-[#27272a] rounded-xl w-full sm:w-auto shadow-xs">
          <button
            type="button"
            onClick={() => setScriptType('hiragana')}
            className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              scriptType === 'hiragana'
                ? 'bg-white dark:bg-[#27272a] text-[#c84b31] dark:text-[#e05d44] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46]'
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <span className="font-jp text-sm font-bold">あ</span>
            <span>Hiragana (平仮名)</span>
            {isHiraganaAllActive && (
              <span className="w-2 h-2 rounded-full bg-[#c84b31] dark:bg-[#e05d44]" title="Semua Hiragana terpilih" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setScriptType('katakana')}
            className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              scriptType === 'katakana'
                ? 'bg-white dark:bg-[#27272a] text-[#1e3a8a] dark:text-[#3b82f6] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46]'
                : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <span className="font-jp text-sm font-bold">ア</span>
            <span>Katakana (片仮名)</span>
            {isKatakanaAllActive && (
              <span className="w-2 h-2 rounded-full bg-[#1e3a8a] dark:bg-[#3b82f6]" title="Semua Katakana terpilih" />
            )}
          </button>
        </div>
      </div>

      {/* Control Strip & Presets */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#e7e5e4] dark:border-[#27272a]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mr-1 shrink-0">Tabel:</span>
            {[
              { id: 'gojuuon', label: '50 Bunyi Dasar (Gojūon)' },
              { id: 'dakuten', label: 'Bunyi Keruh (Dakuten)' },
              { id: 'yoon', label: 'Bunyi Kombinasi (Yōon)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryView(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border whitespace-nowrap shrink-0 ${
                  categoryView === tab.id
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-[#78716c] dark:text-[#a1a1aa]">Terpilih:</span>
            <span className="px-3 py-1 rounded-lg border border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 font-bold">
              {selectedTotal} Karakter
            </span>
          </div>
        </div>

        {/* Quick Presets Buttons (Scrollable chips on mobile, clean layout) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mr-1 shrink-0">Preset:</span>
          
          {/* Preset: Dasar 46 Keduanya */}
          <button
            type="button"
            onClick={() => togglePresetItems(gojuuonBothItems)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              isGojuuonBothActive
                ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
            }`}
            title={isGojuuonBothActive ? 'Klik untuk membatalkan pilihan Dasar 46' : 'Klik untuk memilih Dasar 46'}
          >
            <span className="font-mono text-[10px] font-bold">{isGojuuonBothActive ? '✓' : '+'}</span>
            <span>Dasar 46</span>
          </button>

          {/* Preset: Semua Hiragana */}
          <button
            type="button"
            onClick={() => togglePresetItems(hiraganaAllItems)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              isHiraganaAllActive
                ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
            }`}
            title={isHiraganaAllActive ? 'Klik untuk membatalkan semua Hiragana' : 'Klik untuk memilih semua Hiragana'}
          >
            <span className="font-mono text-[10px] font-bold">{isHiraganaAllActive ? '✓' : '+'}</span>
            <span>Semua Hiragana</span>
          </button>

          {/* Preset: Semua Katakana */}
          <button
            type="button"
            onClick={() => togglePresetItems(katakanaAllItems)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              isKatakanaAllActive
                ? 'bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/15 border-[#1e3a8a] dark:border-[#3b82f6] text-[#1e3a8a] dark:text-[#3b82f6] font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
            }`}
            title={isKatakanaAllActive ? 'Klik untuk membatalkan semua Katakana' : 'Klik untuk memilih semua Katakana'}
          >
            <span className="font-mono text-[10px] font-bold">{isKatakanaAllActive ? '✓' : '+'}</span>
            <span>Semua Katakana</span>
          </button>

          {/* Preset: Pilih Seluruhnya */}
          <button
            type="button"
            onClick={() => togglePresetItems(allItemsList)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              isAllActive
                ? 'bg-[#1c1917] dark:bg-[#f4f4f5] border-[#1c1917] dark:border-[#f4f4f5] text-white dark:text-[#18181b] font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#e7e5e4] dark:hover:bg-[#27272a] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
            }`}
            title={isAllActive ? 'Klik untuk membatalkan seluruh pilihan' : 'Klik untuk memilih seluruh Hiragana & Katakana'}
          >
            <span className="font-mono text-[10px] font-bold">{isAllActive ? '✓' : '+'}</span>
            <span>Semua (Hira+Kata)</span>
          </button>

          {/* Separator */}
          <div className="h-5 w-px bg-[#e7e5e4] dark:border-[#27272a] mx-1 shrink-0" />

          {/* Reset button */}
          <button
            type="button"
            onClick={() => selectPreset('clear')}
            className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-transparent hover:bg-rose-500/10 border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-rose-600 text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ml-auto"
            title="Kosongkan semua pilihan"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GOJUUON 50-SOUND ORTHODOX MATRIX TABLE */}
      {categoryView === 'gojuuon' && (
        <div className="space-y-4 mb-8">
          {/* MOBILE RESPONSIVE 5-COLUMNS CARD VIEW (Zero Horizontal Scroll!) */}
          <div className="block sm:hidden space-y-3">
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
                <div key={row.rowName} className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-3 shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#e7e5e4]/60 dark:border-[#27272a]/60">
                    <span className="text-xs font-mono font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                      Baris {row.rowName}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleItemsList(rowItems)}
                      className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] flex items-center gap-1"
                    >
                      <span>{isRowAllSelected ? '✓ Batalkan' : '+ Pilih Baris'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {row.vowels.map((romaji, idx) => {
                      if (!romaji) {
                        return (
                          <div 
                            key={`empty-${idx}`} 
                            className="h-13 rounded-lg border border-dashed border-[#e7e5e4]/50 dark:border-[#27272a]/50 bg-black/[0.02] dark:bg-white/[0.01] flex items-center justify-center text-[#d6d3d1] dark:text-[#3f3f46] text-xs font-mono select-none"
                          >
                            —
                          </div>
                        );
                      }

                      const item = itemsByRomaji.get(romaji);
                      if (!item) return <div key={romaji} className="h-13" />;

                      const isSelected = selectedItemIds.has(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`h-13 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer select-none active:scale-95 ${
                            isSelected
                              ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold shadow-xs'
                              : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                          }`}
                        >
                          <span className="text-xl font-jp leading-none mb-0.5">{item.character}</span>
                          <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] leading-none">{item.romaji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special N mobile card */}
            {specialNItem && (
              <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-3 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold block">Konsonan N (撥音)</span>
                  <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">Satu-satunya huruf tanpa vokal</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleItem(specialNItem.id)}
                  className={`w-14 h-13 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer select-none active:scale-95 ${
                    selectedItemIds.has(specialNItem.id)
                      ? 'bg-[#c84b31]/10 dark:bg-[#e05d44]/15 border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold shadow-xs'
                      : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                  }`}
                >
                  <span className="text-xl font-jp leading-none mb-0.5">{specialNItem.character}</span>
                  <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] leading-none">{specialNItem.romaji}</span>
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP MATRIX TABLE (SM AND UP) */}
          <div className="hidden sm:block bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 shadow-xs overflow-x-auto">
            <div className="min-w-[620px]">
            {/* Table Header: Vowel Columns [A, I, U, E, O] */}
            <div className="grid grid-cols-6 gap-2 mb-2 pb-2 border-b border-[#e7e5e4] dark:border-[#27272a] text-center font-mono text-xs font-bold text-[#78716c] dark:text-[#a1a1aa]">
              <div className="text-left font-jp text-xs uppercase text-[#1c1917] dark:text-[#f4f4f5] flex items-center">
                Baris \ Kolom
              </div>
              {['a (段)', 'i (段)', 'u (段)', 'e (段)', 'o (段)'].map((col, idx) => {
                const vowelChar = ['a', 'i', 'u', 'e', 'o'][idx];
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
                          <span className="text-xl sm:text-2xl font-jp leading-none mb-1">
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
                    <span className="text-xl sm:text-2xl font-jp leading-none mb-1">
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
                    <span className="font-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
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
                          <span className="text-xl font-jp leading-none mb-1">{item.character}</span>
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
                    <span className="font-jp font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
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
                          <span className="text-xl font-jp leading-none mb-1">{item.character}</span>
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

      {/* Sticky Bottom Action Dock (Clean Ergonomic Floating Card) */}
      <div className="sticky bottom-16 md:bottom-2 z-20 mt-8 transition-all">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="bg-[#faf8f5]/95 dark:bg-[#18181b]/95 backdrop-blur-md border border-[#e7e5e4] dark:border-[#27272a] p-3.5 sm:p-4 rounded-2xl shadow-xl transition-colors">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              
              {/* Left: Selected Counter & State Info */}
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#d6d3d1] dark:border-[#3f3f46] flex items-center justify-center font-mono font-bold text-[#c84b31] dark:text-[#e05d44] shadow-xs shrink-0">
                    {selectedTotal}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1c1917] dark:text-[#f4f4f5] leading-tight">
                      {selectedTotal > 0 ? `${selectedTotal} Karakter Terpilih` : 'Belum Ada Karakter'}
                    </div>
                    <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] leading-tight mt-0.5">
                      {selectedTotal === 0 ? 'Pilih minimal 1 huruf' : 'Siap untuk uji memori'}
                    </div>
                  </div>
                </div>

                {/* Mobile-only compact mode toggle */}
                <div className="sm:hidden flex items-center gap-1 bg-[#f4f0e8] dark:bg-[#27272a] p-0.5 rounded-lg border border-[#e7e5e4] dark:border-[#3f3f46] text-xs">
                  <button
                    type="button"
                    onClick={() => setRequeueMistakes(true)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                      requeueMistakes
                        ? 'bg-[#c84b31] text-white font-bold shadow-xs'
                        : 'text-[#78716c] dark:text-[#a1a1aa]'
                    }`}
                  >
                    Ulangi
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequeueMistakes(false)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                      !requeueMistakes
                        ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold shadow-xs'
                        : 'text-[#78716c] dark:text-[#a1a1aa]'
                    }`}
                  >
                    1x
                  </button>
                </div>
              </div>

              {/* Right: Controls & CTA Action */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Desktop mode switchers */}
                <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-[#1f1f23] p-1 rounded-xl border border-[#e7e5e4] dark:border-[#27272a] text-xs shadow-xs">
                  <button
                    type="button"
                    onClick={() => setRequeueMistakes(true)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
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
                    className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      !requeueMistakes
                        ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-bold shadow-xs'
                        : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                    }`}
                  >
                    1x Putaran
                  </button>
                </div>

                {/* Primary CTA (Full width on mobile, sleek, thumb-friendly min 46px) */}
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={selectedTotal === 0}
                  className={`w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.98] ${
                    selectedTotal > 0
                      ? 'bg-[#c84b31] hover:bg-[#b03d25] text-white'
                      : 'bg-[#e7e5e4] dark:bg-[#27272a] text-[#a8a29e] dark:text-[#71717a] cursor-not-allowed'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai Sesi Kuis</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
