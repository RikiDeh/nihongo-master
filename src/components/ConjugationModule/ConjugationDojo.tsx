import React, { useState } from 'react';
import { VERBS_DATA } from '../../data/verbsData';
import { getDistractorsForVerb, fisherYatesShuffle } from '../../data/verbDistractors';
import { useShowRomaji } from '../../hooks/useShowRomaji';
import { VerbItem, ConjugationForm, VerbGroup } from '../../types';
import { speakJapanese, playSuccessSound, playErrorSound } from '../../utils/audio';
import { 
  Swords, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrillQuestion {
  verb: VerbItem;
  targetForm: ConjugationForm;
  correctAnswer: string;
  correctRomaji: string;
  options: { kanji: string; romaji: string }[];
  explanation: string;
}

// Pure helper function untuk membuat soal drill baru dengan Fisher-Yates Shuffle & distractor bunyi seimbang
function generateNewQuestion(
  formFilter: ConjugationForm | 'random' = 'te',
  groupFilter: VerbGroup | 'all' = 'all'
): DrillQuestion {
  // Filter pool kata kerja
  const pool = VERBS_DATA.filter(v => groupFilter === 'all' || v.group === groupFilter);
  const chosenVerb = pool[Math.floor(Math.random() * pool.length)] || VERBS_DATA[0];

  // Tentukan bentuk target
  const forms: ConjugationForm[] = ['masu', 'te', 'nai', 'ta'];
  const targetForm: ConjugationForm = formFilter === 'random' 
    ? forms[Math.floor(Math.random() * forms.length)] 
    : formFilter;

  const correctFormDetail = chosenVerb.forms[targetForm];
  const correctAnswer = correctFormDetail.kanji;
  const correctRomaji = correctFormDetail.romaji;

  // Dapatkan opsi pengecoh spesifik yang menguji kaidah perubahan bunyi bentuk target
  const distractors = getDistractorsForVerb(chosenVerb.id, targetForm);

  // Satukan jawaban benar dan 3 pengecoh, lalu acak tanpa bias statistik via Fisher-Yates Shuffle
  const allOptions = fisherYatesShuffle([
    { kanji: correctAnswer, romaji: correctRomaji },
    ...distractors,
  ]);

  const getFormNameId = (form: ConjugationForm) => {
    switch (form) {
      case 'masu': return 'Bentuk Sopan (~Masu)';
      case 'te': return 'Bentuk ~Te (Penghubung / Permintaan)';
      case 'nai': return 'Bentuk Negatif (~Nai)';
      case 'ta': return 'Bentuk Lampau (~Ta)';
    }
  };

  const explanation = chosenVerb.ruleExplanation 
    ? `${chosenVerb.ruleExplanation}\nBentuk ${getFormNameId(targetForm)} yang benar adalah: ${correctAnswer} (${correctRomaji}).`
    : `Bentuk ${getFormNameId(targetForm)} yang benar adalah: ${correctAnswer} (${correctRomaji}).`;

  return {
    verb: chosenVerb,
    targetForm,
    correctAnswer,
    correctRomaji,
    options: allOptions,
    explanation,
  };
}

export const ConjugationDojo: React.FC = () => {
  const [showRomaji] = useShowRomaji();
  const [activeTab, setActiveTab] = useState<'cheatsheet' | 'trainer'>('trainer');

  // Cheatsheet inspector state
  const [selectedVerbId, setSelectedVerbId] = useState<string>(VERBS_DATA[0].id);

  // Trainer state
  const [selectedFormFilter, setSelectedFormFilter] = useState<ConjugationForm | 'random'>('te');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<VerbGroup | 'all'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion>(() => generateNewQuestion('te', 'all'));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const selectedVerb = VERBS_DATA.find(v => v.id === selectedVerbId) || VERBS_DATA[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setTotalAnswered(prev => prev + 1);

    const isCorrect = currentQuestion.options[index].kanji === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSuccessSound();
      speakJapanese(currentQuestion.correctAnswer);
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

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentQuestion(generateNewQuestion(selectedFormFilter, selectedGroupFilter));
  };

  const getTargetFormBadge = (form: ConjugationForm) => {
    switch (form) {
      case 'te': return { label: 'BENTUK ~TE', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'masu': return { label: 'BENTUK ~MASU', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case 'nai': return { label: 'BENTUK ~NAI', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'ta': return { label: 'BENTUK ~TA', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
  };

  const getGroupBadge = (group: VerbGroup) => {
    switch (group) {
      case 'ichidan': return { label: 'Gol. 2 (Ichidan)', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'godan': return { label: 'Gol. 1 (Godan)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'irregular': return { label: 'Gol. 3 (Irregular)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Dojo Konjugasi Kata Kerja (Doushi no Katsuyou)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Masteri Perubahan Bentuk Kata Kerja N5
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Tembus tembok tersulit pemula! Kuasai rumus perubahan Bentuk-Te, Masu, Nai, dan Ta dengan panduan visual dan latihan refleks instan.
        </p>
      </div>

      {/* Main Tabs (Cheatsheet vs Drill Trainer) */}
      <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('trainer')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'trainer'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>Drill Trainer (Latihan Refleks)</span>
        </button>

        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'cheatsheet'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-300" />
          <span>Rumus & Cheatsheet Interaktif</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: DRILL TRAINER                                                 */}
      {/* ==================================================================== */}
      {activeTab === 'trainer' && currentQuestion && (
        <div className="max-w-2xl mx-auto">
          {/* Trainer Filter & Streak Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 mb-6 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Form Filter Selector */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase mr-1 shrink-0">Bentuk:</span>
                {(['te', 'masu', 'nai', 'ta', 'random'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setSelectedFormFilter(f);
                      setIsAnswered(false);
                      setSelectedOption(null);
                      setCurrentQuestion(generateNewQuestion(f, selectedGroupFilter));
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      selectedFormFilter === f
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'random' ? '🎲 Acak' : `~${f.toUpperCase()}`}
                  </button>
                ))}
              </div>

              {/* Streak & Score Tracker */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Streak: {streak}</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Skor: <strong className="text-white font-bold">{correctCount}</strong>/{totalAnswered}
                </div>
              </div>
            </div>

            {/* Group Filter Selector */}
            <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase mr-1 shrink-0">Golongan:</span>
              {([
                { id: 'all', label: 'Semua Golongan' },
                { id: 'godan', label: 'Gol. 1 (Godan)' },
                { id: 'ichidan', label: 'Gol. 2 (Ichidan)' },
                { id: 'irregular', label: 'Gol. 3 (Irregular)' },
              ] as const).map(g => (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGroupFilter(g.id);
                    setIsAnswered(false);
                    setSelectedOption(null);
                    setCurrentQuestion(generateNewQuestion(selectedFormFilter, g.id));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                    selectedGroupFilter === g.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
            {/* Header badges */}
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getGroupBadge(currentQuestion.verb.group).color}`}>
                {getGroupBadge(currentQuestion.verb.group).label}
              </span>

              <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider border ${getTargetFormBadge(currentQuestion.targetForm).color}`}>
                {getTargetFormBadge(currentQuestion.targetForm).label}
              </span>
            </div>

            {/* Target Challenge Display */}
            <div className="text-center py-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl mb-6">
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                Bentuk Kamus (Jishokei):
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl sm:text-5xl font-jp font-extrabold text-white">
                  {currentQuestion.verb.kanji}
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQuestion.verb.kanji)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                  title="Dengarkan pengucapan"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
              <div className="text-sm font-jp text-rose-400 font-semibold mt-1">
                {currentQuestion.verb.kana}
                {showRomaji && (
                  <span className="text-slate-400 font-mono text-xs ml-1.5 font-normal">
                    • {currentQuestion.verb.romaji}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Arti: <strong className="text-white">{currentQuestion.verb.meaningId}</strong>
              </div>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isCorrect = opt.kanji === currentQuestion.correctAnswer;
                let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-500/10';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border-2 text-base text-left font-medium transition duration-150 flex items-center justify-between cursor-pointer select-none ${btnStyle}`}
                  >
                    <div>
                      <span className="text-lg font-jp font-bold block mb-0.5">
                        {opt.kanji}
                      </span>
                      {showRomaji && opt.romaji && (
                        <span className="text-xs font-mono text-slate-400">
                          {opt.romaji}
                        </span>
                      )}
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Rule Explanation Box */}
            {isAnswered && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 mb-6 animate-pop">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-white block mb-1">
                      Kunci Jawaban & Logika Bunyi:
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
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer animate-pop"
                >
                  <span>Tantangan Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: RUMUS & CHEATSHEET INTERAKTIF                                 */}
      {/* ==================================================================== */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-8">
          {/* Card 1: Visual Rule Breakdown (The Legendary Te-Form Cheat Sheet) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2.5 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Rumus Emas Bentuk-Te & Ta (Godan vs Ichidan)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Group 1: Godan */}
              <div className="md:col-span-2 bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold mb-3 inline-block">
                  Golongan 1: Godan (U-Verbs)
                </span>
                <p className="text-xs text-slate-300 mb-4">
                  Perubahan bentuk-te ditentukan oleh <strong>huruf akhir</strong> kata kerja:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-rose-300 font-bold">Akhiran [う], [つ], [る]</span>
                    <span className="font-bold text-emerald-400 font-jp">➔ 〜って (〜tte) / 〜った (〜tta)</span>
                    <span className="text-[11px] text-slate-400">買<strong className="text-white">って</strong>, 待<strong className="text-white">って</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-sky-300 font-bold">Akhiran [む], [ぶ], [ぬ]</span>
                    <span className="font-bold text-emerald-400 font-jp">➔ 〜んで (〜nde) / 〜んだ (〜nda)</span>
                    <span className="text-[11px] text-slate-400">飲<strong className="text-white">んで</strong>, 遊<strong className="text-white">んで</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-amber-300 font-bold">Akhiran [く]</span>
                    <span className="font-bold text-emerald-400 font-jp">➔ 〜いて (〜ite) / 〜いた (〜ita)</span>
                    <span className="text-[11px] text-slate-400">書<strong className="text-white">いて</strong>, 聞<strong className="text-white">いて</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-purple-300 font-bold">Akhiran [ぐ]</span>
                    <span className="font-bold text-emerald-400 font-jp">➔ 〜いで (〜ide) / 〜いだ (〜ida)</span>
                    <span className="text-[11px] text-slate-400">泳<strong className="text-white">いで</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-teal-300 font-bold">Akhiran [す]</span>
                    <span className="font-bold text-emerald-400 font-jp">➔ 〜して (〜shite) / 〜した (〜shita)</span>
                    <span className="text-[11px] text-slate-400">話<strong className="text-white">して</strong></span>
                  </div>
                </div>

                {/* Important exceptions banner */}
                <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200">
                  <div className="flex items-center gap-2 font-bold text-rose-300 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>2 Pengecualian Wajib Ingat di Ujian N5:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                    <li><strong>行く (iku = pergi)</strong>: Berubah menjadi <strong className="text-white font-jp">行って (itte)</strong>, BUKAN <s>iite</s>!</li>
                    <li><strong>帰る (kaeru = pulang)</strong>: Berakhiran "-eru" tapi termasuk <strong className="text-white">GODAN</strong> ➔ <strong className="text-white font-jp">帰って (kaette)</strong>!</li>
                  </ul>
                </div>
              </div>

              {/* Group 2 & 3: Ichidan and Irregular */}
              <div className="space-y-4">
                {/* Ichidan */}
                <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-5">
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold mb-2 inline-block">
                    Golongan 2: Ichidan (Ru-Verbs)
                  </span>
                  <p className="text-xs text-slate-300 mb-3">
                    Paling mudah! Cukup <strong>buang [る]</strong> lalu langsung tempel akhiran yang diinginkan:
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-jp font-bold">
                    食べる ➔ 食べ【て】 / 食べ【ます】 / 食べ【ない】
                  </div>
                </div>

                {/* Irregular */}
                <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold mb-2 inline-block">
                    Golongan 3: Irregular (Fukisoku)
                  </span>
                  <p className="text-xs text-slate-300 mb-3">
                    Hanya ada 2 kata dasar (wajib dihafal mati):
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                      <strong>する (suru):</strong> して • します • しない • した
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                      <strong>来る (kuru):</strong> きて • きます • こない • きた
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Verb Matrix Inspector */}
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>Pilih Kata Kerja untuk Melihat Matriks Perubahan:</span>
              </h3>

              {/* Verb pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
                {VERBS_DATA.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVerbId(v.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 font-jp ${
                      selectedVerbId === v.id
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {v.kanji} ({v.meaningId})
                  </button>
                ))}
              </div>

              {/* 4 Forms Matrix Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Form 1: Masu */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    Bentuk Sopan (~Masu)
                  </span>
                  <div className="text-xl font-jp font-bold text-white mb-0.5">
                    {selectedVerb.forms.masu.kanji}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mb-2">
                    {selectedVerb.forms.masu.romaji}
                  </div>
                  <button
                    onClick={() => speakJapanese(selectedVerb.forms.masu.kanji)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

                {/* Form 2: Te */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Bentuk Sambung (~Te)
                  </span>
                  <div className="text-xl font-jp font-bold text-white mb-0.5">
                    {selectedVerb.forms.te.kanji}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mb-2">
                    {selectedVerb.forms.te.romaji}
                  </div>
                  <button
                    onClick={() => speakJapanese(selectedVerb.forms.te.kanji)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

                {/* Form 3: Nai */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                    Bentuk Negatif (~Nai)
                  </span>
                  <div className="text-xl font-jp font-bold text-white mb-0.5">
                    {selectedVerb.forms.nai.kanji}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mb-2">
                    {selectedVerb.forms.nai.romaji}
                  </div>
                  <button
                    onClick={() => speakJapanese(selectedVerb.forms.nai.kanji)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

                {/* Form 4: Ta */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Bentuk Lampau (~Ta)
                  </span>
                  <div className="text-xl font-jp font-bold text-white mb-0.5">
                    {selectedVerb.forms.ta.kanji}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mb-2">
                    {selectedVerb.forms.ta.romaji}
                  </div>
                  <button
                    onClick={() => speakJapanese(selectedVerb.forms.ta.kanji)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
