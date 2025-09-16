import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  showAllShapes: boolean;
  cagedSequenceLength: number;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
}

export function useKeyboardNavigation({
  showAllShapes,
  cagedSequenceLength,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
  onToggleShowAllShapes,
  onToggleShowPentatonic,
  onToggleShowAllNotes
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (!showAllShapes) {
            event.preventDefault();
            onPreviousPosition();
          }
          break;
        case 'ArrowRight':
          if (!showAllShapes) {
            event.preventDefault();
            onNextPosition();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          if (!showAllShapes) {
            event.preventDefault();
            const position = parseInt(event.key) - 1;
            if (position < cagedSequenceLength) {
              onSetPosition(position);
            }
          }
          break;
        }
        case ' ':
          event.preventDefault();
          onToggleShowAllShapes();
          break;
        case 's':
        case 'S':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with save
          event.preventDefault();
          onToggleShowPentatonic();
          break;
        case 'n':
        case 'N':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with new file, etc.
          event.preventDefault();
          onToggleShowAllNotes();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    showAllShapes,
    onPreviousPosition,
    onNextPosition,
    onSetPosition,
    cagedSequenceLength,
    onToggleShowAllShapes,
    onToggleShowPentatonic,
    onToggleShowAllNotes
  ]);
}