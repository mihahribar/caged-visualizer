/**
 * Logic hook for the modes system
 * Handles pattern calculations and provides computed values
 */

import { useMemo } from 'react';
import type { ModePosition } from '../types';
import type { UseModesStateReturn } from './useModesState';
import {
  calculateModePattern,
  getModeInfo,
  getModePositionsForDisplay,
  getRootPositionsForDisplay,
  createDisplayPositions,
  getOptimalDisplayRange,
  analyzeModeStructure,
  getModeIntervalInfo
} from '../utils';
import { MODE_DATA } from '../constants';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';

/**
 * Options for mode calculation
 */
export interface ModesLogicOptions {
  /** Maximum number of frets to calculate */
  maxFrets?: number;
  /** Whether to optimize for display performance */
  optimizeForDisplay?: boolean;
  /** Whether to include advanced analysis */
  includeAnalysis?: boolean;
}

/**
 * Hook for modes calculation logic
 */
export function useModesLogic(
  modesState: UseModesStateReturn,
  options: ModesLogicOptions = {}
) {
  const {
    maxFrets = FRETBOARD_CONSTANTS.MAX_FRET,
    optimizeForDisplay = true,
    includeAnalysis = false
  } = options;

  const { modeState, currentRootNote, setIsLoading } = modesState;

  // Core pattern calculation (memoized for performance)
  const modePattern = useMemo(() => {
    try {
      setIsLoading(true);
      const pattern = calculateModePattern(
        modeState.currentMode,
        currentRootNote,
        maxFrets
      );
      setIsLoading(false);
      return pattern;
    } catch (error) {
      console.error('Error calculating mode pattern:', error);
      setIsLoading(false);
      return null;
    }
  }, [modeState.currentMode, currentRootNote, maxFrets, setIsLoading]);

  // Mode information (memoized)
  const modeInfo = useMemo(() => {
    if (!modePattern) return null;

    return getModeInfo(modeState.currentMode, currentRootNote);
  }, [modeState.currentMode, currentRootNote, modePattern]);

  // Display positions (memoized)
  const displayPositions = useMemo(() => {
    if (!modePattern) return [];

    const modeData = MODE_DATA[modeState.currentMode];

    return createDisplayPositions(modePattern, {
      highlightRoots: modeState.highlightRoot,
      showNoteNames: modeState.showNoteNames,
      showScaleDegrees: false, // Can be made configurable later
      modeColor: modeData.color
    });
  }, [
    modePattern,
    modeState.currentMode,
    modeState.highlightRoot,
    modeState.showNoteNames
  ]);

  // Fretboard display positions (for shared components)
  const fretboardPositions = useMemo(() => {
    if (!modePattern) return [];

    return getModePositionsForDisplay(modeState.currentMode, currentRootNote);
  }, [modeState.currentMode, currentRootNote, modePattern]);

  // Root positions for display
  const rootPositions = useMemo(() => {
    if (!modePattern) return [];

    return getRootPositionsForDisplay(modeState.currentMode, currentRootNote);
  }, [modeState.currentMode, currentRootNote, modePattern]);

  // Optimal display range
  const displayRange = useMemo(() => {
    if (!optimizeForDisplay || !modePattern) {
      return { startFret: 0, endFret: maxFrets };
    }

    return getOptimalDisplayRange(modeState.currentMode, currentRootNote);
  }, [modeState.currentMode, currentRootNote, optimizeForDisplay, maxFrets, modePattern]);

  // Mode analysis (expensive, only when requested)
  const modeAnalysis = useMemo(() => {
    if (!includeAnalysis || !modePattern) return null;

    return {
      structure: analyzeModeStructure(modeState.currentMode),
      intervals: getModeIntervalInfo(modeState.currentMode),
      totalPositions: modePattern.positions.length,
      rootCount: modePattern.positions.filter(pos => pos.isRoot).length
    };
  }, [modeState.currentMode, includeAnalysis, modePattern]);

  // Current mode data
  const currentModeData = useMemo(() => {
    return MODE_DATA[modeState.currentMode];
  }, [modeState.currentMode]);

  // Position filtering helpers
  const getPositionsInRange = useMemo(() => {
    return (startFret: number, endFret: number): ModePosition[] => {
      if (!modePattern) return [];

      return modePattern.positions.filter(
        pos => pos.fret >= startFret && pos.fret <= endFret
      );
    };
  }, [modePattern]);

  const getPositionsOnString = useMemo(() => {
    return (stringIndex: number): ModePosition[] => {
      if (!modePattern) return [];

      return modePattern.positions.filter(pos => pos.string === stringIndex);
    };
  }, [modePattern]);

  // Position lookup helpers
  const getPositionAt = useMemo(() => {
    return (stringIndex: number, fretNumber: number): ModePosition | null => {
      if (!modePattern) return null;

      return modePattern.positions.find(
        pos => pos.string === stringIndex && pos.fret === fretNumber
      ) || null;
    };
  }, [modePattern]);

  const hasPositionAt = useMemo(() => {
    return (stringIndex: number, fretNumber: number): boolean => {
      return getPositionAt(stringIndex, fretNumber) !== null;
    };
  }, [getPositionAt]);

  // Position type helpers
  const isRootPosition = useMemo(() => {
    return (stringIndex: number, fretNumber: number): boolean => {
      const position = getPositionAt(stringIndex, fretNumber);
      return position?.isRoot || false;
    };
  }, [getPositionAt]);

  // Statistics
  const statistics = useMemo(() => {
    if (!modePattern || !modeInfo) {
      return {
        totalPositions: 0,
        rootPositions: 0,
        averagePositionsPerString: 0,
        fretSpan: 0
      };
    }

    const positions = modePattern.positions;
    const frets = positions.map(pos => pos.fret);
    const minFret = Math.min(...frets);
    const maxFret = Math.max(...frets);

    return {
      totalPositions: positions.length,
      rootPositions: modeInfo.rootCount,
      averagePositionsPerString: Math.round(positions.length / 6 * 10) / 10,
      fretSpan: maxFret - minFret + 1
    };
  }, [modePattern, modeInfo]);

  return {
    // Core data
    modePattern,
    modeInfo,
    currentModeData,

    // Display data
    displayPositions,
    fretboardPositions,
    rootPositions,
    displayRange,

    // Analysis (optional)
    modeAnalysis,
    statistics,

    // Helper functions
    getPositionsInRange,
    getPositionsOnString,
    getPositionAt,
    hasPositionAt,
    isRootPosition,

    // State flags
    isCalculating: modesState.isLoading,
    hasPattern: modePattern !== null,

    // Computed properties
    get patternLength() {
      return modePattern?.positions.length || 0;
    },

    get rootCount() {
      return modeInfo?.rootCount || 0;
    },

    get modeColor() {
      return currentModeData.color;
    },

    get modeDisplayName() {
      return currentModeData.displayName;
    },

    get modeDescription() {
      return currentModeData.description;
    }
  };
}

/**
 * Hook return type for external use
 */
export type UseModesLogicReturn = ReturnType<typeof useModesLogic>;