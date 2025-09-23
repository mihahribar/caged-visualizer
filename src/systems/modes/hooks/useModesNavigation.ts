/**
 * Navigation hook for the modes system
 * Handles mode switching, root note navigation, and sequence management
 */

import { useCallback, useMemo } from 'react';
import type { ModeType, ChromaticNote } from '../types';
import type { UseModesStateReturn } from './useModesState';
import { ALL_MODES, MODE_ROOT_NOTES } from '../constants';
import { CHROMATIC_NOTES } from '../utils/musicTheory';

/**
 * Navigation options
 */
export interface ModesNavigationOptions {
  /** Whether to wrap around when reaching end of sequences */
  wrapAround?: boolean;
  /** Whether to include transition animations */
  enableTransitions?: boolean;
  /** Custom transition delay in milliseconds */
  transitionDelay?: number;
}

/**
 * Navigation hook for modes system
 */
export function useModesNavigation(
  modesState: UseModesStateReturn,
  options: ModesNavigationOptions = {}
) {
  const {
    wrapAround = true,
    enableTransitions = true,
    transitionDelay = 300
  } = options;

  const {
    modeState,
    currentRootNote,
    setMode,
    setRootNote,
    setRootPosition,
    nextMode,
    previousMode,
    nextRootPosition,
    previousRootPosition
  } = modesState;

  // Current indices for navigation
  const currentModeIndex = useMemo(() => {
    return ALL_MODES.indexOf(modeState.currentMode);
  }, [modeState.currentMode]);

  const currentRootIndex = useMemo(() => {
    return CHROMATIC_NOTES.indexOf(currentRootNote);
  }, [currentRootNote]);

  // Mode navigation with bounds checking
  const navigateToMode = useCallback((targetMode: ModeType) => {
    if (!ALL_MODES.includes(targetMode)) {
      console.warn(`Invalid mode: ${targetMode}`);
      return false;
    }

    setMode(targetMode);
    return true;
  }, [setMode]);

  const navigateToModeIndex = useCallback((index: number) => {
    if (index < 0 || index >= ALL_MODES.length) {
      if (wrapAround) {
        const wrappedIndex = ((index % ALL_MODES.length) + ALL_MODES.length) % ALL_MODES.length;
        setMode(ALL_MODES[wrappedIndex]);
        return true;
      } else {
        console.warn(`Mode index out of bounds: ${index}`);
        return false;
      }
    }

    setMode(ALL_MODES[index]);
    return true;
  }, [setMode, wrapAround]);

  // Root note navigation
  const navigateToRootNote = useCallback((targetRoot: ChromaticNote) => {
    if (!CHROMATIC_NOTES.includes(targetRoot)) {
      console.warn(`Invalid root note: ${targetRoot}`);
      return false;
    }

    setRootNote(targetRoot);
    return true;
  }, [setRootNote]);

  const navigateToRootIndex = useCallback((index: number) => {
    if (index < 0 || index >= CHROMATIC_NOTES.length) {
      if (wrapAround) {
        const wrappedIndex = ((index % 12) + 12) % 12;
        setRootPosition(wrappedIndex);
        return true;
      } else {
        console.warn(`Root index out of bounds: ${index}`);
        return false;
      }
    }

    setRootPosition(index);
    return true;
  }, [setRootPosition, wrapAround]);

  // Enhanced navigation with animation support
  const nextModeWithTransition = useCallback(async () => {
    if (enableTransitions) {
      // Optional: trigger transition state
      await new Promise(resolve => setTimeout(resolve, transitionDelay));
    }
    nextMode();
  }, [nextMode, enableTransitions, transitionDelay]);

  const previousModeWithTransition = useCallback(async () => {
    if (enableTransitions) {
      await new Promise(resolve => setTimeout(resolve, transitionDelay));
    }
    previousMode();
  }, [previousMode, enableTransitions, transitionDelay]);

  // Jump navigation (skip modes)
  const jumpModes = useCallback((steps: number) => {
    const targetIndex = currentModeIndex + steps;
    return navigateToModeIndex(targetIndex);
  }, [currentModeIndex, navigateToModeIndex]);

  const jumpRootPositions = useCallback((steps: number) => {
    const targetIndex = currentRootIndex + steps;
    return navigateToRootIndex(targetIndex);
  }, [currentRootIndex, navigateToRootIndex]);

  // Quick access to traditional mode roots (based on C major scale)
  const goToTraditionalRoot = useCallback(() => {
    const traditionalRoot = MODE_ROOT_NOTES[modeState.currentMode];
    return navigateToRootNote(traditionalRoot);
  }, [modeState.currentMode, navigateToRootNote]);

  // Mode sequence navigation
  const goToFirstMode = useCallback(() => {
    return navigateToMode(ALL_MODES[0]);
  }, [navigateToMode]);

  const goToLastMode = useCallback(() => {
    return navigateToMode(ALL_MODES[ALL_MODES.length - 1]);
  }, [navigateToMode]);

  // Root sequence navigation
  const goToC = useCallback(() => {
    return navigateToRootNote('C');
  }, [navigateToRootNote]);

  const goToFirstRoot = useCallback(() => {
    return navigateToRootNote(CHROMATIC_NOTES[0]);
  }, [navigateToRootNote]);

  // Navigation state queries
  const canGoNext = useMemo(() => {
    return wrapAround || currentModeIndex < ALL_MODES.length - 1;
  }, [currentModeIndex, wrapAround]);

  const canGoPrevious = useMemo(() => {
    return wrapAround || currentModeIndex > 0;
  }, [currentModeIndex, wrapAround]);

  const canGoNextRoot = useMemo(() => {
    return wrapAround || currentRootIndex < CHROMATIC_NOTES.length - 1;
  }, [currentRootIndex, wrapAround]);

  const canGoPreviousRoot = useMemo(() => {
    return wrapAround || currentRootIndex > 0;
  }, [currentRootIndex, wrapAround]);

  // Progress indicators
  const modeProgress = useMemo(() => {
    return {
      current: currentModeIndex + 1,
      total: ALL_MODES.length,
      percentage: Math.round(((currentModeIndex + 1) / ALL_MODES.length) * 100)
    };
  }, [currentModeIndex]);

  const rootProgress = useMemo(() => {
    return {
      current: currentRootIndex + 1,
      total: CHROMATIC_NOTES.length,
      percentage: Math.round(((currentRootIndex + 1) / CHROMATIC_NOTES.length) * 100)
    };
  }, [currentRootIndex]);

  // Navigation context for components
  const navigationContext = useMemo(() => {
    return {
      currentMode: modeState.currentMode,
      currentRootNote,
      currentModeIndex,
      currentRootIndex,
      canGoNext,
      canGoPrevious,
      canGoNextRoot,
      canGoPreviousRoot,
      modeProgress,
      rootProgress,
      allModes: ALL_MODES,
      allRootNotes: CHROMATIC_NOTES,
      traditionalRoot: MODE_ROOT_NOTES[modeState.currentMode]
    };
  }, [
    modeState.currentMode,
    currentRootNote,
    currentModeIndex,
    currentRootIndex,
    canGoNext,
    canGoPrevious,
    canGoNextRoot,
    canGoPreviousRoot,
    modeProgress,
    rootProgress
  ]);

  return {
    // Basic navigation
    navigateToMode,
    navigateToModeIndex,
    navigateToRootNote,
    navigateToRootIndex,

    // Sequential navigation
    nextMode,
    previousMode,
    nextRootPosition,
    previousRootPosition,

    // Enhanced navigation
    nextModeWithTransition,
    previousModeWithTransition,

    // Jump navigation
    jumpModes,
    jumpRootPositions,

    // Quick access
    goToTraditionalRoot,
    goToFirstMode,
    goToLastMode,
    goToC,
    goToFirstRoot,

    // State queries
    canGoNext,
    canGoPrevious,
    canGoNextRoot,
    canGoPreviousRoot,

    // Progress info
    modeProgress,
    rootProgress,

    // Context data
    navigationContext,

    // Current state
    currentModeIndex,
    currentRootIndex,

    // Helper getters
    get isFirstMode() {
      return currentModeIndex === 0;
    },

    get isLastMode() {
      return currentModeIndex === ALL_MODES.length - 1;
    },

    get isFirstRoot() {
      return currentRootIndex === 0;
    },

    get isLastRoot() {
      return currentRootIndex === CHROMATIC_NOTES.length - 1;
    },

    get nextModePreview() {
      const nextIndex = (currentModeIndex + 1) % ALL_MODES.length;
      return ALL_MODES[nextIndex];
    },

    get previousModePreview() {
      const prevIndex = (currentModeIndex - 1 + ALL_MODES.length) % ALL_MODES.length;
      return ALL_MODES[prevIndex];
    },

    get nextRootPreview() {
      const nextIndex = (currentRootIndex + 1) % 12;
      return CHROMATIC_NOTES[nextIndex];
    },

    get previousRootPreview() {
      const prevIndex = (currentRootIndex - 1 + 12) % 12;
      return CHROMATIC_NOTES[prevIndex];
    }
  };
}

/**
 * Hook return type for external use
 */
export type UseModesNavigationReturn = ReturnType<typeof useModesNavigation>;