import React, { useState } from 'react';
import { PARTICLE_QUESTIONS } from '../../data/particlesData';
import { ParticleQuestion } from '../../types';
import { speakJapanese, playSuccessSound, playErrorSound } from '../../utils/audio';
import { 
  Sparkles, 
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
      speakJapanese(currentQuestion.audioText);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setCorrectCount(prev => prev + 1);

      if (newStreak > 0 && newStreak % 5 === 0) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } else {
      playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentIndex(prev => (prev + 1) % PARTICLE_QUESTIONS.length);
  };

  const handleRandomize = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    const randomIndex = Math.floor(Math.random() * PARTICLE_QUESTIONS.length);
    setCurrentIndex(randomIndex);
  };

  const isCurrentCorrect = selectedOption === currentQuestion.correctParticle;

  // Render kalimat dengan slot rumpang interaktif
  const renderInteractiveSentence = () => {
    const parts = currentQuestion.sentenceWithBlank.split('___');
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-2xl sm:text-3xl md:text-4xl font-jp font-bold text-white leading-relaxed my-2">
        <span>{parts[0]}</span>
        <span 
          className={`inline-flex items-center justify-center min-w-[50px] px-3 py-1 rounded-xl font-black text-2xl sm:text-3xl transition-all duration-300 border ${
            !isAnswered
              ? 'border-dashed border-rose-500/80 bg-rose-500/10 text-rose-300 animate-pulse'
              : isCurrentCorrect
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/30'
                : 'border-rose-500 bg-rose-500/20 text-rose-300 line-through'
          }`}
        >
          {isAnswered ? selectedOption : '?'}
        </span>
        {parts[1] && <span>{parts[1]}</span>}

        {/* Jika salah, tampilkan jawaban benar di sebelahnya */}
        {isAnswered && !isCurrentCorrect && (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl font-black text-2xl sm:text-3xl border border-emerald-500 bg-emerald-500/20 text-emerald-400 ml-2 animate-bounce">
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Dojo Partikel N5 (助詞マスター)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Latihan Partikel Bahasa Jepang
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Kuasai perbedaan kasus krusial: <span className="text-rose-400 font-bold font-jp">は vs が</span>, <span className="text-sky-400 font-bold font-jp">に vs で</span>, <span className="text-emerald-400 font-bold font-jp">を</span>, <span className="text-amber-400 font-bold font-jp">へ</span>, dan lainnya lewat kalimat nyata.
        </p>
      </div>

      {/* Tabs Pill */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('drill')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'drill'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mode Drill Interaktif</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Panduan Sakti Partikel N5</span>
        </button>
      </div>

      {/* TAB 1: DRILL TRAINER */}
      {activeTab === 'drill' && (
        <div className="max-w-2xl mx-auto">
          {/* Top Bar: Progress & Streak */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 mb-6 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-rose-300 font-bold text-xs border border-slate-700/80">
                Soal {currentIndex + 1} / {PARTICLE_QUESTIONS.length}
              </span>
              <button
                onClick={handleRandomize}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                title="Acak Soal"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Streak: {streak}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Skor: <strong className="text-white font-bold">{correctCount}</strong>/{totalAnswered}
              </div>
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
            <div className="text-center py-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl mb-6 px-4">
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">
                Lengkapi Partikel Kalimat Rumpang Berikut:
              </span>

              {renderInteractiveSentence()}

              <p className="text-sm text-slate-300 font-medium mt-3 italic">
                "{currentQuestion.translationId}"
              </p>

              {isAnswered && (
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQuestion.audioText)}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition border border-slate-700/60"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Pelafalan Asli</span>
                </button>
              )}
            </div>

            {/* 4 Large Particle Choice Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {currentQuestion.options.map(particle => {
                const isSelected = selectedOption === particle;
                const isCorrect = particle === currentQuestion.correctParticle;

                let btnClass = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60';

                if (isAnswered) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20';
                  } else if (isSelected) {
                    btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                  } else {
                    btnClass = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={particle}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(particle)}
                    className={`py-4 rounded-2xl border-2 font-jp font-black text-3xl sm:text-4xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center relative ${btnClass}`}
                  >
                    <span>{particle}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-2 right-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Explanation Card */}
            {isAnswered && (
              <div
                className={`p-5 rounded-2xl border mb-6 animate-fadeIn ${
                  isCurrentCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-white block">
                      {isCurrentCorrect ? '✅ Tepat Sekali!' : '❌ Jawaban Kurang Tepat'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
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
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer"
                >
                  <span>Soal Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN & CHEATSHEET PARTIKEL */}
      {activeTab === 'summary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 mb-2">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Tabel Sakti Partikel Inti JLPT N5
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Berikut ringkasan rumus penggunaan 8 partikel wajib yang selalu diujikan di JLPT N5:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WA vs GA */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-jp font-black text-rose-400 text-lg">は (wa) vs が (ga)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">Klasik</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong className="text-white">は</strong>: Penanda Topik umum ("Mengenai X...").</li>
                <li>• <strong className="text-white">が</strong>: Penanda Subjek penegas / Informasi baru / Objek kesukaan (すき/きらい) / Kata tanya subjek (だれが).</li>
              </ul>
            </div>

            {/* NI vs DE */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-jp font-black text-sky-400 text-lg">に (ni) vs で (de)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">Tempat & Waktu</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong className="text-white">に</strong>: Titik waktu berangka (７じに) / Tempat keberadaan benda statis (つくえのうえに あります).</li>
                <li>• <strong className="text-white">で</strong>: Tempat aktivitas aksi dinamis (がっこうで たべます) / Alat (はしで) / Sarana transportasi (バスで).</li>
              </ul>
            </div>

            {/* O & E */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-jp font-black text-emerald-400 text-lg">を (o) & へ (e)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">Objek & Arah</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong className="text-white">を</strong>: Objek penderita langsung dari kata kerja transitif (ごはんを たべます).</li>
                <li>• <strong className="text-white">へ</strong>: Arah pergerakan / destinasi perjalanan fisik (にほんへ いきます).</li>
              </ul>
            </div>

            {/* TO, KARA, MADE */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-jp font-black text-amber-400 text-lg">と / から / まで / も</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">Relasi</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong className="text-white">と</strong>: Bersama orang (ともだちと) / Dan menghubungkan benda.</li>
                <li>• <strong className="text-white">から〜まで</strong>: Dari (titik awal) sampai (batas akhir).</li>
                <li>• <strong className="text-white">も</strong>: Menyatakan "juga / pun".</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
