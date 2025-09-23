import { useState } from 'react';
import { FretboardDisplay } from '@/shared/components';
import type { StringIndex, FretNumber } from '@/shared/types/core';

// Simple mode data
const MODES = {
  'C Major (Ionian)': { root: 'C', intervals: [0, 2, 4, 5, 7, 9, 11], color: '#3B82F6' },
  'D Dorian': { root: 'D', intervals: [0, 2, 3, 5, 7, 9, 10], color: '#10B981' },
  'E Phrygian': { root: 'E', intervals: [0, 1, 3, 5, 7, 8, 10], color: '#F59E0B' },
  'F Lydian': { root: 'F', intervals: [0, 2, 4, 6, 7, 9, 11], color: '#EF4444' },
  'G Mixolydian': { root: 'G', intervals: [0, 2, 4, 5, 7, 9, 10], color: '#8B5CF6' },
  'A Aeolian': { root: 'A', intervals: [0, 2, 3, 5, 7, 8, 10], color: '#EC4899' },
  'B Locrian': { root: 'B', intervals: [0, 1, 3, 5, 6, 8, 10], color: '#6B7280' }
};

// Standard tuning notes (from low E to high E, but in array order from top to bottom as displayed)
const TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];

// Chromatic notes
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNoteAtFret(stringIndex: number, fretNumber: number): string {
  const openNote = TUNING[stringIndex];
  const openNoteIndex = NOTES.indexOf(openNote);
  const noteIndex = (openNoteIndex + fretNumber) % 12;
  return NOTES[noteIndex];
}

function isNoteInMode(note: string, modeData: { root: string; intervals: number[] }): boolean {
  const rootIndex = NOTES.indexOf(modeData.root);
  const noteIndex = NOTES.indexOf(note);
  const interval = (noteIndex - rootIndex + 12) % 12;
  return modeData.intervals.includes(interval);
}

function isRootNote(note: string, rootNote: string): boolean {
  return note === rootNote;
}

export default function SimpleModesVisualizer() {
  const [selectedMode, setSelectedMode] = useState<keyof typeof MODES>('C Major (Ionian)');
  const [showNoteNames, setShowNoteNames] = useState(true);

  const currentMode = MODES[selectedMode];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Guitar Modes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the seven modes of the major scale
        </p>
      </div>

      {/* Mode Selector */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Mode:
        </label>
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value as keyof typeof MODES)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {Object.keys(MODES).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showNoteNames}
            onChange={(e) => setShowNoteNames(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show note names</span>
        </label>
      </div>

      {/* Mode Info */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {selectedMode}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: currentMode.color }}
          />
          <span>Root: {currentMode.root}</span>
          <span>•</span>
          <span>Intervals: {currentMode.intervals.join('-')}</span>
        </div>
      </div>

      {/* Fretboard */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <FretboardDisplay
          selectedRoot={currentMode.root}
          currentPattern={selectedMode}
          showAllPatterns={false}
          showOverlay={false}
          showNoteNames={showNoteNames}

          shouldShowDot={(stringIndex: StringIndex, fretNumber: FretNumber): boolean => {
            const note = getNoteAtFret(stringIndex, fretNumber);
            return isNoteInMode(note, currentMode);
          }}

          getDotStyle={(stringIndex: StringIndex, fretNumber: FretNumber) => {
            const note = getNoteAtFret(stringIndex, fretNumber);
            const isRoot = isRootNote(note, currentMode.root);

            return {
              backgroundColor: currentMode.color,
              border: isRoot ? '3px solid white' : '1px solid rgba(255,255,255,0.5)',
              transform: isRoot ? 'scale(1.2)' : 'scale(1.0)',
              zIndex: isRoot ? 10 : 5
            };
          }}

          isKeyNote={(stringIndex: StringIndex, fretNumber: FretNumber): boolean => {
            const note = getNoteAtFret(stringIndex, fretNumber);
            return isRootNote(note, currentMode.root);
          }}

          shouldShowOverlayDot={() => false}

          shouldShowNoteName={(stringIndex: StringIndex, fretNumber: FretNumber): boolean => {
            if (!showNoteNames) return false;
            const note = getNoteAtFret(stringIndex, fretNumber);
            return isNoteInMode(note, currentMode);
          }}

          getNoteNameAtFret={(stringIndex: StringIndex, fretNumber: FretNumber): string => {
            return getNoteAtFret(stringIndex, fretNumber);
          }}
        />
      </div>
    </div>
  );
}