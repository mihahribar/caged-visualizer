import { useState } from 'react';
import type { ChordType } from '../types';
import { useCAGEDLogic } from '../hooks/useCAGEDLogic';
import { useCAGEDSequence } from '../hooks/useCAGEDSequence';
import {
  CAGED_SHAPE_DATA,
  STRING_NAMES,
  TOTAL_FRETS
} from '../constants';

const CAGEDVisualizer = () => {
  const [selectedChord, setSelectedChord] = useState<ChordType>('C');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showAllShapes, setShowAllShapes] = useState(false);

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
    setCurrentPosition((prev) => (prev + 1) % cagedSequence.length);
  };

  const previousPosition = () => {
    setCurrentPosition((prev) => (prev - 1 + cagedSequence.length) % cagedSequence.length);
  };

  return (
    <div className="max-w-8xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">CAGED Guitar System</h1>
        <p className="text-gray-600">Learn the same chord using different shapes down the neck</p>
      </div>

      {/* Chord Selector */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <label className="text-gray-600 text-sm mr-3">Choose your chord:</label>
          <select 
            value={selectedChord}
            onChange={(e) => {
              setSelectedChord(e.target.value as ChordType);
              setCurrentPosition(0); // Reset to first position when changing chord
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
          >
            <option value="C">C Major</option>
            <option value="A">A Major</option>
            <option value="G">G Major</option>
            <option value="E">E Major</option>
            <option value="D">D Major</option>
          </select>
        </div>
      </div>

      {/* Current Shape Info & Navigation */}
      {!showAllShapes && (
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <button
              onClick={previousPosition}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
            >
              ← Previous
            </button>
            
            <div 
              className="px-6 py-3 rounded-full text-white font-medium text-lg"
              style={{ backgroundColor: CAGED_SHAPE_DATA[currentShape].color }}
            >
              {selectedChord} - {CAGED_SHAPE_DATA[currentShape].name}
            </div>
            
            <button
              onClick={nextPosition}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
            >
              Next →
            </button>
          </div>
          
          {/* CAGED Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {cagedSequence.map((shape, index) => (
              <button
                key={shape}
                onClick={() => setCurrentPosition(index)}
                className={`w-8 h-8 rounded-full text-white text-sm font-medium transition-all ${
                  index === currentPosition ? 'scale-110 shadow-lg' : 'opacity-40'
                }`}
                style={{ backgroundColor: CAGED_SHAPE_DATA[shape].color }}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show All Shapes Toggle */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowAllShapes(!showAllShapes)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            showAllShapes 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showAllShapes ? 'Show Single Shape' : 'Show All CAGED Shapes'}
        </button>
      </div>

      {/* Fretboard */}
      <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
        <div className="relative">
          {/* Fret markers */}
          <div className="flex justify-between mb-2">
            <div className="w-8"></div>
            {Array.from({ length: TOTAL_FRETS }, (_, i) => (
              <div key={i} className="flex-1 text-center">
                {[3, 5, 7, 9, 12].includes(i + 1) && (
                  <div className="text-xs text-gray-400 font-mono">{i + 1}</div>
                )}
              </div>
            ))}
          </div>

          {/* Strings and frets */}
          {STRING_NAMES.map((stringName, stringIndex) => (
            <div key={stringIndex} className="flex items-center mb-3">
              {/* String name */}
              <div className="w-8 text-right pr-2 text-sm font-mono text-gray-600">
                {stringName}
              </div>
              
              {/* Frets */}
              <div className="flex-1 flex relative">
                {/* String line */}
                <div 
                  className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t border-gray-400"
                  style={{ zIndex: 1 }}
                ></div>
                
                {Array.from({ length: TOTAL_FRETS }, (_, fretIndex) => (
                  <div key={fretIndex} className="flex-1 relative flex justify-center items-center h-8">
                    {/* Fret line */}
                    {fretIndex > 0 && (
                      <div className="absolute left-0 top-0 bottom-0 border-l border-gray-300"></div>
                    )}
                    
                    
                    {/* Chord dot */}
                    {shouldShowDot(stringIndex, fretIndex + 1) && (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm ${
                          isRootNote(stringIndex, fretIndex + 1) ? 'ring-2 ring-gray-800' : ''
                        }`}
                        style={{ 
                          ...getDotStyle(stringIndex, fretIndex + 1),
                          zIndex: 10 
                        }}
                      >
                        {isRootNote(stringIndex, fretIndex + 1) ? 'R' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
        <p>Choose a CAGED chord, then cycle through the 5 shapes to see different ways to play it</p>
        <p>Each shape shows the same chord at a different position on the neck</p>
        {showAllShapes && <p className="font-medium">Showing all 5 CAGED positions for {selectedChord} major - overlapping notes show blended colors</p>}
      </div>
    </div>
  );
};

export default CAGEDVisualizer;