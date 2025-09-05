import type { QuizConfig, ChordType } from '../types';

// Default quiz configuration (as specified: 5 questions, configurable in code)
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  questionCount: 5,
  allowedChords: ['C', 'A', 'G', 'E', 'D'],
  allowedShapes: ['C', 'A', 'G', 'E', 'D'],
};

// Additional quiz configurations for future extensibility
export const QUIZ_PRESETS = {
  beginner: {
    questionCount: 5,
    allowedChords: ['C', 'G', 'D'] as ChordType[],
    allowedShapes: ['C', 'G', 'D'] as ChordType[],
  },
  intermediate: {
    questionCount: 5,
    allowedChords: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
    allowedShapes: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
  },
  advanced: {
    questionCount: 10,
    allowedChords: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
    allowedShapes: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
  },
} as const;

// Configuration validation
export function validateQuizConfig(config: QuizConfig): boolean {
  return (
    config.questionCount > 0 &&
    config.allowedChords.length >= 2 && // Need at least 2 chords for multiple choice
    config.allowedShapes.length >= 1 &&
    config.allowedChords.length <= 5 && // Max 5 CAGED chords
    config.allowedShapes.length <= 5 // Max 5 CAGED shapes
  );
}

// Get quiz configuration (currently returns default, but configurable in code)
export function getQuizConfig(): QuizConfig {
  // For now, return the default config
  // This can be modified to support different difficulty levels or user preferences
  return DEFAULT_QUIZ_CONFIG;
}