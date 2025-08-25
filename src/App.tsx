import CAGEDVisualizer from "./components/CAGEDVisualizer";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <CAGEDVisualizer />
    </ThemeProvider>
  );
}

export default App
