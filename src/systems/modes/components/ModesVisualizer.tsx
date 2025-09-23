/**
 * Main visualizer component for the Guitar Modes System
 * Provides the complete interface for exploring guitar modes
 */

import React from 'react';
import { useModes, type ModesHookOptions } from '../hooks';
import { ModesNavigation } from './ModesNavigation';
import { ModesDisplay } from './ModesDisplay';
import { ModesToggles } from './ModesToggles';
import { ModesInfo } from './ModesInfo';

/**
 * Props for the ModesVisualizer component
 */
export interface ModesVisualizerProps {
  /** Configuration options for the modes system */
  options?: ModesHookOptions;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the info panel */
  showInfo?: boolean;
  /** Whether to show the controls panel */
  showControls?: boolean;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Whether to enable keyboard navigation */
  enableKeyboard?: boolean;
}

/**
 * Main guitar modes visualizer component
 *
 * This component provides a complete interface for exploring guitar modes,
 * including mode selection, root note navigation, fretboard visualization,
 * and display options.
 *
 * @example
 * ```tsx
 * <ModesVisualizer
 *   options={{
 *     initialState: { currentMode: 'dorian' },
 *     keyboard: { enabled: true },
 *     storage: { autoSave: true }
 *   }}
 *   showInfo={true}
 *   enableKeyboard={true}
 * />
 * ```
 */
export function ModesVisualizer({
  options = {},
  className = '',
  showInfo = true,
  showControls = true,
  layout = 'vertical',
  enableKeyboard = true
}: ModesVisualizerProps) {
  // Initialize modes system with configuration
  const modes = useModes({
    ...options,
    keyboard: {
      enabled: enableKeyboard,
      requireFocus: true,
      ...options.keyboard
    }
  });

  // Determine layout classes
  const layoutClasses = layout === 'horizontal'
    ? 'flex flex-row gap-6'
    : 'flex flex-col gap-6';

  const containerClasses = `
    modes-visualizer
    ${layoutClasses}
    p-6
    bg-white dark:bg-gray-900
    text-gray-900 dark:text-gray-100
    rounded-lg
    shadow-lg
    min-h-0
    ${className}
  `.trim();

  return (
    <div
      ref={modes.keyboard.componentRef as React.RefObject<HTMLDivElement>}
      tabIndex={0}
      className={containerClasses}
      role="application"
      aria-label="Guitar Modes Visualizer"
      onFocus={modes.keyboard.handleFocus}
      onBlur={modes.keyboard.handleBlur}
    >
      {/* Loading indicator */}
      {modes.isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Calculating pattern...</span>
          </div>
        </div>
      )}

      {/* Header with mode info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Guitar Modes</h1>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: modes.currentModeData.color }}
              aria-hidden="true"
            />
            <span className="text-lg font-semibold">
              {modes.currentModeData.displayName}
            </span>
            <span className="text-lg text-gray-600 dark:text-gray-400">
              in {modes.currentRootNote}
            </span>
          </div>
        </div>

        {/* Keyboard status indicator */}
        {enableKeyboard && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {modes.keyboard.isKeyboardActive ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Keyboard active
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                Click to activate keyboard
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className={layout === 'horizontal' ? 'flex flex-row gap-6 flex-1' : 'flex flex-col gap-6'}>

        {/* Left panel: Controls and Info */}
        <div className={`${layout === 'horizontal' ? 'w-80 flex-shrink-0' : ''} flex flex-col gap-4`}>

          {/* Navigation Controls */}
          {showControls && (
            <div className="space-y-4">
              <ModesNavigation modes={modes} />
              <ModesToggles modes={modes} />
            </div>
          )}

          {/* Mode Information */}
          {showInfo && (
            <ModesInfo modes={modes} />
          )}

        </div>

        {/* Right panel: Fretboard Display */}
        <div className="flex-1 min-w-0">
          <ModesDisplay modes={modes} />
        </div>

      </div>

      {/* Footer with statistics */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-4">
          <span>{modes.logic.patternLength} positions</span>
          <span>{modes.logic.rootCount} root notes</span>
          <span>Frets {modes.display.effectiveFretRange.start}–{modes.display.effectiveFretRange.end}</span>
        </div>

        {modes.display.hasSelections && (
          <div className="flex items-center gap-2">
            <span>{modes.display.selectionCount} selected</span>
            <button
              onClick={modes.display.clearSelectedPositions}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts help (hidden, for screen readers) */}
      {enableKeyboard && (
        <div className="sr-only">
          <h2>Keyboard Shortcuts</h2>
          <ul>
            <li>Arrow Left/Right: Change mode</li>
            <li>Arrow Up/Down: Change root note</li>
            <li>1-7: Jump to mode</li>
            <li>N: Toggle note names</li>
            <li>R: Toggle root highlighting</li>
            <li>F: Toggle focus mode</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Default export for easier importing
 */
export default ModesVisualizer;