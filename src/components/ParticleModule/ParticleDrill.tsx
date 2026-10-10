import React, { useState } from 'react';
import { PARTICLE_QUESTIONS } from '../../data/particlesData';
import { ParticleQuestion } from '../../types';
import { speakJapanese, playSuccessSound, playErrorSound } from '../../utils/audio';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  RotateCw,
  Lightbulb,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ParticleDrill: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drill' | 'summary'>('drill');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Soal yang sedang aktif
  const currentQuestion: ParticleQuestion = PARTICLE_QUESTIONS[currentIndex] || PARTICLE_QUESTIONS[0];

  const handleSelectOption = (particle: string) => {
    if (isAnswered) return;
    setSelectedOption(particle);
    setIsAnswered(true);
    setTotalAnswered(prev => prev + 1);

    const isCorrect = particle === currentQuestion.correctParticle;

    if (isCorrect) {
      playSuccessSound();
      setCorrectCount(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        if (next % 5 === 0) {
          try {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
          } catch (e) {
            console.debug('Confetti error:', e);
          }
        }
        return next;
      });
    } else {
      playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIndex < PARTICLE_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop kembali
    }
  };

  const handleRandomize = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    const randomIndex = Math.floor(Math.random() * PARTICLE_QUESTIONS.length);
    setCurrentIndex(randomIndex);
  };

  const isCurrentCorrect = selectedOption === currentQuestion.correctParticle;

  const renderInteractiveSentence = () => {
    const parts = currentQuestion.sentenceWithBlank.split('【　】');
    return (
      <div className="text-2xl sm:text-3xl font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed flex flex-wrap items-center justify-center gap-1 my-3">
        <span>{parts[0]}</span>
        <span 
          className={`inline-flex items-center justify-center min-w-[50px] px-3 py-0.5 rounded-lg border font-mono font-bold text-2xl transition-all ${
            !isAnswered
              ? 'border-dashed border-[#c84b31] bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44]'
              : isCurrentCorrect
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 animate-shake'
          }`}
        >
          {isAnswered ? selectedOption : '...'}
        </span>
        {parts[1] && <span>{parts[1]}</span>}

        {isAnswered && !isCurrentCorrect && (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg font-bold text-xl border border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ml-2">
            {currentQuestion.correctParticle}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#c84b31]/25 bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44] text-xs font-mono font-medium mb-3">
          <span>[助詞道場] N5 PARTICLE DRILL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Latihan Refleks Partikel Bahasa Jepang
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-sm max-w-xl mx-auto">
          Kuasai perbedaan partikel krusial: <span className="font-serif-jp font-bold text-[#c84b31]">は vs が</span>, <span className="font-serif-jp font-bold text-[#1e3a8a] dark:text-[#60a5fa]">に vs で</span>, <span className="font-serif-jp font-bold text-[#2e7d32]">を</span>, dan lainnya lewat kalimat nyata.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('drill')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition cursor-pointer border ${
            activeTab === 'drill'
              ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
              : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Mode Drill Interaktif</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition cursor-pointer border ${
            activeTab === 'summary'
              ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
              : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Tabel Partikel N5</span>
        </button>
      </div>

      {/* TAB 1: DRILL TRAINER */}
      {activeTab === 'drill' && (
        <div className="max-w-2xl mx-auto">
          {/* Top Bar: Progress & Streak */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-3.5 mb-6 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                Soal {currentIndex + 1} / {PARTICLE_QUESTIONS.length}
              </span>
              <button
                type="button"
                onClick={handleRandomize}
                className="p-1 rounded text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition"
                title="Acak Soal"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#c84b31]/5 border border-[#c84b31]/20 text-[#c84b31] dark:text-[#e05d44] text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Streak: {streak}</span>
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                Skor: <strong className="text-[#1c1917] dark:text-[#f4f4f5] font-bold">{correctCount}</strong>/{totalAnswered}
              </div>
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs relative mb-6">
            <div className="text-center py-6 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl mb-6 px-4">
              <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider block mb-2 font-medium">
                Pilih partikel yang tepat untuk melengkapi kalimat:
              </span>

              {renderInteractiveSentence()}

              <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] font-sans mt-3 italic">
                &ldquo;{currentQuestion.translationId}&rdquo;
              </p>

              {isAnswered && (
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQuestion.audioText)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-[#1f1f23] hover:border-[#1c1917] text-[#2e7d32] dark:text-[#4ade80] text-xs font-semibold transition border border-[#e7e5e4] dark:border-[#27272a]"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengar Kalimat</span>
                </button>
              )}
            </div>

            {/* 4 Large Particle Choice Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {currentQuestion.options.map(particle => {
                const isSelected = selectedOption === particle;
                const isCorrect = particle === currentQuestion.correctParticle;

                let btnClass = 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#c84b31]';

                if (isAnswered) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300';
                  } else if (isSelected) {
                    btnClass = 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-800 dark:text-rose-300';
                  } else {
                    btnClass = 'opacity-40 border-[#e7e5e4] dark:border-[#27272a]';
                  }
                }

                return (
                  <button
                    key={particle}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(particle)}
                    className={`py-4 rounded-xl border-2 font-serif-jp font-bold text-3xl sm:text-4xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center relative ${btnClass}`}
                  >
                    <span>{particle}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Explanation Card */}
            {isAnswered && (
              <div
                className={`p-4 rounded-lg border mb-6 animate-fadeIn ${
                  isCurrentCorrect
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-xs font-mono uppercase block text-[#1c1917] dark:text-[#f4f4f5]">
                      {isCurrentCorrect ? 'Penjelasan Pola:' : 'Analisis Kesalahan:'}
                    </span>
                    <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] leading-relaxed whitespace-pre-line">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-xs active:translate-y-px"
                >
                  <span>Soal Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN & CHEATSHEET PARTIKEL */}
      {activeTab === 'summary' && (
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 mb-2">
            <BookOpen className="w-5 h-5 text-[#c84b31]" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
              Tabel Komparasi Partikel Inti JLPT N5
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa]">
            Ringkasan rumus penggunaan 8 partikel wajib yang selalu diujikan di JLPT N5:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WA vs GA */}
            <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-jp font-bold text-[#c84b31] dark:text-[#e05d44] text-lg">は (wa) vs が (ga)</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Topik / Subjek</span>
              </div>
              <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">は</strong>: Penanda Topik umum (&ldquo;Mengenai X...&rdquo;).</li>
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">が</strong>: Penanda Subjek penegas / Objek kesukaan (すき/きらい) / Kata tanya subjek (だれが).</li>
              </ul>
            </div>

            {/* NI vs DE */}
            <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-jp font-bold text-[#1e3a8a] dark:text-[#60a5fa] text-lg">に (ni) vs で (de)</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Tempat & Waktu</span>
              </div>
              <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">に</strong>: Titik waktu berangka (７じに) / Tempat keberadaan benda statis (つくえのうえに あります).</li>
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">で</strong>: Tempat aktivitas aksi dinamis (がっこうで たべます) / Alat (はしで).</li>
              </ul>
            </div>

            {/* O & E */}
            <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-jp font-bold text-[#2e7d32] dark:text-[#4ade80] text-lg">を (o) & へ (e)</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Objek & Arah</span>
              </div>
              <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">を</strong>: Objek penderita langsung kata kerja transitif (ごはんを たべます).</li>
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">へ</strong>: Arah pergerakan / destinasi fisik (にほんへ いきます).</li>
              </ul>
            </div>

            {/* TO, KARA, MADE */}
            <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] text-lg">と / から / まで / も</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Relasi</span>
              </div>
              <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">と</strong>: Bersama orang (ともだちと) / Dan menghubungkan kata benda.</li>
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">から〜まで</strong>: Dari (awal) sampai (akhir).</li>
                <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">も</strong>: Menyatakan &ldquo;juga / pun&rdquo;.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
