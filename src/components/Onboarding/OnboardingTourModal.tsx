import React, { useState } from 'react';
import { Compass, BookOpen, Swords, Sparkles, X, ChevronRight, ChevronLeft, Check, Layers, HelpCircle } from 'lucide-react';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule?: (module: 'roadmap' | 'kana' | 'dojo' | 'kanji' | 'vocab' | 'quiz') => void;
}

interface TourStep {
  title: string;
  jpSubtitle: string;
  badge: string;
  description: string;
  highlights: { title: string; desc: string }[];
  targetModule?: 'roadmap' | 'kana' | 'dojo' | 'kanji' | 'vocab' | 'quiz';
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Selamat Datang di NihongoMaster',
    jpSubtitle: 'ようこそ！日本語の道へ',
    badge: 'PANDUAN PEMULA',
    description: 'Platform belajar bahasa Jepang otentik dari 0 (Nol) hingga lulus JLPT N1 dengan kurikulum bertahap, latihan refleks, dan sistem Spaced Repetition (SRS).',
    highlights: [
      { title: 'Kurikulum Otentik', desc: 'Rute terstruktur dari Hiragana/Katakana hingga 2.167 Joyō Kanji.' },
      { title: 'Ramah Mobile & Desktop', desc: 'Desain responsif Zen Washi tanpa slider rumit dan tanpa lag.' },
      { title: 'Anti-Lupa (SRS)', desc: 'Algoritma review otomatis yang menjaga materi tetap menempel di ingatan.' },
    ],
    tip: 'Kamu bisa membuka kembali panduan ini kapan saja lewat menu Pengaturan ⚙️.',
  },
  {
    title: '1. Peta Belajar (Roadmap)',
    jpSubtitle: '学習の地図 (Arc 0 → N1)',
    badge: 'LANGKAH PERTAMA',
    description: 'Pusat komando belajarmu. Cukup buka Roadmap setiap hari dan ikuti tombol "Fokus Belajarmu Sekarang" untuk lanjut tanpa perlu bingung harus mulai dari mana.',
    highlights: [
      { title: 'Arc 0: Fondasi Aksara', desc: 'Kuasai 46 Hiragana & 46 Katakana beserta bunyi turunan (Dakuten & Youon).' },
      { title: 'Misi Harian (Daily Quests)', desc: '3 tantangan harian ringkas untuk mempertahankan Streak belajar.' },
      { title: 'Status Progres', desc: 'Lacak persentase penguasaan materi di setiap tingkatan level.' },
    ],
    targetModule: 'roadmap',
    tip: 'Bagi pengguna baru, selesaikan Arc 0 terlebih dahulu sebelum masuk ke Kanji!',
  },
  {
    title: '2. Fondasi Aksara (Kana)',
    jpSubtitle: '仮名の基礎 (Hiragana & Katakana)',
    badge: 'MENU KANA 「あ」',
    description: 'Pelajari bentuk tulisan, bunyi pelafalan asli Tokyo, dan uji refleks membaca secara bertahap per baris.',
    highlights: [
      { title: 'Matriks Gojūon Native', desc: 'Tabel kartu 5-kolom yang pas di layar ponsel tanpa slider geser ke samping.' },
      { title: 'Mode Kuis Refleks', desc: 'Kuis interaktif dengan audio native; kesalahan otomatis diulang sampai hafal.' },
      { title: 'Bantuan Romaji', desc: 'Bisa dinyalakan/dimatikan dengan tombol [Aa] di bilah navigasi.' },
    ],
    targetModule: 'kana',
    tip: 'Gunakan tombol angka 1–4 di keyboard desktop untuk menjawab kuis secepat kilat!',
  },
  {
    title: '3. Mode Latihan & Ujian',
    jpSubtitle: '鍛錬と模擬試験 (Dojo & JLPT)',
    badge: 'MENU LATIHAN ⚔️',
    description: 'Di menu bilah bawah "Latihan", kamu bisa mengakses 2 fasilitas drill utama:',
    highlights: [
      { title: 'Dojo Konjugasi Kata Kerja', desc: 'Latih perubahan bentuk Te, Masu, Nai, Ta, Potensial (bisa), dan Pasif (di-/ter-).' },
      { title: 'Pusat Ujian JLPT (N5→N1)', desc: 'Simulasi Mondai 1 (Bacaan Kanji), Mondai 2 (Ejaan), Mondai 3 (Konteks), & Mondai 4 (Tata Bahasa).' },
      { title: 'Ghost Engine (Remedial)', desc: 'Sistem mencatat soal yang salah dan menyediakan tombol 1-klik untuk drill ulang.' },
    ],
    targetModule: 'dojo',
    tip: 'Soal kuis dijamin 100% sesuai level N yang dipilih tanpa bocor kosakata sulit.',
  },
  {
    title: '4. Pustaka Lengkap & Kamus',
    jpSubtitle: '辞書と文法 (Kanji, Kosakata, Grammar)',
    badge: 'MENU PUSTAKA 📚',
    description: 'Koleksi kamus pintar dengan detail lengkap yang langsung muncul di layar tanpa perlu scroll jauh:',
    highlights: [
      { title: '2.167 Joyō Kanji', desc: 'Dilengkapi jumlah goresan, cerita mnemonik, arti Indonesia, dan bacaan Onyomi/Kunyomi.' },
      { title: '9.177 Kosakata Berkalimat', desc: 'Contoh kalimat otentik untuk memahami cara pakai kata dalam percakapan nyata.' },
      { title: 'Drawer Instan di Mobile', desc: 'Mengetuk kartu langsung memunculkan lembar detail dari bawah layar.' },
    ],
    targetModule: 'kanji',
    tip: 'Tandai materi penting dengan bintang untuk dimasukkan ke ulasan hafalan SRS harian.',
  },
];

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToModule,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleJumpToModule = () => {
    if (step.targetModule && onNavigateToModule) {
      onNavigateToModule(step.targetModule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <div className="relative bg-[#faf8f5] dark:bg-[#18181b] border-2 border-[#c84b31]/40 dark:border-[#e05d44]/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl z-10 flex flex-col text-left overflow-hidden animate-slideUp">
        {/* Glow ambient background accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c84b31]/10 dark:bg-[#e05d44]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e7e5e4] dark:border-[#27272a] relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] border border-[#c84b31]/20">
              {step.badge}
            </span>
            <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
              Langkah {currentStep + 1} dari {TOUR_STEPS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            title="Lewati Panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Japanese Subtitle */}
        <div className="mb-4 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
            {step.title}
          </h2>
          <p className="text-xs font-jp text-[#c84b31] dark:text-[#e05d44] font-medium mt-0.5">
            {step.jpSubtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mt-2 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Step Highlights Cards */}
        <div className="space-y-2.5 mb-5 relative z-10">
          {step.highlights.map((item, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] flex items-start gap-3 shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                ✓
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5] block mb-0.5">
                  {item.title}
                </span>
                <span className="text-[#78716c] dark:text-[#a1a1aa] leading-normal">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Helpful Tip Banner */}
        <div className="p-3 rounded-xl bg-[#c84b31]/5 border border-[#c84b31]/20 text-xs text-[#78716c] dark:text-[#a1a1aa] mb-5 flex items-start gap-2 relative z-10">
          <Sparkles className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44] shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-[#1c1917] dark:text-[#f4f4f5]">Tips:</strong> {step.tip}
          </span>
        </div>

        {/* Progress Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-5 relative z-10">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentStep 
                  ? 'w-6 bg-[#c84b31] dark:bg-[#e05d44]' 
                  : 'w-1.5 bg-[#d6d3d1] dark:bg-[#3f3f46] hover:bg-[#a8a29e]'
              }`}
              title={`Lompat ke langkah ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#e7e5e4] dark:border-[#27272a] relative z-10">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer ${
              isFirst
                ? 'opacity-30 border-transparent text-[#78716c] cursor-not-allowed'
                : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-2">
            {step.targetModule && (
              <button
                type="button"
                onClick={handleJumpToModule}
                className="px-3 py-2.5 rounded-xl text-xs font-medium text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                Coba Buka Sekarang
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#c84b31] dark:bg-[#e05d44] hover:bg-[#a63a23] dark:hover:bg-[#c84b31] text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <span>{isLast ? 'Mulai Belajar Sekarang' : 'Lanjut'}</span>
              {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
