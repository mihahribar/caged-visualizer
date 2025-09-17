import type { CAGEDShapeData, ChromaticValues, CAGEDShapesByQuality } from '../types';

export const TOTAL_FRETS = 15;

export const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

// Standard guitar tuning (semitones from C)
export const STRING_TUNING = [4, 11, 7, 2, 9, 4] as const; // E(4), B(11), G(7), D(2), A(9), E(4)

// Major chord patterns (existing)
export const CAGED_SHAPE_DATA: CAGEDShapeData = {
  C: {
    name: 'C Shape',
    color: '#FF6B6B',
    pattern: [0, 1, 0, 2, 3, -1],
    fingers: [0, 1, 0, 2, 3, -1],
    rootNotes: [4]
  },
  A: {
    name: 'A Shape',
    color: '#4ECDC4',
    pattern: [0, 2, 2, 2, 0, -1],
    fingers: [0, 4, 3, 2, 0, -1],
    rootNotes: [4]
  },
  G: {
    name: 'G Shape',
    color: '#45B7D1',
    pattern: [3, 0, 0, 0, 2, 3],
    fingers: [4, -1, 0, 0, 2, 3],
    rootNotes: [0, 5]
  },
  E: {
    name: 'E Shape',
    color: '#96CEB4',
    pattern: [0, 0, 1, 2, 2, 0],
    fingers: [0, 0, 1, 3, 2, 0],
    rootNotes: [0, 5]
  },
  D: {
    name: 'D Shape',
    color: '#FECA57',
    pattern: [2, 3, 2, 0, -1, -1],
    fingers: [2, 3, 1, 0, -1, -1],
    rootNotes: [3]
  }
};

// Minor chord patterns
export const CAGED_MINOR_SHAPE_DATA: CAGEDShapeData = {
  C: {
    name: 'Cm Shape',
    color: '#FF6B6B',
    pattern: [0, 1, 0, 1, 3, -1],
    fingers: [0, 2, 0, 1, 4, -1],
    rootNotes: [4]
  },
  A: {
    name: 'Am Shape',
    color: '#4ECDC4',
    pattern: [0, 1, 2, 2, 0, -1],
    fingers: [0, 1, 3, 2, 0, -1],
    rootNotes: [4]
  },
  G: {
    name: 'Gm Shape',
    color: '#45B7D1',
    pattern: [3, 0, 0, 3, 2, 3],
    fingers: [4, -1, 0, 3, 1, 2],
    rootNotes: [0, 5]
  },
  E: {
    name: 'Em Shape',
    color: '#96CEB4',
    pattern: [0, 0, 0, 2, 2, 0],
    fingers: [0, 0, 0, 2, 3, 0],
    rootNotes: [0, 5]
  },
  D: {
    name: 'Dm Shape',
    color: '#FECA57',
    pattern: [1, 3, 2, 0, -1, -1],
    fingers: [1, 3, 2, 0, -1, -1],
    rootNotes: [3]
  }
};

// Combined chord data by quality
export const CAGED_SHAPES_BY_QUALITY: CAGEDShapesByQuality = {
  major: CAGED_SHAPE_DATA,
  minor: CAGED_MINOR_SHAPE_DATA
};

export const CHROMATIC_VALUES: ChromaticValues = { 
  C: 0, 
  A: 9, 
  G: 7, 
  E: 4, 
  D: 2 
};

export const NATURAL_STARTING_SHAPES = {
  'C': 'C',
  'A': 'A', 
  'G': 'G',
  'E': 'E',
  'D': 'D'
} as const;

export const FULL_CAGED_SEQUENCE = ['C', 'A', 'G', 'E', 'D'] as const;

// Major pentatonic scale intervals (semitones from root)
export const PENTATONIC_INTERVALS = [0, 2, 4, 7, 9] as const;

// Major chord intervals (semitones from root): Root, Major Third, Perfect Fifth
export const MAJOR_CHORD_INTERVALS = [0, 4, 7] as const;

// Minor chord intervals (semitones from root): Root, Minor Third, Perfect Fifth
export const MINOR_CHORD_INTERVALS = [0, 3, 7] as const;

// Chromatic scale to note names mapping (including sharps/flats)
export const CHROMATIC_TO_NOTE_NAME: readonly string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

// Natural note names array for easy reference
export const NATURAL_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

// Chromatic positions of natural notes (no sharps/flats)
export const NATURAL_NOTE_POSITIONS = [0, 2, 4, 5, 7, 9, 11] as const;