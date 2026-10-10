import React, { useState } from 'react';
import { 
  RotateCcw, 
  Check, 
  Sun, 
  Moon
} from 'lucide-react';

export type DesignThemeId = 'duolingo' | 'zen-editorial' | 'hybrid';

interface DesignShowroomProps {
  onBackToApp?: () => void;
}

export const DesignShowroom: React.FC<DesignShowroomProps> = ({ onBackToApp }) => {
  const [activeTheme, setActiveTheme] = useState<DesignThemeId>('hybrid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Interactive test state for Quiz
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Interactive test state for Flashcard
  const [isFlashcardRevealed, setIsFlashcardRevealed] = useState(false);
  const [flashcardResult, setFlashcardResult] = useState<'correct' | 'wrong' | null>(null);

  const resetInteractiveDemos = () => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setIsFlashcardRevealed(false);
    setFlashcardResult(null);
  };

  const handleSelectTheme = (theme: DesignThemeId) => {
    setActiveTheme(theme);
    resetInteractiveDemos();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      // Theme background wrapper
      activeTheme === 'duolingo'
        ? (isDarkMode ? 'bg-[#131f24] text-white' : 'bg-[#f7f7f7] text-[#4b4b4b]')
        : activeTheme === 'zen-editorial'
        ? (isDarkMode ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#faf8f5] text-[#1c1917]')
        : (isDarkMode ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fbf9f5] text-[#1c1917]')
    } p-4 sm:p-8 font-sans`}>
      
      {/* Top Controller Bar */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${
          isDarkMode 
            ? 'bg-zinc-900/90 border-zinc-800 shadow-xl' 
            : 'bg-white/90 border-stone-200 shadow-sm backdrop-blur'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Sandbox Preview
                </span>
                <span className="text-xs text-stone-500">Zero DB Touch • Isolated Test</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
                Design Lab: Perbandingan 3 Konsep UI/UX
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Pilih tab di bawah untuk melihat perbedaan bentuk tombol, kontras kartu, tipografi, dan sensasi interaktifnya.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {/* Light/Dark Mode Switcher */}
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isDarkMode 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' 
                    : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
                <span>{isDarkMode ? 'Mode Gelap' : 'Mode Terang'}</span>
              </button>

              {onBackToApp && (
                <button
                  type="button"
                  onClick={onBackToApp}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                >
                  Kembali ke Aplikasi
                </button>
              )}
            </div>
          </div>

          {/* Theme Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-6">
            
            {/* OPTION 1: Duolingo */}
            <button
              type="button"
              onClick={() => handleSelectTheme('duolingo')}
              className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                activeTheme === 'duolingo'
                  ? 'border-[#58cc02] bg-[#58cc02]/10 ring-2 ring-[#58cc02]/30'
                  : isDarkMode
                  ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#58cc02]">
                  Opsi 1
                </span>
                {activeTheme === 'duolingo' && <Check className="w-4 h-4 text-[#58cc02]" />}
              </div>
              <div className="font-bold text-sm sm:text-base mt-1 text-[#2b70c9] dark:text-[#1cb0f6]">
                Duolingo Gamified
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Tombol 3D tebal membal (pushable), warna ceria cerah, rounded besar, nuansa game kasual.
              </p>
            </button>

            {/* OPTION 2: Zen Editorial */}
            <button
              type="button"
              onClick={() => handleSelectTheme('zen-editorial')}
              className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                activeTheme === 'zen-editorial'
                  ? 'border-[#c84b31] bg-[#c84b31]/10 ring-2 ring-[#c84b31]/30'
                  : isDarkMode
                  ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c84b31]">
                  Opsi 2
                </span>
                {activeTheme === 'zen-editorial' && <Check className="w-4 h-4 text-[#c84b31]" />}
              </div>
              <div className="font-bold text-sm sm:text-base mt-1 text-[#c84b31]">
                Japanese Zen Editorial
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Warm Washi parchment, Sumi ink, tipografi Noto Serif kuas, hairline 1px border, 0% emoji liar.
              </p>
            </button>

            {/* OPTION 3: The Hybrid */}
            <button
              type="button"
              onClick={() => handleSelectTheme('hybrid')}
              className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                activeTheme === 'hybrid'
                  ? 'border-indigo-600 bg-indigo-600/10 ring-2 ring-indigo-600/30'
                  : isDarkMode
                  ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Opsi 3 (Rekomendasi)
                </span>
                {activeTheme === 'hybrid' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <div className="font-bold text-sm sm:text-base mt-1 text-indigo-600 dark:text-indigo-400">
                The Hybrid (Zen + Tactile)
              </div>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                Kanvas kertas tenang + tipografi Jepang mewah, tapi opsi kuis punya tactile press yang membal mantap.
              </p>
            </button>

          </div>
        </div>
      </div>

      {/* Main Sandbox Content */}
      <div className="max-w-6xl mx-auto space-y-12">

        {/* DEMO 1: JLPT MULTIPLE-CHOICE QUIZ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
                Interaktif Demo 1
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Simulasi Kuis JLPT (Mondai Bunmyaku Kitei)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedQuizOption(null);
                setQuizSubmitted(false);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pilihan</span>
            </button>
          </div>

          {/* RENDER THEME 1: DUOLINGO STYLE */}
          {activeTheme === 'duolingo' && (
            <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
              isDarkMode 
                ? 'bg-[#202f36] border-[#37464f]' 
                : 'bg-white border-[#e5e5e5] shadow-sm'
            }`}>
              {/* Gamified Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#1cb0f6] text-white font-extrabold text-xs">
                    JLPT N5
                  </span>
                  <span className="text-xs font-bold text-[#afafaf]">SOAL 04 / 15</span>
                </div>
                <div className="flex items-center gap-1 font-extrabold text-sm text-[#ff9600]">
                  <span>🔥 5 STREAK</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#afafaf] mb-2">
                  Pilihlah kata yang paling tepat untuk mengisi tanda kurung:
                </p>
                <div className="text-xl sm:text-2xl font-black font-jp text-[#3c3c3c] dark:text-[#ffffff] bg-[#f7f7f7] dark:bg-[#131f24] p-4 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464f]">
                  田中さんは 明日【　　】へ 行きます。
                </div>
                <p className="text-xs text-[#777777] dark:text-[#afafaf] mt-2 font-medium">
                  Artinya: &ldquo;Saudara Tanaka besok akan pergi ke [ ... ].&rdquo;
                </p>
              </div>

              {/* 4 Chunky 3D Push-Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 1, text: '病院 (びょういん)', label: 'Rumah Sakit', correct: true },
                  { id: 2, text: '美容院 (びよういん)', label: 'Salon Kecantikan', correct: false },
                  { id: 3, text: '大学院 (だいがくいん)', label: 'Pascasarjana', correct: false },
                  { id: 4, text: '映画館 (えいがかん)', label: 'Bioskop', correct: false },
                ].map((option) => {
                  const isSelected = selectedQuizOption === option.id;
                  const isSubmitted = quizSubmitted;
                  
                  let btnColorClass = isDarkMode
                    ? 'bg-[#202f36] text-white border-[#37464f] border-b-4 hover:bg-[#283840] active:translate-y-1 active:border-b-0'
                    : 'bg-white text-[#4b4b4b] border-[#e5e5e5] border-b-4 hover:bg-[#f7f7f7] active:translate-y-1 active:border-b-0';

                  if (isSelected && !isSubmitted) {
                    btnColorClass = isDarkMode
                      ? 'bg-[#1cb0f6]/20 text-[#1cb0f6] border-[#1cb0f6] border-b-4'
                      : 'bg-[#ddf4ff] text-[#1899d6] border-[#84d8ff] border-b-4';
                  }

                  if (isSubmitted) {
                    if (option.correct) {
                      btnColorClass = 'bg-[#d7ffb8] text-[#58a700] border-[#58cc02] border-b-4';
                    } else if (isSelected && !option.correct) {
                      btnColorClass = 'bg-[#ffdfe0] text-[#ea2b2b] border-[#ff4b4b] border-b-4';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedQuizOption(option.id)}
                      className={`p-4 rounded-2xl text-left font-bold transition-all ${btnColorClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-jp text-base">{option.text}</span>
                        <span className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs">
                          {option.id}
                        </span>
                      </div>
                      <div className="text-xs font-normal opacity-75 mt-1">{option.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e5e5] dark:border-[#37464f]">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-wider text-sm border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuizOption(null);
                      setQuizSubmitted(false);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold uppercase tracking-wider text-sm border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all"
                  >
                    Soal Berikutnya →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RENDER THEME 2: JAPANESE ZEN EDITORIAL STYLE */}
          {activeTheme === 'zen-editorial' && (
            <div className={`p-6 sm:p-8 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-[#1f1f23] border-zinc-800' 
                : 'bg-[#ffffff] border-stone-200/90 shadow-sm'
            }`}>
              {/* Editorial Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold tracking-wider bg-stone-100 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300">
                    JLPT N5
                  </span>
                  <span className="text-xs font-jp text-stone-500">問題四 • 文脈規定</span>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  04 / 15
                </div>
              </div>

              {/* Question Text with Authentic Japanese Serif */}
              <div className="mb-8">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium">
                  次の文の（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。
                </div>
                <div className="text-xl sm:text-2xl font-jp font-bold text-stone-900 dark:text-stone-100 leading-relaxed tracking-wide">
                  田中さんは　明日【　　】へ　行きます。
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-2 italic">
                  Artinya: &ldquo;Saudara Tanaka besok akan pergi ke [ ... ].&rdquo;
                </div>
              </div>

              {/* Clean Editorial Options (1px hairline border, subtle states) */}
              <div className="space-y-2.5 mb-8">
                {[
                  { id: 1, text: '病院 (びょういん)', romaji: 'byouin', label: 'Rumah Sakit', correct: true },
                  { id: 2, text: '美容院 (びよういん)', romaji: 'biyouin', label: 'Salon Kecantikan', correct: false },
                  { id: 3, text: '大学院 (だいがくいん)', romaji: 'daigakuin', label: 'Pascasarjana', correct: false },
                  { id: 4, text: '映画館 (えいがかん)', romaji: 'eigakan', label: 'Bioskop', correct: false },
                ].map((option) => {
                  const isSelected = selectedQuizOption === option.id;
                  const isSubmitted = quizSubmitted;

                  let rowStyle = isDarkMode
                    ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-300'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50/50 text-stone-800';

                  if (isSelected && !isSubmitted) {
                    rowStyle = isDarkMode
                      ? 'border-[#c84b31] bg-[#c84b31]/10 text-white ring-1 ring-[#c84b31]'
                      : 'border-[#c84b31] bg-[#c84b31]/5 text-[#c84b31] ring-1 ring-[#c84b31]';
                  }

                  if (isSubmitted) {
                    if (option.correct) {
                      rowStyle = isDarkMode
                        ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
                        : 'border-emerald-600 bg-emerald-50 text-emerald-900';
                    } else if (isSelected && !option.correct) {
                      rowStyle = isDarkMode
                        ? 'border-rose-800 bg-rose-950/40 text-rose-300'
                        : 'border-rose-400 bg-rose-50 text-rose-900';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedQuizOption(option.id)}
                      className={`w-full p-3.5 rounded-lg border text-left flex items-center justify-between transition-colors ${rowStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded border border-current/30 flex items-center justify-center text-xs font-mono">
                          {option.id}
                        </span>
                        <span className="font-jp text-base font-semibold">{option.text}</span>
                        <span className="text-xs text-stone-400 hidden sm:inline">({option.label})</span>
                      </div>
                      {isSubmitted && option.correct && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Benar (正解)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Minimalist Editorial Action */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-zinc-800">
                <span className="text-xs text-stone-400">Tekan angka 1-4 pada keyboard untuk memilih</span>
                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-6 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Verifikasi Jawaban
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuizOption(null);
                      setQuizSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Lanjut ke Soal Berikutnya →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RENDER THEME 3: THE HYBRID (ZEN CALM + TACTILE PUSH BUTTON) */}
          {activeTheme === 'hybrid' && (
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-[#1f1f23] border-zinc-800 shadow-xl' 
                : 'bg-[#ffffff] border-stone-200/90 shadow-sm'
            }`}>
              {/* Hybrid Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    JLPT N5
                  </span>
                  <span className="text-xs text-stone-500 font-medium">Mondai 4 • Bunmyaku Kitei</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-mono">Soal 04/15</span>
                </div>
              </div>

              {/* Japanese Typography in Question Box */}
              <div className="mb-6">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium">
                  Pilihlah jawaban yang paling tepat untuk melengkapi kalimat:
                </div>
                <div className="p-4 sm:p-5 rounded-xl border border-stone-200/80 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-900/60">
                  <div className="text-xl sm:text-2xl font-jp font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                    田中さんは　明日【　　】へ　行きます。
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                    Tanaka-san wa ashita [ ... ] e ikimasu. (&ldquo;Saudara Tanaka besok akan pergi ke [...]&rdquo;)
                  </div>
                </div>
              </div>

              {/* Tactile 3D Buttons with Japanese Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 1, text: '病院 (びょういん)', label: 'Rumah Sakit', correct: true },
                  { id: 2, text: '美容院 (びよういん)', label: 'Salon Kecantikan', correct: false },
                  { id: 3, text: '大学院 (だいがくいん)', label: 'Pascasarjana', correct: false },
                  { id: 4, text: '映画館 (えいがかん)', label: 'Bioskop', correct: false },
                ].map((option) => {
                  const isSelected = selectedQuizOption === option.id;
                  const isSubmitted = quizSubmitted;

                  let tactileClass = isDarkMode
                    ? 'bg-zinc-900/80 text-zinc-200 border-zinc-700 border-b-[3px] hover:bg-zinc-850 active:translate-y-0.5 active:border-b'
                    : 'bg-white text-stone-800 border-stone-300 border-b-[3px] hover:bg-stone-50 active:translate-y-0.5 active:border-b';

                  if (isSelected && !isSubmitted) {
                    tactileClass = isDarkMode
                      ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500 border-b-[3px]'
                      : 'bg-indigo-50/60 text-indigo-900 border-indigo-600 border-b-[3px]';
                  }

                  if (isSubmitted) {
                    if (option.correct) {
                      tactileClass = isDarkMode
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500 border-b-[3px]'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-600 border-b-[3px]';
                    } else if (isSelected && !option.correct) {
                      tactileClass = isDarkMode
                        ? 'bg-rose-950/50 text-rose-300 border-rose-500 border-b-[3px]'
                        : 'bg-rose-50 text-rose-900 border-rose-600 border-b-[3px]';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedQuizOption(option.id)}
                      className={`p-4 rounded-xl text-left font-medium transition-all ${tactileClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-jp text-base font-bold">{option.text}</span>
                        <span className="text-xs font-mono opacity-50 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                          #{option.id}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hybrid Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-zinc-800">
                <div className="text-xs text-stone-400">
                  {selectedQuizOption ? 'Opsi dipilih. Klik tombol untuk evaluasi.' : 'Pilih salah satu kartu di atas.'}
                </div>
                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider border-b-[3px] border-indigo-800 active:translate-y-0.5 active:border-b transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuizOption(null);
                      setQuizSubmitted(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs uppercase tracking-wider border-b-[3px] border-stone-700 dark:border-stone-300 active:translate-y-0.5 active:border-b transition-all"
                  >
                    Soal Selanjutnya →
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* DEMO 2: KANJI MASTER CARD INSPECTION */}
        <section>
          <div className="mb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
              Interaktif Demo 2
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Tampilan Kartu Kanji & Detail Kosakata
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* DUOLINGO KANJI CARD */}
            <div className={`p-6 rounded-3xl border-2 ${
              isDarkMode ? 'bg-[#202f36] border-[#37464f]' : 'bg-white border-[#e5e5e5]'
            }`}>
              <div className="text-xs font-bold text-[#58cc02] uppercase tracking-wider mb-2">
                Opsi 1: Duolingo Style
              </div>
              <div className="w-24 h-24 mx-auto my-4 rounded-2xl bg-[#ddf4ff] dark:bg-[#18394a] flex items-center justify-center font-jp font-black text-5xl text-[#1899d6]">
                桜
              </div>
              <div className="text-center mb-4">
                <div className="font-extrabold text-lg text-[#3c3c3c] dark:text-white">Sakura</div>
                <div className="text-xs text-[#777] dark:text-[#afafaf] font-bold">Bunga Sakura / Cherry Blossom</div>
              </div>
              <div className="space-y-2 text-xs font-bold">
                <div className="p-2.5 rounded-xl bg-[#f7f7f7] dark:bg-[#131f24] flex justify-between">
                  <span className="text-[#afafaf]">Onyomi:</span>
                  <span className="text-[#3c3c3c] dark:text-white">オウ (OU)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f7f7f7] dark:bg-[#131f24] flex justify-between">
                  <span className="text-[#afafaf]">Kunyomi:</span>
                  <span className="text-[#3c3c3c] dark:text-white">さくら (sakura)</span>
                </div>
              </div>
              <button 
                type="button"
                className="w-full mt-4 py-2.5 rounded-xl bg-[#1cb0f6] text-white font-extrabold text-xs uppercase border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0"
              >
                Latihan Tulis
              </button>
            </div>

            {/* ZEN EDITORIAL KANJI CARD */}
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-[#1f1f23] border-zinc-800' : 'bg-white border-stone-200'
            }`}>
              <div className="text-xs font-semibold text-[#c84b31] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Opsi 2: Zen Editorial</span>
                <span className="px-1.5 py-0.2 rounded border border-stone-300 dark:border-zinc-700 text-[10px] font-mono">
                  [漢] N5
                </span>
              </div>
              <div className="my-4 text-center">
                <div className="font-jp text-6xl font-bold text-stone-900 dark:text-stone-100 tracking-normal">
                  桜
                </div>
                <div className="text-xs text-stone-400 font-mono mt-1">10 Strokes • 木 (Pohon)</div>
              </div>
              <div className="text-center mb-4">
                <div className="font-jp font-semibold text-stone-800 dark:text-stone-200">
                  Bunga Sakura
                </div>
                <div className="text-xs text-stone-500 italic">Cherry Blossom</div>
              </div>
              <div className="space-y-1.5 text-xs border-t border-stone-100 dark:border-zinc-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-stone-400 font-jp">音読み:</span>
                  <span className="font-mono text-stone-700 dark:text-stone-300">オウ (ō)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-jp">訓読み:</span>
                  <span className="font-jp text-stone-700 dark:text-stone-300">さくら</span>
                </div>
              </div>
              <button 
                type="button"
                className="w-full mt-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Buka Riwayat Kanji
              </button>
            </div>

            {/* HYBRID KANJI CARD */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-[#1f1f23] border-zinc-800' : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Opsi 3: The Hybrid</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold">
                  N5 Mastered
                </span>
              </div>
              <div className="my-4 text-center">
                <div className="font-jp text-6xl font-black text-stone-900 dark:text-stone-100 hover:scale-105 transition-transform inline-block cursor-default">
                  桜
                </div>
                <div className="text-xs text-stone-400 font-mono mt-1">Radikal 木 • 10 Goresan</div>
              </div>
              <div className="text-center mb-4">
                <div className="font-bold text-base text-stone-800 dark:text-stone-200">
                  Bunga Sakura (Cherry Blossom)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Onyomi</div>
                  <div className="font-bold text-stone-700 dark:text-stone-300 mt-0.5">オウ</div>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Kunyomi</div>
                  <div className="font-jp font-bold text-stone-700 dark:text-stone-300 mt-0.5">さくら</div>
                </div>
              </div>
              <button 
                type="button"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider border-b-[3px] border-indigo-800 active:translate-y-0.5 active:border-b transition-all"
              >
                Mulai Drill Soal
              </button>
            </div>

          </div>
        </section>

        {/* DEMO 3: SRS SPACED REPETITION FLASHCARD */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
                Interaktif Demo 3
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Simulasi Sesi SRS Flashcard Spaced Repetition
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFlashcardRevealed(false);
                setFlashcardResult(null);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Flashcard</span>
            </button>
          </div>

          <div className={`max-w-2xl mx-auto p-6 sm:p-10 rounded-2xl border text-center transition-all ${
            isDarkMode ? 'bg-[#1f1f23] border-zinc-800 shadow-xl' : 'bg-white border-stone-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-xs text-stone-400 mb-6">
              <span className="font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Stage 4: Guru (Review Tiap 3 Hari)
              </span>
              <span>1 dari 12 Kartu Due</span>
            </div>

            <div className="py-6">
              <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">Kosakata JLPT</span>
              <div className="font-jp text-5xl sm:text-6xl font-black my-4 text-stone-900 dark:text-stone-100">
                約束
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400 font-jp">
                やくそく (yakusoku)
              </div>
            </div>

            {/* Reveal Section */}
            {!isFlashcardRevealed ? (
              <button
                type="button"
                onClick={() => setIsFlashcardRevealed(true)}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
                  activeTheme === 'duolingo'
                    ? 'bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0'
                    : activeTheme === 'zen-editorial'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-b-[3px] border-indigo-800 active:translate-y-0.5 active:border-b'
                }`}
              >
                Buka Arti Kata (Spacebar)
              </button>
            ) : (
              <div className="space-y-6 animate-pop">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                  <div className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Janji / Perjanjian (Promise, Appointment)
                  </div>
                  <div className="text-xs text-stone-500 mt-1 font-jp">
                    友達と約束があります。(Saya punya janji dengan teman.)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFlashcardResult('wrong')}
                    className={`py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      activeTheme === 'duolingo'
                        ? 'bg-[#ff4b4b] text-white border-b-4 border-[#ea2b2b] active:translate-y-1 active:border-b-0'
                        : activeTheme === 'zen-editorial'
                        ? 'border border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                        : 'bg-rose-600 hover:bg-rose-700 text-white border-b-[3px] border-rose-800 active:translate-y-0.5 active:border-b'
                    }`}
                  >
                    1 • Lupa / Salah
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlashcardResult('correct')}
                    className={`py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      activeTheme === 'duolingo'
                        ? 'bg-[#58cc02] text-white border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0'
                        : activeTheme === 'zen-editorial'
                        ? 'bg-[#c84b31] text-white hover:bg-[#b03d25]'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white border-b-[3px] border-emerald-800 active:translate-y-0.5 active:border-b'
                    }`}
                  >
                    2 • Ingat / Benar
                  </button>
                </div>

                {flashcardResult && (
                  <div className={`p-3 rounded-lg text-xs font-semibold ${
                    flashcardResult === 'correct' 
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}>
                    {flashcardResult === 'correct' 
                      ? '✓ Stage naik ke Stage 5 (Master)! Interval bertambah jadi 7 hari.'
                      : '✕ Stage turun ke Stage 3. Dijadwalkan remedi dalam 4 jam.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
