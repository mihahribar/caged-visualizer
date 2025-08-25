import { useCAGEDLogic } from '../hooks/useCAGEDLogic';
import { useCAGEDSequence } from '../hooks/useCAGEDSequence';
import { useCAGEDState } from '../hooks/useCAGEDState';
import ChordSelector from './ChordSelector';
import NavigationControls from './NavigationControls';
import ShowAllToggle from './ShowAllToggle';
import FretboardDisplay from './FretboardDisplay';
import {
  CAGED_SHAPE_DATA
} from '../constants';

const CAGEDVisualizer = () => {
  const { state, actions } = useCAGEDState();
  const { selectedChord, currentPosition, showAllShapes } = state;

  // Use custom hooks for logic
  const cagedSequence = useCAGEDSequence(selectedChord);
  const { shapePositions, getShapeFret, getShapesAtPosition, createGradientStyle } = useCAGEDLogic(selectedChord, cagedSequence);
  const currentShape = cagedSequence[currentPosition];


  // Check if a dot should be shown at this position
  const shouldShowDot = (stringIndex: number, fretNumber: number) => {
    if (showAllShapes) {
      return getShapesAtPosition(stringIndex, fretNumber).length > 0;
    } else {
      // Show only current shape
      const basePosition = shapePositions[currentShape];
      const shapeFret = getShapeFret(currentShape, stringIndex, basePosition);
      return shapeFret === fretNumber && shapeFret > 0;
    }
  };

  // Get color/style for a dot at this position
  const getDotStyle = (stringIndex: number, fretNumber: number) => {
    if (showAllShapes) {
      const shapesHere = getShapesAtPosition(stringIndex, fretNumber);
      return createGradientStyle(shapesHere);
    } else {
      return { backgroundColor: CAGED_SHAPE_DATA[currentShape].color };
    }
  };

  // Check if this is a root note (simplified - usually on low E string)
  const isRootNote = (stringIndex: number, fretNumber: number) => {
    // Don't show root indicators when showing all shapes - too cluttered
    if (showAllShapes) return false;
    return stringIndex === 5 && shouldShowDot(stringIndex, fretNumber); // Low E is now at index 5
  };

  const nextPosition = () => {
    actions.nextPosition(cagedSequence.length);
  };

  const previousPosition = () => {
    actions.previousPosition(cagedSequence.length);
  };

  return (
    <div className="max-w-8xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">CAGED Guitar System</h1>
        <p className="text-gray-600">Learn the same chord using different shapes down the neck</p>
      </div>

      <ChordSelector
        selectedChord={selectedChord}
        onChordChange={actions.setChord}
      />

      <NavigationControls
        selectedChord={selectedChord}
        currentPosition={currentPosition}
        currentShape={currentShape}
        cagedSequence={cagedSequence}
        onPreviousPosition={previousPosition}
        onNextPosition={nextPosition}
        onSetPosition={actions.setPosition}
        showAllShapes={showAllShapes}
      />

      <ShowAllToggle
        showAllShapes={showAllShapes}
        onToggle={actions.toggleShowAllShapes}
      />

      <FretboardDisplay
        selectedChord={selectedChord}
        currentShape={currentShape}
        showAllShapes={showAllShapes}
        shouldShowDot={shouldShowDot}
        getDotStyle={getDotStyle}
        isRootNote={isRootNote}
      />

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600 space-y-1" role="region" aria-label="Instructions">
        <p>Choose a CAGED chord, then cycle through the 5 shapes to see different ways to play it</p>
        <p>Each shape shows the same chord at a different position on the neck</p>
        {showAllShapes && (
          <p className="font-medium">
            Showing all 5 CAGED positions for {selectedChord} major - overlapping notes show blended colors
          </p>
        )}
      </div>
    </div>
  );
};

export default CAGEDVisualizer;