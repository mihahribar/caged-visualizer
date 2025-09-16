import type { CAGEDShapeData, ChromaticValues } from '../types';

export const TOTAL_FRETS = 15;

export const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

// Standard guitar tuning (semitones from C)
export const STRING_TUNING = [4, 11, 7, 2, 9, 4] as const; // E(4), B(11), G(7), D(2), A(9), E(4)

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