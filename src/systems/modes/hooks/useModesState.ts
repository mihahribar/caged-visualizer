/**
 * Core state management hook for the modes system
 * Handles all state updates and provides actions for mode system
 */

import { useState, useCallback, useReducer } from 'react';
import type { ModeType, ChromaticNote, ModeState, ModesSystemState } from '../types';
import { DEFAULT_MODE_STATE, ALL_MODES } from '../constants';
import { CHROMATIC_NOTES } from '../utils/musicTheory';

/**
 * Actions for mode state management
 */
type ModeStateAction =
  | { type: 'SET_MODE'; payload: ModeType }
  | { type: 'SET_ROOT_POSITION'; payload: number }
  | { type: 'SET_ROOT_NOTE'; payload: ChromaticNote }
  | { type: 'TOGGLE_NOTE_NAMES' }
  | { type: 'TOGGLE_HIGHLIGHT_ROOT' }
  | { type: 'RESET_STATE' }
  | { type: 'SET_FULL_STATE'; payload: ModeState };

/**
 * Mode state reducer
 */
function modeStateReducer(state: ModeState, action: ModeStateAction): ModeState {
  switch (action.type) {
    case 'SET_MODE':
      if (!ALL_MODES.includes(action.payload)) {
        console.warn(`Invalid mode: ${action.payload}`);
        return state;
      }
      return {
        ...state,
        currentMode: action.payload
      };

    case 'SET_ROOT_POSITION':
      if (action.payload < 0 || action.payload > 11) {
        console.warn(`Invalid root position: ${action.payload}`);
        return state;
      }
      return {
        ...state,
        rootPosition: action.payload
      };

    case 'SET_ROOT_NOTE': {
      if (!CHROMATIC_NOTES.includes(action.payload)) {
        console.warn(`Invalid root note: ${action.payload}`);
        return state;
      }
      const rootPosition = CHROMATIC_NOTES.indexOf(action.payload);
      return {
        ...state,
        rootPosition
      };
    }

    case 'TOGGLE_NOTE_NAMES':
      return {
        ...state,
        showNoteNames: !state.showNoteNames
      };

    case 'TOGGLE_HIGHLIGHT_ROOT':
      return {
        ...state,
        highlightRoot: !state.highlightRoot
      };

    case 'RESET_STATE':
      return { ...DEFAULT_MODE_STATE };

    case 'SET_FULL_STATE':
      // Validate the incoming state
      if (!ALL_MODES.includes(action.payload.currentMode) ||
          action.payload.rootPosition < 0 || action.payload.rootPosition > 11) {
        console.warn('Invalid state payload, ignoring');
        return state;
      }
      return { ...action.payload };

    default:
      return state;
  }
}

/**
 * Core modes state management hook
 */
export function useModesState(initialState?: Partial<ModeState>) {
  // Merge initial state with defaults
  const mergedInitialState: ModeState = {
    ...DEFAULT_MODE_STATE,
    ...initialState
  };

  // Use reducer for state management
  const [modeState, dispatch] = useReducer(modeStateReducer, mergedInitialState);

  // System-level state
  const [isLoading, setIsLoading] = useState(false);

  // Action creators
  const setMode = useCallback((mode: ModeType) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const setRootPosition = useCallback((position: number) => {
    dispatch({ type: 'SET_ROOT_POSITION', payload: position });
  }, []);

  const setRootNote = useCallback((note: ChromaticNote) => {
    dispatch({ type: 'SET_ROOT_NOTE', payload: note });
  }, []);

  const toggleNoteNames = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTE_NAMES' });
  }, []);

  const toggleHighlightRoot = useCallback(() => {
    dispatch({ type: 'TOGGLE_HIGHLIGHT_ROOT' });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const setFullState = useCallback((state: ModeState) => {
    dispatch({ type: 'SET_FULL_STATE', payload: state });
  }, []);

  // Derived state
  const currentRootNote = CHROMATIC_NOTES[modeState.rootPosition];

  // Navigation helpers
  const nextMode = useCallback(() => {
    const currentIndex = ALL_MODES.indexOf(modeState.currentMode);
    const nextIndex = (currentIndex + 1) % ALL_MODES.length;
    setMode(ALL_MODES[nextIndex]);
  }, [modeState.currentMode, setMode]);

  const previousMode = useCallback(() => {
    const currentIndex = ALL_MODES.indexOf(modeState.currentMode);
    const prevIndex = (currentIndex - 1 + ALL_MODES.length) % ALL_MODES.length;
    setMode(ALL_MODES[prevIndex]);
  }, [modeState.currentMode, setMode]);

  const nextRootPosition = useCallback(() => {
    const nextPos = (modeState.rootPosition + 1) % 12;
    setRootPosition(nextPos);
  }, [modeState.rootPosition, setRootPosition]);

  const previousRootPosition = useCallback(() => {
    const prevPos = (modeState.rootPosition - 1 + 12) % 12;
    setRootPosition(prevPos);
  }, [modeState.rootPosition, setRootPosition]);

  // Complete system state
  const systemState: ModesSystemState = {
    mode: modeState,
    pattern: null, // Will be set by useModesLogic
    isLoading
  };

  return {
    // State
    modeState,
    systemState,
    currentRootNote,
    isLoading,

    // Basic actions
    setMode,
    setRootPosition,
    setRootNote,
    toggleNoteNames,
    toggleHighlightRoot,
    resetState,
    setFullState,

    // Navigation actions
    nextMode,
    previousMode,
    nextRootPosition,
    previousRootPosition,

    // System actions
    setIsLoading,

    // Getters
    getCurrentMode: () => modeState.currentMode,
    getCurrentRootNote: () => currentRootNote,
    getCurrentRootPosition: () => modeState.rootPosition,
    getShowNoteNames: () => modeState.showNoteNames,
    getHighlightRoot: () => modeState.highlightRoot
  };
}

/**
 * Hook return type for external use
 */
export type UseModesStateReturn = ReturnType<typeof useModesState>;