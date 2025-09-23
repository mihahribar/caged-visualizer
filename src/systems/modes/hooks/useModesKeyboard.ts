/**
 * Keyboard navigation hook for the modes system
 * Provides keyboard shortcuts and navigation controls
 */

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import type { UseModesNavigationReturn } from './useModesNavigation';
import type { UseModesStateReturn } from './useModesState';
import type { UseModesDisplayReturn } from './useModesDisplay';

/**
 * Keyboard mapping configuration
 */
export interface KeyboardMapping {
  // Mode navigation
  nextMode: string[];
  previousMode: string[];
  jumpToFirstMode: string[];
  jumpToLastMode: string[];

  // Root navigation
  nextRoot: string[];
  previousRoot: string[];
  jumpToC: string[];
  traditionalRoot: string[];

  // Display toggles
  toggleNoteNames: string[];
  toggleHighlightRoot: string[];
  toggleScaleDegrees: string[];
  toggleIntervals: string[];

  // Visual controls
  zoomIn: string[];
  zoomOut: string[];
  resetZoom: string[];
  toggleFocusMode: string[];

  // Quick mode access (1-7 for the 7 modes)
  modeShortcuts: Record<string, number>;
}

/**
 * Default keyboard mappings
 */
const DEFAULT_KEYBOARD_MAPPING: KeyboardMapping = {
  // Mode navigation
  nextMode: ['ArrowRight', 'l'],
  previousMode: ['ArrowLeft', 'h'],
  jumpToFirstMode: ['Home', 'g'],
  jumpToLastMode: ['End', 'G'],

  // Root navigation
  nextRoot: ['ArrowUp', 'k'],
  previousRoot: ['ArrowDown', 'j'],
  jumpToC: ['c'],
  traditionalRoot: ['t'],

  // Display toggles
  toggleNoteNames: ['n'],
  toggleHighlightRoot: ['r'],
  toggleScaleDegrees: ['d'],
  toggleIntervals: ['i'],

  // Visual controls
  zoomIn: ['+', '='],
  zoomOut: ['-', '_'],
  resetZoom: ['0'],
  toggleFocusMode: ['f'],

  // Quick mode access (1-7)
  modeShortcuts: {
    '1': 0, // Ionian
    '2': 1, // Dorian
    '3': 2, // Phrygian
    '4': 3, // Lydian
    '5': 4, // Mixolydian
    '6': 5, // Aeolian
    '7': 6  // Locrian
  }
};

/**
 * Keyboard navigation options
 */
export interface KeyboardNavigationOptions {
  /** Whether keyboard navigation is enabled */
  enabled?: boolean;
  /** Custom key mappings */
  keyMapping?: Partial<KeyboardMapping>;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
  /** Debounce delay for rapid key presses */
  debounceDelay?: number;
  /** Whether to require focus on the component */
  requireFocus?: boolean;
}

/**
 * Keyboard navigation hook
 */
export function useModesKeyboard(
  modesState: UseModesStateReturn,
  modesNavigation: UseModesNavigationReturn,
  modesDisplay: UseModesDisplayReturn,
  options: KeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    keyMapping = {},
    preventDefault = true,
    debounceDelay = 50,
    requireFocus = false
  } = options;

  // Merge custom mappings with defaults (memoized to prevent recreation)
  const effectiveMapping: KeyboardMapping = useMemo(() => ({
    ...DEFAULT_KEYBOARD_MAPPING,
    ...keyMapping,
    modeShortcuts: {
      ...DEFAULT_KEYBOARD_MAPPING.modeShortcuts,
      ...(keyMapping.modeShortcuts || {})
    }
  }), [keyMapping]);

  // Component focus state
  const [isFocused, setIsFocused] = useState(false);
  const componentRef = useRef<HTMLElement | null>(null);
  const lastKeyTimeRef = useRef<number>(0);

  // Focus handlers
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Check if key combination matches any mapping
  const checkKeyMatch = useCallback((key: string, mapping: string[]): boolean => {
    return mapping.includes(key);
  }, []);

  // Debounced action execution
  const executeWithDebounce = useCallback((action: () => void) => {
    const now = Date.now();
    if (now - lastKeyTimeRef.current >= debounceDelay) {
      action();
      lastKeyTimeRef.current = now;
    }
  }, [debounceDelay]);

  // Key press handler
  const handleKeyPress = useCallback((event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    // Check if keyboard navigation is enabled
    if (!enabled) return;

    // Check focus requirement
    if (requireFocus && !isFocused) return;

    // Check for modifier keys that should be ignored
    if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey) return;

    const key = keyboardEvent.key;

    // Mode navigation
    if (checkKeyMatch(key, effectiveMapping.nextMode)) {
      executeWithDebounce(() => modesNavigation.nextMode());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.previousMode)) {
      executeWithDebounce(() => modesNavigation.previousMode());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.jumpToFirstMode)) {
      executeWithDebounce(() => modesNavigation.goToFirstMode());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.jumpToLastMode)) {
      executeWithDebounce(() => modesNavigation.goToLastMode());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    // Root navigation
    if (checkKeyMatch(key, effectiveMapping.nextRoot)) {
      executeWithDebounce(() => modesNavigation.nextRootPosition());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.previousRoot)) {
      executeWithDebounce(() => modesNavigation.previousRootPosition());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.jumpToC)) {
      executeWithDebounce(() => modesNavigation.goToC());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.traditionalRoot)) {
      executeWithDebounce(() => modesNavigation.goToTraditionalRoot());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    // Display toggles
    if (checkKeyMatch(key, effectiveMapping.toggleNoteNames)) {
      executeWithDebounce(() => modesState.toggleNoteNames());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.toggleHighlightRoot)) {
      executeWithDebounce(() => modesState.toggleHighlightRoot());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.toggleScaleDegrees)) {
      executeWithDebounce(() => modesDisplay.toggleScaleDegrees());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.toggleIntervals)) {
      executeWithDebounce(() => modesDisplay.toggleIntervals());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    // Visual controls
    if (checkKeyMatch(key, effectiveMapping.zoomIn)) {
      executeWithDebounce(() => modesDisplay.zoomIn());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.zoomOut)) {
      executeWithDebounce(() => modesDisplay.zoomOut());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.resetZoom)) {
      executeWithDebounce(() => modesDisplay.resetZoom());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    if (checkKeyMatch(key, effectiveMapping.toggleFocusMode)) {
      executeWithDebounce(() => modesDisplay.toggleFocusMode());
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }

    // Mode shortcuts (1-7)
    if (key in effectiveMapping.modeShortcuts) {
      const modeIndex = effectiveMapping.modeShortcuts[key];
      executeWithDebounce(() => modesNavigation.navigateToModeIndex(modeIndex));
      if (preventDefault) keyboardEvent.preventDefault();
      return;
    }
  }, [
    enabled,
    requireFocus,
    isFocused,
    effectiveMapping,
    modesNavigation,
    modesState,
    modesDisplay,
    executeWithDebounce,
    checkKeyMatch,
    preventDefault
  ]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;

    const targetElement = requireFocus ? componentRef.current : document;
    if (!targetElement) return;

    targetElement.addEventListener('keydown', handleKeyPress);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled, requireFocus, handleKeyPress]);

  // Set up focus listeners if focus is required
  useEffect(() => {
    if (!requireFocus || !componentRef.current) return;

    const element = componentRef.current;

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [requireFocus, handleFocus, handleBlur]);

  // Keyboard help information
  const keyboardHelp = {
    modeNavigation: {
      'Next Mode': effectiveMapping.nextMode.join(', '),
      'Previous Mode': effectiveMapping.previousMode.join(', '),
      'First Mode': effectiveMapping.jumpToFirstMode.join(', '),
      'Last Mode': effectiveMapping.jumpToLastMode.join(', ')
    },
    rootNavigation: {
      'Next Root': effectiveMapping.nextRoot.join(', '),
      'Previous Root': effectiveMapping.previousRoot.join(', '),
      'Jump to C': effectiveMapping.jumpToC.join(', '),
      'Traditional Root': effectiveMapping.traditionalRoot.join(', ')
    },
    displayToggles: {
      'Toggle Note Names': effectiveMapping.toggleNoteNames.join(', '),
      'Toggle Highlight Root': effectiveMapping.toggleHighlightRoot.join(', '),
      'Toggle Scale Degrees': effectiveMapping.toggleScaleDegrees.join(', '),
      'Toggle Intervals': effectiveMapping.toggleIntervals.join(', ')
    },
    visualControls: {
      'Zoom In': effectiveMapping.zoomIn.join(', '),
      'Zoom Out': effectiveMapping.zoomOut.join(', '),
      'Reset Zoom': effectiveMapping.resetZoom.join(', '),
      'Toggle Focus Mode': effectiveMapping.toggleFocusMode.join(', ')
    },
    modeShortcuts: {
      'Ionian (1st)': '1',
      'Dorian (2nd)': '2',
      'Phrygian (3rd)': '3',
      'Lydian (4th)': '4',
      'Mixolydian (5th)': '5',
      'Aeolian (6th)': '6',
      'Locrian (7th)': '7'
    }
  };

  return {
    // Component ref for focus management
    componentRef,

    // State
    enabled,
    isFocused,
    requireFocus,

    // Focus handlers
    handleFocus,
    handleBlur,

    // Configuration
    effectiveMapping,
    keyboardHelp,

    // Manual action triggers (for button fallbacks)
    triggerNextMode: () => executeWithDebounce(() => modesNavigation.nextMode()),
    triggerPreviousMode: () => executeWithDebounce(() => modesNavigation.previousMode()),
    triggerNextRoot: () => executeWithDebounce(() => modesNavigation.nextRootPosition()),
    triggerPreviousRoot: () => executeWithDebounce(() => modesNavigation.previousRootPosition()),

    // State queries
    get isKeyboardActive() {
      return enabled && (!requireFocus || isFocused);
    },

    get hasCustomMappings() {
      return Object.keys(keyMapping).length > 0;
    }
  };
}

/**
 * Hook return type for external use
 */
export type UseModesKeyboardReturn = ReturnType<typeof useModesKeyboard>;