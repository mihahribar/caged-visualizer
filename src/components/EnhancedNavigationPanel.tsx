import { useEffect } from 'react';
import type { ChordType } from '../types';
import { CAGED_SHAPE_DATA } from '../constants';

interface EnhancedNavigationPanelProps {
  selectedChord: ChordType;
  currentPosition: number;
  currentShape: string;
  cagedSequence: string[];
  showAllShapes: boolean;
  showPentatonic: boolean;
  onChordChange: (chord: ChordType) => void;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
}

const chords: { value: ChordType; label: string }[] = [
  { value: 'C', label: 'C Major' },
  { value: 'A', label: 'A Major' },
  { value: 'G', label: 'G Major' },
  { value: 'E', label: 'E Major' },
  { value: 'D', label: 'D Major' }
];

export default function EnhancedNavigationPanel({
  selectedChord,
  currentPosition,
  currentShape,
  cagedSequence,
  showAllShapes,
  showPentatonic,
  onChordChange,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
  onToggleShowAllShapes,
  onToggleShowPentatonic
}: EnhancedNavigationPanelProps) {
  // Add keyboard navigation
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
            if (position < cagedSequence.length) {
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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showAllShapes, onPreviousPosition, onNextPosition, onSetPosition, cagedSequence.length, onToggleShowAllShapes, onToggleShowPentatonic]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 mb-6">
      {/* Chord Selection Section */}
      <section className="mb-4" aria-label="Chord selection">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">
            Choose Chord
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Root Note
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {chords.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChordChange(value)}
              className={`
                relative px-3 py-2 rounded-lg font-medium text-sm text-white transition-all duration-200 cursor-pointer
                focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none
                ${selectedChord === value
                  ? 'shadow-lg transform scale-105 focus:ring-white ring-2 ring-white ring-opacity-50'
                  : 'opacity-60 hover:opacity-80 hover:scale-102 focus:ring-gray-400'
                }
              `}
              style={{
                backgroundColor: CAGED_SHAPE_DATA[value].color
              }}
              aria-label={`Select ${label}`}
              aria-pressed={selectedChord === value}
            >
              <div className="text-center">
                <div className="text-base font-bold">{value}</div>
                <div className="text-xs opacity-80">Major</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* View Mode Section */}
      <section className="mb-4" aria-label="View mode controls">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">
            View Mode
          </h3>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Space</kbd>
            <span>toggle</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onToggleShowAllShapes}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none ${
              showAllShapes
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white focus:ring-indigo-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400'
            }`}
            aria-pressed={showAllShapes}
            aria-label={showAllShapes ? 'Switch to single CAGED shape' : 'Show all CAGED shapes'}
          >
            <div className="text-center">
              <div className="font-semibold text-sm">{showAllShapes ? 'All Shapes' : 'Single Shape'}</div>
              <div className="text-xs opacity-80">
                {showAllShapes ? 'All 5 positions' : 'One by one'}
              </div>
            </div>
          </button>

          <button
            onClick={onToggleShowPentatonic}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none ${
              showPentatonic
                ? 'bg-green-600 dark:bg-green-500 text-white focus:ring-green-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400'
            }`}
            aria-pressed={showPentatonic}
            aria-label={showPentatonic ? 'Hide pentatonic scale overlay' : 'Show pentatonic scale overlay'}
          >
            <div className="text-center">
              <div className="font-semibold text-sm">{showPentatonic ? 'Scale On' : 'Scale Off'}</div>
              <div className="text-xs opacity-80">
                {showPentatonic ? 'Pentatonic overlay' : 'Show pentatonic'}
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Position Navigation Section - Only show in single shape mode */}
      {!showAllShapes && (
        <section className="mb-3" aria-label="Position navigation">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">
              CAGED Position
            </h3>
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">←→</kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">1-5</kbd>
            </div>
          </div>

          {/* Current Position Display */}
          <div className="flex justify-center items-center space-x-3 mb-3">
            <button
              onClick={onPreviousPosition}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none"
              aria-label="Previous chord shape"
              title="Previous shape (←)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              className="px-4 py-2 rounded-lg text-white font-semibold text-base shadow-sm"
              style={{ backgroundColor: CAGED_SHAPE_DATA[currentShape].color }}
              role="status"
              aria-live="polite"
              aria-label={`Current shape: ${selectedChord} ${CAGED_SHAPE_DATA[currentShape].name}`}
            >
              <div className="text-center">
                <div className="text-lg">{selectedChord}</div>
                <div className="text-xs opacity-90">{CAGED_SHAPE_DATA[currentShape].name}</div>
              </div>
            </div>

            <button
              onClick={onNextPosition}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none"
              aria-label="Next chord shape"
              title="Next shape (→)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Shape Position Selector */}
          <div className="flex justify-center space-x-2" role="tablist" aria-label="CAGED shape selector">
            {cagedSequence.map((shape, index) => (
              <button
                key={shape}
                onClick={() => onSetPosition(index)}
                className={`relative w-10 h-10 rounded-lg text-white text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                  index === currentPosition
                    ? 'scale-110 shadow-lg focus:ring-white ring-2 ring-white ring-opacity-30'
                    : 'opacity-50 hover:opacity-75 focus:ring-gray-400'
                }`}
                style={{ backgroundColor: CAGED_SHAPE_DATA[shape].color }}
                role="tab"
                aria-selected={index === currentPosition}
                aria-label={`${shape} shape position ${index + 1} of ${cagedSequence.length}`}
                title={`${shape} shape (${index + 1})`}
              >
                <div className="text-base">{shape}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Instructions */}
      <section className="text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3" role="region" aria-label="Current mode instructions">
        {showAllShapes && (
          <div className="space-y-1">
            <p className="font-medium text-indigo-600 dark:text-indigo-400">
              All CAGED Positions Mode
            </p>
            <p>
              Viewing all 5 CAGED positions for {selectedChord} major simultaneously
            </p>
            <p className="text-xs">
              Overlapping notes show blended colors • Toggle pentatonic scale to see scale patterns
            </p>
          </div>
        )}

        {!showAllShapes && (
          <div className="space-y-1">
            <p className="font-medium" style={{ color: CAGED_SHAPE_DATA[currentShape].color }}>
              {CAGED_SHAPE_DATA[currentShape].name} - Position {currentPosition + 1} of {cagedSequence.length}
            </p>
            <p>
              Navigate through different ways to play {selectedChord} major using CAGED shapes
            </p>
            <p className="text-xs">
              Use arrow keys or number keys 1-5 for quick navigation • Space to show all shapes
            </p>
          </div>
        )}

        {showPentatonic && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="font-medium text-green-600 dark:text-green-400 text-sm">
              {selectedChord} Major Pentatonic Scale Active
            </p>
            <p className="text-xs">
              Green dots: scale notes • Green rings: chord + scale overlap
            </p>
          </div>
        )}
      </section>
    </div>
  );
}