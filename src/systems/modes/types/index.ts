export type ModeType = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';

/**
 * Chromatic note names for mode root notes
 * Extended beyond ChordType to include all 12 chromatic notes
 */
export type ChromaticNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface ModeData {
  name: string;
  displayName: string;
  intervals: number[];
  rootNote: ChromaticNote;
  color: string;
  description: string;
}

export interface ModeState {
  currentMode: ModeType;
  rootPosition: number;
  showNoteNames: boolean;
  highlightRoot: boolean;
}

export interface ModePosition {
  fret: number;
  string: number;
  note: ChromaticNote;
  interval: number;
  isRoot: boolean;
}

export interface ModePattern {
  mode: ModeType;
  rootNote: ChromaticNote;
  positions: ModePosition[];
}

export interface ModesSystemState {
  mode: ModeState;
  pattern: ModePattern | null;
  isLoading: boolean;
}