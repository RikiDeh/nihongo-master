import React, { useState, useEffect } from 'react';
import { KANJI_DATA } from '../../data/kanjiData';
import { CORE_RADICALS_N5 } from '../../data/radicalsData';
import { JLPTLevel, KanjiItem } from '../../types';
import { Search, BookOpen, Volume2, Sparkles, Lightbulb, Play, Layers, Star, CheckCircle2 } from 'lucide-react';
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
}

export const KanjiExplorer: React.FC<KanjiExplorerProps> = ({ onGoToQuiz }) => {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('N5');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKanji, setActiveKanji] = useState<KanjiItem | null>(KANJI_DATA[0]);
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

  const levels: (JLPTLevel | 'ALL')[] = ['N5', 'ALL', 'N4', 'N3', 'N2', 'N1'];

  const n5Categories = [
    { id: 'ALL', label: 'Semua Kategori' },
    { id: 'Angka & Jumlah', label: '🔢 Angka & Jumlah' },
    { id: 'Waktu & Kalender', label: '📅 Waktu & Kalender' },
    { id: 'Alam & Arah', label: '🌲 Alam & Arah' },
    { id: 'Orang & Keluarga', label: '👨‍👩‍👧 Orang & Keluarga' },
    { id: 'Aktivitas & Sekolah', label: '🏫 Aktivitas & Sekolah' },
    { id: 'Benda, Sifat & Tempat', label: '🏙️ Benda & Sifat' },
  ];

  const filteredKanji = KANJI_DATA.filter(item => {
    const matchesLevel = selectedLevel === 'ALL' || item.level === selectedLevel;
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesBookmark = !onlyBookmarked || isKanjiBookmarked(item.id);

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesLevel && matchesCategory && matchesBookmark;

    const matchesSearch = 
      item.kanji.includes(query) ||
      item.meaningId.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query) ||
      item.onyomi.some(on => on.toLowerCase().includes(query)) ||
      item.kunyomi.some(kun => kun.toLowerCase().includes(query));

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Modul Kanji Resmi JLPT N5 (105 Kanji Lengkap + Radikal & Mnemonic)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Masteri Kanji Bahasa Jepang
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Kuasai 105 Kanji resmi tingkat N5 melalui sistem dekonstruksi radikal dan cerita asosiasi visual (*mnemonic*) yang mudah diingat.
        </p>
      </div>

      {/* Main Tabs: Kanji Explorer vs Radical Workshop */}
      <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('kanji')}
            className={`pb-2 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'kanji'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⛩️ Bank Kanji ({filteredKanji.length} Karakter)
          </button>
          <button
            onClick={() => setActiveTab('radicals')}
            className={`pb-2 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'radicals'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🧩 Bengkel Radikal ({CORE_RADICALS_N5.length} Balok Lego)
          </button>
        </div>

        {/* Start Kanji Quiz Button */}
        {activeTab === 'kanji' && (
          <div className="flex items-center gap-2">
            {onGoToQuiz && (
              <button
                onClick={onGoToQuiz}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition cursor-pointer"
              >
                <span>Pusat Ujian & Kuis</span>
              </button>
            )}
            <button
              onClick={() => setShowQuizModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/25 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Kuis Hafalan Kanji</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: RADICALS WORKSHOP */}
      {activeTab === 'radicals' && (
        <div className="mb-12">
          <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5 mb-6 text-sm text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-indigo-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Mengapa Harus Belajar Radikal Dulu? (Metode WaniKani & Heisig)</span>
            </h3>
            Kanji bukanlah coretan acak yang harus dihafal membabi buta. Semua kanji tersusun dari kombinasi radikal dasar. Begitu kamu mengenal 22 radikal di bawah ini, menghafal 105 kanji N5 akan terasa seperti menyusun balok LEGO!
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORE_RADICALS_N5.map((rad) => (
              <div
                key={rad.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-jp font-bold text-indigo-400">
                    {rad.radical}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {rad.strokes} Coretan
                  </span>
                </div>

                <div className="text-sm font-bold text-white mb-0.5">
                  {rad.meaningId}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  Nama: <code className="text-slate-300 font-mono">{rad.nameId}</code>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    Contoh di Kanji N5:
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
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 text-xs font-jp font-bold text-slate-200 transition cursor-pointer"
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
        </div>
      )}

      {/* VIEW 2: KANJI EXPLORER */}
      {activeTab === 'kanji' && (
        <>
          {/* Controls: Level & Category & Search */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* JLPT Level filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setSelectedCategory('ALL');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      selectedLevel === lvl
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Semua Level' : lvl === 'N5' ? 'JLPT N5 (105 Kanji)' : lvl}
                  </button>
                ))}
              </div>

              {/* Search and Bookmark Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setOnlyBookmarked(prev => !prev)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                    onlyBookmarked
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Filter hanya kanji yang dibintang/bookmark"
                >
                  <Star className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  <span>Favorit ({bookmarkedCount})</span>
                </button>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kanji, arti, On/Kun..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Category Sub-Filters for N5 */}
            {selectedLevel === 'N5' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-rose-400" />
                  Tema:
                </span>
                {n5Categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-200'
                        : 'bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-white'
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredKanji.map(item => {
                  const isActive = activeKanji?.id === item.id;
                  const isBookmarked = isKanjiBookmarked(item.id);
                  const isMastered = isKanjiMastered(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveKanji(item)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative group ${
                        isActive 
                          ? 'bg-slate-800 border-rose-500/80 shadow-lg ring-1 ring-rose-500/50' 
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      {/* Bookmark button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkKanji(item.id);
                        }}
                        className="absolute top-2.5 left-2.5 p-1 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition"
                        title={isBookmarked ? 'Hapus dari favorit' : 'Tandai sebagai favorit/sulit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                      </button>

                      {/* Level and Mastered badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        {isMastered && (
                          <span title="Sudah dikuasai">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(item.level)}`}>
                          {item.level}
                        </span>
                      </div>

                      <div className="text-4xl sm:text-5xl font-jp font-bold text-white my-2 group-hover:scale-110 transition-transform">
                        {item.kanji}
                      </div>

                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {item.meaningId}
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                        {item.onyomi[0] || item.kunyomi[0]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredKanji.length === 0 && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
                  Tidak ada kanji yang sesuai dengan pencarian atau filter.
                </div>
              )}
            </div>

            {/* Kanji Detailed Inspector with Mnemonic (Right / 5 cols) */}
            <div className="lg:col-span-5">
              {activeKanji ? (
                <div className="sticky top-20 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getLevelBadgeClass(activeKanji.level)}`}>
                        JLPT {activeKanji.level}
                      </span>
                      {activeKanji.category && (
                        <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {activeKanji.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleBookmarkKanji(activeKanji.id)}
                        className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isKanjiBookmarked(activeKanji.id)
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title={isKanjiBookmarked(activeKanji.id) ? 'Hapus dari favorit' : 'Tandai favorit/sulit'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isKanjiBookmarked(activeKanji.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMasteredKanji(activeKanji.id)}
                        className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isKanjiMastered(activeKanji.id)
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title={isKanjiMastered(activeKanji.id) ? 'Batalkan status dikuasai' : 'Tandai sudah dikuasai'}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isKanjiMastered(activeKanji.id) ? 'text-emerald-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => speakJapanese(activeKanji.kanji)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                        title="Dengarkan pengucapan"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Suara</span>
                      </button>
                    </div>
                  </div>

                  {/* Big Character Display */}
                  <div className="text-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-4">
                    <div className="text-8xl font-jp font-bold text-white mb-2">
                      {activeKanji.kanji}
                    </div>
                    <div className="text-xl font-bold text-rose-400">
                      {activeKanji.meaningId}
                    </div>
                    <div className="text-xs text-slate-400">
                      {activeKanji.meaning}
                    </div>
                  </div>

                  {/* MNEMONIC STORY CARD (WaniKani Style) */}
                  {activeKanji.mnemonic && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cerita Pengingat (Mnemonic):</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {activeKanji.mnemonic}
                      </p>
                    </div>
                  )}

                  {/* Readings: Onyomi & Kunyomi */}
                  <div className="space-y-2.5 mb-4">
                    <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                        On'yomi (Bacaan Cina - Katakana):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeKanji.onyomi.length > 0 ? (
                          activeKanji.onyomi.map(on => (
                            <span key={on} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono font-medium">
                              {on}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                        Kun'yomi (Bacaan Jepang Asli - Hiragana):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeKanji.kunyomi.length > 0 ? (
                          activeKanji.kunyomi.map(kun => (
                            <span key={kun} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono font-medium">
                              {kun}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Radicals & Stroke count */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">Jumlah Coretan</span>
                      <span className="text-base font-bold font-mono text-white">{activeKanji.strokes} Strokes</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">Radikal Dasar</span>
                      <span className="text-base font-bold font-jp text-indigo-400">{activeKanji.radicals.join(', ')}</span>
                    </div>
                  </div>

                  {/* Example Compounds */}
                  {activeKanji.examples.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Kosakata Contoh (Jukugo)
                      </h4>
                      <div className="space-y-1.5">
                        {activeKanji.examples.map(ex => (
                          <div 
                            key={ex.word}
                            onClick={() => speakJapanese(ex.word)}
                            className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition cursor-pointer group"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-jp font-bold text-white group-hover:text-rose-400 transition-colors">
                                  {ex.word}
                                </span>
                                <span className="text-xs font-jp text-slate-400">
                                  ({ex.reading})
                                </span>
                              </div>
                              <span className="text-xs text-slate-300">
                                {ex.meaning}
                              </span>
                            </div>
                            <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-sm">
                  Pilih salah satu kanji untuk melihat detail.
                </div>
              )}
            </div>
          </div>
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
