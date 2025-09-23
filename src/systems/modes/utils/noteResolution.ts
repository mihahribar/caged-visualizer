import type { ChromaticNote, ModeType, ModePosition } from '../types';
import { CHROMATIC_NOTES, noteToNumber } from './musicTheory';
import { getScaleDegree } from './intervalHelpers';

/**
 * Note name resolution utilities for the modes system
 * Handles note naming, enharmonic equivalents, and display formatting
 */

/**
 * Enharmonic equivalent mappings (for future expansion)
 * Currently we use sharps, but this allows for flat equivalents
 */
export const ENHARMONIC_EQUIVALENTS: Record<ChromaticNote, string[]> = {
  'C': ['C', 'B#'],
  'C#': ['C#', 'Db'],
  'D': ['D'],
  'D#': ['D#', 'Eb'],
  'E': ['E', 'Fb'],
  'F': ['F', 'E#'],
  'F#': ['F#', 'Gb'],
  'G': ['G'],
  'G#': ['G#', 'Ab'],
  'A': ['A'],
  'A#': ['A#', 'Bb'],
  'B': ['B', 'Cb']
};

/**
 * Preferred note names for different contexts
 */
export type NoteNamingContext = 'sharp' | 'flat' | 'natural';

/**
 * Get the preferred note name for a chromatic value in a given context
 */
export function getPreferredNoteName(
  chromaticValue: number,
  context: NoteNamingContext = 'sharp'
): string {
  const normalizedValue = ((chromaticValue % 12) + 12) % 12;
  const sharpName = CHROMATIC_NOTES[normalizedValue];

  if (context === 'sharp' || !ENHARMONIC_EQUIVALENTS[sharpName]) {
    return sharpName;
  }

  const equivalents = ENHARMONIC_EQUIVALENTS[sharpName];

  if (context === 'flat' && equivalents.length > 1) {
    // Return flat equivalent if available
    return equivalents.find(name => name.includes('b')) || sharpName;
  }

  if (context === 'natural') {
    // Return natural note if available
    return equivalents.find(name => !name.includes('#') && !name.includes('b')) || sharpName;
  }

  return sharpName;
}

/**
 * Format a note name for display with optional octave
 */
export function formatNoteForDisplay(
  note: ChromaticNote,
  options: {
    includeOctave?: boolean;
    octave?: number;
    context?: NoteNamingContext;
  } = {}
): string {
  const { includeOctave = false, octave = 4, context = 'sharp' } = options;

  const noteValue = noteToNumber(note);
  const formattedNote = getPreferredNoteName(noteValue, context);

  return includeOctave ? `${formattedNote}${octave}` : formattedNote;
}

/**
 * Get display information for a mode position
 */
export function getPositionDisplayInfo(
  position: ModePosition,
  mode: ModeType,
  options: {
    showScaleDegree?: boolean;
    showInterval?: boolean;
    showNoteName?: boolean;
    noteNamingContext?: NoteNamingContext;
  } = {}
): {
  primaryLabel: string;
  secondaryLabel?: string;
  isRoot: boolean;
  scaleDegree: number | null;
} {
  const {
    showScaleDegree = false,
    showInterval = false,
    showNoteName = true,
    noteNamingContext = 'sharp'
  } = options;

  let primaryLabel = '';
  let secondaryLabel: string | undefined;

  const scaleDegree = getScaleDegree(mode, position.interval);

  if (showNoteName) {
    primaryLabel = formatNoteForDisplay(position.note, { context: noteNamingContext });
  } else if (showScaleDegree && scaleDegree) {
    primaryLabel = scaleDegree.toString();
  } else if (showInterval) {
    primaryLabel = position.interval.toString();
  }

  // Add secondary info if requested
  if (showNoteName && showScaleDegree && scaleDegree) {
    secondaryLabel = scaleDegree.toString();
  } else if (showNoteName && showInterval) {
    secondaryLabel = position.interval.toString();
  }

  return {
    primaryLabel,
    secondaryLabel,
    isRoot: position.isRoot,
    scaleDegree
  };
}

/**
 * Resolve note names for an entire mode pattern
 */
export function resolvePatternNoteNames(
  positions: ModePosition[],
  mode: ModeType,
  context: NoteNamingContext = 'sharp'
): Array<ModePosition & { displayName: string; scaleDegree: number | null }> {
  return positions.map(position => ({
    ...position,
    displayName: formatNoteForDisplay(position.note, { context }),
    scaleDegree: getScaleDegree(mode, position.interval)
  }));
}

/**
 * Get all unique note names in a mode pattern
 */
export function getUniqueNoteNames(
  positions: ModePosition[],
  context: NoteNamingContext = 'sharp'
): string[] {
  const uniqueNotes = new Set<string>();

  for (const position of positions) {
    const noteName = formatNoteForDisplay(position.note, { context });
    uniqueNotes.add(noteName);
  }

  const noteArray = Array.from(uniqueNotes);
  return noteArray.sort((a, b) => {
    if (isValidNoteName(a) && isValidNoteName(b)) {
      const aValue = noteToNumber(a);
      const bValue = noteToNumber(b);
      return aValue - bValue;
    }
    return 0;
  });
}

/**
 * Create a note name mapping for quick lookups
 */
export function createNoteNameMap(
  positions: ModePosition[],
  context: NoteNamingContext = 'sharp'
): Map<string, ModePosition[]> {
  const noteMap = new Map<string, ModePosition[]>();

  for (const position of positions) {
    const noteName = formatNoteForDisplay(position.note, { context });

    if (!noteMap.has(noteName)) {
      noteMap.set(noteName, []);
    }

    noteMap.get(noteName)!.push(position);
  }

  return noteMap;
}

/**
 * Get note names in scale degree order for a mode
 */
export function getScaleNoteNames(
  _mode: ModeType,
  rootNote: ChromaticNote,
  context: NoteNamingContext = 'sharp'
): string[] {
  const rootValue = noteToNumber(rootNote);
  const scaleNotes: string[] = [];

  // Get intervals for this mode and convert to note names
  const intervals = [0, 2, 4, 5, 7, 9, 11]; // Use major scale intervals as base

  for (const interval of intervals) {
    const noteValue = (rootValue + interval) % 12;
    const noteName = getPreferredNoteName(noteValue, context);
    scaleNotes.push(noteName);
  }

  return scaleNotes;
}

/**
 * Validate that a note name is a valid chromatic note
 */
export function isValidNoteName(noteName: string): noteName is ChromaticNote {
  return CHROMATIC_NOTES.includes(noteName as ChromaticNote);
}

/**
 * Parse a note name and return its chromatic value
 */
export function parseNoteName(noteName: string): number | null {
  if (!isValidNoteName(noteName)) {
    // Try to find enharmonic equivalent
    for (const [note, equivalents] of Object.entries(ENHARMONIC_EQUIVALENTS)) {
      if (equivalents.includes(noteName) && isValidNoteName(note)) {
        return noteToNumber(note);
      }
    }
    return null;
  }

  return noteToNumber(noteName);
}

/**
 * Get octave information for a fret position
 */
export function calculateOctave(stringIndex: number, fretNumber: number): number {
  // Standard guitar tuning starts around octave 2-4
  // This is a simplified calculation
  const baseOctaves = [2, 2, 3, 3, 3, 4]; // Approximate octaves for open strings
  const additionalOctaves = Math.floor(fretNumber / 12);

  return baseOctaves[stringIndex] + additionalOctaves;
}

/**
 * Format note with octave information for a fret position
 */
export function formatNoteWithOctave(
  position: ModePosition,
  context: NoteNamingContext = 'sharp'
): string {
  const octave = calculateOctave(position.string, position.fret);
  return formatNoteForDisplay(position.note, {
    includeOctave: true,
    octave,
    context
  });
}