import { useState } from 'react';
import { FretboardDisplay } from '@/shared/components';
import type { StringIndex, FretNumber } from '@/shared/types/core';

// Simple mode data
const MODES = {
  'C Ionian (Major)': { root: 'C', intervals: [0, 2, 4, 5, 7, 9, 11], color: '#3B82F6' },
  'D Dorian': { root: 'D', intervals: [0, 2, 3, 5, 7, 9, 10], color: '#10B981' },
  'E Phrygian': { root: 'E', intervals: [0, 1, 3, 5, 7, 8, 10], color: '#F59E0B' },
  'F Lydian': { root: 'F', intervals: [0, 2, 4, 6, 7, 9, 11], color: '#EF4444' },
  'G Mixolydian': { root: 'G', intervals: [0, 2, 4, 5, 7, 9, 10], color: '#8B5CF6' },
  'A Aeolian (Minor)': { root: 'A', intervals: [0, 2, 3, 5, 7, 8, 10], color: '#EC4899' },
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
  const [selectedMode, setSelectedMode] = useState<keyof typeof MODES>('C Ionian (Major)');
  const [showNoteNames, setShowNoteNames] = useState(true);

  const currentMode = MODES[selectedMode];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Mode Selector */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Mode:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(MODES).map(([mode, data]) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode as keyof typeof MODES)}
              className={`
                p-2 rounded font-medium text-left transition-all duration-200
                ${selectedMode === mode
                  ? 'ring-2 ring-offset-1 ring-offset-gray-50 dark:ring-offset-gray-800 shadow-lg'
                  : 'hover:shadow-md'
                }
              `}
              style={{
                backgroundColor: data.color,
                color: 'white'
              }}
            >
              <div className="flex flex-col gap-0.5">
                <div className="text-sm font-bold">{mode}</div>
                <div className="text-xs opacity-90">
                  Root: {data.root} • {data.intervals.join('-')}
                </div>
              </div>
            </button>
          ))}
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

          keyNoteIndicator="R"
          ariaLabel={`Guitar fretboard showing ${selectedMode} mode`}
        />
      </div>

      {/* Note Names Toggle Control */}
      <div className="mt-6">
        <section className="mb-4" aria-label="View mode controls">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Note Names</span>
              <button
                onClick={() => setShowNoteNames(!showNoteNames)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                  showNoteNames
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
                aria-pressed={showNoteNames}
                aria-label={showNoteNames ? 'Hide note names on fretboard' : 'Show note names on fretboard'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    showNoteNames ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {showNoteNames ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}