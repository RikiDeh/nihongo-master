import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { VOCAB_DATA } from '../../data/vocabData';
import { JLPTLevel } from '../../types';
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

  const currentFlashcard = filteredVocab[flashcardIndex] || filteredVocab[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev + 1) % filteredVocab.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev - 1 + filteredVocab.length) % filteredVocab.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1e3a8a]/5 dark:bg-[#3b82f6]/10 border border-[#1e3a8a]/20 dark:border-[#3b82f6]/30 text-[#1e3a8a] dark:text-[#3b82f6] text-xs font-mono font-medium mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>[語] PERBENDAHARAAN KOSAKATA N5→N1</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Kosakata Esensial Bahasa Jepang
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-xs sm:text-sm max-w-xl mx-auto font-sans">
          Dengarkan pengucapan audio, pelajari arti bahasa Indonesia, dan perkuat memori dengan mode kartu studi.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Level Filters */}
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
              {(() => {
                const count = lvl === 'ALL'
                  ? VOCAB_DATA.length
                  : VOCAB_DATA.filter(v => v.level === lvl).length;
                return lvl === 'ALL' ? `Semua (${count})` : `${lvl} (${count})`;
              })()}
            </button>
          ))}
        </div>

        {/* Toggles & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Bookmark Filter */}
          <button
            onClick={() => setOnlyBookmarked(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
              onlyBookmarked
                ? 'bg-[#c84b31]/10 border-[#c84b31]/40 text-[#c84b31] dark:text-[#e05d44] font-bold'
                : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
            title="Filter hanya kosakata yang dibintang/bookmark"
          >
            <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-[#c84b31] text-[#c84b31] dark:fill-[#e05d44] dark:text-[#e05d44]' : 'text-[#78716c] dark:text-[#a1a1aa]'}`} />
            <span>Favorit ({bookmarkedCount})</span>
          </button>

          {/* Quiz CTA */}
          {onGoToQuiz && (
            <button
              onClick={onGoToQuiz}
              className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white transition cursor-pointer shrink-0 shadow-xs"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Ujian</span>
            </button>
          )}

          {/* Flashcard mode switch */}
          <button
            onClick={() => {
              setFlashcardMode(m => !m);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 border transition cursor-pointer shrink-0 ${
              flashcardMode 
                ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold' 
                : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flashcard</span>
          </button>

          {/* Search */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-[#78716c] dark:text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFlashcardIndex(0);
              }}
              placeholder="Cari kata..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#1c1917] dark:text-[#f4f4f5] placeholder-[#a8a29e] dark:placeholder-[#71717a] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f4f4f5]"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      {availableCategories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 scrollbar-none">
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
                  : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
              }`}
            >
              {cat === 'ALL' ? 'Semua Topik' : cat}
            </button>
          ))}
        </div>
      )}

      {/* FLASHCARD MODE */}
      {flashcardMode && (
        <>
          {filteredVocab.length === 0 ? (
            <div className="max-w-md mx-auto my-12 p-8 text-center bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl shadow-xs">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#c84b31]/10 border border-[#c84b31]/20 flex items-center justify-center text-[#c84b31]">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-serif-jp">
                Tidak Ada Kosakata Ditemukan
              </h3>
              <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-6 leading-relaxed">
                {onlyBookmarked
                  ? 'Belum ada kosakata yang kamu tandai bintang. Klik ikon bintang pada kartu kosakata untuk memasukkannya ke daftar favorit/latihan.'
                  : 'Tidak ada kata yang sesuai dengan filter atau kata kunci pencarian kamu.'}
              </p>
              <div className="flex justify-center gap-3">
                {onlyBookmarked && (
                  <button
                    onClick={() => setOnlyBookmarked(false)}
                    className="px-4 py-2 rounded-lg bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#e7e5e4] text-xs font-semibold text-[#1c1917] dark:text-[#f4f4f5] transition cursor-pointer border border-[#e7e5e4] dark:border-[#3f3f46]"
                  >
                    Lihat Semua Kosakata
                  </button>
                )}
                <button
                  onClick={() => setFlashcardMode(false)}
                  className="px-4 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-xs font-bold text-white transition cursor-pointer"
                >
                  Kembali ke Daftar
                </button>
              </div>
            </div>
          ) : currentFlashcard && (
            <div className="max-w-xl mx-auto my-8">
              <div className="flex items-center justify-between text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3">
                <span className="font-mono">Kartu {flashcardIndex + 1} dari {filteredVocab.length}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b]">
                  JLPT {currentFlashcard.level}
                </span>
              </div>

              <div
                onClick={() => setIsFlipped(f => !f)}
                className="min-h-[280px] bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] dark:hover:border-[#71717a] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition shadow-xs relative select-none"
              >
                {/* Bookmark button on flashcard */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmarkVocab(currentFlashcard.id);
                  }}
                  className="absolute top-4 left-4 p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#c84b31] transition"
                  title={isVocabBookmarked(currentFlashcard.id) ? 'Hapus dari favorit' : 'Tandai favorit/sulit'}
                >
                  <Star className={`w-4 h-4 ${isVocabBookmarked(currentFlashcard.id) ? 'fill-[#c84b31] text-[#c84b31]' : ''}`} />
                </button>

                <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] absolute top-4 right-4 font-mono">
                  Klik kartu untuk membalik
                </span>

                {!isFlipped ? (
                  // Front side: Japanese
                  <div className="animate-pop flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-2">
                      {currentFlashcard.kanji || currentFlashcard.kana}
                    </span>
                    {currentFlashcard.kanji && (
                      <span className="text-lg font-serif-jp text-[#c84b31] mb-1">
                        {currentFlashcard.kana}
                      </span>
                    )}
                    {showRomaji && (
                      <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                        {currentFlashcard.romaji}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakJapanese(currentFlashcard.kanji || currentFlashcard.kana);
                      }}
                      className="mt-4 p-2 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition"
                    >
                      <Volume2 className="w-4 h-4 text-[#2e7d32]" />
                    </button>
                  </div>
                ) : (
                  // Back side: Indonesian & English meaning + Sentence
                  <div className="animate-pop flex flex-col items-center">
                    <span className="text-2xl font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                      {currentFlashcard.meaningId}
                    </span>
                    <span className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-4">
                      {currentFlashcard.meaningEn} • {currentFlashcard.partOfSpeech}
                    </span>

                    {currentFlashcard.exampleSentence && (
                      <div className="p-3 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-left max-w-md w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] uppercase font-mono font-semibold">Contoh Kalimat:</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(currentFlashcard.exampleSentence!.jp);
                            }}
                            className="text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]"
                          >
                            <Volume2 className="w-3 h-3 text-[#2e7d32]" />
                          </button>
                        </div>
                        <div className="text-xs font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                          {currentFlashcard.exampleSentence.jp}
                        </div>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">
                          {currentFlashcard.exampleSentence.id}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Flashcard Navigation */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={handlePrevFlashcard}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() => setIsFlipped(f => !f)}
                  className="px-5 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Balik Kartu
                </button>
                <button
                  onClick={handleNextFlashcard}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-medium transition cursor-pointer"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* STANDARD LIST MODE */}
      {!flashcardMode && (
        <div>
          {/* Counter Display */}
          <div className="flex items-center justify-between text-xs text-[#78716c] dark:text-[#a1a1aa] mb-4 px-1">
            <span className="font-mono">
              Menampilkan <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{displayedVocab.length}</strong> dari <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{filteredVocab.length}</strong> kosakata
            </span>
            {onlyBookmarked && <span className="text-[#c84b31] font-semibold">• Mode Favorit</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedVocab.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#1c1917] dark:hover:border-[#71717a] rounded-xl p-4 transition flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleBookmarkVocab(item.id)}
                        className="p-1 rounded-md text-[#78716c] hover:text-[#c84b31] transition cursor-pointer"
                        title={isVocabBookmarked(item.id) ? 'Hapus dari favorit' : 'Tandai favorit/sulit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isVocabBookmarked(item.id) ? 'fill-[#c84b31] text-[#c84b31]' : 'text-[#78716c]'}`} />
                      </button>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5] dark:bg-[#18181b] text-[#1c1917] dark:text-[#f4f4f5]">
                        {item.level}
                      </span>
                    </div>
                    <span className="text-[11px] font-sans text-[#78716c] dark:text-[#a1a1aa]">
                      {item.category}
                    </span>
                  </div>

                  {/* Word Display */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                      {item.kanji || item.kana}
                    </span>
                    {item.kanji && (
                      <span className="text-sm font-serif-jp text-[#c84b31]">
                        {item.kana}
                      </span>
                    )}
                    {showRomaji && (
                      <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                        ({item.romaji})
                      </span>
                    )}
                  </div>

                  {/* Indonesian Meaning */}
                  <div className="text-sm font-semibold text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                    {item.meaningId}
                  </div>
                  <div className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3">
                    {item.meaningEn}
                  </div>

                  {/* Example sentence */}
                  {item.exampleSentence && (
                    <div className="p-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] mb-2">
                      <div className="flex items-center justify-between text-[11px] font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] mb-1">
                        <span>{item.exampleSentence.jp}</span>
                        <button
                          onClick={() => speakJapanese(item.exampleSentence!.jp)}
                          className="text-[#78716c] hover:text-[#2e7d32] transition"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[10px] text-[#78716c] dark:text-[#a1a1aa]">
                        {item.exampleSentence.id}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between mt-2">
                  <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
                    {item.partOfSpeech}
                  </span>

                  <button
                    onClick={() => speakJapanese(item.kanji || item.kana)}
                    className="flex items-center gap-1 text-[11px] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] px-2 py-1 rounded bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] transition cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3 text-[#2e7d32]" />
                    <span>Pelafalan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredVocab.length && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setVisibleCount(prev => Math.min(filteredVocab.length, prev + 60))}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white dark:bg-[#1f1f23] hover:bg-[#faf8f5] dark:hover:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] text-xs font-bold transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a] shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Muat 60 Item Lagi (Menampilkan {displayedVocab.length} dari {filteredVocab.length})</span>
              </button>
              <button
                onClick={() => {
                  if (filteredVocab.length > 500) {
                    const confirmLoad = window.confirm(
                      `⚠️ Peringatan Performa:\nMemuat ${filteredVocab.length} item sekaligus dapat memperlambat browser.\n\nApakah Anda yakin ingin melanjutkan?`
                    );
                    if (!confirmLoad) return;
                  }
                  setVisibleCount(filteredVocab.length);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] hover:bg-white dark:hover:bg-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] text-xs font-medium transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-center"
              >
                <span>Muat Semua ({filteredVocab.length})</span>
              </button>
            </div>
          )}

          {filteredVocab.length === 0 && (
            <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-8 text-center text-[#78716c] dark:text-[#a1a1aa] text-sm">
              Tidak ada kosakata yang sesuai dengan filter atau pencarian.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
