interface ShowAllToggleProps {
  showAllShapes: boolean;
  onToggle: () => void;
}

export default function ShowAllToggle({ showAllShapes, onToggle }: ShowAllToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onToggle}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
          showAllShapes 
            ? 'bg-gray-800 text-white focus:ring-gray-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
        }`}
        aria-pressed={showAllShapes}
        aria-label={showAllShapes ? 'Show single CAGED shape' : 'Show all CAGED shapes'}
        title={showAllShapes ? 'Switch to single shape view' : 'View all shapes at once'}
      >
        {showAllShapes ? 'Show Single Shape' : 'Show All CAGED Shapes'}
      </button>
    </div>
  );
}