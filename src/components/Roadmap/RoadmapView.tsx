import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
      level: 'KANA',
      kanjiBadge: '仮名',
      title: 'Kana Gateway (Hiragana & Katakana)',
      tag: 'Fondasi Utama (0 ke Pemula)',
      desc: 'Kuasai 46 Hiragana + 46 Katakana beserta Dakuten dan Kombinasi (Yōon). Wajib lancar refleks sebelum melangkah ke aksara Kanji.',
      target: '92+ Karakter (Refleks baca cepat)',
      moduleAction: 'kana' as ActiveModule,
      targetLevel: undefined,
      actionLabel: 'Mulai Kuis Kana',
      progressPercent: progress.quizHistory.some(q => q.category.toLowerCase().includes('kana')) ? 100 : 0,
      badgeBorder: 'border-[#c84b31]/30 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5',
      items: ['Hiragana Gojūon, Dakuten & Handakuten', 'Katakana untuk serapan kata asing', 'Kombinasi Yōon (kya, sha, chu, dsb.)'],
    },
    {
      level: 'N5',
      kanjiBadge: '初級',
      title: 'Dasar Percakapan Sehari-hari (JLPT N5)',
      tag: 'Pemula (Beginner)',
      desc: 'Mulai membaca kanji dasar, angka, hari, partikel (wa, ga, o, ni, de), dan bentuk sopan (~desu / ~masu).',
      target: '~100 Kanji • ~800 Kosakata • Pola Kalimat Dasar',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N5' as JLPTLevel,
      actionLabel: 'Buka Materi N5',
      progressPercent: calcLevelProgress('N5'),
      badgeBorder: 'border-emerald-500/30 text-[#2e7d32] dark:text-[#4ade80] bg-[#2e7d32]/5',
      items: ['Partikel esensial (は, が, を, に, で)', 'Konjugasi kata kerja dasar (bentuk-て, bentuk-ます)', 'Kanji angka, alam, keluarga, dan waktu'],
    },
    {
      level: 'N4',
      kanjiBadge: '中初',
      title: 'Komunikasi Terapan & Pengandaian (JLPT N4)',
      tag: 'Menengah Bawah (Elementary)',
      desc: 'Mampu berbicara mengenai pengalaman, memberi saran, kalimat pengandaian (~tara, ~ba), bentuk pasif dan kausatif.',
      target: '~300 Kanji • ~1,500 Kosakata • Pemahaman Bacaan Pendek',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N4' as JLPTLevel,
      actionLabel: 'Buka Materi N4',
      progressPercent: calcLevelProgress('N4'),
      badgeBorder: 'border-sky-500/30 text-sky-700 dark:text-sky-300 bg-sky-500/5',
      items: ['Bentuk pengandaian (~tara, ~nara, ~ba)', 'Keigo dasar (bahasa sopan/hormat)', 'Pemahaman dialog kehidupan di Jepang'],
    },
    {
      level: 'N3',
      kanjiBadge: '中級',
      title: 'Jembatan Menengah (The Intermediate Bridge)',
      tag: 'Menengah (Intermediate)',
      desc: 'Titik perubahan krusial: mampu memahami berita sederhana, artikel koran ringan, dan percakapan tempo alami tanpa furigana konstan.',
      target: '~650 Kanji • ~3,500 Kosakata • Bacaan Menengah',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N3' as JLPTLevel,
      actionLabel: 'Buka Materi N3',
      progressPercent: calcLevelProgress('N3'),
      badgeBorder: 'border-[#1e3a8a]/30 text-[#1e3a8a] dark:text-[#60a5fa] bg-[#1e3a8a]/5',
      items: ['Pembedaan transitif & intransitif', 'Tata bahasa bernuansa (~wake, ~you ni, ~hazu)', 'Percakapan natural penutur asli'],
    },
    {
      level: 'N2',
      kanjiBadge: '準上',
      title: 'Bahasa Bisnis & Media Profesional (JLPT N2)',
      tag: 'Mahir Bawah (Business Fluent)',
      desc: 'Standar minimum untuk bekerja di perusahaan Jepang atau universitas Jepang. Mampu membaca editorial dan mendengar debat.',
      target: '~1,000 Kanji • ~6,000 Kosakata • Opini & Berita',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N2' as JLPTLevel,
      actionLabel: 'Buka Materi N2',
      progressPercent: calcLevelProgress('N2'),
      badgeBorder: 'border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/5',
      items: ['Ekspresi bisnis dan keigo lanjutan', 'Membaca cepat artikel opini dan esai', 'Idiom majemuk profesional'],
    },
    {
      level: 'N1',
      kanjiBadge: '上級',
      title: 'Puncak Kemahiran Bahasa (Native Fluency)',
      tag: 'Mahir Penuh (Mastery)',
      desc: 'Tingkat tertinggi: mampu memahami nuansa tulisan sastra, dokumen hukum, debat filosofis, dan idiom 4 huruf (Yojijukugo).',
      target: '~2,000+ Kanji • ~10,000+ Kosakata • Literatur Kompleks',
      moduleAction: 'kanji' as ActiveModule,
      targetLevel: 'N1' as JLPTLevel,
      actionLabel: 'Buka Materi N1',
      progressPercent: calcLevelProgress('N1'),
      badgeBorder: 'border-[#c84b31]/40 text-[#c84b31] dark:text-[#e05d44] bg-[#c84b31]/5 font-bold',
      items: ['Yojijukugo (四字熟語 - Idiom 4 Karakter)', 'Tata bahasa sastra & ekspresi formal', 'Membaca artikel kritik ilmiah dan filsafat'],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Editorial Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#1e3a8a]/25 bg-[#1e3a8a]/5 text-[#1e3a8a] dark:text-[#60a5fa] text-xs font-mono font-medium mb-3">
          <span>[学修系統図] CURRICULUM ROADMAP 0→N1</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Peta Jalan: Dari Nol Hingga Mahir N1
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-sm max-w-xl mx-auto leading-relaxed">
          Panduan langkah demi langkah terstruktur dari pemula total tanpa bekal aksara hingga level kemahiran tertinggi standar JLPT.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-7 before:w-[1px] before:bg-[#e7e5e4] dark:before:bg-[#27272a] before:-z-0">
        {steps.map((step) => (
          <div
            key={step.level}
            className="relative z-10 flex items-start gap-4 sm:gap-6 group"
          >
            {/* Hanko Stamp Level Indicator */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#d6d3d1] dark:border-[#3f3f46] flex flex-col items-center justify-center text-[#1c1917] dark:text-[#f4f4f5] shrink-0 shadow-xs group-hover:border-[#c84b31] transition-colors">
              <span className="font-jp font-bold text-base leading-none text-[#c84b31] dark:text-[#e05d44]">
                {step.kanjiBadge}
              </span>
              <span className="font-mono text-[10px] font-semibold text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
                {step.level}
              </span>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] hover:border-[#d6d3d1] dark:hover:border-[#3f3f46] rounded-xl p-5 sm:p-6 transition-all duration-150 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5]">
                  {step.title}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${step.badgeBorder} self-start sm:self-auto`}>
                  [{step.tag}]
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mb-4 leading-relaxed">
                {step.desc}
              </p>

              {/* Targets & Live Mastery Bar */}
              <div className="space-y-2 mb-4">
                <div className="p-3 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#78716c] dark:text-[#a1a1aa]">
                    Target: <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{step.target}</strong>
                  </span>
                  <span className="text-[#2e7d32] dark:text-[#4ade80] font-bold">
                    Penguasaan: {step.progressPercent}%
                  </span>
                </div>

                {/* Progress bar hairline */}
                <div className="w-full h-1 bg-[#e7e5e4] dark:bg-[#27272a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#c84b31] dark:bg-[#e05d44] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(step.progressPercent, 2)}%` }}
                  />
                </div>
              </div>

              {/* Syllabus points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {step.items.map((it, idx) => (
                  <div key={idx} className="text-[11px] font-sans text-[#78716c] dark:text-[#a1a1aa] bg-[#faf8f5] dark:bg-[#18181b] p-2 rounded border border-[#e7e5e4] dark:border-[#27272a]">
                    • {it}
                  </div>
                ))}
              </div>

              {/* CTA Action */}
              <div className="flex justify-end pt-2 border-t border-[#e7e5e4] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => onNavigate(step.moduleAction, step.targetLevel)}
                  className="px-4 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-xs active:translate-y-px"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
