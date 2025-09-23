import type { ModeData, ModeType, ChromaticNote } from '../types';

// Musical intervals for each mode (semitones from root)
export const MODE_INTERVALS: Record<ModeType, number[]> = {
  // C Ionian (Major): C D E F G A B
  ionian: [0, 2, 4, 5, 7, 9, 11],

  // D Dorian: D E F G A B C
  dorian: [0, 2, 3, 5, 7, 9, 10],

  // E Phrygian: E F G A B C D
  phrygian: [0, 1, 3, 5, 7, 8, 10],

  // F Lydian: F G A B C D E
  lydian: [0, 2, 4, 6, 7, 9, 11],

  // G Mixolydian: G A B C D E F
  mixolydian: [0, 2, 4, 5, 7, 9, 10],

  // A Aeolian (Natural Minor): A B C D E F G
  aeolian: [0, 2, 3, 5, 7, 8, 10],

  // B Locrian: B C D E F G A
  locrian: [0, 1, 3, 5, 6, 8, 10]
};

// Color scheme for modes - distinct colors for each mode
export const MODE_COLORS: Record<ModeType, string> = {
  ionian: '#3B82F6',    // Blue - bright, major feel
  dorian: '#8B5CF6',    // Purple - sophisticated minor
  phrygian: '#EF4444',  // Red - dramatic, Spanish feel
  lydian: '#F59E0B',    // Amber - ethereal, floating
  mixolydian: '#10B981', // Emerald - bluesy, dominant
  aeolian: '#6366F1',   // Indigo - classic minor
  locrian: '#64748B'    // Slate - diminished, unstable
};

// Root notes for each mode based on C major scale
export const MODE_ROOT_NOTES: Record<ModeType, ChromaticNote> = {
  ionian: 'C',
  dorian: 'D',
  phrygian: 'E',
  lydian: 'F',
  mixolydian: 'G',
  aeolian: 'A',
  locrian: 'B'
};

// Complete mode data definitions
export const MODE_DATA: Record<ModeType, ModeData> = {
  ionian: {
    name: 'ionian',
    displayName: 'Ionian (Major)',
    intervals: MODE_INTERVALS.ionian,
    rootNote: 'C',
    color: MODE_COLORS.ionian,
    description: 'The major scale - bright and happy sound'
  },

  dorian: {
    name: 'dorian',
    displayName: 'Dorian',
    intervals: MODE_INTERVALS.dorian,
    rootNote: 'D',
    color: MODE_COLORS.dorian,
    description: 'Minor scale with raised 6th - jazzy and sophisticated'
  },

  phrygian: {
    name: 'phrygian',
    displayName: 'Phrygian',
    intervals: MODE_INTERVALS.phrygian,
    rootNote: 'E',
    color: MODE_COLORS.phrygian,
    description: 'Minor scale with lowered 2nd - Spanish/flamenco sound'
  },

  lydian: {
    name: 'lydian',
    displayName: 'Lydian',
    intervals: MODE_INTERVALS.lydian,
    rootNote: 'F',
    color: MODE_COLORS.lydian,
    description: 'Major scale with raised 4th - dreamy and ethereal'
  },

  mixolydian: {
    name: 'mixolydian',
    displayName: 'Mixolydian',
    intervals: MODE_INTERVALS.mixolydian,
    rootNote: 'G',
    color: MODE_COLORS.mixolydian,
    description: 'Major scale with lowered 7th - bluesy and dominant'
  },

  aeolian: {
    name: 'aeolian',
    displayName: 'Aeolian (Natural Minor)',
    intervals: MODE_INTERVALS.aeolian,
    rootNote: 'A',
    color: MODE_COLORS.aeolian,
    description: 'The natural minor scale - melancholy and emotional'
  },

  locrian: {
    name: 'locrian',
    displayName: 'Locrian',
    intervals: MODE_INTERVALS.locrian,
    rootNote: 'B',
    color: MODE_COLORS.locrian,
    description: 'Diminished scale - unstable and dissonant'
  }
};

// All available modes in order
export const ALL_MODES: ModeType[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian'
];

// Default mode state
export const DEFAULT_MODE_STATE = {
  currentMode: 'ionian' as ModeType,
  rootPosition: 0, // Start at open position
  showNoteNames: true,
  highlightRoot: true
};