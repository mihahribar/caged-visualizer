import type { CAGEDShapeData, ChromaticValues } from '../types';

export const TOTAL_FRETS = 15;

export const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

export const CAGED_SHAPE_DATA: CAGEDShapeData = {
  C: {
    name: 'C Shape',
    color: '#FF6B6B',
    pattern: [0, 1, 0, 2, 3, -1],
    fingers: [0, 1, 0, 2, 3, -1]
  },
  A: {
    name: 'A Shape',
    color: '#4ECDC4',
    pattern: [0, 2, 2, 2, 0, -1],
    fingers: [0, 4, 3, 2, 0, -1]
  },
  G: {
    name: 'G Shape', 
    color: '#45B7D1',
    pattern: [3, 0, 0, 0, 2, 3],
    fingers: [4, -1, 0, 0, 2, 3]
  },
  E: {
    name: 'E Shape',
    color: '#96CEB4',
    pattern: [0, 0, 1, 2, 2, 0],
    fingers: [0, 0, 1, 3, 2, 0]
  },
  D: {
    name: 'D Shape',
    color: '#FECA57',
    pattern: [2, 3, 2, 0, -1, -1],
    fingers: [2, 3, 1, 0, -1, -1]
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