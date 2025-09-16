import { useCAGEDLogic } from '../hooks/useCAGEDLogic';
import { useCAGEDSequence } from '../hooks/useCAGEDSequence';
import { useCAGEDState } from '../hooks/useCAGEDState';
import EnhancedNavigationPanel from './EnhancedNavigationPanel';
import FretboardDisplay from './FretboardDisplay';
import {
  CAGED_SHAPE_DATA
} from '../constants';

const CAGEDVisualizer = () => {
  const { state, actions } = useCAGEDState();
  const { selectedChord, currentPosition, showAllShapes, showPentatonic } = state;

  // Use custom hooks for logic
  const cagedSequence = useCAGEDSequence(selectedChord);
  const { shapePositions, getShapeFret, getShapesAtPosition, createGradientStyle, isPentatonicNote } = useCAGEDLogic(selectedChord, cagedSequence);
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

  // Check if this is a root note for the current shape
  const isRootNote = (stringIndex: number, fretNumber: number) => {
    if (showAllShapes) {
      // When showing all shapes, check if any shape has a root note at this position
      const shapesHere = getShapesAtPosition(stringIndex, fretNumber);
      return shapesHere.some(shapeKey => {
        const shape = CAGED_SHAPE_DATA[shapeKey];
        return shape.rootNotes.includes(stringIndex);
      });
    } else {
      // For single shape view, check if current shape has root note here
      const shape = CAGED_SHAPE_DATA[currentShape];
      return shape.rootNotes.includes(stringIndex) && shouldShowDot(stringIndex, fretNumber);
    }
  };

  // Check if a pentatonic dot should be shown at this position
  const shouldShowPentatonicDot = (stringIndex: number, fretNumber: number) => {
    return isPentatonicNote(stringIndex, fretNumber);
  };

  const nextPosition = () => {
    actions.nextPosition(cagedSequence.length);
  };

  const previousPosition = () => {
    actions.previousPosition(cagedSequence.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <EnhancedNavigationPanel
        selectedChord={selectedChord}
        currentPosition={currentPosition}
        currentShape={currentShape}
        cagedSequence={cagedSequence}
        showAllShapes={showAllShapes}
        showPentatonic={showPentatonic}
        onChordChange={actions.setChord}
        onPreviousPosition={previousPosition}
        onNextPosition={nextPosition}
        onSetPosition={actions.setPosition}
        onToggleShowAllShapes={actions.toggleShowAllShapes}
        onToggleShowPentatonic={actions.toggleShowPentatonic}
      />

      <FretboardDisplay
        selectedChord={selectedChord}
        currentShape={currentShape}
        showAllShapes={showAllShapes}
        showPentatonic={showPentatonic}
        shouldShowDot={shouldShowDot}
        getDotStyle={getDotStyle}
        isRootNote={isRootNote}
        shouldShowPentatonicDot={shouldShowPentatonicDot}
      />
    </div>
  );
};

export default CAGEDVisualizer;