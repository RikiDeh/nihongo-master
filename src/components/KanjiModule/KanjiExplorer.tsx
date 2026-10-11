import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { KANJI_DATA } from '../../data/kanjiData';
import { CORE_RADICALS_JOYO } from '../../data/radicalsData';
import { JLPTLevel, KanjiItem } from '../../types';
import { Search, BookOpen, Volume2, Sparkles, Lightbulb, Play, Layers, Star, CheckCircle2, X } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';
import { 
  isKanjiBookmarked, 
  toggleBookmarkKanji, 
  isKanjiMastered, 
  toggleMasteredKanji, 
  getUserProgress, 
  subscribeToStorage 
} from '../../utils/storage';
import { KanjiQuizModal } from './KanjiQuizModal';

interface KanjiExplorerProps {
  onGoToQuiz?: () => void;
  initialLevel?: JLPTLevel | 'ALL';
}

export const KanjiExplorer: React.FC<KanjiExplorerProps> = ({ onGoToQuiz, initialLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>(initialLevel || 'N5');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [visibleCount, setVisibleCount] = useState(60);
  const [activeKanji, setActiveKanji] = useState<KanjiItem | null>(KANJI_DATA[0]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [radicalSearch, setRadicalSearch] = useState('');
  const [radicalStrokeFilter, setRadicalStrokeFilter] = useState<number | 'ALL'>('ALL');
  const [, setStorageTick] = useState(0);

  // Subscribe ke perubahan localStorage
  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setStorageTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const progress = getUserProgress();
  const bookmarkedCount = progress.bookmarkedKanjiIds.length;

  // Tab: 'kanji' or 'radicals'
  const [activeTab, setActiveTab] = useState<'kanji' | 'radicals'>('kanji');

  // Quiz modal state
  const [showQuizModal, setShowQuizModal] = useState(false);

  const levels: (JLPTLevel | 'ALL')[] = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

  // Komputasi kategori dinamis berdasarkan level aktif (TIKET 17.3)
  const availableCategories = useMemo(() => {
    const list = selectedLevel === 'ALL'
      ? KANJI_DATA
      : KANJI_DATA.filter(item => item.level === selectedLevel);
    const unique = Array.from(
      new Set(list.map(item => item.category).filter(Boolean))
    ) as string[];

    return [
      { id: 'ALL', label: 'Semua Kategori' },
      ...unique.sort().map(cat => ({ id: cat, label: cat })),
    ];
  }, [selectedLevel]);

  // Reset pagination jika filter / search berubah (React render-phase state adjustment)
  const [prevFilter, setPrevFilter] = useState({
    level: selectedLevel,
    category: selectedCategory,
    bookmarked: onlyBookmarked,
    query: deferredSearchQuery,
  });

  if (
    prevFilter.level !== selectedLevel ||
    prevFilter.category !== selectedCategory ||
    prevFilter.bookmarked !== onlyBookmarked ||
    prevFilter.query !== deferredSearchQuery
  ) {
    setPrevFilter({
      level: selectedLevel,
      category: selectedCategory,
      bookmarked: onlyBookmarked,
      query: deferredSearchQuery,
    });
    setVisibleCount(60);
  }

  const filteredKanji = useMemo(() => {
    return KANJI_DATA.filter(item => {
      const matchesLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesBookmark = !onlyBookmarked || progress.bookmarkedKanjiIds.includes(item.id);

      const query = deferredSearchQuery.trim().toLowerCase();
      if (!query) return matchesLevel && matchesCategory && matchesBookmark;

      const matchesSearch = 
        item.kanji.includes(query) ||
        item.meaningId.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query) ||
        item.onyomi.some(on => on.toLowerCase().includes(query)) ||
        item.kunyomi.some(kun => kun.toLowerCase().includes(query));

      return matchesLevel && matchesCategory && matchesBookmark && matchesSearch;
    });
  }, [selectedLevel, selectedCategory, onlyBookmarked, deferredSearchQuery, progress.bookmarkedKanjiIds]);

  const filteredRadicals = useMemo(() => {
    return CORE_RADICALS_JOYO.filter(rad => {
      if (radicalStrokeFilter !== 'ALL' && rad.strokes !== radicalStrokeFilter) {
        return false;
      }
      const q = radicalSearch.trim().toLowerCase();
      if (!q) return true;
      const matchRadical = rad.radical.includes(q);
      const matchName = rad.nameId.toLowerCase().includes(q);
      const matchMeaning = rad.meaningId.toLowerCase().includes(q);
      const matchExamples = rad.examples.some(ex => ex.includes(q));
      return matchRadical || matchName || matchMeaning || matchExamples;
    });
  }, [radicalStrokeFilter, radicalSearch]);

  const displayedKanji = filteredKanji.slice(0, visibleCount);

  const getLevelBadgeClass = (level: JLPTLevel) => {
    switch (level) {
      case 'N5': return 'bg-[#2e7d32]/10 text-[#2e7d32] dark:text-[#4ade80] border-[#2e7d32]/30';
      case 'N4': return 'bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-[#3b82f6] border-[#1e3a8a]/30';
      case 'N3': return 'bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] border-[#c84b31]/30';
      case 'N2': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'N1': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 text-[#1e3a8a] dark:text-[#3b82f6] text-xs font-mono font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>[漢] 2.167 JOYŌ KANJI RESMI N5→N1</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Perbendaharaan Kanji Jepang
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-xs sm:text-sm max-w-2xl mx-auto font-sans">
          Pelajari kanji melalui dekonstruksi radikal klasik dan cerita asosiasi visual (mnemonic).
        </p>
      </div>

      {/* Main Tabs: Kanji Explorer vs Radical Workshop */}
      <div className="flex items-center justify-between border-b border-[#e7e5e4] dark:border-[#27272a] mb-6 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('kanji')}
            className={`pb-2 px-3 text-xs sm:text-sm font-sans font-medium border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kanji'
                ? 'border-[#c84b31] dark:border-[#e05d44] text-[#c84b31] dark:text-[#e05d44] font-bold'
                : 'border-transparent text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <span className="font-jp font-bold">字</span>
            <span>Bank Kanji ({filteredKanji.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('radicals')}
            className={`pb-2 px-3 text-xs sm:text-sm font-sans font-medium border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'radicals'
                ? 'border-[#1e3a8a] dark:border-[#3b82f6] text-[#1e3a8a] dark:text-[#3b82f6] font-bold'
                : 'border-transparent text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <span className="font-jp font-bold">部</span>
            <span>214 Radikal Kangxi ({CORE_RADICALS_JOYO.length})</span>
          </button>
        </div>

        {/* Start Kanji Quiz Button */}
        {activeTab === 'kanji' && (
          <div className="flex items-center gap-2">
            {onGoToQuiz && (
              <button
                onClick={onGoToQuiz}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1f1f23] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-sans transition cursor-pointer"
              >
                <span>Pusat Ujian</span>
              </button>
            )}
            <button
              onClick={() => setShowQuizModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#c84b31] dark:bg-[#e05d44] hover:bg-[#b03f27] text-white text-xs font-sans font-medium flex items-center gap-1.5 shadow-xs transition cursor-pointer active:translate-y-px"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Kuis Kanji</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: RADICALS WORKSHOP */}
      {activeTab === 'radicals' && (
        <div className="mb-12">
          <div className="bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 rounded-xl p-5 mb-6 text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] leading-relaxed">
            <h3 className="text-sm sm:text-base font-jp font-bold text-[#1e3a8a] dark:text-[#3b82f6] mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1e3a8a] dark:text-[#3b82f6]" />
              <span>214 Radikal Resmi Kangxi Bushu (214部首) & Metode Heisig/WaniKani</span>
            </h3>
            Kanji bukanlah coretan acak yang harus dihafal membabi buta. Semua kanji tersusun dari kombinasi 214 radikal dasar (Kangxi Bushu). Mengenal radikal beserta maknanya akan mengubah hafalan 2.136 Joyō Kanji menjadi proses merangkai balok cerita yang bermakna!
          </div>

          {/* Radical Filters & Search */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-4 mb-6 flex flex-col gap-3 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c] dark:text-[#a1a1aa]" />
                <input
                  type="text"
                  placeholder="Cari radikal, makna (Indo), nama, atau kanji turunan..."
                  value={radicalSearch}
                  onChange={(e) => setRadicalSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-xs sm:text-sm text-[#1c1917] dark:text-[#f4f4f5] focus:outline-hidden focus:ring-1 focus:ring-[#1e3a8a] dark:focus:ring-[#3b82f6]"
                />
                {radicalSearch && (
                  <button
                    onClick={() => setRadicalSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] p-0.5"
                    aria-label="Bersihkan pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-xs text-[#78716c] dark:text-[#a1a1aa] font-mono shrink-0 self-center">
                Ditemukan: <strong className="text-[#1e3a8a] dark:text-[#3b82f6]">{filteredRadicals.length}</strong> / {CORE_RADICALS_JOYO.length}
              </div>
            </div>

            {/* Stroke Count Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] mr-1 shrink-0">Coretan:</span>
              <button
                onClick={() => setRadicalStrokeFilter('ALL')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition shrink-0 cursor-pointer ${
                  radicalStrokeFilter === 'ALL'
                    ? 'bg-[#1e3a8a] text-white font-bold dark:bg-[#3b82f6]'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] dark:text-[#a1a1aa] border border-[#e7e5e4] dark:border-[#27272a] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                Semua
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((str) => (
                <button
                  key={str}
                  onClick={() => setRadicalStrokeFilter(str)}
                  className={`px-2 py-1 rounded-md text-xs font-mono transition shrink-0 cursor-pointer ${
                    radicalStrokeFilter === str
                      ? 'bg-[#1e3a8a] text-white font-bold dark:bg-[#3b82f6]'
                      : 'bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] dark:text-[#a1a1aa] border border-[#e7e5e4] dark:border-[#27272a] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                  }`}
                >
                  {str}画
                </button>
              ))}
            </div>
          </div>

          {filteredRadicals.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1f1f23] rounded-xl border border-[#e7e5e4] dark:border-[#27272a]">
              <p className="text-sm text-[#78716c] dark:text-[#a1a1aa]">Tidak ada radikal yang cocok dengan pencarian &quot;{radicalSearch}&quot;.</p>
              <button
                onClick={() => { setRadicalSearch(''); setRadicalStrokeFilter('ALL'); }}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#1e3a8a] text-white text-xs hover:bg-[#1e3a8a]/90 transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRadicals.map((rad) => (
                <div
                  key={rad.id}
                  className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1e3a8a] dark:hover:border-[#3b82f6] rounded-xl p-4 transition shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-jp font-bold text-[#1e3a8a] dark:text-[#3b82f6]">
                        {rad.radical}
                      </span>
                      <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] px-2 py-0.5 rounded bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                        {rad.strokes} Coretan
                      </span>
                    </div>

                    <div className="text-sm font-sans font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                      {rad.meaningId}
                    </div>
                    <div className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3 font-sans">
                      Nama: <code className="text-[#1c1917] dark:text-[#f4f4f5] font-mono">{rad.nameId}</code>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#27272a]">
                    <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider block mb-1 font-mono">
                      Contoh di Joyō Kanji:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rad.examples.map((ex) => (
                        <span
                          key={ex}
                          onClick={() => {
                            const target = KANJI_DATA.find(k => k.kanji === ex);
                            if (target) {
                              setActiveKanji(target);
                              setActiveTab('kanji');
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#c84b31]/10 hover:text-[#c84b31] dark:hover:bg-[#e05d44]/15 dark:hover:text-[#e05d44] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] transition cursor-pointer"
                          title="Klik untuk lihat kanji ini di penjelajah"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: KANJI EXPLORER */}
      {activeTab === 'kanji' && (
        <>
          {/* Controls: Level & Category & Search */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-4 sm:p-5 mb-8 flex flex-col gap-4 shadow-xs">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* JLPT Level filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {levels.map(lvl => {
                  const count = lvl === 'ALL'
                    ? KANJI_DATA.length
                    : KANJI_DATA.filter(k => k.level === lvl).length;
                  return (
                    <button
                      key={lvl}
                      onClick={() => {
                        setSelectedLevel(lvl);
                        setSelectedCategory('ALL');
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer shrink-0 border ${
                        selectedLevel === lvl
                          ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                          : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                      }`}
                    >
                      {lvl === 'ALL' ? `Semua (${count})` : `${lvl} (${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Search and Bookmark Filter */}
              <div className="flex items-center gap-2.5 w-full lg:w-auto">
                <button
                  onClick={() => setOnlyBookmarked(prev => !prev)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                    onlyBookmarked
                      ? 'bg-[#c84b31]/10 border-[#c84b31]/40 text-[#c84b31] dark:text-[#e05d44] font-bold'
                      : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                  }`}
                  title="Filter hanya kanji yang dibintang/bookmark"
                >
                  <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : 'text-[#78716c] dark:text-[#a1a1aa]'}`} />
                  <span>Favorit ({bookmarkedCount})</span>
                </button>

                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-[#78716c] dark:text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kanji, arti, On/Kun..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] placeholder-[#a8a29e] dark:placeholder-[#71717a] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f4f4f5]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Category Sub-Filters */}
            {availableCategories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#e7e5e4] dark:border-[#27272a]">
                <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] uppercase shrink-0 mr-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#78716c] dark:text-[#a1a1aa]" />
                  TEMA:
                </span>
                {availableCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition cursor-pointer shrink-0 border ${
                      selectedCategory === cat.id
                        ? 'bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/15 border-[#1e3a8a]/30 dark:border-[#3b82f6]/40 text-[#1e3a8a] dark:text-[#3b82f6] font-bold'
                        : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Grid: Kanji List & Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kanji Cards List (Left / 7 cols) */}
            <div className="lg:col-span-7">
              {/* Counter Display (TIKET 17.2) */}
              <div className="flex items-center justify-between text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3 px-1">
                <span>
                  Menampilkan <strong className="text-[#1c1917] dark:text-[#f4f4f5] font-mono">{displayedKanji.length}</strong> dari <strong className="text-[#1c1917] dark:text-[#f4f4f5] font-mono">{filteredKanji.length}</strong> kanji
                </span>
                {onlyBookmarked && <span className="text-[#c84b31] dark:text-[#e05d44] font-semibold font-mono">[FAVORIT]</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayedKanji.map(item => {
                  const isActive = activeKanji?.id === item.id;
                  const isBookmarked = isKanjiBookmarked(item.id);
                  const isMastered = isKanjiMastered(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveKanji(item);
                        setIsMobileDrawerOpen(true);
                      }}
                      className={`p-3.5 rounded-lg border text-center transition cursor-pointer relative group ${
                        isActive 
                          ? 'bg-white dark:bg-[#27272a] border-[#1c1917] dark:border-[#f4f4f5] shadow-xs ring-1 ring-[#1c1917] dark:ring-[#f4f4f5]' 
                          : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] dark:hover:border-[#f4f4f5]'
                      }`}
                    >
                      {/* Bookmark button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkKanji(item.id);
                        }}
                        className="absolute top-2.5 left-2.5 p-1 rounded text-[#a8a29e] dark:text-[#71717a] hover:text-[#c84b31] dark:hover:text-[#e05d44] transition"
                        title={isBookmarked ? 'Hapus dari favorit' : 'Tandai sebagai favorit/sulit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : 'text-[#d6d3d1] dark:text-[#3f3f46]'}`} />
                      </button>

                      {/* Level and Mastered badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        {isMastered && (
                          <span title="Sudah dikuasai">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" />
                          </span>
                        )}
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${getLevelBadgeClass(item.level)}`}>
                          {item.level}
                        </span>
                      </div>

                      <div className="text-4xl sm:text-5xl font-jp font-black text-[#1c1917] dark:text-[#f4f4f5] my-2 group-hover:scale-105 transition-transform">
                        {item.kanji}
                      </div>

                      <div className="text-xs font-sans font-medium text-[#1c1917] dark:text-[#f4f4f5] truncate">
                        {item.meaningId}
                      </div>

                      <div className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] mt-1 truncate">
                        {item.onyomi[0] || item.kunyomi[0]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredKanji.length && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setVisibleCount(prev => Math.min(filteredKanji.length, prev + 60))}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-white dark:bg-[#1f1f23] hover:bg-[#faf8f5] dark:hover:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-sans font-medium transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a] shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Muat 60 Lagi ({displayedKanji.length}/{filteredKanji.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      if (filteredKanji.length > 500) {
                        const confirmLoad = window.confirm(
                          `Peringatan Performa:\nMemuat ${filteredKanji.length} kanji sekaligus dapat mempengaruhi kelancaran browser.\n\nLanjutkan?`
                        );
                        if (!confirmLoad) return;
                      }
                      setVisibleCount(filteredKanji.length);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] hover:bg-[#f4f0e8] dark:hover:bg-[#1f1f23] text-[#78716c] dark:text-[#a1a1aa] text-xs font-sans transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-center"
                  >
                    <span>Muat Semua ({filteredKanji.length})</span>
                  </button>
                </div>
              )}

              {filteredKanji.length === 0 && (
                <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-8 text-center text-[#78716c] dark:text-[#a1a1aa] text-xs font-sans">
                  Tidak ada kanji yang sesuai dengan filter pencarian.
                </div>
              )}
            </div>

            {/* Kanji Detailed Inspector with Mnemonic (Desktop Right Column / 5 cols) */}
            <div className="hidden lg:block lg:col-span-5">
              {activeKanji ? (
                <div className="sticky top-20 bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLevelBadgeClass(activeKanji.level)}`}>
                        [{activeKanji.level}]
                      </span>
                      {activeKanji.category && (
                        <span className="text-[11px] font-sans text-[#78716c] dark:text-[#a1a1aa] px-2 py-0.5 rounded bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                          {activeKanji.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleBookmarkKanji(activeKanji.id)}
                        className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
                          isKanjiBookmarked(activeKanji.id)
                            ? 'bg-[#c84b31]/10 border-[#c84b31]/40 text-[#c84b31] dark:text-[#e05d44]'
                            : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                        }`}
                        title={isKanjiBookmarked(activeKanji.id) ? 'Hapus dari favorit' : 'Tandai favorit/sulit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isKanjiBookmarked(activeKanji.id) ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMasteredKanji(activeKanji.id)}
                        className={`p-1.5 rounded-md border text-xs transition cursor-pointer ${
                          isKanjiMastered(activeKanji.id)
                            ? 'bg-[#2e7d32]/10 border-[#2e7d32]/40 text-[#2e7d32] dark:text-[#4ade80]'
                            : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                        }`}
                        title={isKanjiMastered(activeKanji.id) ? 'Batalkan status dikuasai' : 'Tandai sudah dikuasai'}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isKanjiMastered(activeKanji.id) ? 'text-[#2e7d32] dark:text-[#4ade80]' : ''}`} />
                      </button>

                      <button
                        onClick={() => speakJapanese(activeKanji.kanji)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] text-xs font-sans transition cursor-pointer"
                        title="Dengarkan pengucapan"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#2e7d32] dark:text-[#4ade80]" />
                        <span>Suara</span>
                      </button>
                    </div>
                  </div>

                  {/* Big Character Display */}
                  <div className="text-center py-6 bg-[#faf8f5] dark:bg-[#18181b] rounded-lg border border-[#e7e5e4] dark:border-[#27272a] mb-4">
                    <div className="text-7xl sm:text-8xl font-jp font-black text-[#1c1917] dark:text-[#f4f4f5] mb-2 leading-none">
                      {activeKanji.kanji}
                    </div>
                    <div className="text-lg font-jp font-bold text-[#c84b31] dark:text-[#e05d44]">
                      {activeKanji.meaningId}
                    </div>
                    <div className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa]">
                      {activeKanji.meaning}
                    </div>
                  </div>

                  {/* MNEMONIC STORY CARD (WaniKani Style) */}
                  {activeKanji.mnemonic && (
                    <div className="p-3.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-jp font-bold text-[#c84b31] dark:text-[#e05d44] mb-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Cerita Pengingat [記憶術]:</span>
                      </div>
                      <p className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] leading-relaxed">
                        {activeKanji.mnemonic}
                      </p>
                    </div>
                  )}

                  {/* Readings: Onyomi & Kunyomi */}
                  <div className="space-y-2 mb-4">
                    <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c84b31] dark:text-[#e05d44] block mb-1">
                        [音] On'yomi (Katakana):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeKanji.onyomi.length > 0 ? (
                          activeKanji.onyomi.map(on => (
                            <span key={on} className="px-2 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-mono font-medium">
                              {on}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#a8a29e] dark:text-[#71717a]">—</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1e3a8a] dark:text-[#3b82f6] block mb-1">
                        [訓] Kun'yomi (Hiragana):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeKanji.kunyomi.length > 0 ? (
                          activeKanji.kunyomi.map(kun => (
                            <span key={kun} className="px-2 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#e7e5e4] dark:border-[#3f3f46] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-mono font-medium">
                              {kun}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#a8a29e] dark:text-[#71717a]">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Radicals & Stroke count */}
                  <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-center">
                    <div className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                      <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase">Coretan</span>
                      <span className="text-sm font-bold text-[#1c1917] dark:text-[#f4f4f5]">{activeKanji.strokes} 画</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                      <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase">Radikal</span>
                      <span className="text-sm font-jp font-bold text-[#1e3a8a] dark:text-[#3b82f6]">{activeKanji.radicals.join(', ')}</span>
                    </div>
                  </div>

                  {/* Example Compounds */}
                  {activeKanji.examples.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider mb-2">
                        Kosakata Contoh [熟語]
                      </h4>
                      <div className="space-y-1.5">
                        {activeKanji.examples.map(ex => (
                          <div 
                            key={ex.word}
                            onClick={() => speakJapanese(ex.word)}
                            className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] dark:hover:border-[#f4f4f5] flex items-center justify-between transition cursor-pointer group"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] group-hover:text-[#c84b31] dark:group-hover:text-[#e05d44] transition-colors">
                                  {ex.word}
                                </span>
                                <span className="text-xs font-jp text-[#78716c] dark:text-[#a1a1aa]">
                                  ({ex.reading})
                                </span>
                              </div>
                              <span className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa]">
                                {ex.meaning}
                              </span>
                            </div>
                            <Volume2 className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#71717a] group-hover:text-[#2e7d32] dark:group-hover:text-[#4ade80] transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-8 text-center text-[#78716c] dark:text-[#a1a1aa] text-xs font-sans">
                  Pilih salah satu kanji di sebelah kiri untuk melihat rincian dekonstruksi.
                </div>
              )}
            </div>
          </div>

          {/* MOBILE INSTANT BOTTOM DRAWER (LG:HIDDEN) */}
          {isMobileDrawerOpen && activeKanji && (
            <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
                onClick={() => setIsMobileDrawerOpen(false)}
              />
              <div className="relative bg-[#faf8f5] dark:bg-[#18181b] border-t border-[#e7e5e4] dark:border-[#27272a] rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 pb-28 shadow-2xl z-50 animate-slideUp">
                <div className="w-12 h-1 bg-[#d6d3d1] dark:bg-[#3f3f46] rounded-full mx-auto mb-4" />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLevelBadgeClass(activeKanji.level)}`}>
                      [{activeKanji.level}]
                    </span>
                    {activeKanji.category && (
                      <span className="text-[11px] font-sans text-[#78716c] dark:text-[#a1a1aa] px-2 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#e7e5e4] dark:border-[#27272a]">
                        {activeKanji.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleBookmarkKanji(activeKanji.id)}
                      className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                        isKanjiBookmarked(activeKanji.id)
                          ? 'bg-[#c84b31]/10 border-[#c84b31]/40 text-[#c84b31] dark:text-[#e05d44]'
                          : 'bg-white dark:bg-[#27272a] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isKanjiBookmarked(activeKanji.id) ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-2 rounded-lg bg-white dark:bg-[#27272a] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]"
                      aria-label="Tutup panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Character & Meanings */}
                <div className="text-center py-4 bg-white dark:bg-[#1f1f23] rounded-xl border border-[#e7e5e4] dark:border-[#27272a] mb-4 shadow-xs">
                  <div className="text-7xl font-jp font-black text-[#1c1917] dark:text-[#f4f4f5] mb-2 leading-none">
                    {activeKanji.kanji}
                  </div>
                  <div className="text-lg font-jp font-bold text-[#c84b31] dark:text-[#e05d44]">
                    {activeKanji.meaningId}
                  </div>
                  <div className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
                    {activeKanji.meaning}
                  </div>
                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={() => speakJapanese(activeKanji.kanji)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2e7d32]/10 border border-[#2e7d32]/30 text-[#2e7d32] dark:text-[#4ade80] text-xs font-bold transition cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Putar Audio Pengucapan</span>
                    </button>
                  </div>
                </div>

                {/* Mnemonic Story */}
                {activeKanji.mnemonic && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] mb-3 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-jp font-bold text-[#c84b31] dark:text-[#e05d44] mb-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Cerita Pengingat [記憶術]:</span>
                    </div>
                    <p className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] leading-relaxed">
                      {activeKanji.mnemonic}
                    </p>
                  </div>
                )}

                {/* Readings */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-3 bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#c84b31] dark:text-[#e05d44] block mb-1">
                      [音] On'yomi:
                    </span>
                    <span className="text-xs font-mono font-medium text-[#1c1917] dark:text-[#f4f4f5]">
                      {activeKanji.onyomi.join(', ') || '—'}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1e3a8a] dark:text-[#3b82f6] block mb-1">
                      [訓] Kun'yomi:
                    </span>
                    <span className="text-xs font-mono font-medium text-[#1c1917] dark:text-[#f4f4f5]">
                      {activeKanji.kunyomi.join(', ') || '—'}
                    </span>
                  </div>
                </div>

                {/* Example Compounds */}
                {activeKanji.examples.length > 0 && (
                  <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-3 shadow-xs">
                    <h4 className="text-[11px] font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider mb-2">
                      Kosakata Contoh [熟語]
                    </h4>
                    <div className="space-y-1.5">
                      {activeKanji.examples.slice(0, 3).map(ex => (
                        <div 
                          key={ex.word}
                          onClick={() => speakJapanese(ex.word)}
                          className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-xs text-[#1c1917] dark:text-[#f4f4f5] mr-1.5">{ex.word}</span>
                            <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">({ex.reading})</span>
                            <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">{ex.meaning}</div>
                          </div>
                          <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Interactive Kanji Quiz Modal */}
      {showQuizModal && (
        <KanjiQuizModal
          kanjiList={filteredKanji}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </div>
  );
};
