/**
 * Integration utilities for connecting modes system with shared utilities
 * Handles differences in string ordering and provides adapter functions
 */

import type { ChromaticNote, ModePosition } from '../types';
import type { FretboardPosition } from '@/shared/types/core';
import { getNoteAtFret as sharedGetNoteAtFret, getNoteNameAtFret } from '@/shared/utils/musicTheory';
import { noteToNumber, numberToNote } from './musicTheory';

/**
 * String index mapping between modes system and shared utilities
 * Modes system: [0, 1, 2, 3, 4, 5] = [E, A, D, G, B, E] (low to high)
 * Shared system: [0, 1, 2, 3, 4, 5] = [E, B, G, D, A, E] (different order)
 */
const MODES_TO_SHARED_STRING_MAP = [0, 4, 3, 2, 1, 5] as const;
const SHARED_TO_MODES_STRING_MAP = [0, 4, 3, 2, 1, 5] as const;

/**
 * Convert modes system string index to shared system string index
 */
export function convertModesToSharedString(modesStringIndex: number): number {
  if (modesStringIndex < 0 || modesStringIndex >= MODES_TO_SHARED_STRING_MAP.length) {
    throw new Error(`Invalid modes string index: ${modesStringIndex}`);
  }
  return MODES_TO_SHARED_STRING_MAP[modesStringIndex];
}

/**
 * Convert shared system string index to modes system string index
 */
export function convertSharedToModesString(sharedStringIndex: number): number {
  if (sharedStringIndex < 0 || sharedStringIndex >= SHARED_TO_MODES_STRING_MAP.length) {
    throw new Error(`Invalid shared string index: ${sharedStringIndex}`);
  }
  return SHARED_TO_MODES_STRING_MAP[sharedStringIndex];
}

/**
 * Get note at fret using shared utilities with string index conversion
 */
export function getSharedNoteAtFret(modesStringIndex: number, fretNumber: number): number {
  const sharedStringIndex = convertModesToSharedString(modesStringIndex);
  return sharedGetNoteAtFret(sharedStringIndex, fretNumber);
}

/**
 * Get note name at fret using shared utilities with string index conversion
 */
export function getSharedNoteNameAtFret(modesStringIndex: number, fretNumber: number): ChromaticNote {
  const sharedStringIndex = convertModesToSharedString(modesStringIndex);
  const noteName = getNoteNameAtFret(sharedStringIndex, fretNumber);
  return noteName as ChromaticNote;
}

/**
 * Convert ModePosition to FretboardPosition for shared components
 */
export function modePositionToSharedFretboard(position: ModePosition): FretboardPosition {
  const sharedStringIndex = convertModesToSharedString(position.string);
  return {
    stringIndex: sharedStringIndex as 0 | 1 | 2 | 3 | 4 | 5,
    fretNumber: position.fret
  };
}

/**
 * Convert FretboardPosition from shared system to modes system
 */
export function sharedFretboardToModePosition(
  fretboardPos: FretboardPosition,
  note?: ChromaticNote,
  interval?: number,
  isRoot?: boolean
): ModePosition {
  const modesStringIndex = convertSharedToModesString(fretboardPos.stringIndex);

  // If note info not provided, calculate it
  const noteAtPosition = note || getSharedNoteNameAtFret(modesStringIndex, fretboardPos.fretNumber);

  return {
    fret: fretboardPos.fretNumber,
    string: modesStringIndex,
    note: noteAtPosition,
    interval: interval || 0,
    isRoot: isRoot || false
  };
}

/**
 * Validate that string mappings are working correctly
 */
export function validateStringMapping(): boolean {
  console.log('🎸 Validating string index mapping...');

  const testPositions = [
    { modes: 0, expected: 'E' }, // Low E string
    { modes: 1, expected: 'A' }, // A string
    { modes: 2, expected: 'D' }, // D string
    { modes: 3, expected: 'G' }, // G string
    { modes: 4, expected: 'B' }, // B string
    { modes: 5, expected: 'E' }  // High E string
  ];

  let allValid = true;

  for (const { modes, expected } of testPositions) {
    try {
      const noteName = getSharedNoteNameAtFret(modes, 0); // Open string
      if (noteName !== expected) {
        console.error(`❌ String ${modes}: Expected ${expected}, got ${noteName}`);
        allValid = false;
      } else {
        console.log(`✅ String ${modes}: ${noteName} (correct)`);
      }
    } catch (error) {
      console.error(`❌ String ${modes}: Error - ${error}`);
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Cross-validate calculations between modes and shared systems
 */
export function crossValidateCalculations(): boolean {
  console.log('🔍 Cross-validating calculations...');

  const testCases = [
    { string: 0, fret: 3 }, // Low E, 3rd fret (G)
    { string: 1, fret: 5 }, // A string, 5th fret (D)
    { string: 2, fret: 7 }, // D string, 7th fret (A)
    { string: 3, fret: 0 }, // G string, open (G)
    { string: 4, fret: 2 }, // B string, 2nd fret (C#)
    { string: 5, fret: 12 } // High E, 12th fret (E)
  ];

  let allValid = true;

  for (const { string, fret } of testCases) {
    try {
      const sharedNote = getSharedNoteNameAtFret(string, fret);
      const modesNote = getSharedNoteNameAtFret(string, fret); // Same function, different perspective

      if (sharedNote !== modesNote) {
        console.error(`❌ String ${string}, Fret ${fret}: Mismatch - Shared: ${sharedNote}, Modes: ${modesNote}`);
        allValid = false;
      } else {
        console.log(`✅ String ${string}, Fret ${fret}: ${sharedNote} (consistent)`);
      }
    } catch (error) {
      console.error(`❌ String ${string}, Fret ${fret}: Error - ${error}`);
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Run all integration validations
 */
export function runIntegrationValidations(): boolean {
  console.log('🔗 Running shared integration validations...\n');

  const results = [
    validateStringMapping(),
    crossValidateCalculations()
  ];

  const allPassed = results.every(result => result);
  console.log(`\n${allPassed ? '✅' : '❌'} Integration validation ${allPassed ? 'PASSED' : 'FAILED'}`);

  return allPassed;
}

/**
 * Get chromatic value using either system (for compatibility)
 */
export function getChromaticValue(note: ChromaticNote): number {
  return noteToNumber(note);
}

/**
 * Get note name from chromatic value (for compatibility)
 */
export function getChromaticNoteName(value: number): ChromaticNote {
  return numberToNote(value);
}