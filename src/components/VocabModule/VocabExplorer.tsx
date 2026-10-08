import React, { useState, useEffect } from 'react';
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
  const availableCategories = [
    'ALL',
    ...Array.from(
      new Set(
        VOCAB_DATA
          .filter(item => selectedLevel === 'ALL' || item.level === selectedLevel)
          .map(item => item.category)
          .filter(Boolean)
      )
    ),
  ];

  const filteredVocab = VOCAB_DATA.filter(item => {
    const matchesLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesBookmark = !onlyBookmarked || isVocabBookmarked(item.id);
    const query = searchQuery.trim().toLowerCase();
    
    if (!query) return matchesLevel && matchesCategory && matchesBookmark;

    const matchesSearch =
      (item.kanji && item.kanji.includes(query)) ||
      item.kana.includes(query) ||
      item.romaji.toLowerCase().includes(query) ||
      item.meaningId.toLowerCase().includes(query) ||
      item.meaningEn.toLowerCase().includes(query);

    return matchesLevel && matchesCategory && matchesBookmark && matchesSearch;
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Perbendaharaan Kosakata (Vocab Vault)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Kosakata Esensial N5 s/d N1
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Dengarkan pengucapan asli, pelajari arti bahasa Indonesia, dan uji ingatanmu dengan mode kartu hafalan (flashcard).
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {levels.map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setSelectedCategory('ALL');
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedLevel === lvl
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {lvl === 'ALL' ? 'Semua Level' : lvl}
            </button>
          ))}
        </div>

        {/* Toggles & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Bookmark Filter */}
          <button
            onClick={() => setOnlyBookmarked(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
              onlyBookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Filter hanya kosakata yang dibintang/bookmark"
          >
            <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>Favorit ({bookmarkedCount})</span>
          </button>

          {/* Quiz CTA */}
          {onGoToQuiz && (
            <button
              onClick={onGoToQuiz}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition cursor-pointer shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kuis Vocab</span>
            </button>
          )}

          {/* Flashcard mode switch */}
          <button
            onClick={() => {
              setFlashcardMode(m => !m);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer shrink-0 ${
              flashcardMode 
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-200' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Mode Flashcard</span>
          </button>

          {/* Search */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFlashcardIndex(0);
              }}
              placeholder="Cari kata..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      {availableCategories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Kategori:
          </span>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-500/25'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
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
            <div className="max-w-md mx-auto my-12 p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Tidak Ada Kosakata Ditemukan
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {onlyBookmarked
                  ? 'Belum ada kosakata yang kamu tandai bintang ⭐. Klik ikon bintang pada kartu kosakata untuk memasukkannya ke daftar favorit/latihan.'
                  : 'Tidak ada kata yang sesuai dengan filter atau kata kunci pencarian kamu.'}
              </p>
              <div className="flex justify-center gap-3">
                {onlyBookmarked && (
                  <button
                    onClick={() => setOnlyBookmarked(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                  >
                    Lihat Semua Kosakata
                  </button>
                )}
                <button
                  onClick={() => setFlashcardMode(false)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white transition"
                >
                  Kembali ke Daftar
                </button>
              </div>
            </div>
          ) : currentFlashcard && (
            <div className="max-w-xl mx-auto my-8">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>Kartu {flashcardIndex + 1} dari {filteredVocab.length}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(currentFlashcard.level)}`}>
                  JLPT {currentFlashcard.level}
                </span>
              </div>

              <div
                onClick={() => setIsFlipped(f => !f)}
                className="min-h-[280px] bg-slate-900 border-2 border-slate-700 hover:border-slate-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-2xl relative select-none"
              >
                {/* Bookmark button on flashcard */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmarkVocab(currentFlashcard.id);
                  }}
                  className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition"
                  title={isVocabBookmarked(currentFlashcard.id) ? 'Hapus dari favorit' : 'Tandai favorit/sulit'}
                >
                  <Star className={`w-4 h-4 ${isVocabBookmarked(currentFlashcard.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                <span className="text-[11px] text-slate-400 absolute top-4 right-4">
                  Klik kartu untuk membalik
                </span>

                {!isFlipped ? (
                  // Front side: Japanese
                  <div className="animate-pop flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl font-jp font-bold text-white mb-2">
                      {currentFlashcard.kanji || currentFlashcard.kana}
                    </span>
                    {currentFlashcard.kanji && (
                      <span className="text-lg font-jp text-rose-400 mb-1">
                        {currentFlashcard.kana}
                      </span>
                    )}
                    {showRomaji && (
                      <span className="text-xs font-mono text-slate-400">
                        {currentFlashcard.romaji}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakJapanese(currentFlashcard.kanji || currentFlashcard.kana);
                      }}
                      className="mt-4 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                ) : (
                  // Back side: Indonesian & English meaning + Sentence
                  <div className="animate-pop flex flex-col items-center">
                    <span className="text-2xl font-bold text-emerald-400 mb-1">
                      {currentFlashcard.meaningId}
                    </span>
                    <span className="text-xs text-slate-400 mb-4">
                      {currentFlashcard.meaningEn} • {currentFlashcard.partOfSpeech}
                    </span>

                    {currentFlashcard.exampleSentence && (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-left max-w-md w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Contoh Kalimat:</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(currentFlashcard.exampleSentence!.jp);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <Volume2 className="w-3 h-3 text-emerald-400" />
                          </button>
                        </div>
                        <div className="text-xs font-jp text-white mb-1">
                          {currentFlashcard.exampleSentence.jp}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {currentFlashcard.exampleSentence.id}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Flashcard Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handlePrevFlashcard}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() => setIsFlipped(f => !f)}
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition cursor-pointer"
                >
                  Balik Kartu
                </button>
                <button
                  onClick={handleNextFlashcard}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map(item => (
            <div
              key={item.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleBookmarkVocab(item.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                      title={isVocabBookmarked(item.id) ? 'Hapus dari favorit' : 'Tandai favorit/sulit'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isVocabBookmarked(item.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                    </button>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(item.level)}`}>
                      {item.level}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {item.category}
                  </span>
                </div>

                {/* Word Display */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-jp font-bold text-white">
                    {item.kanji || item.kana}
                  </span>
                  {item.kanji && (
                    <span className="text-sm font-jp text-rose-400">
                      {item.kana}
                    </span>
                  )}
                  {showRomaji && (
                    <span className="text-xs font-mono text-slate-400">
                      ({item.romaji})
                    </span>
                  )}
                </div>

                {/* Indonesian Meaning */}
                <div className="text-sm font-semibold text-slate-100 mb-1">
                  {item.meaningId}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  {item.meaningEn}
                </div>

                {/* Example sentence */}
                {item.exampleSentence && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-2">
                    <div className="flex items-center justify-between text-[11px] font-jp text-slate-200 mb-1">
                      <span>{item.exampleSentence.jp}</span>
                      <button
                        onClick={() => speakJapanese(item.exampleSentence!.jp)}
                        className="text-slate-500 hover:text-emerald-400 transition"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.exampleSentence.id}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {item.partOfSpeech}
                </span>

                <button
                  onClick={() => speakJapanese(item.kanji || item.kana)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>Pelafalan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
