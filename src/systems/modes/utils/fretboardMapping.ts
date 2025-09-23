import type { ModePosition, ModePattern, ChromaticNote, ModeType } from '../types';
import type { FretboardPosition } from '@/shared/types/core';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';
import { calculateModePattern, getModeInfo } from './modeCalculations';

/**
 * Fretboard mapping utilities for the modes system
 * Handles conversion between mode positions and fretboard display format
 */

/**
 * Convert a ModePosition to FretboardPosition for the shared fretboard component
 */
export function modePositionToFretboardPosition(position: ModePosition): FretboardPosition {
  return {
    stringIndex: position.string as 0 | 1 | 2 | 3 | 4 | 5,
    fretNumber: position.fret
  };
}

/**
 * Convert multiple ModePositions to FretboardPositions
 */
export function modePositionsToFretboardPositions(positions: ModePosition[]): FretboardPosition[] {
  return positions.map(modePositionToFretboardPosition);
}

/**
 * Get all fretboard positions for a mode within the display range
 */
export function getModePositionsForDisplay(
  mode: ModeType,
  rootNote: ChromaticNote
): FretboardPosition[] {
  const pattern = calculateModePattern(mode, rootNote, FRETBOARD_CONSTANTS.MAX_FRET);
  return modePositionsToFretboardPositions(pattern.positions);
}

/**
 * Get only root note positions for fretboard display
 */
export function getRootPositionsForDisplay(
  mode: ModeType,
  rootNote: ChromaticNote
): FretboardPosition[] {
  const pattern = calculateModePattern(mode, rootNote, FRETBOARD_CONSTANTS.MAX_FRET);
  const rootPositions = pattern.positions.filter(pos => pos.isRoot);
  return modePositionsToFretboardPositions(rootPositions);
}

/**
 * Generate position data with additional metadata for visual display
 */
export interface DisplayModePosition extends ModePosition {
  /** Whether this position should be highlighted */
  isHighlighted: boolean;
  /** CSS color for this position */
  color: string;
  /** Display label (note name or scale degree) */
  label: string;
  /** Z-index for layering (higher numbers on top) */
  zIndex: number;
}

/**
 * Create display positions with visual metadata
 */
export function createDisplayPositions(
  pattern: ModePattern,
  options: {
    highlightRoots?: boolean;
    showNoteNames?: boolean;
    showScaleDegrees?: boolean;
    modeColor: string;
  }
): DisplayModePosition[] {
  const { highlightRoots = true, showNoteNames = true, showScaleDegrees = false, modeColor } = options;

  return pattern.positions.map(position => {
    const isRoot = position.isRoot;
    const isHighlighted = highlightRoots && isRoot;

    // Determine label based on preferences
    let label = '';
    if (showNoteNames) {
      label = position.note;
    } else if (showScaleDegrees) {
      // Convert interval to scale degree (0 -> 1, 2 -> 2, etc.)
      const intervals = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals as reference
      const scaleDegree = intervals.indexOf(position.interval) + 1;
      label = scaleDegree > 0 ? scaleDegree.toString() : '?';
    }

    return {
      ...position,
      isHighlighted,
      color: modeColor,
      label,
      zIndex: isRoot ? 10 : 5 // Roots on top
    };
  });
}

/**
 * Filter positions by fret range for focused display
 */
export function filterPositionsByFretRange(
  positions: ModePosition[],
  startFret: number,
  endFret: number
): ModePosition[] {
  return positions.filter(pos => pos.fret >= startFret && pos.fret <= endFret);
}

/**
 * Group positions by string for efficient rendering
 */
export function groupPositionsByString(positions: ModePosition[]): Map<number, ModePosition[]> {
  const grouped = new Map<number, ModePosition[]>();

  for (const position of positions) {
    if (!grouped.has(position.string)) {
      grouped.set(position.string, []);
    }
    grouped.get(position.string)!.push(position);
  }

  // Sort positions within each string by fret number
  for (const [, stringPositions] of grouped) {
    stringPositions.sort((a, b) => a.fret - b.fret);
  }

  return grouped;
}

/**
 * Get positions that are playable in a specific position/box
 */
export function getPositionBoxPositions(
  pattern: ModePattern,
  centerFret: number,
  fretSpan: number = 4
): ModePosition[] {
  const startFret = Math.max(0, centerFret - Math.floor(fretSpan / 2));
  const endFret = Math.min(FRETBOARD_CONSTANTS.MAX_FRET, startFret + fretSpan);

  return filterPositionsByFretRange(pattern.positions, startFret, endFret);
}

/**
 * Calculate optimal fret range to display all root positions
 */
export function getOptimalDisplayRange(
  mode: ModeType,
  rootNote: ChromaticNote
): { startFret: number; endFret: number } {
  const modeInfo = getModeInfo(mode, rootNote);
  const rootPositions = modeInfo.rootPositions;

  if (rootPositions.length === 0) {
    return { startFret: 0, endFret: FRETBOARD_CONSTANTS.MAX_FRET };
  }

  const minFret = Math.min(...rootPositions.map(pos => pos.fret));
  const maxFret = Math.max(...rootPositions.map(pos => pos.fret));

  // Add padding around the range
  const padding = 2;
  const startFret = Math.max(0, minFret - padding);
  const endFret = Math.min(FRETBOARD_CONSTANTS.MAX_FRET, maxFret + padding);

  return { startFret, endFret };
}

/**
 * Check if two positions overlap (same string and fret)
 */
export function positionsOverlap(pos1: ModePosition, pos2: ModePosition): boolean {
  return pos1.string === pos2.string && pos1.fret === pos2.fret;
}

/**
 * Remove duplicate positions (same string/fret combination)
 */
export function removeDuplicatePositions(positions: ModePosition[]): ModePosition[] {
  const seen = new Set<string>();
  return positions.filter(pos => {
    const key = `${pos.string}-${pos.fret}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}