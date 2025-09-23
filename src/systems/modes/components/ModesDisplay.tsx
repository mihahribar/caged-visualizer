/**
 * Display component for the Guitar Modes System
 * Integrates with shared FretboardDisplay to show mode patterns
 */

import React, { useMemo } from 'react';
import type { UseModesReturn } from '../hooks';
import { FretboardDisplay } from '@/shared/components';
import type { StringIndex, FretNumber } from '@/shared/types/core';

/**
 * Props for the ModesDisplay component
 */
export interface ModesDisplayProps {
  /** The modes hook return object */
  modes: UseModesReturn;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Fretboard display component for guitar modes
 */
export function ModesDisplay({
  modes,
  className = ''
}: ModesDisplayProps) {

  // Convert modes positions to fretboard display format
  const fretboardProps = useMemo(() => {
    const { display, logic, currentRootNote } = modes;

    return {
      selectedRoot: currentRootNote,
      currentPattern: modes.currentMode,
      showAllPatterns: false, // Modes only show one pattern at a time
      showOverlay: false, // No overlay for now
      showNoteNames: modes.state.getShowNoteNames(),

      // Function to determine if a dot should be shown
      shouldShowDot: (stringIndex: StringIndex, fretNumber: FretNumber): boolean => {
        return display.shouldShowPosition(stringIndex, fretNumber);
      },

      // Function to get styling for dots
      getDotStyle: (stringIndex: StringIndex, fretNumber: FretNumber): React.CSSProperties | undefined => {
        const position = logic.getPositionAt(stringIndex, fretNumber);
        if (!position) return undefined;

        const displayPosition = logic.displayPositions.find(
          dp => dp.string === stringIndex && dp.fret === fretNumber
        );

        if (!displayPosition) return undefined;

        const baseStyle = display.getPositionStyle(displayPosition);
        const isRoot = logic.isRootPosition(stringIndex, fretNumber);
        const modeColor = modes.currentModeData.color;

        // Enhanced styling with mode colors and root emphasis
        return {
          ...baseStyle,
          backgroundColor: modeColor,
          border: isRoot ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.3)',
          boxShadow: isRoot
            ? `0 0 8px ${modeColor}, inset 0 0 0 2px ${modeColor}`
            : `0 0 4px ${modeColor}`,
          transform: isRoot ? 'scale(1.1)' : 'scale(1.0)',
          zIndex: isRoot ? 10 : 5,
          opacity: display.displayOptions.colorIntensity || 0.8,
          transition: 'all 0.3s ease-in-out'
        };
      },

      // Function to check if position contains important notes (roots)
      isKeyNote: (stringIndex: StringIndex, fretNumber: FretNumber): boolean => {
        return logic.isRootPosition(stringIndex, fretNumber);
      },

      // Function to determine if overlay dot should be shown
      shouldShowOverlayDot: (): boolean => {
        return false; // No overlay in modes system
      },

      // Function to determine if note name should be displayed
      shouldShowNoteName: (stringIndex: StringIndex, fretNumber: FretNumber): boolean => {
        if (!modes.state.getShowNoteNames()) return false;
        return display.shouldShowPosition(stringIndex, fretNumber);
      },

      // Function to get note name for position
      getNoteNameAtFret: (stringIndex: StringIndex, fretNumber: FretNumber): string => {
        const position = logic.getPositionAt(stringIndex, fretNumber);
        if (!position) return '';

        // Return note name or scale degree based on display settings
        if (display.displayOptions.showScaleDegrees) {
          const scaleDegree = logic.modePattern?.positions
            .find(p => p.string === stringIndex && p.fret === fretNumber)?.interval;
          if (scaleDegree !== undefined) {
            const modeIntervals = logic.modeInfo?.pattern.positions
              .map(p => p.interval)
              .filter((interval, index, arr) => arr.indexOf(interval) === index)
              .sort((a, b) => a - b) || [];
            const degreeIndex = modeIntervals.indexOf(scaleDegree);
            return degreeIndex !== -1 ? (degreeIndex + 1).toString() : '';
          }
        }

        return position.note;
      }
    };
  }, [modes]);


  const containerClasses = `
    modes-display
    relative
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {/* Display Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white dark:border-gray-900"
            style={{ backgroundColor: modes.currentModeData.color }}
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold">
            {modes.currentModeData.displayName}
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            in {modes.currentRootNote}
          </span>
          <span
            className="px-2 py-1 text-xs rounded-full font-medium text-white"
            style={{ backgroundColor: modes.currentModeData.color }}
          >
            Mode {modes.navigation.modeProgress.current}/7
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{modes.display.visiblePositionCount} visible positions</span>
          {modes.display.fretSpan > 0 && (
            <span>
              Frets {modes.display.effectiveFretRange.start}–{modes.display.effectiveFretRange.end}
            </span>
          )}
        </div>
      </div>

      {/* Fretboard Display */}
      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-500 ease-in-out">
        {/* Mode transition overlay */}
        {modes.isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-900/30 to-transparent animate-pulse rounded-lg z-20" />
        )}

        {/* Fretboard with enhanced styling */}
        <div className="relative">
          <FretboardDisplay
            {...fretboardProps}
          />

          {/* Root note indicator legend */}
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
            <div
              className="w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: modes.currentModeData.color }}
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {modes.currentRootNote} Root
            </span>
          </div>
        </div>
      </div>

      {/* Position Info */}
      {modes.display.hoveredPositionInfo && (
        <div className="mt-4 p-4 rounded-lg border transition-all duration-300 ease-in-out"
             style={{
               backgroundColor: `${modes.currentModeData.color}20`,
               borderColor: `${modes.currentModeData.color}40`
             }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md"
                style={{ backgroundColor: modes.currentModeData.color }}
              >
                {modes.display.hoveredPositionInfo.position.note}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {modes.display.hoveredPositionInfo.position.note}
                  {modes.display.hoveredPositionInfo.position.isRoot && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full font-medium text-white"
                          style={{ backgroundColor: modes.currentModeData.color }}>
                      Root Note
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  String {modes.display.hoveredPositionInfo.position.string + 1} •
                  Fret {modes.display.hoveredPositionInfo.position.fret}
                  {modes.display.displayOptions.showScaleDegrees && (
                    <span className="ml-2">
                      • Scale degree {(modes.display.hoveredPositionInfo.position as { interval: number }).interval + 1}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {modes.display.hoveredPositionInfo.isSelected && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse"
                     style={{ backgroundColor: modes.currentModeData.color }} />
                <span className="text-sm font-medium"
                      style={{ color: modes.currentModeData.color }}>
                  Selected
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Display Controls */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Display Options</h3>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={modes.state.getShowNoteNames()}
              onChange={modes.state.toggleNoteNames}
              className="rounded border-gray-300 dark:border-gray-600"
              style={{ accentColor: modes.currentModeData.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">Show note names</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={modes.state.getHighlightRoot()}
              onChange={modes.state.toggleHighlightRoot}
              className="rounded border-gray-300 dark:border-gray-600"
              style={{ accentColor: modes.currentModeData.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">Highlight roots</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={modes.display.displayOptions.showScaleDegrees}
              onChange={modes.display.toggleScaleDegrees}
              className="rounded border-gray-300 dark:border-gray-600"
              style={{ accentColor: modes.currentModeData.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">Show scale degrees</span>
          </label>
        </div>

        {modes.display.hasSelections && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {modes.display.selectionCount} position{modes.display.selectionCount !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={modes.display.selectAllRootPositions}
                  className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  style={{ color: modes.currentModeData.color }}
                >
                  Select all roots
                </button>
                <button
                  onClick={modes.display.clearSelectedPositions}
                  className="px-2 py-1 text-xs rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pattern Statistics */}
      <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pattern Statistics</h3>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: modes.currentModeData.color }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold" style={{ color: modes.currentModeData.color }}>
              {modes.logic.statistics.totalPositions}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total positions</div>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold" style={{ color: modes.currentModeData.color }}>
              {modes.logic.statistics.rootPositions}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Root positions</div>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold" style={{ color: modes.currentModeData.color }}>
              {modes.logic.statistics.averagePositionsPerString}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg per string</div>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold" style={{ color: modes.currentModeData.color }}>
              {modes.logic.statistics.fretSpan}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Fret span</div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {modes.isLoading && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
          <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 border-3 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${modes.currentModeData.color} transparent transparent transparent` }}
              />
              <div
                className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: `${modes.currentModeData.color}60 transparent transparent transparent`,
                  animationDirection: 'reverse',
                  animationDuration: '0.8s'
                }}
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Calculating {modes.currentModeData.displayName} pattern...
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                in {modes.currentRootNote}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModesDisplay;