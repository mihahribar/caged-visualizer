import type { ModeType, ChromaticNote, ModePattern, ModePosition } from '../types';
import { MODE_INTERVALS, MODE_DATA } from '../constants';
import {
  noteToNumber,
  getNoteAtFret,
  transposeIntervals,
  STANDARD_TUNING
} from './musicTheory';

/**
 * Core mode calculation functions
 * Handles the mathematical logic for generating mode patterns on the fretboard
 */

/**
 * Calculate the absolute chromatic intervals for a mode in a specific key
 */
export function calculateModeIntervals(mode: ModeType, rootNote: ChromaticNote): number[] {
  const baseIntervals = MODE_INTERVALS[mode];
  const rootNumber = noteToNumber(rootNote);

  // Transpose the mode intervals to the new root
  return transposeIntervals(baseIntervals, rootNumber);
}

/**
 * Calculate all fretboard positions for a given mode and root note
 */
export function calculateModePattern(
  mode: ModeType,
  rootNote: ChromaticNote,
  maxFrets: number = 15
): ModePattern {
  const modeIntervals = calculateModeIntervals(mode, rootNote);
  const positions: ModePosition[] = [];

  // For each string on the guitar
  for (let stringIndex = 0; stringIndex < STANDARD_TUNING.length; stringIndex++) {
    // For each fret position
    for (let fretNumber = 0; fretNumber <= maxFrets; fretNumber++) {
      const noteAtPosition = getNoteAtFret(stringIndex, fretNumber);
      const noteNumber = noteToNumber(noteAtPosition);

      // Check if this note is part of the mode
      const intervalIndex = modeIntervals.indexOf(noteNumber);

      if (intervalIndex !== -1) {
        // This note is part of the mode
        const originalInterval = MODE_INTERVALS[mode][intervalIndex];
        const isRoot = originalInterval === 0;

        positions.push({
          fret: fretNumber,
          string: stringIndex,
          note: noteAtPosition,
          interval: originalInterval,
          isRoot
        });
      }
    }
  }

  return {
    mode,
    rootNote,
    positions
  };
}

/**
 * Get all root note positions for a specific mode and root note
 */
export function getRootPositions(
  mode: ModeType,
  rootNote: ChromaticNote,
  maxFrets: number = 15
): ModePosition[] {
  const pattern = calculateModePattern(mode, rootNote, maxFrets);
  return pattern.positions.filter(pos => pos.isRoot);
}

/**
 * Calculate mode pattern for a specific position/box on the neck
 * This focuses on a 4-fret span starting from the given position
 */
export function calculateModeBox(
  mode: ModeType,
  rootNote: ChromaticNote,
  startingFret: number,
  fretSpan: number = 4
): ModePosition[] {
  const fullPattern = calculateModePattern(mode, rootNote, startingFret + fretSpan);

  // Filter to only include notes within the box
  return fullPattern.positions.filter(pos =>
    pos.fret >= startingFret && pos.fret <= startingFret + fretSpan
  );
}

/**
 * Get the scale degrees for a mode pattern
 * Returns positions with their scale degree (1-7) instead of chromatic interval
 */
export function getModeScaleDegrees(pattern: ModePattern): (ModePosition & { scaleDegree: number })[] {
  const modeIntervals = MODE_INTERVALS[pattern.mode];

  return pattern.positions.map(pos => {
    const intervalIndex = modeIntervals.indexOf(pos.interval);
    const scaleDegree = intervalIndex + 1; // Convert 0-based to 1-based

    return {
      ...pos,
      scaleDegree
    };
  });
}

/**
 * Find the nearest root note position to a given fret
 */
export function findNearestRoot(
  mode: ModeType,
  rootNote: ChromaticNote,
  targetFret: number,
  targetString?: number
): ModePosition | null {
  const rootPositions = getRootPositions(mode, rootNote);

  if (rootPositions.length === 0) return null;

  // If string is specified, filter to that string first
  const candidatePositions = targetString !== undefined
    ? rootPositions.filter(pos => pos.string === targetString)
    : rootPositions;

  if (candidatePositions.length === 0) return null;

  // Find the position with minimum distance to target fret
  return candidatePositions.reduce((nearest, current) => {
    const currentDistance = Math.abs(current.fret - targetFret);
    const nearestDistance = Math.abs(nearest.fret - targetFret);
    return currentDistance < nearestDistance ? current : nearest;
  });
}

/**
 * Get mode information including calculated pattern
 */
export function getModeInfo(mode: ModeType, rootNote: ChromaticNote) {
  const modeData = MODE_DATA[mode];
  const pattern = calculateModePattern(mode, rootNote);
  const rootPositions = getRootPositions(mode, rootNote);

  return {
    ...modeData,
    pattern,
    rootPositions,
    totalPositions: pattern.positions.length,
    rootCount: rootPositions.length
  };
}

/**
 * Validate that a calculated mode pattern is musically correct
 */
export function validateModePattern(pattern: ModePattern): boolean {
  const expectedIntervals = MODE_INTERVALS[pattern.mode];
  const foundIntervals = new Set(pattern.positions.map(pos => pos.interval));

  // Check that all expected intervals are found
  for (const interval of expectedIntervals) {
    if (!foundIntervals.has(interval)) {
      console.error(`Missing interval ${interval} in mode pattern`);
      return false;
    }
  }

  // Check that root positions exist
  const rootPositions = pattern.positions.filter(pos => pos.isRoot);
  if (rootPositions.length === 0) {
    console.error('No root positions found in mode pattern');
    return false;
  }

  return true;
}