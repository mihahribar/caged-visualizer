import { useMemo } from 'react';
import type { QuizQuestion, QuizConfig, ChordType } from '../types';
import { CHROMATIC_VALUES } from '../constants';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateAllChoices(allChords: ChordType[]): ChordType[] {
  // Return all available chords in random order
  return shuffleArray([...allChords]);
}

export function useQuizLogic(config: QuizConfig) {
  const generateQuestions = useMemo(() => {
    return (): QuizQuestion[] => {
      const questions: QuizQuestion[] = [];
      
      for (let i = 0; i < config.questionCount; i++) {
        // Randomly select a root chord for the question
        const rootChord = config.allowedChords[Math.floor(Math.random() * config.allowedChords.length)];
        
        // Randomly select a shape to use for displaying the chord
        const shapeUsed = config.allowedShapes[Math.floor(Math.random() * config.allowedShapes.length)];
        
        // Calculate the position where this shape needs to be played for the root chord
        const targetValue = CHROMATIC_VALUES[rootChord];
        const shapeValue = CHROMATIC_VALUES[shapeUsed];
        const position = (targetValue - shapeValue + 12) % 12;
        
        // Generate multiple choice options - all 5 chords in random order
        const allChoices = generateAllChoices(config.allowedChords);
        
        questions.push({
          id: i + 1,
          rootChord,
          shapeUsed,
          position,
          choices: allChoices,
          correctAnswer: rootChord,
        });
      }
      
      return questions;
    };
  }, [config]);

  const validateAnswer = useMemo(() => {
    return (question: QuizQuestion, selectedAnswer: ChordType): boolean => {
      return question.correctAnswer === selectedAnswer;
    };
  }, []);

  const getQuestionDescription = useMemo(() => {
    return (question: QuizQuestion): string => {
      return `What chord is being played using the ${question.shapeUsed} shape at position ${question.position}?`;
    };
  }, []);

  return {
    generateQuestions,
    validateAnswer,
    getQuestionDescription,
  };
}