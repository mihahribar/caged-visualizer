interface QuizProgressProps {
  progress: number; // 0 to 1
}

export default function QuizProgress({ progress }: QuizProgressProps) {
  const progressPercentage = Math.round(progress * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Quiz Progress
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {progressPercentage}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Quiz progress: ${progressPercentage}% complete`}
        />
      </div>
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">Start</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Complete</span>
      </div>
    </div>
  );
}