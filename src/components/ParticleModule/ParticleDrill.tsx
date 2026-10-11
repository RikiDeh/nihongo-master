import React, { useState, useMemo } from 'react';
import { PARTICLE_QUESTIONS } from '../../data/particlesData';
import { ParticleQuestion, JLPTLevel } from '../../types';
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
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [summaryLevel, setSummaryLevel] = useState<JLPTLevel>('N5');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Filter daftar soal berdasarkan level JLPT yang dipilih
  const activeQuestions = useMemo(() => {
    if (selectedLevel === 'ALL') return PARTICLE_QUESTIONS;
    return PARTICLE_QUESTIONS.filter(q => q.level === selectedLevel);
  }, [selectedLevel]);

  // Soal yang sedang aktif
  const currentQuestion: ParticleQuestion = activeQuestions[currentIndex] || activeQuestions[0] || PARTICLE_QUESTIONS[0];

  const handleLevelChange = (lvl: JLPTLevel | 'ALL') => {
    setSelectedLevel(lvl);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

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
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop kembali
    }
  };

  const handleRandomize = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    const randomIndex = Math.floor(Math.random() * activeQuestions.length);
    setCurrentIndex(randomIndex);
  };

  const isCurrentCorrect = selectedOption === currentQuestion.correctParticle;

  const renderInteractiveSentence = () => {
    const parts = currentQuestion.sentenceWithBlank.split(/【　】|___/);
    return (
      <div className="text-2xl sm:text-3xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed flex flex-wrap items-center justify-center gap-1 my-3">
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

  const getLevelBadge = (level?: JLPTLevel) => {
    switch (level) {
      case 'N5':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'N4':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
      case 'N3':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#c84b31]/25 bg-[#c84b31]/5 text-[#c84b31] dark:text-[#e05d44] text-xs font-mono font-medium mb-3">
          <span>[助詞道場] JLPT PARTICLE DRILL (N5 • N4 • N3)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Latihan Refleks Partikel Bahasa Jepang
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-sm max-w-xl mx-auto">
          Kuasai partikel inti N5 hingga N3: <span className="font-jp font-bold text-[#c84b31]">は vs が</span>, <span className="font-jp font-bold text-[#1e3a8a] dark:text-[#60a5fa]">に vs で</span>, <span className="font-bold text-amber-600">だけ vs しか</span>, serta pola komposit <span className="font-jp font-bold">〜として / 〜につれて</span>.
        </p>
      </div>

      {/* Level Filters */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {(['ALL', 'N5', 'N4', 'N3'] as (JLPTLevel | 'ALL')[]).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => handleLevelChange(lvl)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
              selectedLevel === lvl
                ? 'bg-[#c84b31] text-white border-[#c84b31] shadow-xs'
                : 'bg-white dark:bg-[#1f1f23] text-[#78716c] dark:text-[#a1a1aa] border-[#e7e5e4] dark:border-[#27272a] hover:border-[#c84b31]'
            }`}
          >
            {lvl === 'ALL' ? `Semua Level (${PARTICLE_QUESTIONS.length})` : `${lvl} (${PARTICLE_QUESTIONS.filter(q => q.level === lvl).length})`}
          </button>
        ))}
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
          <span>Tabel Panduan Partikel</span>
        </button>
      </div>

      {/* TAB 1: DRILL TRAINER */}
      {activeTab === 'drill' && (
        <div className="max-w-2xl mx-auto">
          {/* Top Bar: Progress & Streak */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-3.5 mb-6 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa]">
                Soal {currentIndex + 1} / {activeQuestions.length}
              </span>
              {currentQuestion.level && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLevelBadge(currentQuestion.level)}`}>
                  {currentQuestion.level}
                </span>
              )}
              <button
                type="button"
                onClick={handleRandomize}
                className="p-1 rounded text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
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
                    className={`py-4 rounded-xl border-2 font-jp font-bold text-3xl sm:text-4xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center relative ${btnClass}`}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#27272a] pb-4">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#c84b31]" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
                  Tabel Komparasi Partikel JLPT
                </h2>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
                  Rumus dan kaidah partikel penting per tingkat kemampuan
                </p>
              </div>
            </div>

            {/* Sub-tab Level Selector */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#faf8f5] dark:bg-[#18181b] p-1 rounded-lg border border-[#e7e5e4] dark:border-[#27272a]">
              {(['N5', 'N4', 'N3'] as JLPTLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSummaryLevel(lvl)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                    summaryLevel === lvl
                      ? 'bg-[#c84b31] text-white shadow-xs'
                      : 'text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                  }`}
                >
                  Tingkat {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* N5 CHEATSHEET */}
          {summaryLevel === 'N5' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {/* WA vs GA */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#c84b31] dark:text-[#e05d44] text-lg">は (wa) vs が (ga)</span>
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
                  <span className="font-jp font-bold text-[#1e3a8a] dark:text-[#60a5fa] text-lg">に (ni) vs で (de)</span>
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
                  <span className="font-jp font-bold text-[#2e7d32] dark:text-[#4ade80] text-lg">を (o) & へ (e)</span>
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
                  <span className="font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] text-lg">と / から / まで / も</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Relasi & Rentang</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">と</strong>: Bersama orang (ともだちと) / Dan menghubungkan kata benda definitif.</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">から〜まで</strong>: Dari titik awal [から] hingga titik akhir [まで].</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">も</strong>: Menyatakan &ldquo;juga / pun&rdquo;.</li>
                </ul>
              </div>
            </div>
          )}

          {/* N4 CHEATSHEET */}
          {summaryLevel === 'N4' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {/* DAKE vs SHIKA */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#c84b31] dark:text-[#e05d44] text-lg">だけ vs しか...ない</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Batasan & Pembatas</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">だけ</strong>: Hanya/cuma, bisa berpasangan dengan kalimat POSITIF maupun netral.</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">しか</strong>: WAJIB berpasangan dengan predikat NEGATIF (tidak ada selain itu, ada nuansa kekurangan/keluhan).</li>
                </ul>
              </div>

              {/* MADE vs MADE NI */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#1e3a8a] dark:text-[#60a5fa] text-lg">まで vs までに</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Batas Waktu</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">まで</strong>: Durasi aksi terus berlanjut hingga waktu tersebut (5-ji made benkyou suru).</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">までに</strong>: DEADLINE / Batas akhir penyelesaian (&ldquo;paling lambat sebelum jam 5&rdquo;).</li>
                </ul>
              </div>

              {/* NI TSUITE vs NI TOTTE */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#2e7d32] dark:text-[#4ade80] text-lg">〜について vs 〜にとって</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Topik vs Sudut Pandang</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜について</strong>: Tentang / mengenai suatu objek materi bahasan.</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜にとって</strong>: Dari sudut pandang / bagi seseorang (watashi ni totte = bagi saya).</li>
                </ul>
              </div>

              {/* TAME NI vs YOU NI */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-amber-600 dark:text-amber-400 text-lg">〜ために vs 〜ように</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Tujuan & Harapan</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜ために</strong>: Demi/tujuan disengaja dengan kendali diri (membeli kamus untuk belajar).</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜ように</strong>: Supaya/agar tercapai kondisi potensial di luar kontrol langsung (agar lekas sembuh).</li>
                </ul>
              </div>
            </div>
          )}

          {/* N3 CHEATSHEET */}
          {summaryLevel === 'N3' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {/* TO SHITE vs TO SHITE MO */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#c84b31] dark:text-[#e05d44] text-lg">〜として vs 〜としても</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Peran vs Konsesif</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜として</strong>: Sebagai peran, status, atau kualifikasi resmi (ryuugakusei to shite).</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜としても</strong>: Sekalipun / bahkan seandainya (tatoe shippai shita to shite mo).</li>
                </ul>
              </div>

              {/* NI TSURETE vs NI SHITAGATTE */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#1e3a8a] dark:text-[#60a5fa] text-lg">〜につれて vs 〜にしたがって</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Perubahan Simultan</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜につれて</strong>: Seiring perkembangan waktu / fenomena alami satu arah yang berangsur-angsur.</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜にしたがって</strong>: Sejalan dengan / mematuhi instruksi, aturan, atau hukum.</li>
                </ul>
              </div>

              {/* NI OITE vs NI KANSHITE */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-[#2e7d32] dark:text-[#4ade80] text-lg">〜において vs 〜に関して</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Formal Lokatif & Bahasan</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜において</strong>: Ragam formal dari [で] (berlangsung di suatu tempat/bidang formal).</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜に関して</strong>: Ragam formal/akademis dari [〜について] (berkenaan dengan topik).</li>
                </ul>
              </div>

              {/* NI WATATTE vs O TSUUJITE */}
              <div className="p-4 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-jp font-bold text-purple-600 dark:text-purple-400 text-lg">〜にわたって vs 〜を通じて</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-stone-200 dark:border-zinc-800 text-[#78716c]">Rentang Luas vs Media</span>
                </div>
                <ul className="text-xs text-[#78716c] dark:text-[#a1a1aa] space-y-1.5 leading-relaxed">
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜にわたって</strong>: Membentang sepanjang rentang waktu atau area geografis luas.</li>
                  <li>• <strong className="text-[#1c1917] dark:text-[#f4f4f5]">〜を通じて</strong>: Melalui perantara/media atau sepanjang kurun masa (1年を通じて).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
