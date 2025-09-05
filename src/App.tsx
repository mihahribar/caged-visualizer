import CAGEDVisualizer from "./components/CAGEDVisualizer";
import QuizPage from "./components/QuizPage";
import AppNavigation from "./components/AppNavigation";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { useNavigation } from "./hooks/useNavigation";

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
        {currentPage === 'quiz' && <QuizPage />}
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

export default App
