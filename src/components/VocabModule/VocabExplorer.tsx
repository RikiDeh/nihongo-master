import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { VOCAB_DATA } from '../../data/vocabData';
import { JLPTLevel, VocabItem } from '../../types';
import { Search, Layers, Volume2, RotateCw, Trophy, Star } from 'lucide-react';
import { speakJapanese } from '../../utils/audio';
import { useShowRomaji } from '../../hooks/useShowRomaji';
import { 
  isVocabBookmarked, 
  toggleBookmarkVocab, 
  getUserProgress, 
  subscribeToStorage 
} from '../../utils/storage';

interface VocabExplorerProps {
  onGoToQuiz?: () => void;
  initialLevel?: JLPTLevel | 'ALL';
}

export const VocabExplorer: React.FC<VocabExplorerProps> = ({ onGoToQuiz, initialLevel }) => {
  const [showRomaji] = useShowRomaji();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>(initialLevel || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [visibleCount, setVisibleCount] = useState(60);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeVocab, setActiveVocab] = useState<VocabItem | null>(null);
  const [, setStorageTick] = useState(0);

  // Subscribe ke perubahan localStorage
  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setStorageTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const progress = getUserProgress();
  const bookmarkedCount = progress.bookmarkedVocabIds.length;

  const levels: (JLPTLevel | 'ALL')[] = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

  // Categories available for currently selected level
  const availableCategories = useMemo(() => {
    return [
      'ALL',
      ...Array.from(
        new Set(
          VOCAB_DATA
            .filter(item => selectedLevel === 'ALL' || item.level === selectedLevel)
            .map(item => item.category)
            .filter(Boolean)
        )
      ).sort(),
    ];
  }, [selectedLevel]);

  // Reset pagination jika filter / search berubah
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

  const filteredVocab = useMemo(() => {
    return VOCAB_DATA.filter(item => {
      const matchesLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesBookmark = !onlyBookmarked || progress.bookmarkedVocabIds.includes(item.id);
      const query = deferredSearchQuery.trim().toLowerCase();
      
      if (!query) return matchesLevel && matchesCategory && matchesBookmark;

      const matchesSearch =
        (item.kanji && item.kanji.includes(query)) ||
        item.kana.includes(query) ||
        item.romaji.toLowerCase().includes(query) ||
        item.meaningId.toLowerCase().includes(query) ||
        item.meaningEn.toLowerCase().includes(query);

      return matchesLevel && matchesCategory && matchesBookmark && matchesSearch;
    });
  }, [selectedLevel, selectedCategory, onlyBookmarked, deferredSearchQuery, progress.bookmarkedVocabIds]);

  const displayedVocab = filteredVocab.slice(0, visibleCount);
  const currentInspectorItem = (activeVocab && filteredVocab.some(v => v.id === activeVocab.id))
    ? activeVocab
    : (displayedVocab[0] || null);
  const currentFlashcard = filteredVocab[flashcardIndex] || filteredVocab[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev + 1) % filteredVocab.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev - 1 + filteredVocab.length) % filteredVocab.length);
  };

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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 animate-fadeIn pb-24">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#e7e5e4] dark:border-[#27272a]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 text-[#1e3a8a] dark:text-[#3b82f6] mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>[語彙] 9.177 PERBENDAHARAAN KOSAKATA N5→N1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
            Penjelajah Kosakata Bahasa Jepang
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mt-1 max-w-2xl font-sans">
            Split-pane dictionary view: Jelajahi ribuan leksikon di panel kiri, periksa contoh kalimat mendalam dan pelafalan audio di panel kanan.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {onGoToQuiz && (
            <button
              onClick={onGoToQuiz}
              className="px-3.5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Pusat Ujian</span>
            </button>
          )}

          <button
            onClick={() => {
              setFlashcardMode(m => !m);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition cursor-pointer ${
              flashcardMode 
                ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold' 
                : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{flashcardMode ? 'Tutup Flashcard' : 'Mode Flashcard'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-4 mb-6 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Level Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {levels.map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setSelectedCategory('ALL');
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer shrink-0 border ${
                  selectedLevel === lvl
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                {lvl === 'ALL' ? 'Semua Level' : lvl}
              </button>
            ))}
          </div>

          {/* Search and Bookmark Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setOnlyBookmarked(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
                onlyBookmarked
                  ? 'bg-[#c84b31]/10 border-[#c84b31]/40 text-[#c84b31] dark:text-[#e05d44] font-bold'
                  : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : 'text-[#78716c] dark:text-[#a1a1aa]'}`} />
              <span>Favorit ({bookmarkedCount})</span>
            </button>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#78716c] dark:text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFlashcardIndex(0);
                }}
                placeholder="Cari kanji, kana, arti..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] placeholder-[#a8a29e] dark:placeholder-[#71717a] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f4f4f5]"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        {availableCategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#e7e5e4] dark:border-[#27272a]">
            <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] uppercase mr-1 shrink-0">
              KATEGORI:
            </span>
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-sans transition cursor-pointer shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-[#1e3a8a]/10 dark:bg-[#3b82f6]/15 border-[#1e3a8a]/30 dark:border-[#3b82f6]/40 text-[#1e3a8a] dark:text-[#3b82f6] font-bold'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                {cat === 'ALL' ? 'Semua Topik' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FLASHCARD MODE OVERLAY */}
      {flashcardMode && (
        <div className="mb-12">
          {filteredVocab.length === 0 ? (
            <div className="max-w-md mx-auto my-12 p-8 text-center bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl shadow-xs">
              <p className="text-xs text-[#78716c] dark:text-[#a1a1aa]">Tidak ada kosakata pada filter ini.</p>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-3 text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                Kartu {flashcardIndex + 1} dari {filteredVocab.length}
              </div>

              <div 
                onClick={() => setIsFlipped(f => !f)}
                className="min-h-[280px] p-8 rounded-2xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] shadow-sm flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all hover:border-[#1c1917]"
              >
                {!isFlipped ? (
                  <div>
                    <span className="text-[11px] font-mono text-[#78716c] uppercase mb-3 block">
                      [{currentFlashcard.level}] {currentFlashcard.category}
                    </span>
                    <div className="text-5xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-2">
                      {currentFlashcard.kanji || currentFlashcard.kana}
                    </div>
                    {currentFlashcard.kanji && (
                      <div className="text-lg font-jp text-[#c84b31] dark:text-[#e05d44]">
                        {currentFlashcard.kana}
                      </div>
                    )}
                    <span className="text-xs text-[#a8a29e] dark:text-[#71717a] mt-6 block">
                      Klik untuk melihat arti & kalimat contoh
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-sans font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                      {currentFlashcard.meaningId}
                    </div>
                    <div className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-4">
                      {currentFlashcard.meaningEn}
                    </div>
                    {currentFlashcard.exampleSentence && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-left text-xs">
                        <div className="font-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                          {currentFlashcard.exampleSentence.jp}
                        </div>
                        <div className="text-[#78716c] dark:text-[#a1a1aa]">
                          {currentFlashcard.exampleSentence.id}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={handlePrevFlashcard}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-medium cursor-pointer"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() => setIsFlipped(f => !f)}
                  className="px-5 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Balik Kartu
                </button>
                <button
                  onClick={handleNextFlashcard}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-medium cursor-pointer"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SPLIT-PANE DICTIONARY VIEW (DESKTOP & MOBILE RESPONSIVE) */}
      {!flashcardMode && (
        <div>
          {/* Counter info */}
          <div className="flex items-center justify-between text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3 px-1">
            <span>
              Menampilkan <strong className="text-[#1c1917] dark:text-[#f4f4f5] font-mono">{displayedVocab.length}</strong> dari <strong className="text-[#1c1917] dark:text-[#f4f4f5] font-mono">{filteredVocab.length}</strong> kosakata
            </span>
            {onlyBookmarked && <span className="text-[#c84b31] dark:text-[#e05d44] font-semibold font-mono">[FAVORIT]</span>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 Cols): Vocab Directory List */}
            <div className="lg:col-span-7 space-y-2">
              {displayedVocab.map(item => {
                const isActive = currentInspectorItem?.id === item.id;
                const isBookmarked = isVocabBookmarked(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveVocab(item)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isActive 
                        ? 'bg-white dark:bg-[#27272a] border-[#1c1917] dark:border-[#f4f4f5] shadow-xs ring-1 ring-[#1c1917] dark:ring-[#f4f4f5]' 
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] dark:hover:border-[#f4f4f5]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Bookmark icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkVocab(item.id);
                        }}
                        className="text-[#a8a29e] hover:text-[#c84b31] transition shrink-0"
                      >
                        <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : ''}`} />
                      </button>

                      {/* Level Badge */}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${getLevelBadgeClass(item.level)}`}>
                        {item.level}
                      </span>

                      {/* Word Info */}
                      <div className="truncate">
                        <div className="flex items-baseline gap-2">
                          <span className="font-jp font-bold text-base text-[#1c1917] dark:text-[#f4f4f5]">
                            {item.kanji || item.kana}
                          </span>
                          {item.kanji && (
                            <span className="text-xs font-jp text-[#78716c] dark:text-[#a1a1aa]">
                              {item.kana}
                            </span>
                          )}
                          {showRomaji && (
                            <span className="text-[11px] font-mono text-[#a8a29e] dark:text-[#71717a]">
                              ({item.romaji})
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] truncate mt-0.5">
                          {item.meaningId}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakJapanese(item.kanji || item.kana);
                      }}
                      className="p-1.5 rounded-md hover:bg-[#faf8f5] dark:hover:bg-[#18181b] text-[#78716c] hover:text-[#2e7d32] dark:hover:text-[#4ade80] transition shrink-0"
                      title="Dengarkan pengucapan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Load More Button */}
              {visibleCount < filteredVocab.length && (
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setVisibleCount(prev => Math.min(filteredVocab.length, prev + 60))}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white dark:bg-[#1f1f23] hover:bg-[#faf8f5] dark:hover:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-bold transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a] shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Muat 60 Lagi ({displayedVocab.length}/{filteredVocab.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      if (filteredVocab.length > 500) {
                        const confirmLoad = window.confirm(`Peringatan: Memuat ${filteredVocab.length} item dapat memperlambat browser.`);
                        if (!confirmLoad) return;
                      }
                      setVisibleCount(filteredVocab.length);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] text-[#78716c] text-xs font-medium border border-[#e7e5e4] dark:border-[#27272a] cursor-pointer"
                  >
                    <span>Muat Semua ({filteredVocab.length})</span>
                  </button>
                </div>
              )}

              {filteredVocab.length === 0 && (
                <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-8 text-center text-xs text-[#78716c] dark:text-[#a1a1aa]">
                  Tidak ada kosakata yang cocok dengan kata kunci pencarian.
                </div>
              )}
            </div>

            {/* Right Column (5 Cols): Sticky Card Inspector Detail */}
            <div className="lg:col-span-5">
              {currentInspectorItem ? (
                <div className="sticky top-20 bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 shadow-sm">
                  {/* Top Header of Inspector */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLevelBadgeClass(currentInspectorItem.level)}`}>
                        [{currentInspectorItem.level}]
                      </span>
                      <span className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] px-2 py-0.5 rounded bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                        {currentInspectorItem.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleBookmarkVocab(currentInspectorItem.id)}
                        className="p-1.5 rounded-md border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#78716c] hover:text-[#c84b31] transition"
                        title={isVocabBookmarked(currentInspectorItem.id) ? 'Hapus favorit' : 'Tandai favorit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isVocabBookmarked(currentInspectorItem.id) ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => speakJapanese(currentInspectorItem.kanji || currentInspectorItem.kana)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#2e7d32] dark:hover:text-[#4ade80] text-xs font-sans transition cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                        <span>Dengar</span>
                      </button>
                    </div>
                  </div>

                  {/* Big Hero Word Display */}
                  <div className="text-center py-6 bg-[#faf8f5] dark:bg-[#18181b] rounded-lg border border-[#e7e5e4] dark:border-[#27272a] mb-5">
                    <div className="text-4xl sm:text-5xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-2 leading-none">
                      {currentInspectorItem.kanji || currentInspectorItem.kana}
                    </div>
                    {currentInspectorItem.kanji && (
                      <div className="text-lg font-jp text-[#c84b31] dark:text-[#e05d44] mb-1">
                        {currentInspectorItem.kana}
                      </div>
                    )}
                    <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                      ({currentInspectorItem.romaji})
                    </div>
                  </div>

                  {/* Meaning section */}
                  <div className="mb-5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">
                      Arti Bahasa Indonesia
                    </div>
                    <div className="text-base font-sans font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                      {currentInspectorItem.meaningId}
                    </div>
                    {currentInspectorItem.meaningEn && (
                      <div className="text-xs font-sans text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
                        {currentInspectorItem.meaningEn}
                      </div>
                    )}
                  </div>

                  {/* Part of Speech & Meta */}
                  <div className="grid grid-cols-2 gap-2 mb-5 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                      <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase">Kelas Kata</span>
                      <span className="font-semibold text-[#1c1917] dark:text-[#f4f4f5]">{currentInspectorItem.partOfSpeech}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                      <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase">Tingkatan</span>
                      <span className="font-bold text-[#c84b31] dark:text-[#e05d44]">{currentInspectorItem.level}</span>
                    </div>
                  </div>

                  {/* Example sentence */}
                  {currentInspectorItem.exampleSentence ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa]">
                          Contoh Kalimat Otentik [例文]
                        </span>
                        <button
                          type="button"
                          onClick={() => speakJapanese(currentInspectorItem.exampleSentence!.jp)}
                          className="text-[#78716c] hover:text-[#2e7d32] transition p-1"
                          title="Dengar contoh kalimat"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                        </button>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                        <div className="text-sm font-jp text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed mb-1.5">
                          {currentInspectorItem.exampleSentence.jp}
                        </div>
                        <div className="text-xs text-[#78716c] dark:text-[#a1a1aa] leading-relaxed">
                          {currentInspectorItem.exampleSentence.id}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center text-xs text-[#78716c]">
                      Contoh kalimat sedang disusun untuk entri kosakata ini.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-8 text-center text-xs text-[#78716c] dark:text-[#a1a1aa]">
                  Pilih salah satu kosakata di sebelah kiri untuk melihat rincian kalimat contoh.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
