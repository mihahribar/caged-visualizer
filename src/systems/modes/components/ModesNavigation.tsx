/**
 * Navigation component for the Guitar Modes System
 * Provides controls for mode and root note navigation
 */

import type { UseModesReturn } from '../hooks';
import type { ModeType, ChromaticNote } from '../types';
import { ALL_MODES } from '../constants';
import { CHROMATIC_NOTES } from '../utils';

/**
 * Props for the ModesNavigation component
 */
export interface ModesNavigationProps {
  /** The modes hook return object */
  modes: UseModesReturn;
  /** Whether to show mode selector */
  showModeSelector?: boolean;
  /** Whether to show root note selector */
  showRootSelector?: boolean;
  /** Whether to show navigation buttons */
  showButtons?: boolean;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Navigation controls for guitar modes
 */
export function ModesNavigation({
  modes,
  showModeSelector = true,
  showRootSelector = true,
  showButtons = true,
  orientation = 'vertical',
  size = 'md'
}: ModesNavigationProps) {

  // Size-based styling
  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-sm',
      select: 'px-2 py-1 text-sm',
      spacing: 'gap-2'
    },
    md: {
      button: 'px-3 py-2 text-base',
      select: 'px-3 py-2 text-base',
      spacing: 'gap-3'
    },
    lg: {
      button: 'px-4 py-3 text-lg',
      select: 'px-4 py-3 text-lg',
      spacing: 'gap-4'
    }
  }[size];

  const containerClasses = `
    modes-navigation
    ${orientation === 'horizontal' ? `flex flex-row ${sizeClasses.spacing}` : `flex flex-col ${sizeClasses.spacing}`}
  `.trim();

  // Common button classes
  const buttonBaseClasses = `
    ${sizeClasses.button}
    rounded-md
    font-medium
    transition-colors
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:ring-offset-2
    dark:focus:ring-offset-gray-900
  `;

  const primaryButtonClasses = `
    ${buttonBaseClasses}
    bg-blue-600
    text-white
    hover:bg-blue-700
    disabled:bg-gray-400
    disabled:cursor-not-allowed
  `;

  const secondaryButtonClasses = `
    ${buttonBaseClasses}
    bg-gray-200
    text-gray-900
    hover:bg-gray-300
    dark:bg-gray-700
    dark:text-gray-100
    dark:hover:bg-gray-600
    disabled:bg-gray-100
    disabled:text-gray-400
    disabled:cursor-not-allowed
    dark:disabled:bg-gray-800
    dark:disabled:text-gray-600
  `;

  const selectClasses = `
    ${sizeClasses.select}
    rounded-md
    border
    border-gray-300
    bg-white
    text-gray-900
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    dark:bg-gray-700
    dark:border-gray-600
    dark:text-gray-100
    dark:focus:ring-blue-400
    dark:focus:border-blue-400
  `;

  return (
    <div className={containerClasses}>

      {/* Mode Navigation */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Mode ({modes.navigation.modeProgress.current}/{modes.navigation.modeProgress.total})
        </h3>

        {/* Mode Selector Dropdown */}
        {showModeSelector && (
          <select
            value={modes.currentMode}
            onChange={(e) => modes.navigation.navigateToMode(e.target.value as ModeType)}
            className={selectClasses}
            aria-label="Select mode"
          >
            {ALL_MODES.map((mode, index) => (
              <option key={mode} value={mode}>
                {index + 1}. {modes.logic.modeColor && (
                  <span style={{ color: modes.logic.modeColor }}>●</span>
                )} {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        )}

        {/* Mode Navigation Buttons */}
        {showButtons && (
          <div className="flex gap-2">
            <button
              onClick={modes.navigation.previousMode}
              disabled={!modes.navigation.canGoPrevious}
              className={secondaryButtonClasses}
              aria-label="Previous mode"
              title={`Previous: ${modes.navigation.previousModePreview}`}
            >
              ← Prev
            </button>

            <button
              onClick={modes.navigation.nextMode}
              disabled={!modes.navigation.canGoNext}
              className={primaryButtonClasses}
              aria-label="Next mode"
              title={`Next: ${modes.navigation.nextModePreview}`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Quick Mode Access Buttons */}
        <div className="grid grid-cols-7 gap-1">
          {ALL_MODES.map((mode, index) => (
            <button
              key={mode}
              onClick={() => modes.navigation.navigateToMode(mode)}
              className={`
                ${mode === modes.currentMode ? primaryButtonClasses : secondaryButtonClasses}
                aspect-square
                text-xs
                flex
                items-center
                justify-center
              `}
              aria-label={`Mode ${index + 1}: ${mode}`}
              title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Root Note Navigation */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Root Note ({modes.navigation.rootProgress.current}/{modes.navigation.rootProgress.total})
        </h3>

        {/* Root Note Selector */}
        {showRootSelector && (
          <select
            value={modes.currentRootNote}
            onChange={(e) => modes.navigation.navigateToRootNote(e.target.value as ChromaticNote)}
            className={selectClasses}
            aria-label="Select root note"
          >
            {CHROMATIC_NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        )}

        {/* Root Navigation Buttons */}
        {showButtons && (
          <div className="flex gap-2">
            <button
              onClick={modes.navigation.previousRootPosition}
              disabled={!modes.navigation.canGoPreviousRoot}
              className={secondaryButtonClasses}
              aria-label="Previous root note"
              title={`Previous: ${modes.navigation.previousRootPreview}`}
            >
              ↓ Prev
            </button>

            <button
              onClick={modes.navigation.nextRootPosition}
              disabled={!modes.navigation.canGoNextRoot}
              className={primaryButtonClasses}
              aria-label="Next root note"
              title={`Next: ${modes.navigation.nextRootPreview}`}
            >
              Next ↑
            </button>
          </div>
        )}

        {/* Quick Root Access */}
        <div className="flex gap-1">
          <button
            onClick={modes.navigation.goToC}
            className={`
              ${modes.currentRootNote === 'C' ? primaryButtonClasses : secondaryButtonClasses}
              text-xs
              px-2
              py-1
            `}
            aria-label="Go to C"
          >
            C
          </button>

          <button
            onClick={modes.navigation.goToTraditionalRoot}
            className={secondaryButtonClasses + ' text-xs px-2 py-1'}
            aria-label="Go to traditional root"
            title={`Traditional root for ${modes.currentMode}: ${modes.navigation.navigationContext.traditionalRoot}`}
          >
            Trad
          </button>
        </div>
      </div>

      {/* Reset Controls */}
      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Reset
        </h3>

        <div className="flex gap-2">
          <button
            onClick={modes.navigation.goToFirstMode}
            className={secondaryButtonClasses + ' text-sm'}
            aria-label="Go to first mode"
          >
            First Mode
          </button>

          <button
            onClick={modes.state.resetState}
            className={secondaryButtonClasses + ' text-sm'}
            aria-label="Reset all settings"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Mode Progress:</span>
          <span>{modes.navigation.modeProgress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${modes.navigation.modeProgress.percentage}%` }}
          />
        </div>

        <div className="flex justify-between">
          <span>Root Progress:</span>
          <span>{modes.navigation.rootProgress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className="bg-green-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${modes.navigation.rootProgress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ModesNavigation;