/**
 * Info component for the Guitar Modes System
 * Displays detailed information about the current mode
 */

import React from 'react';
import type { UseModesReturn } from '../hooks';
import { MODE_ROOT_NOTES } from '../constants';

/**
 * Props for the ModesInfo component
 */
export interface ModesInfoProps {
  /** The modes hook return object */
  modes: UseModesReturn;
  /** Whether to show mode description */
  showDescription?: boolean;
  /** Whether to show intervals */
  showIntervals?: boolean;
  /** Whether to show statistics */
  showStatistics?: boolean;
  /** Whether to show theory analysis */
  showAnalysis?: boolean;
  /** Whether to show keyboard shortcuts */
  showKeyboardHelp?: boolean;
  /** Whether to allow collapsing sections */
  collapsible?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Information panel for guitar modes
 */
export function ModesInfo({
  modes,
  showDescription = true,
  showIntervals = true,
  showStatistics = true,
  showAnalysis = false,
  showKeyboardHelp = true,
  collapsible = true,
  size = 'md'
}: ModesInfoProps) {

  // Size-based styling
  const sizeClasses = {
    sm: {
      title: 'text-lg',
      subtitle: 'text-base',
      text: 'text-sm',
      spacing: 'space-y-2',
      padding: 'p-3'
    },
    md: {
      title: 'text-xl',
      subtitle: 'text-lg',
      text: 'text-base',
      spacing: 'space-y-3',
      padding: 'p-4'
    },
    lg: {
      title: 'text-2xl',
      subtitle: 'text-xl',
      text: 'text-lg',
      spacing: 'space-y-4',
      padding: 'p-6'
    }
  }[size];

  const containerClasses = `
    modes-info
    ${sizeClasses.spacing}
    ${sizeClasses.padding}
    bg-white
    dark:bg-gray-900
    border
    border-gray-200
    dark:border-gray-700
    rounded-lg
    shadow-sm
  `.trim();

  // Collapsible section component
  const CollapsibleSection = ({
    title,
    children,
    defaultOpen = true
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    if (!collapsible) {
      return (
        <div>
          <h3 className={`${sizeClasses.subtitle} font-semibold text-gray-800 dark:text-gray-200 mb-2`}>
            {title}
          </h3>
          {children}
        </div>
      );
    }

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${sizeClasses.subtitle}
            font-semibold
            text-gray-800
            dark:text-gray-200
            flex
            items-center
            justify-between
            w-full
            text-left
            hover:text-blue-600
            dark:hover:text-blue-400
          `}
        >
          {title}
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {isOpen && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const traditionalRoot = MODE_ROOT_NOTES[modes.currentMode];

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0"
          style={{ backgroundColor: modes.currentModeData.color }}
          aria-hidden="true"
        />
        <div>
          <h2 className={`${sizeClasses.title} font-bold text-gray-900 dark:text-gray-100`}>
            {modes.currentModeData.displayName}
          </h2>
          <p className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
            Root: {modes.currentRootNote}
            {modes.currentRootNote !== traditionalRoot && (
              <span className="ml-2 text-sm">
                (Traditional: {traditionalRoot})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Mode Description */}
      {showDescription && (
        <CollapsibleSection title="Description">
          <p className={`${sizeClasses.text} text-gray-700 dark:text-gray-300 leading-relaxed`}>
            {modes.currentModeData.description}
          </p>
        </CollapsibleSection>
      )}

      {/* Intervals */}
      {showIntervals && (
        <CollapsibleSection title="Intervals">
          <div className="grid grid-cols-7 gap-2">
            {modes.currentModeData.intervals.map((interval, index) => (
              <div
                key={index}
                className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div className={`${sizeClasses.text} font-semibold text-gray-900 dark:text-gray-100`}>
                  {index + 1}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {interval}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Numbers show semitone intervals from root note
          </p>
        </CollapsibleSection>
      )}

      {/* Statistics */}
      {showStatistics && modes.logic.hasPattern && (
        <CollapsibleSection title="Pattern Statistics">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
                  Total positions:
                </span>
                <span className={`${sizeClasses.text} font-medium text-gray-900 dark:text-gray-100`}>
                  {modes.logic.statistics.totalPositions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
                  Root positions:
                </span>
                <span className={`${sizeClasses.text} font-medium text-gray-900 dark:text-gray-100`}>
                  {modes.logic.statistics.rootPositions}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
                  Per string:
                </span>
                <span className={`${sizeClasses.text} font-medium text-gray-900 dark:text-gray-100`}>
                  {modes.logic.statistics.averagePositionsPerString}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
                  Fret span:
                </span>
                <span className={`${sizeClasses.text} font-medium text-gray-900 dark:text-gray-100`}>
                  {modes.logic.statistics.fretSpan}
                </span>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Music Theory Analysis */}
      {showAnalysis && (
        <CollapsibleSection title="Theory Analysis" defaultOpen={false}>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Mode Intervals
              </h4>
              <p className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
                {modes.currentModeData.intervals.join(' - ')}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                Description
              </h4>
              <p className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
                {modes.currentModeData.description}
              </p>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Current Selection Info */}
      {modes.display.hasSelections && (
        <CollapsibleSection title="Selection Info">
          <div className="space-y-2">
            <p className={`${sizeClasses.text} text-gray-700 dark:text-gray-300`}>
              {modes.display.selectionCount} position{modes.display.selectionCount !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={modes.display.selectAllRootPositions}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40"
              >
                Select All Roots
              </button>
              <button
                onClick={modes.display.clearSelectedPositions}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Keyboard Shortcuts */}
      {showKeyboardHelp && modes.keyboard.enabled && (
        <CollapsibleSection title="Keyboard Shortcuts" defaultOpen={false}>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Mode Navigation
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    → or L
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Previous:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    ← or H
                  </kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Root Navigation
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    ↑ or K
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Previous:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    ↓ or J
                  </kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Quick Access
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Modes:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    1-7
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Go to C:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    C
                  </kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Display Toggles
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Notes:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    N
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Roots:</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    R
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Storage Actions */}
      <CollapsibleSection title="Save & Load" defaultOpen={false}>
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                const data = modes.storage.exportState();
                navigator.clipboard.writeText(data);
                // TODO: Add toast notification
              }}
              className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/40"
            >
              Export Settings
            </button>
            <button
              onClick={modes.storage.clearAllData}
              className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40"
            >
              Clear Saved Data
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Settings are automatically saved to your browser
          </p>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default ModesInfo;