import type { ChordType } from '../types';
import { CAGED_SHAPE_DATA } from '../constants';

interface EnhancedNavigationPanelProps {
  selectedChord: ChordType;
  onChordChange: (chord: ChordType) => void;
}

const chords: { value: ChordType; label: string }[] = [
  { value: 'C', label: 'C Major' },
  { value: 'A', label: 'A Major' },
  { value: 'G', label: 'G Major' },
  { value: 'E', label: 'E Major' },
  { value: 'D', label: 'D Major' }
];

export default function RootChordSelector({
  selectedChord,
  onChordChange
}: EnhancedNavigationPanelProps) {

  return (
    <div className="bg-white dark:bg-gray-900 p-2 mb-6">
      {/* Chord Selection Section */}
      <section className="mb-4" aria-label="Chord selection">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-light text-gray-800 dark:text-gray-100">
            Choose Root Chord
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
    </div>
  );
}