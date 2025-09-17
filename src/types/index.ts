export interface CAGEDShape {
  name: string;
  color: string;
  pattern: number[];
  fingers: number[];
  rootNotes: number[];
}

export interface CAGEDShapeWithQuality extends CAGEDShape {
  quality: ChordQuality;
}

export interface CAGEDShapeData {
  [key: string]: CAGEDShape;
}

export interface CAGEDShapesByQuality {
  major: CAGEDShapeData;
  minor: CAGEDShapeData;
}

export type ChordType = 'C' | 'A' | 'G' | 'E' | 'D';

export type ChordQuality = 'major' | 'minor';

export type QuizMode = 'major' | 'minor' | 'mixed';

export interface ChromaticValues {
  [key: string]: number;
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