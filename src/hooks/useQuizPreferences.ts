import { useState, useEffect } from 'react';
import type { QuizPreferences, QuizMode, ChordType } from '../types';
import { DEFAULT_QUIZ_CONFIG } from '../constants/quizConfig';

const QUIZ_PREFERENCES_KEY = 'caged-quiz-preferences';

// Default preferences based on updated quiz config
const DEFAULT_PREFERENCES: QuizPreferences = {
  quizMode: DEFAULT_QUIZ_CONFIG.quizMode,
  questionCount: DEFAULT_QUIZ_CONFIG.questionCount,
  allowedChords: DEFAULT_QUIZ_CONFIG.allowedChords,
  allowedShapes: DEFAULT_QUIZ_CONFIG.allowedShapes,
};

/**
 * Hook for managing quiz preferences with localStorage persistence
 * Provides CRUD operations for user quiz preferences
 */
export function useQuizPreferences() {
  const [preferences, setPreferences] = useState<QuizPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUIZ_PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as QuizPreferences;
        // Validate parsed preferences against current schema
        if (isValidPreferences(parsed)) {
          setPreferences(parsed);
        } else {
          // If invalid, save defaults to localStorage
          savePreferences(DEFAULT_PREFERENCES);
        }
      } else {
        // No stored preferences, save defaults
        savePreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      console.warn('Failed to load quiz preferences from localStorage:', error);
      savePreferences(DEFAULT_PREFERENCES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: QuizPreferences) => {
    try {
      localStorage.setItem(QUIZ_PREFERENCES_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save quiz preferences to localStorage:', error);
    }
  };

  // Update quiz mode
  const updateQuizMode = (quizMode: QuizMode) => {
    const updated = { ...preferences, quizMode };
    savePreferences(updated);
  };

  // Update question count
  const updateQuestionCount = (questionCount: number) => {
    const updated = { ...preferences, questionCount };
    savePreferences(updated);
  };

  // Update allowed chords
  const updateAllowedChords = (allowedChords: ChordType[]) => {
    const updated = { ...preferences, allowedChords };
    savePreferences(updated);
  };

  // Update allowed shapes
  const updateAllowedShapes = (allowedShapes: ChordType[]) => {
    const updated = { ...preferences, allowedShapes };
    savePreferences(updated);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  // Get current preferences as QuizConfig
  const getQuizConfig = () => ({
    questionCount: preferences.questionCount,
    allowedChords: preferences.allowedChords,
    allowedShapes: preferences.allowedShapes,
    quizMode: preferences.quizMode,
  });

  return {
    preferences,
    isLoaded,
    updateQuizMode,
    updateQuestionCount,
    updateAllowedChords,
    updateAllowedShapes,
    resetToDefaults,
    getQuizConfig,
  };
}

/**
 * Validates quiz preferences object structure
 */
function isValidPreferences(prefs: unknown): prefs is QuizPreferences {
  if (!prefs || typeof prefs !== 'object') {
    return false;
  }

  const obj = prefs as Record<string, unknown>;

  return (
    typeof obj.quizMode === 'string' &&
    ['major', 'minor', 'mixed'].includes(obj.quizMode) &&
    typeof obj.questionCount === 'number' &&
    obj.questionCount > 0 &&
    Array.isArray(obj.allowedChords) &&
    obj.allowedChords.length > 0 &&
    Array.isArray(obj.allowedShapes) &&
    obj.allowedShapes.length > 0
  );
}