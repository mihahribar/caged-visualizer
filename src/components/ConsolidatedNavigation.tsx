import type { ChordType } from '../types';
import { CAGED_SHAPE_DATA } from '../constants';

interface ConsolidatedNavigationProps {
  selectedChord: ChordType;
  currentPosition: number;
  currentShape: string;
  cagedSequence: string[];
  showAllShapes: boolean;
  onChordChange: (chord: ChordType) => void;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
}

const chords: { value: ChordType; label: string }[] = [
  { value: 'C', label: 'C Major' },
  { value: 'A', label: 'A Major' },
  { value: 'G', label: 'G Major' },
  { value: 'E', label: 'E Major' },
  { value: 'D', label: 'D Major' }
];

export default function ConsolidatedNavigation({
  selectedChord,
  currentPosition,
  currentShape,
  cagedSequence,
  showAllShapes,
  onChordChange,
  onPreviousPosition,
  onNextPosition,
  onSetPosition
}: ConsolidatedNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between gap-6">

        {/* Root Chord Selection */}
        <div className="flex-2 flex flex-col items-center min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Root Chord (Major)
            </h3>
          </div>
          <div className="flex gap-2">
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
                  <div className="text-base w-10 font-bold">{value}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CAGED Position Navigation - Only show in single shape mode */}
        {!showAllShapes && (
          <div className="flex-2 flex flex-col items-center min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                CAGED Shape/Position
              </h3>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">←→</kbd>
                <span>or</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">1-5</kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Previous Button */}
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

              {/* Shape Position Selector */}
              <div className="flex gap-1.5 ml-2" role="tablist" aria-label="CAGED shape selector">
                {cagedSequence.map((shape, index) => (
                  <button
                    key={shape}
                    onClick={() => onSetPosition(index)}
                    className={`relative w-10 h-10 rounded-md text-white text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none cursor-pointer ${
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

              {/* Next Button */}
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
          </div>
        )}

        {/* All Shapes Mode Indicator */}
        {showAllShapes && (
          <div className="flex-2 flex flex-col items-center min-w-0">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                CAGED Position
              </h3>
              <div className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-base shadow-sm">
                <div className="text-center">
                  <div className="text-base opacity-90">All Shapes</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}