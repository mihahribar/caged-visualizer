import { useQuiz } from '../hooks/useQuiz';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizProgress from './QuizProgress';

export default function QuizPage() {
  const {
    isIdle,
    isActive,
    isCompleted,
    currentQuestion,
    progress,
    startNewQuiz,
    submitAnswer,
    resetQuiz,
    getResults,
  } = useQuiz();

  if (isIdle) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-800 dark:text-gray-100 mb-2">
            CAGED Quiz Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Test your knowledge of chord identification using the CAGED system
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              How it works:
            </h2>
            <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2">
              <li>• You'll see a chord pattern on the fretboard</li>
              <li>• Identify which root chord is being played</li>
              <li>• Choose from multiple choice answers</li>
              <li>• Complete 5 questions to see your score</li>
            </ul>
          </div>
          
          <button
            onClick={startNewQuiz}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isActive && currentQuestion) {
    return (
      <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div className="mb-6">
          <QuizProgress progress={progress} />
        </div>
        
        <QuizQuestion
          question={currentQuestion}
          onSubmitAnswer={submitAnswer}
        />
      </div>
    );
  }

  if (isCompleted) {
    const results = getResults();
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <QuizResults
          results={results}
          onStartNewQuiz={startNewQuiz}
          onResetQuiz={resetQuiz}
        />
      </div>
    );
  }

  return null;
}