/**
 * Validation utilities for state management hooks
 * Helps verify that our React hooks are working correctly
 */

import type { ModeState, ModesSystemState } from '../types';
import { ALL_MODES } from '../constants';
import { CHROMATIC_NOTES } from '../utils/musicTheory';

/**
 * Validate that a mode state is valid
 */
export function validateModeState(state: ModeState): boolean {
  console.log('🔍 Validating mode state...');

  // Check current mode is valid
  if (!ALL_MODES.includes(state.currentMode)) {
    console.error(`❌ Invalid mode: ${state.currentMode}`);
    return false;
  }

  // Check root position is within valid range
  if (state.rootPosition < 0 || state.rootPosition > 11) {
    console.error(`❌ Invalid root position: ${state.rootPosition}`);
    return false;
  }

  // Check boolean flags are actually booleans
  if (typeof state.showNoteNames !== 'boolean') {
    console.error(`❌ showNoteNames must be boolean, got ${typeof state.showNoteNames}`);
    return false;
  }

  if (typeof state.highlightRoot !== 'boolean') {
    console.error(`❌ highlightRoot must be boolean, got ${typeof state.highlightRoot}`);
    return false;
  }

  console.log('✅ Mode state is valid');
  return true;
}

/**
 * Validate that a system state is valid
 */
export function validateSystemState(state: ModesSystemState): boolean {
  console.log('🔍 Validating system state...');

  // Check mode state is valid
  if (!validateModeState(state.mode)) {
    return false;
  }

  // Check loading flag
  if (typeof state.isLoading !== 'boolean') {
    console.error(`❌ isLoading must be boolean, got ${typeof state.isLoading}`);
    return false;
  }

  // Check pattern validity if present
  if (state.pattern !== null) {
    if (!state.pattern.mode || !state.pattern.rootNote || !Array.isArray(state.pattern.positions)) {
      console.error('❌ Invalid pattern structure');
      return false;
    }

    if (!ALL_MODES.includes(state.pattern.mode)) {
      console.error(`❌ Invalid pattern mode: ${state.pattern.mode}`);
      return false;
    }

    if (!CHROMATIC_NOTES.includes(state.pattern.rootNote)) {
      console.error(`❌ Invalid pattern root note: ${state.pattern.rootNote}`);
      return false;
    }
  }

  console.log('✅ System state is valid');
  return true;
}

/**
 * Validate state transitions
 */
export function validateStateTransition(
  fromState: ModeState,
  toState: ModeState,
  action: string
): boolean {
  console.log(`🔄 Validating transition: ${action}`);

  // Both states should be valid
  if (!validateModeState(fromState) || !validateModeState(toState)) {
    return false;
  }

  // Validate specific transition rules
  switch (action) {
    case 'SET_MODE':
      // Only mode should change
      if (fromState.rootPosition !== toState.rootPosition ||
          fromState.showNoteNames !== toState.showNoteNames ||
          fromState.highlightRoot !== toState.highlightRoot) {
        console.error('❌ SET_MODE should only change the mode');
        return false;
      }
      break;

    case 'SET_ROOT_POSITION':
      // Only root position should change
      if (fromState.currentMode !== toState.currentMode ||
          fromState.showNoteNames !== toState.showNoteNames ||
          fromState.highlightRoot !== toState.highlightRoot) {
        console.error('❌ SET_ROOT_POSITION should only change root position');
        return false;
      }
      break;

    case 'TOGGLE_NOTE_NAMES':
      // Only showNoteNames should change
      if (fromState.currentMode !== toState.currentMode ||
          fromState.rootPosition !== toState.rootPosition ||
          fromState.highlightRoot !== toState.highlightRoot) {
        console.error('❌ TOGGLE_NOTE_NAMES should only change showNoteNames');
        return false;
      }
      break;

    case 'TOGGLE_HIGHLIGHT_ROOT':
      // Only highlightRoot should change
      if (fromState.currentMode !== toState.currentMode ||
          fromState.rootPosition !== toState.rootPosition ||
          fromState.showNoteNames !== toState.showNoteNames) {
        console.error('❌ TOGGLE_HIGHLIGHT_ROOT should only change highlightRoot');
        return false;
      }
      break;
  }

  console.log('✅ State transition is valid');
  return true;
}

/**
 * Test state creation with default values
 */
export function testDefaultState(): boolean {
  console.log('🏁 Testing default state creation...');

  const defaultState: ModeState = {
    currentMode: 'ionian',
    rootPosition: 0,
    showNoteNames: true,
    highlightRoot: true
  };

  if (!validateModeState(defaultState)) {
    console.error('❌ Default state is invalid');
    return false;
  }

  console.log('✅ Default state is valid');
  return true;
}

/**
 * Test state with all possible mode values
 */
export function testAllModeStates(): boolean {
  console.log('🎵 Testing all mode states...');

  for (const mode of ALL_MODES) {
    const state: ModeState = {
      currentMode: mode,
      rootPosition: 0,
      showNoteNames: true,
      highlightRoot: true
    };

    if (!validateModeState(state)) {
      console.error(`❌ State invalid for mode: ${mode}`);
      return false;
    }
  }

  console.log('✅ All mode states are valid');
  return true;
}

/**
 * Test state with all chromatic positions
 */
export function testAllRootPositions(): boolean {
  console.log('🔄 Testing all root positions...');

  for (let position = 0; position < 12; position++) {
    const state: ModeState = {
      currentMode: 'ionian',
      rootPosition: position,
      showNoteNames: true,
      highlightRoot: true
    };

    if (!validateModeState(state)) {
      console.error(`❌ State invalid for root position: ${position}`);
      return false;
    }
  }

  console.log('✅ All root positions are valid');
  return true;
}

/**
 * Run all state validation tests
 */
export function runStateValidations(): boolean {
  console.log('🧪 Running state management validations...\n');

  const results = [
    testDefaultState(),
    testAllModeStates(),
    testAllRootPositions()
  ];

  const allPassed = results.every(result => result);
  console.log(`\n${allPassed ? '✅' : '❌'} State validation ${allPassed ? 'PASSED' : 'FAILED'}`);

  return allPassed;
}