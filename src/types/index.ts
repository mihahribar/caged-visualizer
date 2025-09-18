/**
 * TypeScript type definitions for the CAGED chord system visualizer
 *
 * Defines the core data structures for guitar chord patterns, quiz functionality,
 * and music theory concepts used throughout the application.
 */

/**
 * Individual CAGED chord shape definition
 */
export interface CAGEDShape {
  /** Display name of the shape (e.g., "C Shape", "A Shape") */
  name: string;
  /** CSS color value for visual representation */
  color: string;
  /** Fret pattern for each string (0-based, -1 = not played) */
  pattern: number[];
  /** Finger positions for playing the shape (0 = open, 1-4 = fingers) */
  fingers: number[];
  /** String indices that contain the root note of the chord */
  rootNotes: number[];
}

/**
 * CAGED shape with explicit chord quality information
 */
export interface CAGEDShapeWithQuality extends CAGEDShape {
  /** Chord quality (major or minor) for this shape variant */
  quality: ChordQuality;
}

/**
 * Collection of CAGED shapes indexed by shape letter
 */
export interface CAGEDShapeData {
  [key: string]: CAGEDShape;
}

/**
 * CAGED shapes organized by chord quality (major/minor)
 */
export interface CAGEDShapesByQuality {
  /** Major chord shape patterns */
  major: CAGEDShapeData;
  /** Minor chord shape patterns */
  minor: CAGEDShapeData;
}

/**
 * CAGED chord type representing the 5 moveable shapes
 */
export type ChordType = 'C' | 'A' | 'G' | 'E' | 'D';

/**
 * Chord quality affecting interval patterns
 */
export type ChordQuality = 'major' | 'minor';

/**
 * Quiz mode for chord identification practice
 */
export type QuizMode = 'major' | 'minor' | 'mixed';

/**
 * Validation result type for safe type checking operations
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

/**
 * Detailed validation error information
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
  /** The value that was received */
  received: unknown;
  /** Expected type or format */
  expected?: string;
}

/**
 * Type-safe localStorage data structure
 */
export interface LocalStorageData {
  /** Quiz preferences data */
  quizPreferences?: QuizPreferences;
  /** Theme preferences */
  theme?: 'light' | 'dark';
  /** Last updated timestamp */
  lastUpdated?: number;
}

/**
 * Chromatic note values mapping (0-11 representing semitones)
 */
export interface ChromaticValues {
  readonly [key: string]: number;
}

export interface ShapePositions {
  [key: string]: number;
}

export interface QuizQuestion {
  id: number;
  rootChord: ChordType;
  shapeUsed: ChordType;
  position: number;
  choices: ChordType[];
  correctAnswer: ChordType;
  quality: ChordQuality;
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: ChordType;
  correctAnswer: ChordType;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizSession {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface QuizConfig {
  questionCount: number;
  allowedChords: ChordType[];
  allowedShapes: ChordType[];
  quizMode: QuizMode;
}

export interface QuizPreferences {
  quizMode: QuizMode;
  questionCount: number;
  allowedChords: ChordType[];
  allowedShapes: ChordType[];
}