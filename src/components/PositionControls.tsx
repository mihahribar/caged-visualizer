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
  showAllNotes: boolean;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
}

export default function PositionControls({
  selectedChord,
  currentPosition,
  currentShape,
  cagedSequence,
  showAllShapes,
  showPentatonic,
  showAllNotes,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
  onToggleShowAllShapes,
  onToggleShowPentatonic,
  onToggleShowAllNotes
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
  }, [showAllShapes, onPreviousPosition, onNextPosition, onSetPosition, cagedSequence.length, onToggleShowAllShapes, onToggleShowPentatonic, onToggleShowAllNotes]);

  return (
    <div className="mt-6">
      {/* Position Controls - Inside bordered container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
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
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none cursor-pointer"
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
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none cursor-pointer"
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
                className={`relative w-8 h-8 rounded-md text-white text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none cursor-pointer ${
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
              } • Press Space to toggle view mode{showPentatonic ? ' • Press S for scale' : ''}{showAllNotes ? ' • Press N for notes' : ''}
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

          {showAllNotes && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="font-medium text-blue-600 dark:text-blue-400 text-sm">
                Natural Note Names Active
              </p>
              <p className="text-xs">
                Letter labels: natural notes (E,F,G,A,B,C,D) on all fret positions
              </p>
            </div>
          )}
        </div>
      </div>
      {/* View Mode Section - Outside bordered container */}
      <section className="mb-4 mt-6" aria-label="View mode controls">
        <div className="flex items-center justify-end gap-6">
          {/* Show All Shapes Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show All Shapes</span>
            <button
                onClick={onToggleShowAllShapes}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    showAllShapes
                        ? 'bg-indigo-600 dark:bg-indigo-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                }`}
                aria-pressed={showAllShapes}
                aria-label={showAllShapes ? 'Switch to single CAGED shape' : 'Show all CAGED shapes'}
            >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      showAllShapes ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showAllShapes ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Pentatonic Scale Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Pentatonic Scale</span>
            <button
                onClick={onToggleShowPentatonic}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    showPentatonic
                        ? 'bg-green-600 dark:bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                }`}
                aria-pressed={showPentatonic}
                aria-label={showPentatonic ? 'Hide pentatonic scale overlay' : 'Show pentatonic scale overlay'}
            >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      showPentatonic ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showPentatonic ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* All Notes Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">All Notes</span>
            <button
                onClick={onToggleShowAllNotes}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    showAllNotes
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                }`}
                aria-pressed={showAllNotes}
                aria-label={showAllNotes ? 'Hide note names on fretboard' : 'Show note names on fretboard'}
            >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      showAllNotes ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showAllNotes ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}