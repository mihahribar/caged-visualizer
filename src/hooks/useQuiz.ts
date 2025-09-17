import { useQuizState } from './useQuizState';
import { useQuizLogic } from './useQuizLogic';
import { useQuizPreferences } from './useQuizPreferences';
import { getQuizConfig } from '../constants/quizConfig';
import type { ChordType, QuizAnswer } from '../types';

/**
 * Main quiz hook that combines state management and quiz logic
 * This is the primary interface for quiz functionality
 */
export function useQuiz() {
  const { preferences, isLoaded, getQuizConfig: getUserConfig, ...preferenceActions } = useQuizPreferences();
  const config = getQuizConfig(getUserConfig());
  const { state, actions, currentQuestion, progress, scorePercentage } = useQuizState();
  const { generateQuestions, validateAnswer, getQuestionDescription } = useQuizLogic(config);

  const startNewQuiz = () => {
    const questions = generateQuestions();
    actions.startQuiz(questions, config);
  };

  const submitAnswer = (selectedAnswer: ChordType) => {
    if (!currentQuestion) return;

    const isCorrect = validateAnswer(currentQuestion, selectedAnswer);
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    actions.answerQuestion(answer);
    
    // Auto-advance to next question or finish quiz
    setTimeout(() => {
      if (state.currentQuestionIndex + 1 >= state.totalQuestions) {
        actions.finishQuiz();
      } else {
        actions.nextQuestion();
      }
    }, 1000); // Brief delay to show correct/incorrect feedback
  };

  const resetQuiz = () => {
    actions.resetQuiz();
  };

  // Helper methods
  const getCurrentQuestionDescription = () => {
    return currentQuestion ? getQuestionDescription(currentQuestion) : '';
  };

  const getResults = () => {
    if (!state.isCompleted) return null;

    return {
      totalQuestions: state.totalQuestions,
      correctAnswers: state.score,
      percentage: scorePercentage,
      answers: state.answers,
      questions: state.questions,
    };
  };

  return {
    // State
    quiz: state,
    currentQuestion,
    progress,
    scorePercentage,
    config,
    preferences,
    isLoaded,

    // Actions
    startNewQuiz,
    submitAnswer,
    resetQuiz,

    // Preference actions
    ...preferenceActions,

    // Helpers
    getCurrentQuestionDescription,
    getResults,

    // Status flags
    isIdle: !state.isActive && !state.isCompleted,
    isActive: state.isActive,
    isCompleted: state.isCompleted,
  };
}