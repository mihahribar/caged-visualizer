/**
 * Master hook for the modes system
 * Combines all individual hooks into a single, cohesive interface
 */

import { useMemo } from 'react';
import type { ModeState } from '../types';
import { useModesState } from './useModesState';
import { useModesLogic, type ModesLogicOptions } from './useModesLogic';
import { useModesNavigation, type ModesNavigationOptions } from './useModesNavigation';
import { useModesDisplay, type ModesDisplayOptions } from './useModesDisplay';
import { useModesKeyboard, type KeyboardNavigationOptions } from './useModesKeyboard';
import { useModesStorage, type StorageOptions } from './useModesStorage';

/**
 * Configuration options for the master modes hook
 */
export interface ModesHookOptions {
  /** Initial mode state */
  initialState?: Partial<ModeState>;
  /** Logic calculation options */
  logic?: ModesLogicOptions;
  /** Navigation behavior options */
  navigation?: ModesNavigationOptions;
  /** Display configuration options */
  display?: Partial<ModesDisplayOptions>;
  /** Keyboard navigation options */
  keyboard?: KeyboardNavigationOptions;
  /** Storage persistence options */
  storage?: StorageOptions;
}

/**
 * Master modes system hook
 *
 * This hook provides a complete interface to the modes system by combining
 * all individual hooks into a single, easy-to-use interface.
 *
 * @example
 * ```tsx
 * function ModesComponent() {
 *   const modes = useModes({
 *     initialState: { currentMode: 'dorian', showNoteNames: true },
 *     keyboard: { enabled: true },
 *     storage: { autoSave: true }
 *   });
 *
 *   return (
 *     <div ref={modes.keyboard.componentRef} tabIndex={0}>
 *       <h2>{modes.currentModeData.displayName}</h2>
 *       <button onClick={modes.navigation.nextMode}>Next Mode</button>
 *       {modes.logic.displayPositions.map(...)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useModes(options: ModesHookOptions = {}) {
  const {
    initialState,
    logic: logicOptions = {},
    navigation: navigationOptions = {},
    display: displayOptions = {},
    keyboard: keyboardOptions = {},
    storage: storageOptions = {}
  } = options;

  // Initialize core state management
  const modesState = useModesState(initialState);

  // Initialize logic and calculations
  const modesLogic = useModesLogic(modesState, logicOptions);

  // Initialize navigation
  const modesNavigation = useModesNavigation(modesState, navigationOptions);

  // Initialize display management
  const modesDisplay = useModesDisplay(modesState, modesLogic, displayOptions);

  // Initialize keyboard navigation
  const modesKeyboard = useModesKeyboard(
    modesState,
    modesNavigation,
    modesDisplay,
    keyboardOptions
  );

  // Initialize storage persistence
  const modesStorage = useModesStorage(modesState, modesDisplay, storageOptions);

  // Combined interface with organized sections
  const combinedInterface = useMemo(() => ({
    // Current state and computed values
    currentMode: modesState.modeState.currentMode,
    currentRootNote: modesState.currentRootNote,
    currentModeData: modesLogic.currentModeData,
    modePattern: modesLogic.modePattern,
    isLoading: modesState.isLoading,

    // Core state management
    state: {
      // State values
      modeState: modesState.modeState,
      systemState: modesState.systemState,

      // State actions
      setMode: modesState.setMode,
      setRootNote: modesState.setRootNote,
      setRootPosition: modesState.setRootPosition,
      toggleNoteNames: modesState.toggleNoteNames,
      toggleHighlightRoot: modesState.toggleHighlightRoot,
      resetState: modesState.resetState,

      // State queries
      getCurrentMode: modesState.getCurrentMode,
      getCurrentRootNote: modesState.getCurrentRootNote,
      getCurrentRootPosition: modesState.getCurrentRootPosition,
      getShowNoteNames: modesState.getShowNoteNames,
      getHighlightRoot: modesState.getHighlightRoot
    },

    // Logic and calculations
    logic: {
      // Computed data
      modePattern: modesLogic.modePattern,
      modeInfo: modesLogic.modeInfo,
      displayPositions: modesLogic.displayPositions,
      fretboardPositions: modesLogic.fretboardPositions,
      rootPositions: modesLogic.rootPositions,
      displayRange: modesLogic.displayRange,
      statistics: modesLogic.statistics,

      // Helper functions
      getPositionsInRange: modesLogic.getPositionsInRange,
      getPositionsOnString: modesLogic.getPositionsOnString,
      getPositionAt: modesLogic.getPositionAt,
      hasPositionAt: modesLogic.hasPositionAt,
      isRootPosition: modesLogic.isRootPosition,

      // Status flags
      isCalculating: modesLogic.isCalculating,
      hasPattern: modesLogic.hasPattern,

      // Computed properties
      patternLength: modesLogic.patternLength,
      rootCount: modesLogic.rootCount,
      modeColor: modesLogic.modeColor,
      modeDisplayName: modesLogic.modeDisplayName,
      modeDescription: modesLogic.modeDescription
    },

    // Navigation and sequencing
    navigation: {
      // Basic navigation
      navigateToMode: modesNavigation.navigateToMode,
      navigateToModeIndex: modesNavigation.navigateToModeIndex,
      navigateToRootNote: modesNavigation.navigateToRootNote,
      navigateToRootIndex: modesNavigation.navigateToRootIndex,

      // Sequential navigation
      nextMode: modesNavigation.nextMode,
      previousMode: modesNavigation.previousMode,
      nextRootPosition: modesNavigation.nextRootPosition,
      previousRootPosition: modesNavigation.previousRootPosition,

      // Quick access
      goToTraditionalRoot: modesNavigation.goToTraditionalRoot,
      goToFirstMode: modesNavigation.goToFirstMode,
      goToLastMode: modesNavigation.goToLastMode,
      goToC: modesNavigation.goToC,

      // State queries
      canGoNext: modesNavigation.canGoNext,
      canGoPrevious: modesNavigation.canGoPrevious,
      canGoNextRoot: modesNavigation.canGoNextRoot,
      canGoPreviousRoot: modesNavigation.canGoPreviousRoot,

      // Progress info
      modeProgress: modesNavigation.modeProgress,
      rootProgress: modesNavigation.rootProgress,

      // Context
      navigationContext: modesNavigation.navigationContext,

      // Previews
      nextModePreview: modesNavigation.nextModePreview,
      previousModePreview: modesNavigation.previousModePreview,
      nextRootPreview: modesNavigation.nextRootPreview,
      previousRootPreview: modesNavigation.previousRootPreview
    },

    // Display and visual state
    display: {
      // Display state
      displayState: modesDisplay.displayState,
      displayOptions: modesDisplay.displayOptions,

      // Display controls
      setNoteNamingContext: modesDisplay.setNoteNamingContext,
      toggleScaleDegrees: modesDisplay.toggleScaleDegrees,
      toggleIntervals: modesDisplay.toggleIntervals,
      setFretRange: modesDisplay.setFretRange,
      toggleOptimizedRange: modesDisplay.toggleOptimizedRange,
      toggleFretMarkers: modesDisplay.toggleFretMarkers,
      toggleStringLabels: modesDisplay.toggleStringLabels,
      toggleAnimations: modesDisplay.toggleAnimations,
      setColorIntensity: modesDisplay.setColorIntensity,

      // Interaction handlers
      handlePositionHover: modesDisplay.handlePositionHover,
      handlePositionLeave: modesDisplay.handlePositionLeave,
      handlePositionClick: modesDisplay.handlePositionClick,
      clearSelectedPositions: modesDisplay.clearSelectedPositions,
      selectAllRootPositions: modesDisplay.selectAllRootPositions,

      // Focus and zoom
      enterFocusMode: modesDisplay.enterFocusMode,
      exitFocusMode: modesDisplay.exitFocusMode,
      toggleFocusMode: modesDisplay.toggleFocusMode,
      zoomIn: modesDisplay.zoomIn,
      zoomOut: modesDisplay.zoomOut,
      resetZoom: modesDisplay.resetZoom,

      // Computed properties
      effectiveFretRange: modesDisplay.effectiveFretRange,
      visiblePositions: modesDisplay.visiblePositions,
      hoveredPositionInfo: modesDisplay.hoveredPositionInfo,

      // Helper functions
      getPositionStyle: modesDisplay.getPositionStyle,
      shouldShowPosition: modesDisplay.shouldShowPosition,
      resetDisplayState: modesDisplay.resetDisplayState,

      // State queries
      isHovering: modesDisplay.isHovering,
      hasSelections: modesDisplay.hasSelections,
      selectionCount: modesDisplay.selectionCount,
      visiblePositionCount: modesDisplay.visiblePositionCount,
      fretSpan: modesDisplay.fretSpan
    },

    // Keyboard navigation
    keyboard: {
      // Component integration
      componentRef: modesKeyboard.componentRef,

      // State
      enabled: modesKeyboard.enabled,
      isFocused: modesKeyboard.isFocused,
      requireFocus: modesKeyboard.requireFocus,

      // Focus handlers
      handleFocus: modesKeyboard.handleFocus,
      handleBlur: modesKeyboard.handleBlur,

      // Configuration
      effectiveMapping: modesKeyboard.effectiveMapping,
      keyboardHelp: modesKeyboard.keyboardHelp,

      // Manual triggers
      triggerNextMode: modesKeyboard.triggerNextMode,
      triggerPreviousMode: modesKeyboard.triggerPreviousMode,
      triggerNextRoot: modesKeyboard.triggerNextRoot,
      triggerPreviousRoot: modesKeyboard.triggerPreviousRoot,

      // State queries
      isKeyboardActive: modesKeyboard.isKeyboardActive,
      hasCustomMappings: modesKeyboard.hasCustomMappings
    },

    // Storage and persistence
    storage: {
      // Storage state
      storedModeState: modesStorage.storedModeState,
      storedDisplayOptions: modesStorage.storedDisplayOptions,
      storedUserPreferences: modesStorage.storedUserPreferences,
      storedSessionData: modesStorage.storedSessionData,

      // Save functions
      saveModeState: modesStorage.saveModeState,
      saveDisplayOptions: modesStorage.saveDisplayOptions,
      saveUserPreferences: modesStorage.saveUserPreferences,
      saveSessionData: modesStorage.saveSessionData,

      // Load functions
      loadModeState: modesStorage.loadModeState,
      loadDisplayOptions: modesStorage.loadDisplayOptions,
      loadUserPreferences: modesStorage.loadUserPreferences,
      loadSessionData: modesStorage.loadSessionData,

      // Clear functions
      clearModeState: modesStorage.clearModeState,
      clearDisplayOptions: modesStorage.clearDisplayOptions,
      clearUserPreferences: modesStorage.clearUserPreferences,
      clearSessionData: modesStorage.clearSessionData,
      clearAllData: modesStorage.clearAllData,

      // Export/Import
      exportState: modesStorage.exportState,
      importState: modesStorage.importState,

      // Storage status
      hasStoredData: modesStorage.hasStoredData,
      hasSessionData: modesStorage.hasSessionData,
      storageKeys: modesStorage.storageKeys,

      // Configuration
      autoSave: modesStorage.autoSave,
      autoRestore: modesStorage.autoRestore,
      version: modesStorage.version
    }
  }), [
    modesState,
    modesLogic,
    modesNavigation,
    modesDisplay,
    modesKeyboard,
    modesStorage
  ]);

  return combinedInterface;
}

/**
 * Hook return type for external use
 */
export type UseModesReturn = ReturnType<typeof useModes>;