// Guitar Modes System Constants

export const MODES = {
  'C Ionian (Major)': { root: 'C', intervals: [0, 2, 4, 5, 7, 9, 11], color: '#3B82F6' },
  'D Dorian': { root: 'D', intervals: [0, 2, 3, 5, 7, 9, 10], color: '#10B981' },
  'E Phrygian': { root: 'E', intervals: [0, 1, 3, 5, 7, 8, 10], color: '#F59E0B' },
  'F Lydian': { root: 'F', intervals: [0, 2, 4, 6, 7, 9, 11], color: '#EF4444' },
  'G Mixolydian': { root: 'G', intervals: [0, 2, 4, 5, 7, 9, 10], color: '#8B5CF6' },
  'A Aeolian (Minor)': { root: 'A', intervals: [0, 2, 3, 5, 7, 8, 10], color: '#EC4899' },
  'B Locrian': { root: 'B', intervals: [0, 1, 3, 5, 6, 8, 10], color: '#6B7280' }
} as const;

// Standard tuning notes (from top to bottom as displayed on fretboard)
export const TUNING = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

// Chromatic notes
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export type ModeKey = keyof typeof MODES;
export type NoteType = typeof NOTES[number];
export type TuningNote = typeof TUNING[number];