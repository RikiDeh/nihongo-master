import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, ActiveModule } from './components/Navbar';
import { KanaSelector } from './components/KanaQuiz/KanaSelector';
import { KanaQuizSession } from './components/KanaQuiz/KanaQuizSession';
import { KanaResults } from './components/KanaQuiz/KanaResults';
import { KanaItem, QuizSummary, JLPTLevel } from './types';
import { SrsReviewSession } from './components/SrsModule/SrsReviewSession';
import { OnboardingTourModal } from './components/Onboarding/OnboardingTourModal';
import { RoadmapStage, ROADMAP_ARCS } from './data/roadmapData';
import { completeRoadmapStage, reportMissionActivity } from './utils/storage';
import { PwaPrompt } from './components/PwaPrompt/PwaPrompt';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

/**
 * Resilient lazy loader yang otomatis me-retry jika jaringan fluktuatif atau
 * melakukan reload otomatis jika hash chunk berubah akibat deployment versi baru.
 */
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      console.warn('Initial lazy import failed, retrying once...', error);
      try {
        // Coba lagi setelah jeda 300ms
        await new Promise((resolve) => setTimeout(resolve, 300));
        return await factory();
      } catch (retryError) {
        // Jika tetap gagal karena chunk hilang (akibat deploy baru), auto-reload halaman
        const isChunkError =
          (retryError as Error)?.message?.includes('Failed to fetch dynamically imported module') ||
          (retryError as Error)?.message?.includes('Importing a module script failed');

        if (isChunkError && typeof window !== 'undefined') {
          const reloadKey = 'nihongo_lazy_chunk_reload';
          const lastReload = sessionStorage.getItem(reloadKey);
          const now = Date.now();
          if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
            sessionStorage.setItem(reloadKey, now.toString());
            window.location.reload();
          }
        }
        throw retryError;
      }
    }
  });
}

// Lazy-loaded components dengan perlindungan auto-retry & auto-recovery
const KanjiExplorer = lazyWithRetry(() => import('./components/KanjiModule/KanjiExplorer').then(m => ({ default: m.KanjiExplorer })));
const VocabExplorer = lazyWithRetry(() => import('./components/VocabModule/VocabExplorer').then(m => ({ default: m.VocabExplorer })));
const GrammarExplorer = lazyWithRetry(() => import('./components/GrammarModule/GrammarExplorer').then(m => ({ default: m.GrammarExplorer })));
const ConjugationDojo = lazyWithRetry(() => import('./components/ConjugationModule/ConjugationDojo').then(m => ({ default: m.ConjugationDojo })));
const N5QuizCenter = lazyWithRetry(() => import('./components/QuizModule/N5QuizCenter').then(m => ({ default: m.N5QuizCenter })));
const RoadmapView = lazyWithRetry(() => import('./components/Roadmap/RoadmapView').then(m => ({ default: m.RoadmapView })));
const DesignShowroom = lazyWithRetry(() => import('./components/DesignLab/DesignShowroom').then(m => ({ default: m.DesignShowroom })));

export function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lab') === 'true' || window.location.hash === '#lab') {
        return 'design-lab';
      }
    }
    return 'roadmap';
  });
  const [activeLevel, setActiveLevel] = useState<JLPTLevel | 'ALL' | undefined>(undefined);
  const [isSrsOpen, setIsSrsOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Otomatis munculkan Tour untuk User Baru setelah DOM terpasang sempurna
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenTour = localStorage.getItem('nihongo_tour_seen');
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const handleTourReset = () => {
      setIsTourOpen(true);
    };
    window.addEventListener('nihongo_tour_reset', handleTourReset);
    return () => window.removeEventListener('nihongo_tour_reset', handleTourReset);
  }, []);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nihongo_tour_seen', 'true');
    }
  };

  // Kana Quiz Sub-states: 'selector' | 'quiz' | 'results'
  const [kanaStage, setKanaStage] = useState<'selector' | 'quiz' | 'results'>('selector');
  const [activeQuizItems, setActiveQuizItems] = useState<KanaItem[]>([]);
  const [quizSummary, setQuizSummary] = useState<QuizSummary | null>(null);
  const [requeueMistakes, setRequeueMistakes] = useState(true);
  const [activeRoadmapStage, setActiveRoadmapStage] = useState<RoadmapStage | null>(null);
  const [stageEvaluation, setStageEvaluation] = useState<{
    stage: RoadmapStage;
    isPassed: boolean;
    score: number;
  } | null>(null);

  // Start quiz with selected items (optional roadmap stage)
  const handleStartQuiz = (items: KanaItem[], requeue: boolean = true, stage?: RoadmapStage) => {
    setActiveRoadmapStage(stage || null);
    setActiveQuizItems(items);
    setRequeueMistakes(requeue);
    setKanaStage('quiz');
  };

  // Quiz completed
  const handleFinishQuiz = (summary: QuizSummary) => {
    setQuizSummary(summary);

    // Laporkan misi harian kuis refleks
    reportMissionActivity('quiz');

    // Evaluasi kelulusan jika kuis diluncurkan dari Misi Peta Belajar
    let evalResult: { stage: RoadmapStage; isPassed: boolean; score: number } | null = null;
    const stageToEvaluate = activeRoadmapStage;

    if (stageToEvaluate) {
      const isPassed = summary.accuracy >= stageToEvaluate.passingScore;
      evalResult = {
        stage: stageToEvaluate,
        isPassed,
        score: summary.accuracy,
      };

      if (isPassed) {
        // Cari arc pemilik stage ini
        const arc = ROADMAP_ARCS.find(a => a.stages.some(s => s.id === stageToEvaluate.id));
        let nextArcId: string | undefined = undefined;
        if (arc) {
          const isLastStageOfArc = arc.stages[arc.stages.length - 1].id === stageToEvaluate.id;
          if (isLastStageOfArc && arc.arcNumber + 1 < ROADMAP_ARCS.length) {
            nextArcId = ROADMAP_ARCS[arc.arcNumber + 1].id;
          }
        }
        completeRoadmapStage(stageToEvaluate.id, nextArcId);
      }
    } else {
      // Auto-unlock Hiragana / Katakana dasar jika user latihan manual dari Kana Matrix
      if (summary.totalQuestions >= 46 && summary.accuracy >= 95) {
        const isAllHiragana = activeQuizItems.every(i => i.type === 'hiragana');
        if (isAllHiragana) {
          completeRoadmapStage('arc_0_stage_1');
        }
      }
      if (summary.totalQuestions >= 46 && summary.accuracy >= 90) {
        const isAllKatakana = activeQuizItems.every(i => i.type === 'katakana');
        if (isAllKatakana) {
          completeRoadmapStage('arc_0_stage_2');
        }
      }
    }

    setStageEvaluation(evalResult);
    setKanaStage('results');
  };

  // Retry only missed items
  const handleRetryMissed = (missedItems: KanaItem[]) => {
    setActiveQuizItems(missedItems);
    setKanaStage('quiz');
  };

  // Retry all items from the last session
  const handleRetryAll = () => {
    if (activeQuizItems.length > 0) {
      setKanaStage('quiz');
    }
  };

  // Back to character selection
  const handleBackToSelector = () => {
    setKanaStage('selector');
  };

  const handleNavigateFromRoadmap = (module: ActiveModule, level?: JLPTLevel) => {
    if (level) {
      setActiveLevel(level);
    }
    setActiveModule(module);
  };

  const isFullFocusMode = kanaStage === 'quiz';

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#18181b] text-[#1c1917] dark:text-[#f4f4f5] flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Sidebar Navigation (hidden during focus quiz session) */}
      {!isFullFocusMode && (
        <Navbar 
          activeModule={activeModule} 
          onSelectModule={(mod) => {
            setActiveModule(mod);
            if (mod === 'kana') {
              setKanaStage('selector');
            }
          }} 
          onOpenSrsReview={() => setIsSrsOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
        />
      )}

      {/* Main Workspace Canvas (Expansive Width) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className={`flex-1 ${!isFullFocusMode ? 'pb-20 md:pb-12' : ''}`}>
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[#c84b31] border-t-transparent rounded-full animate-spin" />
              </div>
            }>
            {activeModule === 'kana' && (
              <>
                {kanaStage === 'selector' && (
                  <KanaSelector onStartQuiz={handleStartQuiz} />
                )}

                {kanaStage === 'quiz' && (
                  <KanaQuizSession
                    items={activeQuizItems}
                    requeueMistakes={requeueMistakes}
                    onFinishQuiz={handleFinishQuiz}
                    onExit={handleBackToSelector}
                  />
                )}

                {kanaStage === 'results' && quizSummary && (
                  <KanaResults
                    summary={quizSummary}
                    stageEvaluation={stageEvaluation}
                    onReturnToRoadmap={() => {
                      setActiveModule('roadmap');
                      setKanaStage('selector');
                      setStageEvaluation(null);
                      setActiveRoadmapStage(null);
                    }}
                    onRetryMissed={handleRetryMissed}
                    onRetryAll={handleRetryAll}
                    onBackToSelector={() => {
                      handleBackToSelector();
                      setStageEvaluation(null);
                      setActiveRoadmapStage(null);
                    }}
                    onGoToKanji={() => {
                      setActiveModule('kanji');
                      setActiveLevel('N5');
                      setKanaStage('selector');
                      setStageEvaluation(null);
                      setActiveRoadmapStage(null);
                    }}
                  />
                )}
              </>
            )}

            {activeModule === 'kanji' && (
              <KanjiExplorer 
                key={`kanji-${activeLevel || 'N5'}`}
                initialLevel={activeLevel} 
                onGoToQuiz={() => setActiveModule('quiz')} 
              />
            )}

            {activeModule === 'vocab' && (
              <VocabExplorer 
                key={`vocab-${activeLevel || 'N5'}`}
                initialLevel={activeLevel} 
                onGoToQuiz={() => setActiveModule('quiz')} 
              />
            )}

            {activeModule === 'grammar' && (
              <GrammarExplorer 
                key={`grammar-${activeLevel || 'N5'}`}
                initialLevel={activeLevel} 
                onGoToQuiz={() => setActiveModule('quiz')} 
              />
            )}

            {activeModule === 'dojo' && (
              <ConjugationDojo 
                onSwitchSubModule={(mod) => setActiveModule(mod)} 
              />
            )}

            {activeModule === 'quiz' && (
              <N5QuizCenter 
                key={`quiz-${activeLevel || 'N5'}`}
                initialLevel={activeLevel} 
                onSwitchSubModule={(mod) => setActiveModule(mod)}
              />
            )}

            {activeModule === 'roadmap' && (
              <RoadmapView 
                onNavigate={handleNavigateFromRoadmap}
                onOpenSrs={() => setIsSrsOpen(true)}
                onLaunchKanaQuiz={(items, requeue, stage) => {
                  setActiveModule('kana');
                  handleStartQuiz(items, requeue ?? true, stage);
                }}
              />
            )}

            {activeModule === 'design-lab' && (
              <DesignShowroom onBackToApp={() => setActiveModule('kana')} />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

        {/* Minimal Editorial Footer (Added pb-20 on mobile so floating bottom bar never covers it) */}
        {!isFullFocusMode && (
          <footer className="border-t border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5]/90 dark:bg-[#18181b]/90 py-5 pb-24 md:pb-5 text-center text-xs text-[#78716c] dark:text-[#a1a1aa] mt-auto">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-jp font-bold text-[#1c1917] dark:text-[#f4f4f5]">日本語マスター</span>
                <span className="text-[#a8a29e] dark:text-[#71717a]">|</span>
                <span className="font-medium text-[#78716c] dark:text-[#a1a1aa]">NihongoMaster — Platform Belajar Bahasa Jepang 0→N1</span>
              </div>
              <p className="text-[11px] font-sans">Kurikulum Otentik N5 hingga N1 • 100% In-Context JLPT Questions</p>
            </div>
          </footer>
        )}
      </div>

      {/* Srs Review Session Modal */}
      {isSrsOpen && (
        <SrsReviewSession onClose={() => setIsSrsOpen(false)} />
      )}

      {/* Onboarding Tour Modal (Untuk Pengguna Baru & Tombol Bantuan) */}
      <OnboardingTourModal
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          if (mod === 'kana') {
            setKanaStage('selector');
          }
        }}
      />

      {/* PWA Offline Indicator & Install Prompt */}
      <PwaPrompt />
    </div>
  );
}

export default App;
