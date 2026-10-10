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
  Lightbulb,
  Trophy,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type DojoSessionMode = '10' | '20' | 'endless';

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
  formFilter: ConjugationForm | 'random' = 'random',
  groupFilter: VerbGroup | 'all' = 'all',
  chosenVerbInput?: VerbItem
): DrillQuestion {
  // Filter pool kata kerja
  const pool = VERBS_DATA.filter(v => groupFilter === 'all' || v.group === groupFilter);
  const chosenVerb = chosenVerbInput || pool[Math.floor(Math.random() * pool.length)] || VERBS_DATA[0];

  // Tentukan bentuk target (default random 6 bentuk SPK #19)
  const forms: ConjugationForm[] = ['masu', 'te', 'nai', 'ta', 'potential', 'passive'];
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
      case 'potential': return 'Bentuk Potensial / Bisa (~Eru / ~Rareru)';
      case 'passive': return 'Bentuk Pasif / Di- (~Areru / ~Rareru)';
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

interface ConjugationDojoProps {
  onSwitchSubModule?: (subModule: 'quiz' | 'dojo') => void;
}

export const ConjugationDojo: React.FC<ConjugationDojoProps> = ({ onSwitchSubModule }) => {
  const [showRomaji] = useShowRomaji();
  const [activeTab, setActiveTab] = useState<'trainer' | 'matrix' | 'cheatsheet'>('trainer');

  // Cheatsheet inspector state
  const [selectedVerbId, setSelectedVerbId] = useState<string>(VERBS_DATA[0].id);

  // Trainer state SPK #19
  const [sessionMode, setSessionMode] = useState<DojoSessionMode>('10');
  const [selectedFormFilter, setSelectedFormFilter] = useState<ConjugationForm | 'random'>('random');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<VerbGroup | 'all'>('all');

  // Unseen Deck state (Anti-pengulangan Fisher-Yates deck SPK #19)
  const [unseenDeck, setUnseenDeck] = useState<VerbItem[]>(() => {
    return fisherYatesShuffle([...VERBS_DATA]);
  });

  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion>(() => {
    const initialPool = fisherYatesShuffle([...VERBS_DATA]);
    const firstVerb = initialPool.pop() || VERBS_DATA[0];
    return generateNewQuestion('random', 'all', firstVerb);
  });

  const [questionIndex, setQuestionIndex] = useState(1);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [wrongItems, setWrongItems] = useState<{ verb: VerbItem; targetForm: ConjugationForm; userAnswer: string; correctAnswer: string }[]>([]);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const selectedVerb = VERBS_DATA.find(v => v.id === selectedVerbId) || VERBS_DATA[0];

  const handleStartNewSession = (
    mode: DojoSessionMode = sessionMode,
    form: ConjugationForm | 'random' = selectedFormFilter,
    group: VerbGroup | 'all' = selectedGroupFilter
  ) => {
    const pool = VERBS_DATA.filter(v => group === 'all' || v.group === group);
    const newDeck = fisherYatesShuffle([...pool]);
    const firstVerb = newDeck.pop() || pool[0];

    setSessionMode(mode);
    setSelectedFormFilter(form);
    setSelectedGroupFilter(group);
    setUnseenDeck(newDeck);
    setCurrentQuestion(generateNewQuestion(form, group, firstVerb));
    setQuestionIndex(1);
    setIsSessionFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setStreak(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setWrongItems([]);
  };

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
      setWrongItems(prev => [
        ...prev,
        {
          verb: currentQuestion.verb,
          targetForm: currentQuestion.targetForm,
          userAnswer: currentQuestion.options[index].kanji,
          correctAnswer: currentQuestion.correctAnswer,
        }
      ]);
    }
  };

  const handleNextQuestion = () => {
    const maxQuestions = sessionMode === 'endless' ? Infinity : parseInt(sessionMode, 10);
    if (questionIndex >= maxQuestions) {
      setIsSessionFinished(true);
      const finalAccuracy = (correctCount / (totalAnswered || 1)) * 100;
      if (finalAccuracy >= 70) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
      return;
    }

    setIsAnswered(false);
    setSelectedOption(null);
    setQuestionIndex(prev => prev + 1);

    // Ambil kata kerja berikutnya dari Unseen Deck tanpa repetisi
    let nextDeck = [...unseenDeck];
    const pool = VERBS_DATA.filter(v => selectedGroupFilter === 'all' || v.group === selectedGroupFilter);
    if (nextDeck.length === 0) {
      nextDeck = fisherYatesShuffle([...pool]);
    }
    const nextVerb = nextDeck.pop() || pool[0];
    setUnseenDeck(nextDeck);
    setCurrentQuestion(generateNewQuestion(selectedFormFilter, selectedGroupFilter, nextVerb));
  };

  const getTargetFormBadge = (form: ConjugationForm) => {
    switch (form) {
      case 'te': return { label: 'BENTUK ~TE', color: 'bg-[#2e7d32]/10 text-[#2e7d32] border-[#2e7d32]/30' };
      case 'masu': return { label: 'BENTUK ~MASU', color: 'bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-[#60a5fa] border-[#1e3a8a]/30' };
      case 'nai': return { label: 'BENTUK ~NAI', color: 'bg-[#c84b31]/10 text-[#c84b31] border-[#c84b31]/30' };
      case 'ta': return { label: 'BENTUK ~TA', color: 'bg-[#d97706]/10 text-[#d97706] border-[#d97706]/30' };
      case 'potential': return { label: 'POTENSIAL (BISA)', color: 'bg-[#0284c7]/10 text-[#0284c7] border-[#0284c7]/30' };
      case 'passive': return { label: 'PASIF (DI-/TER-)', color: 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30' };
    }
  };

  const getGroupBadge = (group: VerbGroup) => {
    switch (group) {
      case 'ichidan': return { label: 'Gol. 2 (Ichidan)', color: 'bg-[#2e7d32]/10 text-[#2e7d32] border-[#2e7d32]/30' };
      case 'godan': return { label: 'Gol. 1 (Godan)', color: 'bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-[#60a5fa] border-[#1e3a8a]/30' };
      case 'irregular': return { label: 'Gol. 3 (Irregular)', color: 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30' };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Latihan Hub Switcher (Mobile & Desktop Cohesive Bar) */}
      {onSwitchSubModule && (
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1 bg-[#f4f0e8]/90 dark:bg-[#1f1f23]/90 border border-[#e7e5e4] dark:border-[#27272a] rounded-xl shadow-xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSwitchSubModule('quiz')}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />
              <span>Ujian & Tryout JLPT</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchSubModule('dojo')}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 bg-white dark:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] shadow-xs border border-[#d6d3d1] dark:border-[#3f3f46] cursor-pointer"
            >
              <Swords className="w-4 h-4 text-[#c84b31]" />
              <span>Dojo Konjugasi</span>
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c84b31]/10 border border-[#c84b31]/20 text-[#c84b31] text-xs font-mono font-medium mb-3">
          <Swords className="w-3.5 h-3.5" />
          <span>DOJO KONJUGASI KATA KERJA (動詞の活用)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight mb-2">
          Masteri Perubahan Bentuk Kata Kerja
        </h1>
        <p className="text-[#78716c] dark:text-[#a1a1aa] text-sm max-w-xl mx-auto">
          Kuasai pola perubahan Bentuk-Te, Masu, Nai, Ta, Potensial (可能形), dan Pasif (受身形) dengan panduan visual dan latihan refleks instan.
        </p>
      </div>

      {/* Main Tabs (Cheatsheet vs Drill Trainer vs Verb Matrix) */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 border-b border-[#e7e5e4] dark:border-[#27272a] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('trainer')}
          className={`px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium flex items-center gap-1.5 transition cursor-pointer border whitespace-nowrap shrink-0 ${
            activeTab === 'trainer'
              ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
              : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
          }`}
        >
          <Flame className="w-4 h-4 text-[#c84b31]" />
          <span>Latihan Refleks</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium flex items-center gap-1.5 transition cursor-pointer border whitespace-nowrap shrink-0 ${
            activeTab === 'matrix'
              ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
              : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44]" />
          <span>Kamus Perubahan Kata</span>
        </button>

        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium flex items-center gap-1.5 transition cursor-pointer border whitespace-nowrap shrink-0 ${
            activeTab === 'cheatsheet'
              ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
              : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#1e3a8a] dark:text-[#60a5fa]" />
          <span>Rumus Kaidah</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: DRILL TRAINER                                                 */}
      {/* ==================================================================== */}
      {activeTab === 'trainer' && isSessionFinished && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs text-center animate-fadeIn">
          <Trophy className="w-12 h-12 text-[#c84b31] mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] mb-2">
            Sesi Latihan Dojo Selesai
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] mb-6">
            Refleks konjugasi Anda semakin terasah. Sesi {sessionMode === 'endless' ? 'Mode Bertahan' : `${sessionMode} Soal`} telah selesai.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
            <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
              <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase font-mono font-bold">Total Soal</span>
              <span className="text-2xl font-bold font-mono text-[#1c1917] dark:text-[#f4f4f5]">{totalAnswered}</span>
            </div>
            <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
              <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase font-mono font-bold">Jawaban Benar</span>
              <span className="text-2xl font-bold font-mono text-[#2e7d32]">{correctCount}</span>
            </div>
            <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
              <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase font-mono font-bold">Akurasi</span>
              <span className="text-2xl font-bold font-mono text-[#1e3a8a] dark:text-[#60a5fa]">
                {Math.round((correctCount / (totalAnswered || 1)) * 100)}%
              </span>
            </div>
            <div className="p-3 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-lg">
              <span className="text-[10px] text-[#78716c] dark:text-[#a1a1aa] block uppercase font-mono font-bold">Rekor Streak</span>
              <span className="text-2xl font-bold font-mono text-[#c84b31]">{bestStreak}</span>
            </div>
          </div>

          {/* Mistakes Breakdown */}
          {wrongItems.length > 0 && (
            <div className="mb-8 text-left max-w-lg mx-auto">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c84b31] mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Kata Kerja yang Sempat Keliru ({wrongItems.length}):</span>
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                {wrongItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">{item.verb.kanji}</span>
                        <span className="text-xs text-[#78716c] dark:text-[#a1a1aa]">({item.verb.kana})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getTargetFormBadge(item.targetForm).color}`}>
                          {getTargetFormBadge(item.targetForm).label}
                        </span>
                      </div>
                      <div className="text-xs mt-1">
                        <span className="text-[#c84b31] font-mono mr-2">Pilihan: {item.userAnswer}</span>
                        <span className="text-[#2e7d32] font-bold font-mono">Kunci: {item.correctAnswer}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => speakJapanese(item.correctAnswer)}
                      className="p-2 rounded-lg bg-white dark:bg-[#1f1f23] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] border border-[#e7e5e4] dark:border-[#27272a] transition cursor-pointer"
                      title="Dengarkan pelafalan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleStartNewSession('10')}
              className="px-4 py-2 rounded-lg bg-[#c84b31] hover:bg-[#b03f27] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Latihan 10 Soal Lagi</span>
            </button>
            <button
              onClick={() => handleStartNewSession('20')}
              className="px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Latihan 20 Soal Lagi</span>
            </button>
            <button
              onClick={() => handleStartNewSession('endless')}
              className="px-4 py-2 rounded-lg bg-white dark:bg-[#1f1f23] hover:bg-[#faf8f5] dark:hover:bg-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] font-medium text-xs transition cursor-pointer border border-[#e7e5e4] dark:border-[#27272a]"
            >
              Mode Bertahan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'trainer' && !isSessionFinished && currentQuestion && (
        <div className="max-w-2xl mx-auto">
          {/* Trainer Filter & Streak Bar */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-4 sm:p-5 mb-6 shadow-xs space-y-4">
            {/* Session Duration Selector + Counter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
                <span className="text-[10px] font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] uppercase mr-1 shrink-0">DURASI:</span>
                {(
                  [
                    { id: '10', label: '10 Soal' },
                    { id: '20', label: '20 Soal' },
                    { id: 'endless', label: 'Bertahan' },
                  ] as const
                ).map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleStartNewSession(m.id)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer shrink-0 border flex items-center justify-center ${
                      sessionMode === m.id
                        ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                        : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Progress counter: Soal X dari Y */}
              <div className="text-xs font-mono font-medium text-[#78716c] dark:text-[#a1a1aa] shrink-0 self-end sm:self-auto px-1">
                {sessionMode === 'endless' ? (
                  <span>Soal ke-<strong className="text-[#1c1917] dark:text-[#f4f4f5]">{questionIndex}</strong></span>
                ) : (
                  <span>Soal <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{questionIndex}</strong> dari <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{sessionMode}</strong></span>
                )}
              </div>
            </div>

            {/* Form Filter Selector with clear labels */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] uppercase">TARGET PERUBAHAN BENTUK:</span>
                {/* Streak & Score Tracker */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#c84b31]/10 text-[#c84b31] font-bold text-[11px]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{streak}</span>
                  </div>
                  <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">
                    Skor: <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{correctCount}</strong>/{totalAnswered}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1">
                {(
                  [
                    { id: 'random', label: 'Acak', hint: 'Semua Bentuk' },
                    { id: 'te', label: '~Te', hint: 'Sambung' },
                    { id: 'masu', label: '~Masu', hint: 'Sopan' },
                    { id: 'nai', label: '~Nai', hint: 'Negatif' },
                    { id: 'ta', label: '~Ta', hint: 'Lampau' },
                    { id: 'potential', label: 'Potensial', hint: 'Bisa' },
                    { id: 'passive', label: 'Pasif', hint: 'Di-' },
                  ] as const
                ).map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFormFilter(f.id);
                      setIsAnswered(false);
                      setSelectedOption(null);
                      let nextDeck = [...unseenDeck];
                      const pool = VERBS_DATA.filter(v => selectedGroupFilter === 'all' || v.group === selectedGroupFilter);
                      if (nextDeck.length === 0) nextDeck = fisherYatesShuffle([...pool]);
                      const nextVerb = nextDeck.pop() || pool[0];
                      setUnseenDeck(nextDeck);
                      setCurrentQuestion(generateNewQuestion(f.id, selectedGroupFilter, nextVerb));
                    }}
                    className={`min-h-[44px] px-3 py-1.5 rounded-xl text-left transition cursor-pointer shrink-0 border flex flex-col justify-center ${
                      selectedFormFilter === f.id
                        ? 'bg-[#c84b31] text-white border-transparent font-bold shadow-xs'
                        : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold leading-tight">{f.label}</span>
                    <span className={`text-[10px] leading-tight ${selectedFormFilter === f.id ? 'text-white/80' : 'text-[#a8a29e] dark:text-[#71717a]'}`}>
                      {f.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Filter Selector */}
            <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#27272a]">
              <span className="text-[10px] font-mono font-bold text-[#78716c] dark:text-[#a1a1aa] uppercase block mb-2">GOLONGAN KATA KERJA:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
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
                      let nextDeck = [...unseenDeck];
                      const pool = VERBS_DATA.filter(v => g.id === 'all' || v.group === g.id);
                      if (nextDeck.length === 0) nextDeck = fisherYatesShuffle([...pool]);
                      const nextVerb = nextDeck.pop() || pool[0];
                      setUnseenDeck(nextDeck);
                      setCurrentQuestion(generateNewQuestion(selectedFormFilter, g.id, nextVerb));
                    }}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer shrink-0 border flex items-center justify-center ${
                      selectedGroupFilter === g.id
                        ? 'bg-[#1e3a8a] text-white border-transparent font-bold shadow-xs'
                        : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-5 sm:p-8 shadow-xs relative overflow-hidden mb-6">
            {/* Header badges */}
            <div className="flex items-center justify-between mb-5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getGroupBadge(currentQuestion.verb.group).color}`}>
                {getGroupBadge(currentQuestion.verb.group).label}
              </span>

              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider border ${getTargetFormBadge(currentQuestion.targetForm).color}`}>
                {getTargetFormBadge(currentQuestion.targetForm).label}
              </span>
            </div>

            {/* Target Challenge Display */}
            <div className="text-center py-6 px-4 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl mb-6">
              <span className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] uppercase tracking-wider block mb-1">
                BENTUK KAMUS (JISHOKEI):
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl sm:text-5xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">
                  {currentQuestion.verb.kanji}
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQuestion.verb.kanji)}
                  className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer shadow-xs active:scale-95"
                  title="Dengarkan pengucapan"
                  aria-label="Dengarkan pengucapan kata dasar"
                >
                  <Volume2 className="w-4 h-4 text-[#2e7d32]" />
                </button>
              </div>
              <div className="text-sm font-jp text-[#c84b31] font-semibold mt-1">
                {currentQuestion.verb.kana}
                {showRomaji && (
                  <span className="text-[#78716c] dark:text-[#a1a1aa] font-mono text-xs ml-1.5 font-normal">
                    • {currentQuestion.verb.romaji}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
                Arti: <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{currentQuestion.verb.meaningId}</strong>
              </div>
            </div>

            {/* 4 Choices (Responsive 44px+ Touch Targets) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isCorrect = opt.kanji === currentQuestion.correctAnswer;
                let btnStyle = 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917] dark:hover:border-[#71717a] active:scale-[0.99]';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-[#2e7d32]/10 border-[#2e7d32] text-[#2e7d32] font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-[#c84b31]/10 border-[#c84b31] text-[#c84b31] font-bold';
                  } else {
                    btnStyle = 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#a8a29e] dark:text-[#71717a] opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`min-h-[56px] p-4 rounded-xl border text-base text-left font-medium transition flex items-center justify-between cursor-pointer select-none shadow-xs ${btnStyle}`}
                  >
                    <div>
                      <span className="text-lg font-jp font-bold block mb-0.5 leading-tight">
                        {opt.kanji}
                      </span>
                      {showRomaji && opt.romaji && (
                        <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                          {opt.romaji}
                        </span>
                      )}
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-[#2e7d32] shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[#c84b31] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Rule Explanation Box */}
            {isAnswered && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5] block mb-1">
                      Kunci Jawaban & Logika Perubahan:
                    </span>
                    <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a1a1aa] leading-relaxed whitespace-pre-line font-jp">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button (Full-width on mobile for easy one-hand thumb tapping) */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#c84b31] hover:bg-[#b03f27] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-95"
                >
                  <span>
                    {sessionMode !== 'endless' && questionIndex >= parseInt(sessionMode, 10)
                      ? 'Lihat Hasil Sesi'
                      : 'Tantangan Berikutnya'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: MATRIKS & KAMUS PERUBAHAN KATA KERJA                         */}
      {/* ==================================================================== */}
      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl p-5 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-[#e7e5e4] dark:border-[#27272a]">
            <div>
              <h2 className="text-xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5]">
                Kamus Konjugasi 6 Bentuk Utama
              </h2>
              <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-0.5">
                Ketuk kata kerja di bawah untuk melihat rincian 6 bentuk perubahan secara instan.
              </p>
            </div>

            {/* Selected Verb Hero Badge */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a]">
              <div className="text-2xl font-jp font-bold text-[#c84b31] dark:text-[#e05d44]">
                {selectedVerb.kanji}
              </div>
              <div>
                <div className="text-xs font-bold text-[#1c1917] dark:text-[#f4f4f5] leading-tight">
                  {selectedVerb.kana} • {selectedVerb.romaji}
                </div>
                <div className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] leading-tight">
                  Arti: <strong className="text-[#1c1917] dark:text-[#f4f4f5]">{selectedVerb.meaningId}</strong> ({selectedVerb.group.toUpperCase()})
                </div>
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.kanji)}
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer ml-auto"
                title="Dengarkan kata dasar"
              >
                <Volume2 className="w-4 h-4 text-[#2e7d32]" />
              </button>
            </div>
          </div>

          {/* Verb selector pills (Touch-friendly 42px+ targets with subtle scroll hint) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar -mx-2 px-2">
            {VERBS_DATA.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVerbId(v.id)}
                className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 font-jp border flex items-center justify-center ${
                  selectedVerbId === v.id
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-transparent font-bold shadow-xs'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-[#f4f4f5]'
                }`}
              >
                <span className="font-bold text-sm mr-1">{v.kanji}</span>
                <span className="opacity-75 text-[11px]">({v.meaningId})</span>
              </button>
            ))}
          </div>

          {/* 6 Forms Matrix Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Form 1: Masu */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center">
              <span className="text-[10px] font-mono font-bold text-[#1e3a8a] dark:text-[#60a5fa] uppercase tracking-wider block mb-1">
                Sopan (~Masu)
              </span>
              <div className="text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                {selectedVerb.forms.masu.kanji}
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2">
                {selectedVerb.forms.masu.romaji}
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.forms.masu.kanji)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              </button>
            </div>

            {/* Form 2: Te */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center">
              <span className="text-[10px] font-mono font-bold text-[#2e7d32] uppercase tracking-wider block mb-1">
                Sambung (~Te)
              </span>
              <div className="text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                {selectedVerb.forms.te.kanji}
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2">
                {selectedVerb.forms.te.romaji}
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.forms.te.kanji)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              </button>
            </div>

            {/* Form 3: Nai */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center">
              <span className="text-[10px] font-mono font-bold text-[#c84b31] uppercase tracking-wider block mb-1">
                Negatif (~Nai)
              </span>
              <div className="text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                {selectedVerb.forms.nai.kanji}
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2">
                {selectedVerb.forms.nai.romaji}
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.forms.nai.kanji)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              </button>
            </div>

            {/* Form 4: Ta */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center">
              <span className="text-[10px] font-mono font-bold text-[#d97706] uppercase tracking-wider block mb-1">
                Lampau (~Ta)
              </span>
              <div className="text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                {selectedVerb.forms.ta.kanji}
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2">
                {selectedVerb.forms.ta.romaji}
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.forms.ta.kanji)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              </button>
            </div>

            {/* Form 5: Potential */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center">
              <span className="text-[10px] font-mono font-bold text-[#0284c7] uppercase tracking-wider block mb-1">
                Potensial (N4)
              </span>
              <div className="text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                {selectedVerb.forms.potential.kanji}
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2">
                {selectedVerb.forms.potential.romaji}
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.forms.potential.kanji)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              </button>
            </div>

            {/* Form 6: Passive */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] text-center">
              <span className="text-[10px] font-mono font-bold text-[#7c3aed] uppercase tracking-wider block mb-1">
                Pasif (N4)
              </span>
              <div className="text-xl font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-0.5">
                {selectedVerb.forms.passive.kanji}
              </div>
              <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa] mb-2">
                {selectedVerb.forms.passive.romaji}
              </div>
              <button
                onClick={() => speakJapanese(selectedVerb.forms.passive.kanji)}
                className="p-1.5 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f4f4f5] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: RUMUS & CHEATSHEET INTERAKTIF                                 */}
      {/* ==================================================================== */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-8">
          {/* Card 1: Visual Rule Breakdown */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6">
              <Sparkles className="w-5 h-5 text-[#c84b31]" />
              <h2 className="text-xl sm:text-2xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
                Rumus Bentuk-Te & Ta (Godan vs Ichidan)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Group 1: Godan */}
              <div className="md:col-span-2 bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-[#60a5fa] border border-[#1e3a8a]/20 mb-3 inline-block">
                  Golongan 1: Godan (U-Verbs)
                </span>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-4">
                  Perubahan bentuk-te ditentukan oleh <strong>huruf akhir</strong> kata kerja:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                    <span className="font-mono text-[#c84b31] font-bold">Akhiran [う], [つ], [る]</span>
                    <span className="font-bold text-[#2e7d32] font-jp">➔ 〜って (〜tte) / 〜った (〜tta)</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-jp">買<strong className="text-[#1c1917] dark:text-[#f4f4f5]">って</strong>, 待<strong className="text-[#1c1917] dark:text-[#f4f4f5]">って</strong></span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                    <span className="font-mono text-[#1e3a8a] dark:text-[#60a5fa] font-bold">Akhiran [む], [ぶ], [ぬ]</span>
                    <span className="font-bold text-[#2e7d32] font-jp">➔ 〜んで (〜nde) / 〜んだ (〜nda)</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-jp">飲<strong className="text-[#1c1917] dark:text-[#f4f4f5]">んで</strong>, 遊<strong className="text-[#1c1917] dark:text-[#f4f4f5]">んで</strong></span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                    <span className="font-mono text-[#d97706] font-bold">Akhiran [く]</span>
                    <span className="font-bold text-[#2e7d32] font-jp">➔ 〜いて (〜ite) / 〜いた (〜ita)</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-jp">書<strong className="text-[#1c1917] dark:text-[#f4f4f5]">いて</strong>, 聞<strong className="text-[#1c1917] dark:text-[#f4f4f5]">いて</strong></span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                    <span className="font-mono text-[#7c3aed] font-bold">Akhiran [ぐ]</span>
                    <span className="font-bold text-[#2e7d32] font-jp">➔ 〜いで (〜ide) / 〜いだ (〜ida)</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-jp">泳<strong className="text-[#1c1917] dark:text-[#f4f4f5]">いで</strong></span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] flex items-center justify-between">
                    <span className="font-mono text-[#0284c7] font-bold">Akhiran [す]</span>
                    <span className="font-bold text-[#2e7d32] font-jp">➔ 〜して (〜shite) / 〜した (〜shita)</span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-jp">話<strong className="text-[#1c1917] dark:text-[#f4f4f5]">して</strong></span>
                  </div>
                </div>

                {/* Important exceptions banner */}
                <div className="mt-4 p-3.5 rounded-lg bg-[#c84b31]/5 border border-[#c84b31]/20 text-xs text-[#c84b31]">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-[#c84b31]" />
                    <span>2 Pengecualian Wajib Ingat:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#78716c] dark:text-[#a1a1aa] pl-1 font-jp">
                    <li><strong>行く (iku = pergi)</strong>: Berubah menjadi <strong className="text-[#1c1917] dark:text-[#f4f4f5]">行って (itte)</strong>, BUKAN <s>iite</s>!</li>
                    <li><strong>帰る (kaeru = pulang)</strong>: Berakhiran "-eru" tapi termasuk <strong>GODAN</strong> ➔ <strong className="text-[#1c1917] dark:text-[#f4f4f5]">帰って (kaette)</strong>!</li>
                  </ul>
                </div>
              </div>

              {/* Group 2 & 3: Ichidan and Irregular */}
              <div className="space-y-4">
                {/* Ichidan */}
                <div className="bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/20 mb-2 inline-block">
                    Golongan 2: Ichidan (Ru-Verbs)
                  </span>
                  <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3">
                    Paling mudah! Cukup <strong>buang [る]</strong> lalu tempel akhiran yang diinginkan:
                  </p>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-xs text-[#2e7d32] font-jp font-bold">
                    食べる ➔ 食べ【て】 / 食べ【ます】 / 食べ【ない】
                  </div>
                </div>

                {/* Irregular */}
                <div className="bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 mb-2 inline-block">
                    Golongan 3: Irregular (Fukisoku)
                  </span>
                  <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-3">
                    Hanya ada 2 kata dasar (wajib dihafal mati):
                  </p>
                  <div className="space-y-1.5 text-xs font-jp">
                    <div className="p-2 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]">
                      <strong>する (suru):</strong> して • します • しない • した
                    </div>
                    <div className="p-2 rounded-md bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]">
                      <strong>来る (kuru):</strong> きて • きます • こない • きた
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Potential & Passive Guide */}
          <div className="bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6">
              <Sparkles className="w-5 h-5 text-[#1e3a8a] dark:text-[#60a5fa]" />
              <h2 className="text-xl sm:text-2xl font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
                Rumus Konjugasi N4: Potensial (可能形) & Pasif (受身形)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Potential Guide */}
              <div className="bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/20 inline-block">
                    Bentuk Potensial (Arti: Bisa / Mampu)
                  </span>
                  <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-mono">可能形 (Kanōkei)</span>
                </div>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-4">
                  Mengubah kata kerja dasar menjadi kemampuan melakukan tindakan:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-sans">Golongan 1 (Godan):</div>
                    <p className="text-[#78716c] dark:text-[#a1a1aa]">
                      Ganti vokal akhir baris <span className="text-[#d97706] font-bold">"u"</span> ke baris <span className="text-[#0284c7] font-bold">"e"</span> lalu tambahkan <span className="text-[#2e7d32] font-bold">[る]</span>:
                    </p>
                    <div className="mt-1.5 font-jp text-[#1c1917] dark:text-[#f4f4f5] space-y-0.5">
                      <div>書く (kaku) ➔ 書<strong className="text-[#0284c7]">ける</strong> (kakeru = bisa menulis)</div>
                      <div>飲む (nomu) ➔ 飲<strong className="text-[#0284c7]">める</strong> (nomeru = bisa minum)</div>
                      <div>買う (kau) ➔ 買<strong className="text-[#0284c7]">える</strong> (kaeru = bisa beli)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-sans">Golongan 2 (Ichidan):</div>
                    <p className="text-[#78716c] dark:text-[#a1a1aa]">
                      Buang akhiran <span className="text-[#c84b31] font-bold">[る]</span> lalu ganti dengan <span className="text-[#0284c7] font-bold">[られる]</span>:
                    </p>
                    <div className="mt-1.5 font-jp text-[#1c1917] dark:text-[#f4f4f5] space-y-0.5">
                      <div>食べる ➔ 食べ<strong className="text-[#0284c7]">られる</strong> (taberareru = bisa makan)</div>
                      <div>見る ➔ 見<strong className="text-[#0284c7]">られる</strong> (mirareru = bisa melihat)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-sans">Golongan 3 (Irregular):</div>
                    <div className="font-jp text-[#1c1917] dark:text-[#f4f4f5] space-y-0.5">
                      <div>する ➔ <strong className="text-[#0284c7]">できる</strong> (dekiru = bisa melakukan)</div>
                      <div>来る (kuru) ➔ <strong className="text-[#0284c7]">来られる</strong> (korareru = bisa datang)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passive Guide */}
              <div className="bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 inline-block">
                    Bentuk Pasif (Arti: Di- / Ter- / Kena)
                  </span>
                  <span className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] font-mono">受身形 (Ukemikei)</span>
                </div>
                <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mb-4">
                  Menyatakan perbuatan yang diterima subjek atau perbuatan yang merugikan (adversative passive):
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-sans">Golongan 1 (Godan):</div>
                    <p className="text-[#78716c] dark:text-[#a1a1aa]">
                      Ganti vokal akhir baris <span className="text-[#d97706] font-bold">"u"</span> ke baris <span className="text-[#7c3aed] font-bold">"a"</span> lalu tambahkan <span className="text-[#2e7d32] font-bold">[れる]</span> (ingat akhiran う ➔ <strong className="text-[#c84b31]">わ</strong>れる!):
                    </p>
                    <div className="mt-1.5 font-jp text-[#1c1917] dark:text-[#f4f4f5] space-y-0.5">
                      <div>書く (kaku) ➔ 書<strong className="text-[#7c3aed]">かれる</strong> (kakareru = ditulis)</div>
                      <div>買う (kau) ➔ 買<strong className="text-[#7c3aed]">われる</strong> (kawareru = dibeli)</div>
                      <div>話す (hanasu) ➔ 話<strong className="text-[#7c3aed]">される</strong> (hanasareru = dibicarakan)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-sans">Golongan 2 (Ichidan):</div>
                    <p className="text-[#78716c] dark:text-[#a1a1aa]">
                      Buang <span className="text-[#c84b31] font-bold">[る]</span> lalu tambahkan <span className="text-[#7c3aed] font-bold">[られる]</span>:
                    </p>
                    <div className="mt-1.5 font-jp text-[#1c1917] dark:text-[#f4f4f5] space-y-0.5">
                      <div>食べる ➔ 食べ<strong className="text-[#7c3aed]">られる</strong> (taberareru = dimakan)</div>
                      <div>褒める ➔ 褒め<strong className="text-[#7c3aed]">られる</strong> (homerareru = dipuji)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
                    <div className="font-bold text-[#1c1917] dark:text-[#f4f4f5] mb-1 font-sans">Golongan 3 (Irregular):</div>
                    <div className="font-jp text-[#1c1917] dark:text-[#f4f4f5] space-y-0.5">
                      <div>する ➔ <strong className="text-[#7c3aed]">される</strong> (sareru = dilakukan / dikerjai)</div>
                      <div>来る (kuru) ➔ <strong className="text-[#7c3aed]">来られる</strong> (korareru = didatangi)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
