// Guitar Modes System - Music Theory Utilities

import { TUNING, NOTES } from './constants';

/**
 * Calculate the note at a specific fret on a specific string
 */
export function getNoteAtFret(stringIndex: number, fretNumber: number): string {
  const openNote = TUNING[stringIndex];
  const openNoteIndex = NOTES.indexOf(openNote as any);
  const noteIndex = (openNoteIndex + fretNumber) % 12;
  return NOTES[noteIndex];
}

/**
 * Check if a note belongs to a specific mode
 */
export function isNoteInMode(
  note: string,
  modeData: { root: string; intervals: readonly number[] }
): boolean {
  const rootIndex = NOTES.indexOf(modeData.root as any);
  const noteIndex = NOTES.indexOf(note as any);
  const interval = (noteIndex - rootIndex + 12) % 12;
  return modeData.intervals.includes(interval);
}

/**
 * Check if a note is the root note
 */
export function isRootNote(note: string, rootNote: string): boolean {
  return note === rootNote;
}