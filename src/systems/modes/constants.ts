// Guitar Modes System Constants

export const MODES = {
  'Ionian (Major)': { root: 'C', intervals: [0, 2, 4, 5, 7, 9, 11], color: '#FF6B6B' }, // Matches CAGED C Shape
  'Dorian': { root: 'D', intervals: [0, 2, 3, 5, 7, 9, 10], color: '#FECA57' }, // Matches CAGED D Shape
  'Phrygian': { root: 'E', intervals: [0, 1, 3, 5, 7, 8, 10], color: '#96CEB4' }, // Matches CAGED E Shape
  'Lydian': { root: 'F', intervals: [0, 2, 4, 6, 7, 9, 11], color: '#9B59B6' }, // New color - purple
  'Mixolydian': { root: 'G', intervals: [0, 2, 4, 5, 7, 9, 10], color: '#45B7D1' }, // Matches CAGED G Shape
  'Aeolian (Minor)': { root: 'A', intervals: [0, 2, 3, 5, 7, 8, 10], color: '#4ECDC4' }, // Matches CAGED A Shape
  'Locrian': { root: 'B', intervals: [0, 1, 3, 5, 6, 8, 10], color: '#E67E22' } // New color - orange
} as const;

// Standard tuning notes (from top to bottom as displayed on fretboard)
export const TUNING = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

// Chromatic notes
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export type ModeKey = keyof typeof MODES;
export type NoteType = typeof NOTES[number];
export type TuningNote = typeof TUNING[number];