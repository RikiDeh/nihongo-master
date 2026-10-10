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

export function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('kana');
  const [activeLevel, setActiveLevel] = useState<JLPTLevel | 'ALL' | undefined>(undefined);
  const [isSrsOpen, setIsSrsOpen] = useState(false);

  // Kana Quiz Sub-states: 'selector' | 'quiz' | 'results'
  const [kanaStage, setKanaStage] = useState<'selector' | 'quiz' | 'results'>('selector');
  const [activeQuizItems, setActiveQuizItems] = useState<KanaItem[]>([]);
  const [quizSummary, setQuizSummary] = useState<QuizSummary | null>(null);
  const [requeueMistakes, setRequeueMistakes] = useState(true);
  const [requireEnter, setRequireEnter] = useState(true);

  // Start quiz with selected items
  const handleStartQuiz = (items: KanaItem[], requeue: boolean = true, enterRequired: boolean = true) => {
    setActiveQuizItems(items);
    setRequeueMistakes(requeue);
    setRequireEnter(enterRequired);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar (hidden during quiz session to minimize distraction, like Tofugu focus mode) */}
      {kanaStage !== 'quiz' && (
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

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
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
                  requireEnter={requireEnter}
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

          {activeModule === 'dojo' && <ConjugationDojo />}

          {activeModule === 'quiz' && (
            <N5QuizCenter 
              key={`quiz-${activeLevel || 'N5'}`}
              initialLevel={activeLevel} 
            />
          )}

          {activeModule === 'roadmap' && (
            <RoadmapView onNavigate={handleNavigateFromRoadmap} />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      {kanaStage !== 'quiz' && (
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">NihongoMaster</span>
              <span>— Platform Belajar Bahasa Jepang Mandiri</span>
            </div>
            <p>Fitur kuis Kana simultan, evaluasi Romaji, dan kurikulum N5 hingga N1.</p>
          </div>
        </footer>
      )}

      {/* Srs Review Session Modal */}
      {isSrsOpen && (
        <SrsReviewSession onClose={() => setIsSrsOpen(false)} />
      )}
    </div>
  );
}

export default App;
