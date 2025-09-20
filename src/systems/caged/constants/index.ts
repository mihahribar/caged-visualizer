/**
 * CAGED system specific constants
 *
 * This file contains all constants specific to the CAGED chord system,
 * including shape definitions, chord patterns, and CAGED-specific mappings.
 */

import type { CAGEDShapeData, CAGEDShapesByQuality } from '../types';
import type { ChromaticValues } from '@/shared/types/core';

// Major chord patterns
export const CAGED_SHAPE_DATA: CAGEDShapeData = {
  C: {
    name: 'C Shape',
    color: '#FF6B6B',
    pattern: [0, 1, 0, 2, 3, -1],
    fingers: [0, 1, 0, 2, 3, -1],
    keyNotes: [4],
    rootNotes: [4]
  },
  A: {
    name: 'A Shape',
    color: '#4ECDC4',
    pattern: [0, 2, 2, 2, 0, -1],
    fingers: [0, 4, 3, 2, 0, -1],
    keyNotes: [4],
    rootNotes: [4]
  },
  G: {
    name: 'G Shape',
    color: '#45B7D1',
    pattern: [3, 0, 0, 0, 2, 3],
    fingers: [4, -1, 0, 0, 2, 3],
    keyNotes: [0, 5],
    rootNotes: [0, 5]
  },
  E: {
    name: 'E Shape',
    color: '#96CEB4',
    pattern: [0, 0, 1, 2, 2, 0],
    fingers: [0, 0, 1, 3, 2, 0],
    keyNotes: [0, 5],
    rootNotes: [0, 5]
  },
  D: {
    name: 'D Shape',
    color: '#FECA57',
    pattern: [2, 3, 2, 0, -1, -1],
    fingers: [2, 3, 1, 0, -1, -1],
    keyNotes: [3],
    rootNotes: [3]
  }
};

// Minor chord patterns
export const CAGED_MINOR_SHAPE_DATA: CAGEDShapeData = {
  C: {
    name: 'Cm Shape',
    color: '#FF6B6B',
    pattern: [-1, 1, 0, 1, 3, -1],
    fingers: [-1, 2, 0, 1, 4, -1],
    keyNotes: [4],
    rootNotes: [4]
  },
  A: {
    name: 'Am Shape',
    color: '#4ECDC4',
    pattern: [0, 1, 2, 2, 0, -1],
    fingers: [0, 1, 3, 2, 0, -1],
    keyNotes: [4],
    rootNotes: [4]
  },
  G: {
    name: 'Gm Shape',
    color: '#45B7D1',
    pattern: [3, -1, 0, 0, 1, 3],
    fingers: [4, 0, 0, 0, 1, 3],
    keyNotes: [0, 5],
    rootNotes: [0, 5]
  },
  E: {
    name: 'Em Shape',
    color: '#96CEB4',
    pattern: [0, 0, 0, 2, 2, 0],
    fingers: [0, 0, 0, 2, 3, 0],
    keyNotes: [0, 5],
    rootNotes: [0, 5]
  },
  D: {
    name: 'Dm Shape',
    color: '#FECA57',
    pattern: [1, 3, 2, 0, -1, -1],
    fingers: [1, 3, 2, 0, -1, -1],
    keyNotes: [3],
    rootNotes: [3]
  }
};

// Combined chord data by quality
export const CAGED_SHAPES_BY_QUALITY: CAGEDShapesByQuality = {
  major: CAGED_SHAPE_DATA,
  minor: CAGED_MINOR_SHAPE_DATA
};

// Chromatic values for CAGED chord roots
export const CHROMATIC_VALUES: ChromaticValues = {
  C: 0,
  A: 9,
  G: 7,
  E: 4,
  D: 2
};

// Natural starting shapes for each CAGED chord
export const NATURAL_STARTING_SHAPES = {
  'C': 'C',
  'A': 'A',
  'G': 'G',
  'E': 'E',
  'D': 'D'
} as const;

// Complete CAGED sequence order
export const FULL_CAGED_SEQUENCE = ['C', 'A', 'G', 'E', 'D'] as const;