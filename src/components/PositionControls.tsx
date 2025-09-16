import { useEffect } from 'react';
import type { ChordType } from '../types';
import { CAGED_SHAPE_DATA } from '../constants';

interface PositionControlsProps {
  selectedChord: ChordType;
  currentPosition: number;
  currentShape: string;
  cagedSequence: string[];
  showAllShapes: boolean;
  showPentatonic: boolean;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
}

export default function PositionControls({
  selectedChord,
  currentPosition,
  currentShape,
  cagedSequence,
  showAllShapes,
  showPentatonic,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
  onToggleShowAllShapes,
  onToggleShowPentatonic
}: PositionControlsProps) {
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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 mt-6">
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
        <section aria-label="Position navigation">
        <div className="flex items-center justify-between mb-3">
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
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none"
            aria-label="Previous chord shape"
            title="Previous shape (←)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none"
            aria-label="Next chord shape"
            title="Next shape (→)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Shape Position Selector */}
        <div className="flex justify-center space-x-1.5" role="tablist" aria-label="CAGED shape selector">
          {cagedSequence.map((shape, index) => (
            <button
              key={shape}
              onClick={() => onSetPosition(index)}
              className={`relative w-8 h-8 rounded-md text-white text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
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
              <div className="text-sm">{shape}</div>
            </button>
          ))}
        </div>

          {/* Instructions for single shape mode */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="font-medium" style={{ color: CAGED_SHAPE_DATA[currentShape].color }}>
              {CAGED_SHAPE_DATA[currentShape].name} - Position {currentPosition + 1} of {cagedSequence.length}
            </p>
            <p className="text-xs mt-1">
              Use arrow keys or number keys 1-5 for quick navigation
            </p>
          </div>
        </section>
      )}

      {/* Instructions for all modes */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="space-y-1">
          <p className="font-medium">
            {showAllShapes ? (
              <span className="text-indigo-600 dark:text-indigo-400">All CAGED Positions Mode</span>
            ) : (
              <span>Single Shape Mode</span>
            )}
          </p>
          <p>
            {showAllShapes
              ? `Viewing all 5 CAGED positions for ${selectedChord} major simultaneously`
              : `Navigate through different ways to play ${selectedChord} major using CAGED shapes`
            }
          </p>
          <p className="text-xs">
            {showAllShapes
              ? 'Overlapping notes show blended colors'
              : 'Use position controls above'
            } • Press Space to toggle view mode{showPentatonic ? ' • Press S for scale' : ''}
          </p>
        </div>

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
      </div>
    </div>
  );
}