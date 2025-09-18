import { lazy, Suspense } from "react";
import CAGEDVisualizer from "./components/CAGEDVisualizer";
import AppNavigation from "./components/AppNavigation";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { useNavigation } from "./hooks/useNavigation";
import { LoadingFallback } from "./components/LoadingFallback";

// Lazy load Quiz components for better initial bundle size
const QuizPage = lazy(() => import("./components/QuizPage"));

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
        {currentPage === 'visualizer' && <CAGEDVisualizer />}
        {currentPage === 'quiz' && (
          <Suspense fallback={<LoadingFallback message="Loading quiz..." size="large" />}>
            <QuizPage />
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
