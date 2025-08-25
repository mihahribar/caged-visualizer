import type { ChordType } from '../types';

interface ChordSelectorProps {
  selectedChord: ChordType;
  onChordChange: (chord: ChordType) => void;
}

export default function ChordSelector({ selectedChord, onChordChange }: ChordSelectorProps) {
  return (
    <section className="text-center mb-6" aria-label="Chord selection">
      <div className="mb-4">
        <label htmlFor="chord-selector" className="text-gray-600 text-sm mr-3">
          Choose your chord:
        </label>
        <select 
          id="chord-selector"
          value={selectedChord}
          onChange={(e) => onChordChange(e.target.value as ChordType)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select chord type"
        >
          <option value="C">C Major</option>
          <option value="A">A Major</option>
          <option value="G">G Major</option>
          <option value="E">E Major</option>
          <option value="D">D Major</option>
        </select>
      </div>
    </section>
  );
}