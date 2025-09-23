/**
 * Storage hook for the modes system
 * Handles state persistence and restoration from localStorage
 */

import { useCallback, useEffect, useMemo } from 'react';
import type { ModeState } from '../types';
import type { UseModesStateReturn } from './useModesState';
import type { UseModesDisplayReturn, ModesDisplayOptions } from './useModesDisplay';
import { DEFAULT_MODE_STATE } from '../constants';

/**
 * Storage keys for different data types
 */
const STORAGE_KEYS = {
  MODE_STATE: 'caged-modes-state',
  DISPLAY_OPTIONS: 'caged-modes-display-options',
  USER_PREFERENCES: 'caged-modes-user-preferences',
  LAST_SESSION: 'caged-modes-last-session'
} as const;

/**
 * User preferences that can be persisted
 */
export interface ModesUserPreferences {
  /** Preferred note naming context */
  preferredNoteContext: 'sharp' | 'flat';
  /** Whether to always show note names on startup */
  defaultShowNoteNames: boolean;
  /** Whether to always highlight roots on startup */
  defaultHighlightRoot: boolean;
  /** Whether to use optimized fret range by default */
  defaultOptimizedRange: boolean;
  /** Default color intensity */
  defaultColorIntensity: number;
  /** Whether animations are enabled by default */
  defaultAnimations: boolean;
}

/**
 * Session data for restoration
 */
export interface ModesSessionData {
  /** Timestamp when session was saved */
  timestamp: number;
  /** Mode state at time of save */
  modeState: ModeState;
  /** Display options at time of save */
  displayOptions: Partial<ModesDisplayOptions>;
  /** Version for compatibility checking */
  version: string;
}

/**
 * Default user preferences
 */
const DEFAULT_USER_PREFERENCES: ModesUserPreferences = {
  preferredNoteContext: 'sharp',
  defaultShowNoteNames: true,
  defaultHighlightRoot: true,
  defaultOptimizedRange: true,
  defaultColorIntensity: 1.0,
  defaultAnimations: true
};

/**
 * Storage persistence options
 */
export interface StorageOptions {
  /** Whether to automatically save state changes */
  autoSave?: boolean;
  /** Debounce delay for auto-save (ms) */
  autoSaveDelay?: number;
  /** Whether to restore state on component mount */
  autoRestore?: boolean;
  /** Version string for compatibility checking */
  version?: string;
  /** Whether to save user preferences */
  savePreferences?: boolean;
  /** Whether to save session data */
  saveSession?: boolean;
}

/**
 * Safe localStorage operations
 */
class SafeStorage {
  static get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  static set(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
      return false;
    }
  }

  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }

  static getJSON<T>(key: string, defaultValue: T): T {
    const stored = this.get(key);
    if (!stored) return defaultValue;

    try {
      return JSON.parse(stored) as T;
    } catch (error) {
      console.warn('Failed to parse stored JSON:', error);
      return defaultValue;
    }
  }

  static setJSON<T>(key: string, value: T): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to stringify JSON for storage:', error);
      return false;
    }
  }
}

/**
 * Storage hook for modes system
 */
export function useModesStorage(
  modesState: UseModesStateReturn,
  modesDisplay: UseModesDisplayReturn,
  options: StorageOptions = {}
) {
  const {
    autoSave = true,
    autoSaveDelay = 1000,
    autoRestore = true,
    version = '1.0.0',
    savePreferences = true,
    saveSession = true
  } = options;

  // Load stored data
  const storedModeState = useMemo(() => {
    return SafeStorage.getJSON(STORAGE_KEYS.MODE_STATE, DEFAULT_MODE_STATE);
  }, []);

  const storedDisplayOptions = useMemo(() => {
    return SafeStorage.getJSON(STORAGE_KEYS.DISPLAY_OPTIONS, {});
  }, []);

  const storedUserPreferences = useMemo(() => {
    return SafeStorage.getJSON(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  }, []);

  const storedSessionData = useMemo(() => {
    return SafeStorage.getJSON<ModesSessionData | null>(STORAGE_KEYS.LAST_SESSION, null);
  }, []);

  // Save functions
  const saveModeState = useCallback((state: ModeState) => {
    return SafeStorage.setJSON(STORAGE_KEYS.MODE_STATE, state);
  }, []);

  const saveDisplayOptions = useCallback((options: Partial<ModesDisplayOptions>) => {
    return SafeStorage.setJSON(STORAGE_KEYS.DISPLAY_OPTIONS, options);
  }, []);

  const saveUserPreferences = useCallback((preferences: ModesUserPreferences) => {
    if (!savePreferences) return false;
    return SafeStorage.setJSON(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }, [savePreferences]);

  const saveSessionData = useCallback((sessionData: ModesSessionData) => {
    if (!saveSession) return false;
    return SafeStorage.setJSON(STORAGE_KEYS.LAST_SESSION, sessionData);
  }, [saveSession]);

  // Load functions
  const loadModeState = useCallback(() => {
    const stored = SafeStorage.getJSON(STORAGE_KEYS.MODE_STATE, DEFAULT_MODE_STATE);
    modesState.setFullState(stored);
    return stored;
  }, [modesState]);

  const loadDisplayOptions = useCallback(() => {
    const stored = SafeStorage.getJSON(STORAGE_KEYS.DISPLAY_OPTIONS, {});
    // Apply stored options to display state
    // This would need to be implemented based on the display hook's API
    return stored;
  }, []);

  const loadUserPreferences = useCallback(() => {
    return SafeStorage.getJSON(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  }, []);

  const loadSessionData = useCallback(() => {
    const sessionData = SafeStorage.getJSON<ModesSessionData | null>(STORAGE_KEYS.LAST_SESSION, null);

    if (sessionData && sessionData.version === version) {
      // Restore session state
      modesState.setFullState(sessionData.modeState);
      // Note: Display options restoration would need display hook support
      return sessionData;
    }

    return null;
  }, [modesState, version]);

  // Clear functions
  const clearModeState = useCallback(() => {
    return SafeStorage.remove(STORAGE_KEYS.MODE_STATE);
  }, []);

  const clearDisplayOptions = useCallback(() => {
    return SafeStorage.remove(STORAGE_KEYS.DISPLAY_OPTIONS);
  }, []);

  const clearUserPreferences = useCallback(() => {
    return SafeStorage.remove(STORAGE_KEYS.USER_PREFERENCES);
  }, []);

  const clearSessionData = useCallback(() => {
    return SafeStorage.remove(STORAGE_KEYS.LAST_SESSION);
  }, []);

  const clearAllData = useCallback(() => {
    const results = [
      clearModeState(),
      clearDisplayOptions(),
      clearUserPreferences(),
      clearSessionData()
    ];
    return results.every(result => result);
  }, [clearModeState, clearDisplayOptions, clearUserPreferences, clearSessionData]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const timeoutId = setTimeout(() => {
      saveModeState(modesState.modeState);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [autoSave, autoSaveDelay, modesState.modeState, saveModeState]);

  useEffect(() => {
    if (!autoSave || !modesDisplay.displayOptions) return;

    const timeoutId = setTimeout(() => {
      saveDisplayOptions(modesDisplay.displayOptions);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [autoSave, autoSaveDelay, modesDisplay.displayOptions, saveDisplayOptions]);

  // Auto-restore functionality
  useEffect(() => {
    if (!autoRestore) return;

    // Try to restore session first, then individual state
    if (!loadSessionData()) {
      loadModeState();
      loadDisplayOptions();
    }
  }, [autoRestore, loadSessionData, loadModeState, loadDisplayOptions]);

  // Save session data on page unload
  useEffect(() => {
    if (!saveSession) return;

    const handleBeforeUnload = () => {
      const sessionData: ModesSessionData = {
        timestamp: Date.now(),
        modeState: modesState.modeState,
        displayOptions: modesDisplay.displayOptions,
        version
      };
      saveSessionData(sessionData);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveSession, modesState.modeState, modesDisplay.displayOptions, version, saveSessionData]);

  // Export/Import functionality
  const exportState = useCallback(() => {
    const exportData = {
      modeState: modesState.modeState,
      displayOptions: modesDisplay.displayOptions,
      userPreferences: storedUserPreferences,
      timestamp: Date.now(),
      version
    };

    return JSON.stringify(exportData, null, 2);
  }, [modesState.modeState, modesDisplay.displayOptions, storedUserPreferences, version]);

  const importState = useCallback((jsonData: string): boolean => {
    try {
      const importedData = JSON.parse(jsonData);

      if (importedData.version !== version) {
        console.warn('Version mismatch in imported data');
        return false;
      }

      if (importedData.modeState) {
        modesState.setFullState(importedData.modeState);
        saveModeState(importedData.modeState);
      }

      if (importedData.displayOptions) {
        saveDisplayOptions(importedData.displayOptions);
      }

      if (importedData.userPreferences) {
        saveUserPreferences(importedData.userPreferences);
      }

      return true;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }, [version, modesState, saveModeState, saveDisplayOptions, saveUserPreferences]);

  return {
    // Storage state
    storedModeState,
    storedDisplayOptions,
    storedUserPreferences,
    storedSessionData,

    // Save functions
    saveModeState,
    saveDisplayOptions,
    saveUserPreferences,
    saveSessionData,

    // Load functions
    loadModeState,
    loadDisplayOptions,
    loadUserPreferences,
    loadSessionData,

    // Clear functions
    clearModeState,
    clearDisplayOptions,
    clearUserPreferences,
    clearSessionData,
    clearAllData,

    // Export/Import
    exportState,
    importState,

    // Storage status
    get hasStoredData() {
      return storedModeState !== null || Object.keys(storedDisplayOptions).length > 0;
    },

    get hasSessionData() {
      return storedSessionData !== null;
    },

    get storageKeys() {
      return STORAGE_KEYS;
    },

    // Configuration
    autoSave,
    autoRestore,
    version
  };
}

/**
 * Hook return type for external use
 */
export type UseModesStorageReturn = ReturnType<typeof useModesStorage>;