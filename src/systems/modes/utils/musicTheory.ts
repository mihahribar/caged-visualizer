import type { ChromaticNote } from '../types';

/**
 * Music theory utilities for the modes system
 * Handles chromatic calculations and note mappings
 */

// Chromatic note names in order
export const CHROMATIC_NOTES: readonly ChromaticNote[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

// Note name to chromatic index mapping
export const NOTE_TO_NUMBER: Record<ChromaticNote, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

// Standard guitar tuning (low E to high E)
export const STANDARD_TUNING: readonly number[] = [4, 9, 2, 7, 11, 4] as const; // E A D G B E

/**
 * Convert chromatic note to numeric value (0-11)
 */
export function noteToNumber(note: ChromaticNote): number {
  return NOTE_TO_NUMBER[note];
}

/**
 * Convert numeric value to chromatic note name
 */
export function numberToNote(num: number): ChromaticNote {
  const normalizedNum = ((num % 12) + 12) % 12; // Handle negative numbers
  return CHROMATIC_NOTES[normalizedNum];
}

/**
 * Calculate the chromatic distance between two notes
 */
export function getInterval(fromNote: ChromaticNote, toNote: ChromaticNote): number {
  const from = noteToNumber(fromNote);
  const to = noteToNumber(toNote);
  return ((to - from) % 12 + 12) % 12;
}

/**
 * Transpose a note by a given number of semitones
 */
export function transposeNote(note: ChromaticNote, semitones: number): ChromaticNote {
  const noteNum = noteToNumber(note);
  const transposed = (noteNum + semitones) % 12;
  return numberToNote(transposed);
}

/**
 * Transpose an array of intervals by a given number of semitones
 */
export function transposeIntervals(intervals: number[], semitones: number): number[] {
  return intervals.map(interval => (interval + semitones) % 12);
}

/**
 * Get the note at a specific fret on a specific string
 */
export function getNoteAtFret(stringIndex: number, fretNumber: number): ChromaticNote {
  if (stringIndex < 0 || stringIndex >= STANDARD_TUNING.length) {
    throw new Error(`Invalid string index: ${stringIndex}. Must be 0-5.`);
  }

  const openStringNote = STANDARD_TUNING[stringIndex];
  const noteAtFret = (openStringNote + fretNumber) % 12;
  return numberToNote(noteAtFret);
}

/**
 * Get all chromatic notes in a 12-note cycle starting from a root
 */
export function getChromaticScale(rootNote: ChromaticNote): ChromaticNote[] {
  const rootIndex = noteToNumber(rootNote);
  const scale: ChromaticNote[] = [];

  for (let i = 0; i < 12; i++) {
    const noteIndex = (rootIndex + i) % 12;
    scale.push(numberToNote(noteIndex));
  }

  return scale;
}

/**
 * Check if a note is enharmonically equivalent to another
 * (This is mainly for future expansion, as we're using sharps only)
 */
export function areEnharmonic(note1: ChromaticNote, note2: ChromaticNote): boolean {
  return noteToNumber(note1) === noteToNumber(note2);
}

/**
 * Get the chromatic interval between two fret positions
 */
export function getFretInterval(
  fromString: number,
  fromFret: number,
  toString: number,
  toFret: number
): number {
  const fromNote = getNoteAtFret(fromString, fromFret);
  const toNote = getNoteAtFret(toString, toFret);
  return getInterval(fromNote, toNote);
}

/**
 * Validate that a chromatic note is valid
 */
export function isValidChromaticNote(note: string): note is ChromaticNote {
  return CHROMATIC_NOTES.includes(note as ChromaticNote);
}