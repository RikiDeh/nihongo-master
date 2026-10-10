import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  BookOpen, 
  Swords, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Layers, 
  Flame, 
  MousePointerClick,
  Info
} from 'lucide-react';

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule?: (module: 'roadmap' | 'kana' | 'dojo' | 'kanji' | 'vocab' | 'quiz') => void;
}

interface TourStep {
  targetIdDesktop?: string;
  targetIdMobile?: string;
  title: string;
  badge: string;
  description: string;
  actionHint: string;
  moduleToActivate?: 'roadmap' | 'kana' | 'dojo' | 'kanji' | 'vocab' | 'quiz';
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetIdDesktop: 'tour-hero-action',
    targetIdMobile: 'tour-hero-action',
    title: '1. Tombol Mulai Belajar (Hero CTA)',
    badge: 'LANGKAH UTAMA',
    description: 'Ini adalah pusat komando harianmu. Setiap kali membuka aplikasi, kamu tidak perlu bingung memilih materi; cukup klik tombol ini untuk langsung melanjutkan stage belajarmu saat ini.',
    actionHint: 'Klik tombol merah ini untuk langsung memulai materi terdekatmu.',
    moduleToActivate: 'roadmap',
    tip: 'Selesaikan Arc 0 (Hiragana & Katakana) terlebih dahulu sebelum melompat ke Kanji!',
  },
  {
    targetIdDesktop: 'tour-nav-kana',
    targetIdMobile: 'tour-dock-kana',
    title: '2. Menu Kana 「あ」',
    badge: 'FONDASI AKSARA',
    description: 'Menu ini berisi Matriks 50 Bunyi (Gojūon), Dakuten, dan Yoon. Di mobile, kamu akan melihat tampilan kartu 5-kolom yang pas di layar ponsel tanpa slider geser yang merepotkan.',
    actionHint: 'Klik tab Kana untuk melihat tabel huruf dan mulai latihan refleks membaca.',
    tip: 'Di desktop, kamu bisa gunakan tombol angka 1–4 di keyboard saat sesi kuis berlangsung.',
  },
  {
    targetIdDesktop: 'tour-desktop-romaji',
    targetIdMobile: 'tour-header-romaji',
    title: '3. Tombol Bantuan Romaji [Aa / あ]',
    badge: 'BANTUAN CEPAT',
    description: 'Tombol ini untuk menyalakan atau mematikan ejaan abjad Latin (Romaji) secara instan di seluruh kosakata, kanji, dan contoh kalimat.',
    actionHint: 'Klik tombol ini jika ingin melatih mata membaca huruf Jepang asli tanpa bantuan abjad.',
    tip: 'Tersedia di bilah header atas mobile dan di bagian bawah sidebar desktop.',
  },
  {
    targetIdDesktop: 'tour-desktop-srs',
    targetIdMobile: 'tour-header-srs',
    title: '4. Indikator SRS & Habit Api (🔥)',
    badge: 'SISTEM ANTI-LUPA',
    description: 'Menampilkan streak belajar harian dan jumlah butir materi (Kanji/Kosakata) yang sudah jatuh tempo untuk diulang agar tidak lupa.',
    actionHint: 'Klik tombol api ini saat angka menyala untuk masuk ke sesi ulasan kilat Spaced Repetition.',
    tip: 'Cukup ulas 5-10 menit per hari untuk mempertahankan retensi memori jangka panjang.',
  },
  {
    targetIdDesktop: 'tour-nav-dojo',
    targetIdMobile: 'tour-dock-latihan',
    title: '5. Menu Latihan (Dojo & JLPT ⚔️)',
    badge: 'DRILL REFLEKS',
    description: 'Pusat latihan intensif yang mencakup Dojo Konjugasi (perubahan bentuk Te, Masu, Nai, Ta, Potensial, Pasif) serta Simulasi Ujian JLPT berwaktu lengkap dengan pembahasan.',
    actionHint: 'Pilih menu ini saat kamu ingin menguji pemahaman dan kecepatan refleks tata bahasa.',
    tip: 'Jika ada soal yang salah, gunakan fitur Ghost Engine untuk melatih kembali hanya soal-soal yang salah.',
  },
  {
    targetIdDesktop: 'tour-nav-kanji',
    targetIdMobile: 'tour-dock-pustaka',
    title: '6. Pustaka Lengkap (Kanji, Vocab & Grammar 📚)',
    badge: 'KAMUS PINTAR',
    description: 'Akses ke 2.167 Joyō Kanji dan 9.177 Kosakata berkalimat contoh. Di mobile, mengetuk kartu kanji/kosakata akan langsung memunculkan drawer lembar detail dari bawah layar tanpa perlu scroll ke bawah.',
    actionHint: 'Klik kartu kata atau kanji apa saja untuk melihat arti, pelafalan audio, dan contoh kalimatnya.',
    tip: 'Gunakan fitur pencarian dan filter level (N5→N1) untuk mencari kosakata spesifik.',
  },
];

export const OnboardingTourModal: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  // Auto-navigate to module if step needs it
  useEffect(() => {
    if (!isOpen) return;
    if (step.moduleToActivate && onSelectModule) {
      onSelectModule(step.moduleToActivate);
    }
  }, [currentStep, isOpen]);

  // Track target bounding box for spotlight pointer
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;
      const targetId = isMobile ? step.targetIdMobile : step.targetIdDesktop;
      
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          // Gently scroll target into view if not in viewport
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
      }
      setTargetRect(null);
    };

    const timer1 = setTimeout(updatePosition, 50);
    const timer2 = setTimeout(updatePosition, 200);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep, isOpen, step]);

  if (!isOpen) return null;

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

  // Posisi adaptif kartu tour agar tidak menutupi elemen target di desktop
  const getCardStyle = (): React.CSSProperties => {
    if (typeof window === 'undefined') return {};
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      return {};
    }

    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '28rem',
      };
    }

    // Jika elemen target berada di Sidebar kiri (left < 320px)
    if (targetRect.left < 320) {
      const cardTop = Math.max(24, Math.min(window.innerHeight - 380, targetRect.top - 20));
      const cardLeft = Math.min(window.innerWidth - 470, Math.max(280, targetRect.right + 28));
      return {
        top: `${cardTop}px`,
        left: `${cardLeft}px`,
        maxWidth: '28rem',
      };
    }

    // Jika elemen target berada di Main Canvas tengah/kanan (seperti hero CTA)
    const cardWidth = 440;
    const cardHeight = 360;
    const fitsBelow = targetRect.bottom + cardHeight + 24 <= window.innerHeight;
    const cardLeft = Math.max(280, Math.min(window.innerWidth - cardWidth - 24, targetRect.left - 40));

    if (fitsBelow) {
      return {
        top: `${targetRect.bottom + 16}px`,
        left: `${cardLeft}px`,
        maxWidth: '28rem',
      };
    } else {
      const cardTop = Math.max(24, targetRect.top - cardHeight - 16);
      return {
        top: `${cardTop}px`,
        left: `${cardLeft}px`,
        maxWidth: '28rem',
      };
    }
  };

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none animate-fadeIn select-none">
      {/* 1. Backdrop semi-transparent with cutout spotlight if target exists */}
      <div 
        className="fixed inset-0 bg-black/60 pointer-events-auto transition-all duration-300"
        onClick={onClose}
      />

      {/* 2. Spotlight Box Ring around target element */}
      {targetRect && (
        <div 
          className="fixed pointer-events-none transition-all duration-300 z-[60] rounded-xl border-2 border-[#c84b31] dark:border-[#e05d44] shadow-[0_0_25px_rgba(200,75,49,0.7)] animate-pulse"
          style={{
            top: `${Math.max(4, targetRect.top - 6)}px`,
            left: `${Math.max(4, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          {/* Target Pointer Tag */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#c84b31] text-white text-[10px] font-mono font-bold whitespace-nowrap shadow-md flex items-center gap-1">
            <MousePointerClick className="w-3 h-3 animate-bounce" />
            <span>Target Elemen</span>
          </div>
        </div>
      )}

      {/* 3. Floating Interactive Guide Card (Smart Adaptive Placement) */}
      <div 
        className="fixed inset-x-4 bottom-24 sm:inset-x-auto sm:bottom-auto z-[60] pointer-events-auto transition-all duration-300"
        style={getCardStyle()}
      >
        <div className="bg-[#faf8f5] dark:bg-[#18181b] border-2 border-[#c84b31]/40 dark:border-[#e05d44]/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative text-left overflow-hidden animate-slideUp">
          {/* Glow ambient background accents */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#c84b31]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#e7e5e4] dark:border-[#27272a]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] border border-[#c84b31]/20">
                {step.badge}
              </span>
              <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              title="Tutup Panduan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Content */}
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mt-1.5 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Action Hint Card */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#c84b31]/25 dark:border-[#e05d44]/30 text-xs text-[#1c1917] dark:text-[#f4f4f5] mb-3 flex items-start gap-2 shadow-2xs">
            <MousePointerClick className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44] shrink-0 mt-0.5" />
            <span className="text-[11px] leading-snug">
              <strong>Fungsi:</strong> {step.actionHint}
            </span>
          </div>

          {/* Practical Tip */}
          <div className="p-2.5 rounded-xl bg-[#c84b31]/5 border border-[#c84b31]/15 text-[11px] text-[#78716c] dark:text-[#a1a1aa] mb-4 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c84b31] dark:text-[#e05d44] shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong>Tips:</strong> {step.tip}
            </span>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep 
                    ? 'w-5 bg-[#c84b31] dark:bg-[#e05d44]' 
                    : 'w-1.5 bg-[#d6d3d1] dark:bg-[#3f3f46]'
                }`}
                title={`Ke langkah ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#e7e5e4] dark:border-[#27272a]">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition cursor-pointer ${
                isFirst
                  ? 'opacity-30 border-transparent text-[#78716c] cursor-not-allowed'
                  : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#c84b31] dark:bg-[#e05d44] hover:bg-[#a63a23] text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <span>{isLast ? 'Selesai & Paham' : 'Langkah Berikutnya'}</span>
              {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
