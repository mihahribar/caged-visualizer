import { useEffect } from 'react';
import type { ChordType } from '../types';
import { CAGED_SHAPE_DATA } from '../constants';

interface NavigationControlsProps {
  selectedChord: ChordType;
  currentPosition: number;
  currentShape: string;
  cagedSequence: string[];
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
  showAllShapes: boolean;
}

export default function NavigationControls({
  selectedChord,
  currentPosition,
  currentShape,
  cagedSequence,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
  showAllShapes
}: NavigationControlsProps) {
  // Add keyboard navigation
  useEffect(() => {
    if (showAllShapes) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPreviousPosition();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNextPosition();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          event.preventDefault();
          const position = parseInt(event.key) - 1;
          if (position < cagedSequence.length) {
            onSetPosition(position);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAllShapes, onPreviousPosition, onNextPosition, onSetPosition, cagedSequence.length]);

  if (showAllShapes) return null;

  return (
    <section className="text-center mb-6" aria-label="Shape navigation">
      <div className="flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={onPreviousPosition}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none"
          aria-label="Previous chord shape"
          title="Previous shape (←)"
        >
          ← Previous
        </button>
        
        <div 
          className="px-6 py-3 rounded-full text-white font-medium text-lg"
          style={{ backgroundColor: CAGED_SHAPE_DATA[currentShape].color }}
          role="status"
          aria-live="polite"
          aria-label={`Current shape: ${selectedChord} ${CAGED_SHAPE_DATA[currentShape].name}`}
        >
          {selectedChord} - {CAGED_SHAPE_DATA[currentShape].name}
        </div>
        
        <button
          onClick={onNextPosition}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none"
          aria-label="Next chord shape"
          title="Next shape (→)"
        >
          Next →
        </button>
      </div>
      
      <div className="flex justify-center space-x-2" role="tablist" aria-label="CAGED shape selector">
        {cagedSequence.map((shape, index) => (
          <button
            key={shape}
            onClick={() => onSetPosition(index)}
            className={`w-8 h-8 rounded-full text-white text-sm font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none ${
              index === currentPosition ? 'scale-110 shadow-lg focus:ring-white' : 'opacity-40 focus:ring-gray-400'
            }`}
            style={{ backgroundColor: CAGED_SHAPE_DATA[shape].color }}
            role="tab"
            aria-selected={index === currentPosition}
            aria-label={`${shape} shape position ${index + 1} of ${cagedSequence.length}`}
            title={`${shape} shape (${index + 1})`}
          >
            {shape}
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-gray-500" aria-label="Keyboard shortcuts">
        Use ←/→ or numbers 1-5 for quick navigation
      </div>
    </section>
  );
}