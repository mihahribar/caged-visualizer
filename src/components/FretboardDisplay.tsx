import type { ChordType } from '../types';
import { STRING_NAMES, TOTAL_FRETS } from '../constants';

interface FretboardDisplayProps {
  selectedChord: ChordType;
  currentShape: string;
  showAllShapes: boolean;
  shouldShowDot: (stringIndex: number, fretNumber: number) => boolean;
  getDotStyle: (stringIndex: number, fretNumber: number) => React.CSSProperties | undefined;
  isRootNote: (stringIndex: number, fretNumber: number) => boolean;
}

export default function FretboardDisplay({
  selectedChord,
  showAllShapes,
  shouldShowDot,
  getDotStyle,
  isRootNote
}: FretboardDisplayProps) {
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
                      }`}
                      style={getDotStyle(stringIndex, fretIndex + 1)}
                      aria-label={`${isRootNote(stringIndex, fretIndex + 1) ? 'Root note' : 'Chord note'} on ${stringName} string, fret ${fretIndex + 1}`}
                    >
                      {isRootNote(stringIndex, fretIndex + 1) ? 'R' : ''}
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