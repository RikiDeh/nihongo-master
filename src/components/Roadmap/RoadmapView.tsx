import React from 'react';
import { Compass, CheckCircle2, Sparkles, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ActiveModule } from '../Navbar';
import { JLPTLevel } from '../../types';
import { getUserProgress } from '../../utils/storage';
import { KANJI_DATA } from '../../data/kanjiData';
import { VOCAB_DATA } from '../../data/vocabData';

interface RoadmapViewProps {
  onNavigate: (module: ActiveModule, level?: JLPTLevel) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onNavigate }) => {
  const progress = getUserProgress();

  // Hitung penguasaan riil per level
  const calcLevelProgress = (lvl: JLPTLevel) => {
    const levelKanji = KANJI_DATA.filter(k => k.level === lvl);
    const levelVocab = VOCAB_DATA.filter(v => v.level === lvl);
    const totalItems = levelKanji.length + levelVocab.length;
    if (totalItems === 0) return 0;

    const masteredCount = 
      levelKanji.filter(k => progress.masteredKanjiIds.includes(k.id)).length +
      levelVocab.filter(v => progress.masteredVocabIds.includes(v.id)).length;

    return Math.round((masteredCount / totalItems) * 100);
  };

  const steps = [
    {
      level: 'Level 0',
      title: 'Kana Gateway (Hiragana & Katakana)',
      tag: 'Fondasi Utama (0 ke Pemula)',
      desc: 'Kuasai 46 Hiragana + 46 Katakana beserta Dakuten dan Kombinasi (Yōon). Wajib 100% lancar sebelum melangkah ke Kanji.',
      target: '92+ Huruf (Kecepatan < 2 detik per karakter)',
      moduleAction: 'kana' as ActiveModule,
      targetLevel: undefined,
      actionLabel: 'Mulai Kuis Kana',
      progressPercent: progress.quizHistory.some(q => q.category.toLowerCase().includes('kana')) ? 100 : 0,
      color: 'from-rose-500 to-pink-600',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      items: ['Hiragana Gojūon, Dakuten & Handakuten', 'Katakana untuk kata serapan asing', 'Kombinasi Yōon (kya, sha, chu, dsb.)'],
    },
    {
      level: 'JLPT N5',
      title: 'Dasar Percakapan Sehari-hari',
      tag: 'Pemula (Beginner)',
      desc: 'Mulai membaca kanji dasar, angka, hari, partikel (wa, ga, o, ni, de), dan bentuk sopan (~desu / ~masu).',
      target: '~100 Kanji • ~800 Kosakata • Pola Kalimat Dasar',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N5' as JLPTLevel,
      actionLabel: 'Buka Materi N5',
      progressPercent: calcLevelProgress('N5'),
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      items: ['Partikel esensial (は, が, を, に, で)', 'Konjugasi kata kerja dasar (bentuk-て, bentuk-ます)', 'Kanji angka, alam, keluarga, dan waktu'],
    },
    {
      level: 'JLPT N4',
      title: 'Komunikasi Terapan & Pengandaian',
      tag: 'Menengah Bawah (Elementary)',
      desc: 'Mampu berbicara mengenai pengalaman, memberi saran, kalimat pengandaian (~tara, ~ba), bentuk pasif dan kausatif.',
      target: '~300 Kanji • ~1,500 Kosakata • Pemahaman Bacaan Pendek',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N4' as JLPTLevel,
      actionLabel: 'Buka Materi N4',
      progressPercent: calcLevelProgress('N4'),
      color: 'from-sky-500 to-blue-600',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      items: ['Bentuk pengandaian (~tara, ~nara, ~ba)', 'Keigo dasar (bahasa sopan/hormat)', 'Pemahaman dialog kehidupan di Jepang'],
    },
    {
      level: 'JLPT N3',
      title: 'Jembatan Menengah (The Intermediate Bridge)',
      tag: 'Menengah (Intermediate)',
      desc: 'Titik perubahan krusial: mampu memahami berita sederhana, artikel koran ringan, dan percakapan tempo alami tanpa furigana konstan.',
      target: '~650 Kanji • ~3,500 Kosakata • Bacaan Menengah',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N3' as JLPTLevel,
      actionLabel: 'Buka Materi N3',
      progressPercent: calcLevelProgress('N3'),
      color: 'from-indigo-500 to-violet-600',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      items: ['Pembedaan transitif & intransitif', 'Tata bahasa bernuansa (~wake, ~you ni, ~hazu)', 'Percakapan natural penutur asli'],
    },
    {
      level: 'JLPT N2',
      title: 'Bahasa Bisnis & Media Profesional',
      tag: 'Mahir Bawah (Business Fluent)',
      desc: 'Standar minimum untuk bekerja di perusahaan Jepang atau kuliah di universitas Jepang. Mampu membaca editorial dan mendengar debat.',
      target: '~1,000 Kanji • ~6,000 Kosakata • Artikel Opini & Berita',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N2' as JLPTLevel,
      actionLabel: 'Buka Materi N2',
      progressPercent: calcLevelProgress('N2'),
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      items: ['Ekspresi bisnis dan keigo lanjutan', 'Membaca cepat artikel opini dan esai', 'Idiom majemuk profesional'],
    },
    {
      level: 'JLPT N1',
      title: 'Puncak Kemahiran Bahasa (Native Fluency)',
      tag: 'Mahir Penuh (Mastery / Native Level)',
      desc: 'Tingkat tertinggi: mampu memahami nuansa tulisan sastra, dokumen hukum, debat filosofis, dan idiom 4 huruf (Yojijukugo).',
      target: '~2,000+ Kanji • ~10,000+ Kosakata • Literatur & Berita Kompleks',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N1' as JLPTLevel,
      actionLabel: 'Buka Materi N1',
      progressPercent: calcLevelProgress('N1'),
      color: 'from-rose-600 to-red-700',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      items: ['Yojijukugo (四字熟語 - Idiom 4 Karakter)', 'Tata bahasa sastra & ekspresi kuno/formal', 'Membaca artikel kritik ilmiah dan filsafat'],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>The 0 to N1 Roadmap</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Peta Jalan: Dari Nol Hingga N1
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Panduan langkah demi langkah yang terbukti untuk membimbingmu dari baru mengenal huruf Jepang hingga level penguasaan tertinggi.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-7 sm:before:left-8 before:w-0.5 before:bg-slate-800 before:-z-0">
        {steps.map((step) => (
          <div
            key={step.level}
            className="relative z-10 flex items-start gap-4 sm:gap-6 group"
          >
            {/* Number Indicator */}
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-sm sm:text-base shadow-xl shrink-0 border border-white/20 group-hover:scale-105 transition-transform`}>
              {step.level}
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {step.title}
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${step.badgeColor} self-start sm:self-auto`}>
                  {step.tag}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                {step.desc}
              </p>

              {/* Targets & Live Mastery Bar */}
              <div className="space-y-2 mb-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Target: <strong>{step.target}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-sans font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Kuasai: {step.progressPercent}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.max(step.progressPercent, 4)}%` }}
                  />
                </div>
              </div>

              {/* Items checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {step.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Multi-Action Navigator (TIKET 17.4) */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                {step.targetLevel ? (
                  <>
                    <button
                      onClick={() => onNavigate('kanji', step.targetLevel)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-slate-700/60 shadow-sm"
                      title={`Buka Bank Kanji ${step.targetLevel}`}
                    >
                      <span>🈁 Kanji</span>
                      <ArrowUpRight className="w-3 h-3 text-rose-400" />
                    </button>
                    <button
                      onClick={() => onNavigate('vocab', step.targetLevel)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-slate-700/60 shadow-sm"
                      title={`Buka Bank Kosakata ${step.targetLevel}`}
                    >
                      <span>📚 Kosakata</span>
                      <ArrowUpRight className="w-3 h-3 text-sky-400" />
                    </button>
                    <button
                      onClick={() => onNavigate('grammar', step.targetLevel)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-slate-700/60 shadow-sm"
                      title={`Buka Tata Bahasa ${step.targetLevel}`}
                    >
                      <span>📖 Tata Bahasa</span>
                      <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => onNavigate('quiz', step.targetLevel)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
                      title={`Buka Kuis & Ujian ${step.targetLevel}`}
                    >
                      <span>🏆 Kuis</span>
                      <ArrowUpRight className="w-3 h-3 text-rose-400" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onNavigate(step.moduleAction, step.targetLevel)}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-rose-500/20"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
