import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Lock, 
  Play, 
  Trophy, 
  Clock, 
  Target, 
  RotateCcw,
  ChevronRight,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { ActiveModule } from '../Navbar';
import { JLPTLevel, MultipleChoiceQuestion } from '../../types';
import { ROADMAP_ARCS, RoadmapArc, RoadmapStage } from '../../data/roadmapData';
import { 
  getUserProgress, 
  subscribeToStorage, 
  checkDailySignInStatus, 
  getDailyMissions, 
  completeRoadmapStage,
  reportMissionActivity
} from '../../utils/storage';
import { DailySignInModal } from '../DailyModal/DailySignInModal';
import { 
  HIRAGANA_GOJUUON_GROUPS, 
  KATAKANA_GOJUUON_GROUPS,
  HIRAGANA_DAKUTEN_GROUPS,
  KATAKANA_DAKUTEN_GROUPS,
  HIRAGANA_YOON_GROUPS,
  KATAKANA_YOON_GROUPS
} from '../../data/kanaData';
import { generateDynamicMockExam } from '../../utils/quizGenerator';

interface RoadmapViewProps {
  onNavigate: (module: ActiveModule, level?: JLPTLevel) => void;
  onOpenSrs?: () => void;
  onLaunchKanaQuiz?: (items: any[], requeue?: boolean) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ 
  onNavigate, 
  onOpenSrs,
  onLaunchKanaQuiz 
}) => {
  const [progress, setProgress] = useState(() => getUserProgress());
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [activeArcId, setActiveArcId] = useState<string>(() => {
    return getUserProgress().currentArcId || 'arc_0';
  });
  const [showAllMissionsMobile, setShowAllMissionsMobile] = useState(false);

  // State untuk Stage Quiz Runner Modal
  const [activeStageQuiz, setActiveStageQuiz] = useState<RoadmapStage | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStorage(() => {
      const p = getUserProgress();
      setProgress(p);
      if (p.currentArcId && p.currentArcId !== activeArcId) {
        setActiveArcId(p.currentArcId);
      }
    });
    return unsub;
  }, [activeArcId]);

  // Otomatis tawarkan Sign-In jika belum hari ini
  useEffect(() => {
    const status = checkDailySignInStatus();
    if (status.canClaim) {
      // Buka otomatis dengan sedikit jeda agar tidak mengagetkan render
      const timer = setTimeout(() => {
        setIsSignInOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const completedSet = new Set(progress.completedStageIds || []);
  const dailyMissionsData = getDailyMissions();
  const signInStatus = checkDailySignInStatus();

  // Cek apakah suatu Arc terbuka atau terkunci
  const isArcUnlocked = (arc: RoadmapArc): boolean => {
    if (arc.arcNumber === 0) return true;
    const prevArc = ROADMAP_ARCS[arc.arcNumber - 1];
    if (!prevArc) return true;
    const lastStageOfPrev = prevArc.stages[prevArc.stages.length - 1];
    return completedSet.has(lastStageOfPrev.id);
  };

  const currentArc = ROADMAP_ARCS.find(a => a.id === activeArcId) || ROADMAP_ARCS[0];

  // Handler peluncuran stage
  const handleStartStage = (stage: RoadmapStage) => {
    const hiraGojuuon = HIRAGANA_GOJUUON_GROUPS.flatMap(g => g.items);
    const kataGojuuon = KATAKANA_GOJUUON_GROUPS.flatMap(g => g.items);

    if (stage.type === 'kana-drill') {
      if (stage.id === 'arc_0_stage_1') {
        // 46 Hiragana dasar
        if (onLaunchKanaQuiz) {
          onLaunchKanaQuiz(hiraGojuuon, true);
          return;
        }
      } else if (stage.id === 'arc_0_stage_2') {
        // 46 Katakana dasar
        if (onLaunchKanaQuiz) {
          onLaunchKanaQuiz(kataGojuuon, true);
          return;
        }
      }
      onNavigate('kana');
      return;
    }

    if (stage.id === 'arc_0_stage_3') {
      // Grand Exam Kana (50 soal acak campuran)
      const allKanaPool = [
        ...hiraGojuuon,
        ...kataGojuuon,
        ...HIRAGANA_DAKUTEN_GROUPS.flatMap(g => g.items),
        ...KATAKANA_DAKUTEN_GROUPS.flatMap(g => g.items),
        ...HIRAGANA_YOON_GROUPS.flatMap(g => g.items),
        ...KATAKANA_YOON_GROUPS.flatMap(g => g.items),
      ].sort(() => Math.random() - 0.5).slice(0, 50);

      if (onLaunchKanaQuiz) {
        onLaunchKanaQuiz(allKanaPool, false);
        return;
      }
      onNavigate('kana');
      return;
    }

    // Untuk checkpoint-quiz & grand-exam N5+
    const questions = generateDynamicMockExam(stage.targetLevel || 'N5', stage.targetCount);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizTimer(stage.timeLimitMinutes * 60);
    setIsQuizFinished(false);
    setActiveStageQuiz(stage);
  };

  // Timer countdown saat kuis aktif
  useEffect(() => {
    if (!activeStageQuiz || isQuizFinished || quizTimer <= 0) return;
    const interval = setInterval(() => {
      setQuizTimer(t => {
        if (t <= 1) {
          setIsQuizFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeStageQuiz, isQuizFinished, quizTimer]);

  const handleAnswerQuestion = (optionIndex: number) => {
    const nextAnswers = [...userAnswers, optionIndex];
    setUserAnswers(nextAnswers);

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setIsQuizFinished(true);
      // Evaluasi kelulusan
      if (activeStageQuiz) {
        let correctCount = 0;
        quizQuestions.forEach((q, idx) => {
          if (nextAnswers[idx] === q.correctIndex) {
            correctCount++;
          }
        });
        const score = Math.round((correctCount / quizQuestions.length) * 100);
        if (score >= activeStageQuiz.passingScore) {
          // LULUS! Tentukan arc berikutnya jika stage ini adalah stage terakhir
          const arcStages = currentArc.stages;
          const isLast = arcStages[arcStages.length - 1].id === activeStageQuiz.id;
          let nextArcId: string | undefined = undefined;
          if (isLast && currentArc.arcNumber + 1 < ROADMAP_ARCS.length) {
            nextArcId = ROADMAP_ARCS[currentArc.arcNumber + 1].id;
          }
          completeRoadmapStage(activeStageQuiz.id, nextArcId);
        }
        reportMissionActivity('quiz');
      }
    }
  };

  // Cari stage aktif berikutnya yang belum selesai
  const allStagesInOrder = ROADMAP_ARCS.flatMap(a => a.stages);
  const nextActiveStage = allStagesInOrder.find(s => !completedSet.has(s.id)) || allStagesInOrder[0];
  const nextActiveArc = ROADMAP_ARCS.find(a => a.stages.some(s => s.id === nextActiveStage.id)) || ROADMAP_ARCS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* 1. TOP HEADER / DAILY HUB HERO */}
      <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#faf8f5] via-[#f4f0e8] to-[#faf8f5] dark:from-[#18181b] dark:via-[#1f1f23] dark:to-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#c84b31]/10 border border-[#c84b31]/25 text-[#c84b31] dark:text-[#e05d44] text-[11px] font-mono font-bold uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c84b31] dark:bg-[#e05d44] animate-ping" />
              <span>BERANDA PETUALANGAN 0→N1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-[#1c1917] dark:text-[#f4f4f5] tracking-tight">
              Selamat Belajar, <span className="font-jp text-[#c84b31] dark:text-[#e05d44]">道場生</span>
            </h1>
            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-1 max-w-xl">
              Kurikulum terarah dari dasar aksara hingga kecakapan JLPT. Ikuti langkah terdekatmu di bawah ini.
            </p>
          </div>

          {/* Daily Streak & Sign-in Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsSignInOpen(true)}
              className="w-full md:w-auto p-3 rounded-xl border border-[#c84b31]/30 bg-white dark:bg-[#18181b] hover:bg-[#c84b31]/5 transition shadow-xs cursor-pointer flex items-center justify-between md:justify-start gap-3.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#c84b31]/15 dark:bg-[#e05d44]/20 flex items-center justify-center text-[#c84b31] dark:text-[#e05d44] group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono font-bold uppercase text-[#78716c] dark:text-[#a1a1aa]">
                  {signInStatus.canClaim ? 'KLAIM HARI INI' : 'API AKTIF'}
                </div>
                <div className="text-sm font-mono font-black text-[#1c1917] dark:text-[#f4f4f5] leading-none">
                  🔥 {progress.dailyStreak || 0} Hari
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716c] md:hidden" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ONE CLEAR NEXT ACTION CARD (ANTI-BINGUNG HERO) */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1f1f23] border-2 border-[#c84b31]/40 dark:border-[#e05d44]/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#c84b31]/10 text-[#c84b31] dark:text-[#e05d44] border border-[#c84b31]/20">
                FOKUS BELAJARMU SEKARANG
              </span>
              <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                {nextActiveArc.title}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-sans text-[#1c1917] dark:text-[#f4f4f5] flex items-center gap-2">
              <span>{nextActiveStage.title}</span>
              <span className="font-jp text-sm text-[#78716c] dark:text-[#a1a1aa] font-normal">{nextActiveStage.titleJp}</span>
            </h2>
            <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-1 leading-relaxed max-w-xl">
              {nextActiveStage.description}
            </p>
          </div>

          <button
            id="tour-hero-action"
            type="button"
            onClick={() => {
              setActiveArcId(nextActiveArc.id);
              handleStartStage(nextActiveStage);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-98 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Lanjut Belajar Sekarang</span>
          </button>
        </div>
      </div>

      {/* 3. THREE DYNAMIC DAILY MISSIONS (QUESTS) - COMPACT COLLAPSIBLE ON MOBILE */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#c84b31] dark:text-[#e05d44]" />
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-[#1c1917] dark:text-[#f4f4f5]">
              Target Harian (Misi Hari Ini)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAllMissionsMobile(prev => !prev)}
            className="md:hidden text-xs font-mono text-[#c84b31] dark:text-[#e05d44] flex items-center gap-1 font-semibold"
          >
            <span>{dailyMissionsData.missions.filter(m => m.completed).length}/3 Selesai</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllMissionsMobile ? 'rotate-180' : ''}`} />
          </button>
          <span className="hidden md:inline text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
            {dailyMissionsData.missions.filter(m => m.completed).length} / 3 Selesai
          </span>
        </div>

        {/* Mobile: Show first incomplete mission by default or all if expanded */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {dailyMissionsData.missions.map((mission, idx) => {
            const isHiddenOnMobile = !showAllMissionsMobile && idx > 0 && !mission.completed && dailyMissionsData.missions[0].completed === false;
            
            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isHiddenOnMobile ? 'hidden md:block' : 'block'
                } ${
                  mission.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                    : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold leading-tight">
                    {mission.title}
                  </span>
                  {mission.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-[#c84b31] dark:text-[#e05d44] shrink-0">
                      {mission.current}/{mission.target}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#78716c] dark:text-[#a1a1aa] mb-2 leading-relaxed">
                  {mission.description}
                </p>
                
                {!mission.completed && (
                  <button
                    type="button"
                    onClick={() => {
                      if (mission.id === 'srs') {
                        if (onOpenSrs) onOpenSrs();
                      } else if (mission.id === 'quiz') {
                        onNavigate('quiz');
                      }
                    }}
                    className="w-full py-1.5 px-3 rounded-lg border border-[#e7e5e4] dark:border-[#27272a] hover:bg-[#faf8f5] dark:hover:bg-[#18181b] text-xs font-mono font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Mulai Sekarang</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ARC TIMELINE NAVIGATION TABS */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e7e5e4] dark:border-[#27272a] scrollbar-none">
          {ROADMAP_ARCS.map(arc => {
            const unlocked = isArcUnlocked(arc);
            const isSelected = arc.id === activeArcId;
            const isCompleted = arc.stages.every(s => completedSet.has(s.id));

            return (
              <button
                key={arc.id}
                type="button"
                onClick={() => {
                  if (unlocked) setActiveArcId(arc.id);
                }}
                disabled={!unlocked}
                className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] border-[#1c1917] dark:border-[#f4f4f5] font-bold shadow-xs'
                    : unlocked
                    ? isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-[#1f1f23] border-[#e7e5e4] dark:border-[#27272a] text-[#1c1917] dark:text-[#f4f4f5] hover:border-[#1c1917]'
                    : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4]/50 dark:border-[#27272a]/50 text-[#a8a29e] dark:text-[#52525b] cursor-not-allowed opacity-60'
                }`}
              >
                {!unlocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : isCompleted ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="font-jp text-xs">{arc.titleJp.slice(0, 2)}</span>
                )}
                <span>Arc {arc.arcNumber}: {arc.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE ARC DETAIL BANNER */}
      <div className="mb-6 p-5 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider border ${currentArc.badgeColor}`}>
              ARC {currentArc.arcNumber} • {currentArc.badge}
            </span>
            <span className="font-jp font-bold text-sm text-[#78716c] dark:text-[#a1a1aa]">
              {currentArc.titleJp}
            </span>
          </div>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
            {currentArc.stages.filter(s => completedSet.has(s.id)).length} / {currentArc.stages.length} Stage Tuntas
          </span>
        </div>
        <h3 className="text-xl font-bold font-sans text-[#1c1917] dark:text-[#f4f4f5]">
          {currentArc.title}
        </h3>
        <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-1">
          {currentArc.summary}
        </p>
      </div>

      {/* 5. STAGES LIST IN CURRENT ARC */}
      <div className="space-y-4">
        {currentArc.stages.map((stage, idx) => {
          const isDone = completedSet.has(stage.id);
          // Stage terbuka jika stage pertama ATAU stage sebelumnya sudah selesai
          const isStageAvailable = idx === 0 || completedSet.has(currentArc.stages[idx - 1].id);

          return (
            <div
              key={stage.id}
              className={`p-5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/30'
                  : isStageAvailable
                  ? 'bg-white dark:bg-[#1f1f23] border-[#c84b31]/40 dark:border-[#e05d44]/40 shadow-xs ring-1 ring-[#c84b31]/10'
                  : 'bg-[#faf8f5] dark:bg-[#18181b] border-[#e7e5e4] dark:border-[#27272a] opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa]">
                      STAGE {stage.stageNumber}
                    </span>
                    <span className="text-[#a8a29e] dark:text-[#71717a]">•</span>
                    <span className="text-[10px] font-mono font-semibold text-[#c84b31] dark:text-[#e05d44]">
                      {stage.type === 'grand-exam' ? 'GRAND GATEKEEPER EXAM' : 'CHECKPOINT DRILL'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-sans text-[#1c1917] dark:text-[#f4f4f5] flex items-center gap-2">
                    <span>{stage.title}</span>
                    <span className="font-jp text-xs text-[#78716c] dark:text-[#a1a1aa] font-normal">
                      {stage.titleJp}
                    </span>
                  </h4>

                  <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-1 leading-relaxed max-w-2xl">
                    {stage.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#c84b31]" />
                      <span>{stage.targetCount} Soal</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{stage.timeLimitMinutes} Menit</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#1c1917] dark:text-[#f4f4f5]">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Syarat Lulus: {stage.passingScore}%</span>
                    </span>
                  </div>
                </div>

                {/* Stage Action Button */}
                <div className="shrink-0 w-full md:w-auto">
                  {isDone ? (
                    <div className="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Lulus [合格]</span>
                    </div>
                  ) : isStageAvailable ? (
                    <button
                      type="button"
                      onClick={() => handleStartStage(stage)}
                      className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:translate-y-px"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Mulai Tantangan</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-lg bg-[#e7e5e4] dark:bg-[#27272a] text-[#a8a29e] dark:text-[#71717a] text-xs font-mono flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Selesaikan Sebelumnya</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. MODAL STAGE QUIZ RUNNER (FOR N5+ CHECKPOINTS) */}
      {activeStageQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#faf8f5] dark:bg-[#18181b] border border-[#e7e5e4] dark:border-[#27272a] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            {!isQuizFinished ? (
              <>
                {/* Header Kuis */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e7e5e4] dark:border-[#27272a]">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#c84b31] uppercase">
                      {activeStageQuiz.title}
                    </span>
                    <div className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                      Soal {currentQuestionIndex + 1} dari {quizQuestions.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] text-xs font-mono font-bold text-[#c84b31]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {Math.floor(quizTimer / 60)}:{String(quizTimer % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Question */}
                {quizQuestions[currentQuestionIndex] && (
                  <div className="mb-6">
                    <div className="text-lg font-bold font-jp text-[#1c1917] dark:text-[#f4f4f5] leading-relaxed mb-6">
                      {quizQuestions[currentQuestionIndex].question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {quizQuestions[currentQuestionIndex].options.map((option, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleAnswerQuestion(optIdx)}
                          className="p-3 rounded-xl border border-[#e7e5e4] dark:border-[#27272a] bg-white dark:bg-[#1f1f23] hover:border-[#c84b31] dark:hover:border-[#e05d44] hover:bg-[#c84b31]/5 transition text-left text-sm font-jp font-medium cursor-pointer active:translate-y-px"
                        >
                          <span className="font-mono text-xs text-[#78716c] dark:text-[#a1a1aa] mr-2">
                            [{optIdx + 1}]
                          </span>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Hasil Evaluasi Kelulusan Stage */
              <div className="text-center py-4">
                {(() => {
                  let correct = 0;
                  quizQuestions.forEach((q, i) => {
                    if (userAnswers[i] === q.correctIndex) correct++;
                  });
                  const score = Math.round((correct / quizQuestions.length) * 100);
                  const isPassed = score >= activeStageQuiz.passingScore;

                  return (
                    <div>
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 shadow-sm animate-pop">
                        {isPassed ? (
                          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-9 h-9" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <RotateCcw className="w-9 h-9" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-sans text-[#1c1917] dark:text-[#f4f4f5]">
                        {isPassed ? 'SELAMAT, KAMU LULUS! [合格]' : 'BELUM MENCAPAI TARGET KELULUSAN'}
                      </h3>

                      <p className="text-xs text-[#78716c] dark:text-[#a1a1aa] mt-1 max-w-sm mx-auto">
                        {isPassed 
                          ? `Skor ${score}% telah memenuhi syarat kelulusan minimal ${activeStageQuiz.passingScore}%. Tahapan berikutnya terbuka!` 
                          : `Kamu meraih nilai ${score}%, sedangkan syarat kelulusan minimal adalah ${activeStageQuiz.passingScore}%. Perkuat materi dan coba lagi!`}
                      </p>

                      <div className="flex items-center justify-center gap-6 my-5 p-3 rounded-xl bg-white dark:bg-[#1f1f23] border border-[#e7e5e4] dark:border-[#27272a] max-w-xs mx-auto">
                        <div>
                          <div className="text-[10px] font-mono text-[#78716c] uppercase">Nilai Akhir</div>
                          <div className="text-2xl font-mono font-black text-[#c84b31] dark:text-[#e05d44]">{score}%</div>
                        </div>
                        <div className="w-px h-8 bg-[#e7e5e4] dark:border-[#27272a]" />
                        <div>
                          <div className="text-[10px] font-mono text-[#78716c] uppercase">Benar / Total</div>
                          <div className="text-2xl font-mono font-black text-[#1c1917] dark:text-[#f4f4f5]">{correct}/{quizQuestions.length}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveStageQuiz(null)}
                        className="px-6 py-2.5 rounded-xl bg-[#1c1917] dark:bg-[#f4f4f5] text-white dark:text-[#18181b] font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        Kembali ke Peta Belajar
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. DAILY SIGN-IN POPUP MODAL */}
      <DailySignInModal
        isOpen={isSignInOpen}
        currentStreak={progress.dailyStreak || 0}
        onClose={() => setIsSignInOpen(false)}
      />
    </div>
  );
};
