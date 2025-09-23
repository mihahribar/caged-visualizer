/**
 * Toggles component for the Guitar Modes System
 * Provides display option controls and visual settings
 */

import type { UseModesReturn } from '../hooks';

/**
 * Props for the ModesToggles component
 */
export interface ModesTogglesProps {
  /** The modes hook return object */
  modes: UseModesReturn;
  /** Whether to show display toggles */
  showDisplayToggles?: boolean;
  /** Whether to show visual controls */
  showVisualControls?: boolean;
  /** Whether to show fret range controls */
  showFretRange?: boolean;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Display toggles and controls for guitar modes
 */
export function ModesToggles({
  modes,
  showDisplayToggles = true,
  showVisualControls = true,
  showFretRange = true,
  orientation = 'vertical',
  size = 'md'
}: ModesTogglesProps) {

  // Size-based styling
  const sizeClasses = {
    sm: {
      text: 'text-sm',
      toggle: 'h-4 w-8',
      slider: 'h-3 w-3',
      spacing: 'gap-2',
      padding: 'p-2'
    },
    md: {
      text: 'text-base',
      toggle: 'h-5 w-10',
      slider: 'h-4 w-4',
      spacing: 'gap-3',
      padding: 'p-3'
    },
    lg: {
      text: 'text-lg',
      toggle: 'h-6 w-12',
      slider: 'h-5 w-5',
      spacing: 'gap-4',
      padding: 'p-4'
    }
  }[size];

  const containerClasses = `
    modes-toggles
    ${orientation === 'horizontal' ? `flex flex-row ${sizeClasses.spacing}` : `flex flex-col ${sizeClasses.spacing}`}
    ${sizeClasses.padding}
    bg-gray-50
    dark:bg-gray-800
    rounded-lg
  `.trim();

  // Toggle switch component
  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
    description?: string;
  }) => (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex-1">
        <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100`}>
          {label}
        </span>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="relative ml-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`
            ${sizeClasses.toggle}
            rounded-full
            transition-colors
            duration-200
            ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        />
        <div
          className={`
            absolute
            top-0.5
            ${sizeClasses.slider}
            bg-white
            rounded-full
            transition-transform
            duration-200
            ${checked ? 'transform translate-x-5' : 'transform translate-x-0.5'}
          `}
        />
      </div>
    </label>
  );

  // Slider component
  const Slider = ({
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.1,
    label
  }: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300`}>
          {label}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <div className={containerClasses}>

      {/* Display Options */}
      {showDisplayToggles && (
        <div className="space-y-3">
          <h3 className={`${sizeClasses.text} font-semibold text-gray-800 dark:text-gray-200`}>
            Display Options
          </h3>

          <div className="space-y-3">
            <ToggleSwitch
              checked={modes.state.getShowNoteNames()}
              onChange={modes.state.toggleNoteNames}
              label="Note Names"
              description="Show note names on fretboard positions"
            />

            <ToggleSwitch
              checked={modes.state.getHighlightRoot()}
              onChange={modes.state.toggleHighlightRoot}
              label="Highlight Roots"
              description="Emphasize root note positions"
            />

            <ToggleSwitch
              checked={modes.display.displayOptions.showScaleDegrees}
              onChange={modes.display.toggleScaleDegrees}
              label="Scale Degrees"
              description="Show numbers (1-7) instead of note names"
            />

            <ToggleSwitch
              checked={modes.display.displayOptions.showIntervals}
              onChange={modes.display.toggleIntervals}
              label="Intervals"
              description="Show chromatic intervals from root"
            />
          </div>
        </div>
      )}

      {/* Visual Controls */}
      {showVisualControls && (
        <div className="space-y-3">
          <h3 className={`${sizeClasses.text} font-semibold text-gray-800 dark:text-gray-200`}>
            Visual Settings
          </h3>

          <div className="space-y-3">
            <ToggleSwitch
              checked={modes.display.displayOptions.enableAnimations}
              onChange={modes.display.toggleAnimations}
              label="Animations"
              description="Enable smooth transitions and effects"
            />

            <ToggleSwitch
              checked={modes.display.displayOptions.showFretMarkers}
              onChange={modes.display.toggleFretMarkers}
              label="Fret Markers"
              description="Show position markers on fretboard"
            />

            <ToggleSwitch
              checked={modes.display.displayOptions.showStringLabels}
              onChange={modes.display.toggleStringLabels}
              label="String Labels"
              description="Show string names (E, A, D, G, B, E)"
            />

            <Slider
              value={modes.display.displayOptions.colorIntensity}
              onChange={modes.display.setColorIntensity}
              label="Color Intensity"
            />
          </div>
        </div>
      )}

      {/* Focus and Zoom Controls */}
      <div className="space-y-3">
        <h3 className={`${sizeClasses.text} font-semibold text-gray-800 dark:text-gray-200`}>
          View Controls
        </h3>

        <div className="space-y-3">
          <ToggleSwitch
            checked={modes.display.displayState.focusMode}
            onChange={modes.display.toggleFocusMode}
            label="Focus Mode"
            description="Hide distractions and focus on pattern"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={modes.display.zoomOut}
              className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              -
            </button>
            <span className="flex-1 text-center text-sm text-gray-600 dark:text-gray-400">
              Zoom {Math.round(modes.display.displayState.zoomLevel * 100)}%
            </span>
            <button
              onClick={modes.display.zoomIn}
              className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              +
            </button>
          </div>

          <button
            onClick={modes.display.resetZoom}
            className="w-full px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Reset Zoom
          </button>
        </div>
      </div>

      {/* Fret Range Controls */}
      {showFretRange && (
        <div className="space-y-3">
          <h3 className={`${sizeClasses.text} font-semibold text-gray-800 dark:text-gray-200`}>
            Fret Range
          </h3>

          <div className="space-y-3">
            <ToggleSwitch
              checked={modes.display.displayOptions.useOptimizedRange}
              onChange={modes.display.toggleOptimizedRange}
              label="Auto Range"
              description="Automatically focus on relevant frets"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Start Fret
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={modes.display.effectiveFretRange.start}
                  onChange={(e) => {
                    const start = parseInt(e.target.value);
                    modes.display.setFretRange(start, modes.display.effectiveFretRange.end);
                  }}
                  disabled={modes.display.displayOptions.useOptimizedRange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  End Fret
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={modes.display.effectiveFretRange.end}
                  onChange={(e) => {
                    const end = parseInt(e.target.value);
                    modes.display.setFretRange(modes.display.effectiveFretRange.start, end);
                  }}
                  disabled={modes.display.displayOptions.useOptimizedRange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Showing {modes.display.fretSpan} frets ({modes.display.visiblePositionCount} positions)
            </div>
          </div>
        </div>
      )}

      {/* Note Naming Context */}
      <div className="space-y-3">
        <h3 className={`${sizeClasses.text} font-semibold text-gray-800 dark:text-gray-200`}>
          Note Names
        </h3>

        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => modes.display.setNoteNamingContext('sharp')}
              className={`
                px-3 py-1 text-sm rounded
                ${modes.display.displayOptions.noteNamingContext === 'sharp'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Sharps (#)
            </button>
            <button
              onClick={() => modes.display.setNoteNamingContext('flat')}
              className={`
                px-3 py-1 text-sm rounded
                ${modes.display.displayOptions.noteNamingContext === 'flat'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              Flats (♭)
            </button>
          </div>
        </div>
      </div>

      {/* Reset All Settings */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={modes.display.resetDisplayState}
          className="w-full px-3 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40"
        >
          Reset All Display Settings
        </button>
      </div>
    </div>
  );
}

export default ModesToggles;