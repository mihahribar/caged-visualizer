import { useState } from 'react';
import { FretboardDisplay } from '@/shared/components';
import type { StringIndex, FretNumber } from '@/shared/types/core';
import { MODES, type ModeKey } from '../constants';
import { getNoteAtFret, isNoteInMode, isRootNote } from '../utils';
import ToggleSwitch from './ToggleSwitch';

export default function SimpleModesVisualizer() {
  const [selectedMode, setSelectedMode] = useState<ModeKey>('C Ionian (Major)');
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
              onClick={() => setSelectedMode(mode as ModeKey)}
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
            <ToggleSwitch
              label="Show Note Names"
              checked={showNoteNames}
              onChange={setShowNoteNames}
              ariaLabel={showNoteNames ? 'Hide note names on fretboard' : 'Show note names on fretboard'}
            />
          </div>
        </section>
      </div>
    </div>
  );
}