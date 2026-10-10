import React, { useState, lazy, Suspense } from 'react';
import { Navbar, ActiveModule } from './components/Navbar';
import { KanaSelector } from './components/KanaQuiz/KanaSelector';
import { KanaQuizSession } from './components/KanaQuiz/KanaQuizSession';
import { KanaResults } from './components/KanaQuiz/KanaResults';
import { KanaItem, QuizSummary, JLPTLevel } from './types';
import { SrsReviewSession } from './components/SrsModule/SrsReviewSession';

// Lazy-loaded components for optimal bundle size
const KanjiExplorer = lazy(() => import('./components/KanjiModule/KanjiExplorer').then(m => ({ default: m.KanjiExplorer })));
const VocabExplorer = lazy(() => import('./components/VocabModule/VocabExplorer').then(m => ({ default: m.VocabExplorer })));
const GrammarExplorer = lazy(() => import('./components/GrammarModule/GrammarExplorer').then(m => ({ default: m.GrammarExplorer })));
const ConjugationDojo = lazy(() => import('./components/ConjugationModule/ConjugationDojo').then(m => ({ default: m.ConjugationDojo })));
const N5QuizCenter = lazy(() => import('./components/QuizModule/N5QuizCenter').then(m => ({ default: m.N5QuizCenter })));
const RoadmapView = lazy(() => import('./components/Roadmap/RoadmapView').then(m => ({ default: m.RoadmapView })));
const DesignShowroom = lazy(() => import('./components/DesignLab/DesignShowroom').then(m => ({ default: m.DesignShowroom })));

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

  // Kana Quiz Sub-states: 'selector' | 'quiz' | 'results'
  const [kanaStage, setKanaStage] = useState<'selector' | 'quiz' | 'results'>('selector');
  const [activeQuizItems, setActiveQuizItems] = useState<KanaItem[]>([]);
  const [quizSummary, setQuizSummary] = useState<QuizSummary | null>(null);
  const [requeueMistakes, setRequeueMistakes] = useState(true);

  // Start quiz with selected items
  const handleStartQuiz = (items: KanaItem[], requeue: boolean = true) => {
    setActiveQuizItems(items);
    setRequeueMistakes(requeue);
    setKanaStage('quiz');
  };

  // Quiz completed
  const handleFinishQuiz = (summary: QuizSummary) => {
    setQuizSummary(summary);
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
        />
      )}

      {/* Main Workspace Canvas (Expansive Width) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className={`flex-1 ${!isFullFocusMode ? 'pb-20 md:pb-12' : ''}`}>
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
                    onRetryMissed={handleRetryMissed}
                    onRetryAll={handleRetryAll}
                    onBackToSelector={handleBackToSelector}
                    onGoToKanji={() => {
                      setActiveModule('kanji');
                      setActiveLevel('N5');
                      setKanaStage('selector');
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
                onLaunchKanaQuiz={(items, requeue) => {
                  setActiveModule('kana');
                  handleStartQuiz(items, requeue);
                }}
              />
            )}

            {activeModule === 'design-lab' && (
              <DesignShowroom onBackToApp={() => setActiveModule('kana')} />
            )}
          </Suspense>
        </main>

        {/* Minimal Editorial Footer */}
        {!isFullFocusMode && (
          <footer className="border-t border-[#e7e5e4] dark:border-[#27272a] bg-[#faf8f5]/90 dark:bg-[#18181b]/90 py-5 text-center text-xs text-[#78716c] dark:text-[#a1a1aa] mt-auto">
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
    </div>
  );
}

export default App;
