import { memo, useEffect } from 'react';
import type { ChordType } from '../types';
import { STRING_NAMES, TOTAL_FRETS } from '../constants';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

/**
 * Props interface for FretboardDisplay component
 */
interface FretboardDisplayProps {
  /** Currently selected root chord (C, A, G, E, D) */
  selectedChord: ChordType;
  /** Current CAGED shape being displayed (when not showing all) */
  currentShape: string;
  /** Whether to show all CAGED shapes simultaneously */
  showAllShapes: boolean;
  /** Whether to overlay pentatonic scale notes */
  showPentatonic: boolean;
  /** Whether to display note names on natural notes */
  showAllNotes: boolean;
  /** Function to determine if a chord dot should be shown at position */
  shouldShowDot: (stringIndex: number, fretNumber: number) => boolean;
  /** Function to get CSS styling for chord dots (colors, gradients) */
  getDotStyle: (stringIndex: number, fretNumber: number) => React.CSSProperties | undefined;
  /** Function to check if position contains the root note of current chord */
  isRootNote: (stringIndex: number, fretNumber: number) => boolean;
  /** Function to determine if pentatonic dot should be shown at position */
  shouldShowPentatonicDot: (stringIndex: number, fretNumber: number) => boolean;
  /** Function to determine if note name should be displayed at position */
  shouldShowNoteName: (stringIndex: number, fretNumber: number) => boolean;
  /** Function to get note name string for specific position */
  getNoteNameAtFret: (stringIndex: number, fretNumber: number) => string;
}

/**
 * Guitar fretboard display component with CAGED chord visualization
 *
 * Renders an interactive guitar fretboard showing CAGED chord shapes, pentatonic scales,
 * and note names. Uses a table-based layout with CSS Grid for precise positioning.
 * Supports multiple display modes and overlays for comprehensive music education.
 *
 * @param props - FretboardDisplayProps containing display options and calculation functions
 *
 * @returns JSX table element representing guitar fretboard with appropriate ARIA labels
 *
 * @accessibility
 * - Uses semantic table structure with proper headings
 * - Includes ARIA labels for screen reader navigation
 * - Provides descriptive role and aria-label attributes
 * - Fret markers indicate common position references (3rd, 5th, 7th, 9th, 12th frets)
 *
 * @styling
 * - Responsive design adapting to mobile and desktop layouts
 * - Dark mode support with appropriate color schemes
 * - Visual hierarchy with chord dots, pentatonic overlays, and note names
 * - CSS custom properties for precise fretboard spacing
 *
 * @performance
 * - Uses React.memo candidate for props-based re-rendering optimization
 * - Minimal DOM updates through conditional rendering of overlays
 * - Efficient iteration over fixed fretboard dimensions (6 strings × 15 frets)
 */
function FretboardDisplay({
  selectedChord,
  showAllShapes,
  showPentatonic,
  showAllNotes,
  shouldShowDot,
  getDotStyle,
  isRootNote,
  shouldShowPentatonicDot,
  shouldShowNoteName,
  getNoteNameAtFret
}: FretboardDisplayProps) {
  const { startRender } = usePerformanceMonitor('FretboardDisplay');

  useEffect(() => {
    const endRender = startRender();
    endRender();
  });
  return (
    <section className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm" aria-label="Guitar fretboard">
      <table 
        className="fretboard-grid w-full border-collapse"
        role="grid" 
        aria-label={`Guitar fretboard showing ${selectedChord} chord${showAllShapes ? ' in all CAGED positions' : ''}`}
      >
        <thead>
          <tr>
            <th className="w-8"></th>
            {Array.from({ length: TOTAL_FRETS }, (_, i) => (
              <th key={i} className="text-center pb-2 relative">
                {[3, 5, 7, 9, 12].includes(i + 1) && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">{i + 1}</div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRING_NAMES.map((stringName, stringIndex) => (
            <tr key={stringIndex} className="string-row">
              <th 
                className="w-8 text-right pr-2 text-sm font-mono text-gray-600 dark:text-gray-300 font-medium"
                scope="row"
                aria-label={`${stringName} string`}
              >
                {stringName}
              </th>
              
              {Array.from({ length: TOTAL_FRETS }, (_, fretIndex) => (
                <td 
                  key={fretIndex} 
                  className="fret-cell relative h-8 border-l border-gray-300 dark:border-gray-600 first:border-l-0"
                  role="gridcell"
                  aria-label={`${stringName} string, fret ${fretIndex + 1}`}
                >
                  {/* String line */}
                  <div 
                    className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t border-gray-400 dark:border-gray-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  
                  {/* Chord dot */}
                  {shouldShowDot(stringIndex, fretIndex + 1) && (
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm ${
                        isRootNote(stringIndex, fretIndex + 1) ? 'ring-2 ring-gray-800 dark:ring-gray-200' : ''
                      } ${
                        showPentatonic && shouldShowPentatonicDot(stringIndex, fretIndex + 1) ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
                      }`}
                      style={getDotStyle(stringIndex, fretIndex + 1)}
                      aria-label={`${isRootNote(stringIndex, fretIndex + 1) ? 'Root note' : 'Chord note'}${showPentatonic && shouldShowPentatonicDot(stringIndex, fretIndex + 1) ? ' (also pentatonic scale note)' : ''} on ${stringName} string, fret ${fretIndex + 1}`}
                    >
                      {isRootNote(stringIndex, fretIndex + 1) ? 'R' : ''}
                    </div>
                  )}

                  {/* Pentatonic overlay dot */}
                  {showPentatonic && shouldShowPentatonicDot(stringIndex, fretIndex + 1) && !shouldShowDot(stringIndex, fretIndex + 1) && (
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-green-500 dark:border-green-400 bg-green-500/30 dark:bg-green-400/30"
                      aria-label={`Pentatonic scale note on ${stringName} string, fret ${fretIndex + 1}`}
                    />
                  )}

                  {/* Note name overlay */}
                  {showAllNotes && shouldShowNoteName(stringIndex, fretIndex + 1) && (
                    <div
                      className="absolute top-0.5 left-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300
                                 bg-white/90 dark:bg-gray-800/90 rounded px-1 border border-gray-300 dark:border-gray-600
                                 pointer-events-none z-20 leading-tight min-w-[1rem] text-center
                                 sm:top-1 sm:left-1"
                      aria-label={`Note ${getNoteNameAtFret(stringIndex, fretIndex + 1)} on ${stringName} string, fret ${fretIndex + 1}`}
                    >
                      {getNoteNameAtFret(stringIndex, fretIndex + 1)}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// Memoize FretboardDisplay to prevent unnecessary re-renders when props haven't changed
// This is especially important since the component renders 90 cells (6 strings × 15 frets)
export default memo(FretboardDisplay);