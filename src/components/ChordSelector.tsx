import type { ChordType } from '../types';
import { CAGED_SHAPE_DATA } from '../constants';

interface ChordSelectorProps {
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

export default function ChordSelector({ selectedChord, onChordChange }: ChordSelectorProps) {
  return (
    <section className="text-center mb-8" aria-label="Chord selection">
      <div className="mb-6">
        <label className="block text-gray-600 dark:text-gray-300 text-sm mb-4">
          Choose your chord:
        </label>
        <div className="flex justify-center gap-2 flex-wrap">
          {chords.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChordChange(value)}
              className={`
                px-6 py-3 rounded-lg font-medium text-sm text-white transition-all duration-200 cursor-pointer
                min-w-[100px] focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none
                ${selectedChord === value
                  ? 'shadow-lg transform scale-105 focus:ring-white'
                  : 'opacity-40 hover:opacity-60 focus:ring-gray-400'
                }
              `}
              style={{
                backgroundColor: CAGED_SHAPE_DATA[value].color
              }}
              aria-label={`Select ${label}`}
              aria-pressed={selectedChord === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}