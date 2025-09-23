import { lazy, Suspense } from "react";
import CAGEDVisualizer from "@/systems/caged/components/CAGEDVisualizer";
import { AppNavigation, LoadingFallback } from "@/shared/components";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { useNavigation } from "./hooks/useNavigation";

// Lazy load Quiz and Modes components for better initial bundle size
const QuizPage = lazy(() => import("@/systems/quiz/components/QuizPage"));
const ModesVisualizer = lazy(() => import("@/systems/modes/components/ModesVisualizer"));

function AppContent() {
  const { currentPage } = useNavigation();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <header>
        <AppNavigation />
      </header>
      
      {/* Main Content */}
      <main>
        {currentPage === 'caged' && <CAGEDVisualizer />}
        {currentPage === 'quiz' && (
          <Suspense fallback={<LoadingFallback message="Loading quiz..." size="large" />}>
            <QuizPage />
          </Suspense>
        )}
        {currentPage === 'modes' && (
          <Suspense fallback={<LoadingFallback message="Loading modes..." size="large" />}>
            <ModesVisualizer />
          </Suspense>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
