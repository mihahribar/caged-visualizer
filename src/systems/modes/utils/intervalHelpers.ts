import type { ModeType, ChromaticNote, ModePosition } from '../types';
import { MODE_INTERVALS } from '../constants';
import { getInterval } from './musicTheory';

/**
 * Interval calculation helpers for the modes system
 * Provides utilities for working with musical intervals and relationships
 */

/**
 * Interval quality names for display
 */
export const INTERVAL_NAMES: Record<number, string> = {
  0: 'Root (Unison)',
  1: 'Minor 2nd',
  2: 'Major 2nd',
  3: 'Minor 3rd',
  4: 'Major 3rd',
  5: 'Perfect 4th',
  6: 'Tritone',
  7: 'Perfect 5th',
  8: 'Minor 6th',
  9: 'Major 6th',
  10: 'Minor 7th',
  11: 'Major 7th'
};

/**
 * Scale degree names (1-based)
 */
export const SCALE_DEGREE_NAMES: Record<number, string> = {
  1: '1st (Root)',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th'
};

/**
 * Get the interval name for a chromatic interval
 */
export function getIntervalName(interval: number): string {
  const normalizedInterval = ((interval % 12) + 12) % 12;
  return INTERVAL_NAMES[normalizedInterval] || `Interval ${normalizedInterval}`;
}

/**
 * Get the scale degree for an interval within a mode
 */
export function getScaleDegree(mode: ModeType, interval: number): number | null {
  const modeIntervals = MODE_INTERVALS[mode];
  const index = modeIntervals.indexOf(interval);
  return index !== -1 ? index + 1 : null;
}

/**
 * Get the scale degree name for an interval within a mode
 */
export function getScaleDegreeName(mode: ModeType, interval: number): string {
  const degree = getScaleDegree(mode, interval);
  if (degree === null) return 'Not in scale';
  return SCALE_DEGREE_NAMES[degree] || `${degree}th`;
}

/**
 * Calculate the interval between two notes
 */
export function calculateInterval(fromNote: ChromaticNote, toNote: ChromaticNote): {
  semitones: number;
  intervalName: string;
} {
  const semitones = getInterval(fromNote, toNote);
  return {
    semitones,
    intervalName: getIntervalName(semitones)
  };
}

/**
 * Get all intervals present in a mode
 */
export function getModeIntervalInfo(mode: ModeType): Array<{
  interval: number;
  scaleDegree: number;
  intervalName: string;
  scaleDegreeName: string;
}> {
  const intervals = MODE_INTERVALS[mode];

  return intervals.map((interval, index) => ({
    interval,
    scaleDegree: index + 1,
    intervalName: getIntervalName(interval),
    scaleDegreeName: SCALE_DEGREE_NAMES[index + 1] || `${index + 1}th`
  }));
}

/**
 * Find notes that are a specific interval away from a root note
 */
export function findNotesAtInterval(
  rootNote: ChromaticNote,
  targetInterval: number,
  positions: ModePosition[]
): ModePosition[] {
  return positions.filter(pos => {
    const intervalFromRoot = getInterval(rootNote, pos.note);
    return intervalFromRoot === targetInterval;
  });
}

/**
 * Get the characteristic intervals that define a mode (compared to major scale)
 */
export function getModeCharacteristics(mode: ModeType): Array<{
  scaleDegree: number;
  interval: number;
  quality: 'same' | 'raised' | 'lowered';
  description: string;
}> {
  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11]; // Ionian
  const modeIntervals = MODE_INTERVALS[mode];

  return modeIntervals.map((interval, index) => {
    const majorInterval = majorScaleIntervals[index];
    const scaleDegree = index + 1;

    let quality: 'same' | 'raised' | 'lowered';
    let description: string;

    if (interval === majorInterval) {
      quality = 'same';
      description = `Same as major scale`;
    } else if (interval > majorInterval) {
      quality = 'raised';
      description = `Raised by ${interval - majorInterval} semitone(s)`;
    } else {
      quality = 'lowered';
      description = `Lowered by ${majorInterval - interval} semitone(s)`;
    }

    return {
      scaleDegree,
      interval,
      quality,
      description
    };
  });
}

/**
 * Calculate harmonic intervals between positions
 */
export function calculateHarmonicIntervals(
  positions: ModePosition[]
): Array<{
  position1: ModePosition;
  position2: ModePosition;
  interval: number;
  intervalName: string;
}> {
  const harmonicIntervals: Array<{
    position1: ModePosition;
    position2: ModePosition;
    interval: number;
    intervalName: string;
  }> = [];

  // Compare each position with every other position
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];

      const interval = getInterval(pos1.note, pos2.note);
      const intervalName = getIntervalName(interval);

      harmonicIntervals.push({
        position1: pos1,
        position2: pos2,
        interval,
        intervalName
      });
    }
  }

  return harmonicIntervals;
}

/**
 * Get perfect intervals (unison, 4th, 5th, octave) from a set of positions
 */
export function getPerfectIntervals(positions: ModePosition[]): ModePosition[][] {
  const perfectIntervalValues = [0, 5, 7]; // Unison, Perfect 4th, Perfect 5th
  const groups: ModePosition[][] = [];

  for (const targetInterval of perfectIntervalValues) {
    const matchingPositions = positions.filter(pos => pos.interval === targetInterval);
    if (matchingPositions.length > 0) {
      groups.push(matchingPositions);
    }
  }

  return groups;
}

/**
 * Analyze the interval structure of a mode relative to its root
 */
export function analyzeModeStructure(mode: ModeType): {
  name: string;
  intervals: number[];
  characteristics: string[];
  tonalCenter: string;
  keyIntervals: { third: number; seventh: number };
} {
  const intervals = MODE_INTERVALS[mode];
  const characteristics: string[] = [];

  // Determine tonal center (major/minor based on 3rd)
  const third = intervals.find(i => i === 3 || i === 4);
  const tonalCenter = third === 4 ? 'Major' : third === 3 ? 'Minor' : 'Ambiguous';

  // Key intervals that define the mode's character
  const seventh = intervals.find(i => i === 10 || i === 11) || 0;

  // Add characteristic descriptions
  if (intervals.includes(1)) characteristics.push('Contains minor 2nd (b2)');
  if (intervals.includes(3)) characteristics.push('Contains minor 3rd (b3)');
  if (intervals.includes(6)) characteristics.push('Contains tritone (b5/#4)');
  if (intervals.includes(10)) characteristics.push('Contains minor 7th (b7)');

  return {
    name: mode,
    intervals,
    characteristics,
    tonalCenter,
    keyIntervals: {
      third: third || 0,
      seventh
    }
  };
}