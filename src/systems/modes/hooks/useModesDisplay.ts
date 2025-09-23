/**
 * Display hook for the modes system
 * Manages visual state, fretboard display options, and UI preferences
 */

import { useState, useCallback, useMemo } from 'react';
import type { UseModesStateReturn } from './useModesState';
import type { UseModesLogicReturn } from './useModesLogic';
import type { DisplayModePosition, NoteNamingContext } from '../utils';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';

/**
 * Display options for the modes system
 */
export interface ModesDisplayOptions {
  /** Note naming context (sharp/flat preference) */
  noteNamingContext: NoteNamingContext;
  /** Whether to show scale degrees instead of note names */
  showScaleDegrees: boolean;
  /** Whether to show interval numbers */
  showIntervals: boolean;
  /** Fret range to display */
  fretRange: { start: number; end: number };
  /** Whether to use optimized display range */
  useOptimizedRange: boolean;
  /** Whether to show fret markers */
  showFretMarkers: boolean;
  /** Whether to show string labels */
  showStringLabels: boolean;
  /** Animation settings */
  enableAnimations: boolean;
  /** Color intensity (0-1) */
  colorIntensity: number;
}

/**
 * Display state for visual elements
 */
export interface ModesDisplayState extends ModesDisplayOptions {
  /** Currently hovered position */
  hoveredPosition: { string: number; fret: number } | null;
  /** Currently selected positions */
  selectedPositions: Array<{ string: number; fret: number }>;
  /** Whether display is in focus mode */
  focusMode: boolean;
  /** Current zoom level */
  zoomLevel: number;
}

/**
 * Default display options
 */
const DEFAULT_DISPLAY_OPTIONS: ModesDisplayOptions = {
  noteNamingContext: 'sharp',
  showScaleDegrees: false,
  showIntervals: false,
  fretRange: { start: 0, end: FRETBOARD_CONSTANTS.MAX_FRET },
  useOptimizedRange: true,
  showFretMarkers: true,
  showStringLabels: true,
  enableAnimations: true,
  colorIntensity: 1.0
};

/**
 * Display hook for modes system
 */
export function useModesDisplay(
  _modesState: UseModesStateReturn,
  modesLogic: UseModesLogicReturn,
  initialOptions?: Partial<ModesDisplayOptions>
) {
  // Display options state
  const [displayOptions, setDisplayOptions] = useState<ModesDisplayOptions>({
    ...DEFAULT_DISPLAY_OPTIONS,
    ...initialOptions
  });

  // Visual interaction state
  const [hoveredPosition, setHoveredPosition] = useState<{ string: number; fret: number } | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<Array<{ string: number; fret: number }>>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Complete display state
  const displayState: ModesDisplayState = {
    ...displayOptions,
    hoveredPosition,
    selectedPositions,
    focusMode,
    zoomLevel
  };

  // Display options setters
  const setNoteNamingContext = useCallback((context: NoteNamingContext) => {
    setDisplayOptions(prev => ({ ...prev, noteNamingContext: context }));
  }, []);

  const toggleScaleDegrees = useCallback(() => {
    setDisplayOptions(prev => ({ ...prev, showScaleDegrees: !prev.showScaleDegrees }));
  }, []);

  const toggleIntervals = useCallback(() => {
    setDisplayOptions(prev => ({ ...prev, showIntervals: !prev.showIntervals }));
  }, []);

  const setFretRange = useCallback((start: number, end: number) => {
    if (start < 0 || end > FRETBOARD_CONSTANTS.MAX_FRET || start > end) {
      console.warn('Invalid fret range:', { start, end });
      return;
    }
    setDisplayOptions(prev => ({ ...prev, fretRange: { start, end } }));
  }, []);

  const toggleOptimizedRange = useCallback(() => {
    setDisplayOptions(prev => ({ ...prev, useOptimizedRange: !prev.useOptimizedRange }));
  }, []);

  const toggleFretMarkers = useCallback(() => {
    setDisplayOptions(prev => ({ ...prev, showFretMarkers: !prev.showFretMarkers }));
  }, []);

  const toggleStringLabels = useCallback(() => {
    setDisplayOptions(prev => ({ ...prev, showStringLabels: !prev.showStringLabels }));
  }, []);

  const toggleAnimations = useCallback(() => {
    setDisplayOptions(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }));
  }, []);

  const setColorIntensity = useCallback((intensity: number) => {
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    setDisplayOptions(prev => ({ ...prev, colorIntensity: clampedIntensity }));
  }, []);

  // Interaction handlers
  const handlePositionHover = useCallback((string: number, fret: number) => {
    setHoveredPosition({ string, fret });
  }, []);

  const handlePositionLeave = useCallback(() => {
    setHoveredPosition(null);
  }, []);

  const handlePositionClick = useCallback((string: number, fret: number) => {
    setSelectedPositions(prev => {
      const positionKey = `${string}-${fret}`;
      const exists = prev.some(pos => `${pos.string}-${pos.fret}` === positionKey);

      if (exists) {
        // Remove position
        return prev.filter(pos => `${pos.string}-${pos.fret}` !== positionKey);
      } else {
        // Add position
        return [...prev, { string, fret }];
      }
    });
  }, []);

  const clearSelectedPositions = useCallback(() => {
    setSelectedPositions([]);
  }, []);

  const selectAllRootPositions = useCallback(() => {
    if (!modesLogic.modePattern) return;

    const rootPositions = modesLogic.modePattern.positions
      .filter(pos => pos.isRoot)
      .map(pos => ({ string: pos.string, fret: pos.fret }));

    setSelectedPositions(rootPositions);
  }, [modesLogic.modePattern]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(2.0, prev + 0.1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1.0);
  }, []);

  // Focus mode controls
  const enterFocusMode = useCallback(() => {
    setFocusMode(true);
  }, []);

  const exitFocusMode = useCallback(() => {
    setFocusMode(false);
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
  }, []);

  // Computed display properties
  const effectiveFretRange = useMemo(() => {
    if (displayOptions.useOptimizedRange && modesLogic.displayRange) {
      // Convert displayRange format to fretRange format
      return {
        start: modesLogic.displayRange.startFret,
        end: modesLogic.displayRange.endFret
      };
    }
    return displayOptions.fretRange;
  }, [displayOptions.useOptimizedRange, displayOptions.fretRange, modesLogic.displayRange]);

  const visiblePositions = useMemo(() => {
    if (!modesLogic.displayPositions) return [];

    return modesLogic.displayPositions.filter(pos =>
      pos.fret >= effectiveFretRange.start && pos.fret <= effectiveFretRange.end
    );
  }, [modesLogic.displayPositions, effectiveFretRange]);

  const hoveredPositionInfo = useMemo(() => {
    if (!hoveredPosition || !modesLogic.hasPositionAt) return null;

    const position = modesLogic.getPositionAt(hoveredPosition.string, hoveredPosition.fret);
    if (!position) return null;

    return {
      position,
      isSelected: selectedPositions.some(
        sel => sel.string === hoveredPosition.string && sel.fret === hoveredPosition.fret
      )
    };
  }, [hoveredPosition, modesLogic, selectedPositions]);

  // Display style helpers
  const getPositionStyle = useCallback((position: DisplayModePosition) => {
    const baseOpacity = position.isRoot ? 1.0 : 0.8;
    const opacity = baseOpacity * displayOptions.colorIntensity;

    return {
      backgroundColor: position.color,
      opacity,
      transform: `scale(${position.isRoot ? 1.1 : 1.0})`,
      zIndex: position.zIndex,
      transition: displayOptions.enableAnimations ? 'all 0.2s ease' : 'none'
    };
  }, [displayOptions.colorIntensity, displayOptions.enableAnimations]);

  const shouldShowPosition = useCallback((string: number, fret: number) => {
    if (!modesLogic.hasPositionAt) return false;

    const hasPosition = modesLogic.hasPositionAt(string, fret);
    const inRange = fret >= effectiveFretRange.start && fret <= effectiveFretRange.end;

    return hasPosition && inRange;
  }, [modesLogic, effectiveFretRange]);

  // Reset display state
  const resetDisplayState = useCallback(() => {
    setDisplayOptions({ ...DEFAULT_DISPLAY_OPTIONS });
    setHoveredPosition(null);
    setSelectedPositions([]);
    setFocusMode(false);
    setZoomLevel(1.0);
  }, []);

  return {
    // Display state
    displayState,
    displayOptions,

    // Display options setters
    setNoteNamingContext,
    toggleScaleDegrees,
    toggleIntervals,
    setFretRange,
    toggleOptimizedRange,
    toggleFretMarkers,
    toggleStringLabels,
    toggleAnimations,
    setColorIntensity,

    // Interaction handlers
    handlePositionHover,
    handlePositionLeave,
    handlePositionClick,
    clearSelectedPositions,
    selectAllRootPositions,

    // Focus and zoom
    enterFocusMode,
    exitFocusMode,
    toggleFocusMode,
    zoomIn,
    zoomOut,
    resetZoom,

    // Computed properties
    effectiveFretRange,
    visiblePositions,
    hoveredPositionInfo,

    // Helper functions
    getPositionStyle,
    shouldShowPosition,
    resetDisplayState,

    // State queries
    get isHovering() {
      return hoveredPosition !== null;
    },

    get hasSelections() {
      return selectedPositions.length > 0;
    },

    get selectionCount() {
      return selectedPositions.length;
    },

    get visiblePositionCount() {
      return visiblePositions.length;
    },

    get fretSpan() {
      return effectiveFretRange.end - effectiveFretRange.start + 1;
    }
  };
}

/**
 * Hook return type for external use
 */
export type UseModesDisplayReturn = ReturnType<typeof useModesDisplay>;