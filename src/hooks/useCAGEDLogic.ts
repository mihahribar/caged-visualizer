import { useMemo } from 'react';
import type { ChordType } from '../types';
import { CHROMATIC_VALUES, CAGED_SHAPE_DATA, STRING_TUNING, PENTATONIC_INTERVALS, CHROMATIC_TO_NOTE_NAME, NATURAL_NOTE_POSITIONS } from '../constants';

export function useCAGEDLogic(selectedChord: ChordType, cagedSequence: string[]) {
  const shapePositions = useMemo(() => {
    const targetValue = CHROMATIC_VALUES[selectedChord];
    const positions: { [key: string]: number } = {};
    
    for (const [shapeKey, shapeRoot] of Object.entries(CHROMATIC_VALUES)) {
      positions[shapeKey] = (targetValue - shapeRoot + 12) % 12;
    }
    
    return positions;
  }, [selectedChord]);

  const getShapeFret = (shapeKey: string, stringIndex: number, basePosition: number) => {
    const shape = CAGED_SHAPE_DATA[shapeKey];
    const patternFret = shape.pattern[stringIndex];
    
    if (patternFret === -1) return -1; // Not played
    if (patternFret === 0 && basePosition === 0) return 0; // Open string
    if (patternFret === 0 && basePosition > 0) return basePosition; // Barre
    
    return patternFret + basePosition;
  };

  const getShapesAtPosition = (stringIndex: number, fretNumber: number) => {
    const shapesHere: string[] = [];
    for (const shapeKey of cagedSequence) {
      const basePosition = shapePositions[shapeKey];
      const shapeFret = getShapeFret(shapeKey, stringIndex, basePosition);
      if (shapeFret === fretNumber && shapeFret > 0) {
        shapesHere.push(shapeKey);
      }
    }
    return shapesHere;
  };

  const createGradientStyle = (shapes: string[]) => {
    if (shapes.length === 1) {
      return { backgroundColor: CAGED_SHAPE_DATA[shapes[0]].color };
    } else if (shapes.length === 2) {
      const color1 = CAGED_SHAPE_DATA[shapes[0]].color;
      const color2 = CAGED_SHAPE_DATA[shapes[1]].color;
      return {
        background: `linear-gradient(90deg, ${color1} 50%, ${color2} 50%)`
      };
    } else if (shapes.length > 2) {
      const colors = shapes.map(shape => CAGED_SHAPE_DATA[shape].color);
      const gradientStops = colors.map((color, i) =>
        `${color} ${(i * 100 / colors.length)}%, ${color} ${((i + 1) * 100 / colors.length)}%`
      ).join(', ');
      return {
        background: `linear-gradient(90deg, ${gradientStops})`
      };
    }
  };

  // Get the note at a specific string and fret (as chromatic value)
  const getNoteAtFret = (stringIndex: number, fretNumber: number) => {
    return (STRING_TUNING[stringIndex] + fretNumber) % 12;
  };

  // Check if a note at a specific position is part of the pentatonic scale
  const isPentatonicNote = useMemo(() => {
    const rootNote = CHROMATIC_VALUES[selectedChord];
    const pentatonicNotes = PENTATONIC_INTERVALS.map(interval => (rootNote + interval) % 12);

    return (stringIndex: number, fretNumber: number) => {
      const noteAtFret = getNoteAtFret(stringIndex, fretNumber);
      return pentatonicNotes.includes(noteAtFret);
    };
  }, [selectedChord]);

  // Get all pentatonic note positions for the current chord
  const getPentatonicPositions = useMemo(() => {
    const positions: Array<{ stringIndex: number; fretNumber: number }> = [];

    for (let stringIndex = 0; stringIndex < STRING_TUNING.length; stringIndex++) {
      for (let fretNumber = 0; fretNumber <= 15; fretNumber++) {
        if (isPentatonicNote(stringIndex, fretNumber)) {
          positions.push({ stringIndex, fretNumber });
        }
      }
    }

    return positions;
  }, [isPentatonicNote]);

  // Get the note name at a specific string and fret
  const getNoteNameAtFret = (stringIndex: number, fretNumber: number): string => {
    const chromaticValue = (STRING_TUNING[stringIndex] + fretNumber) % 12;
    return CHROMATIC_TO_NOTE_NAME[chromaticValue];
  };

  // Check if a note at a specific position should be shown (natural notes only)
  const shouldShowNoteName = (stringIndex: number, fretNumber: number): boolean => {
    const chromaticValue = (STRING_TUNING[stringIndex] + fretNumber) % 12;
    // Only show if the chromatic value corresponds to actual natural notes (no sharps/flats)
    return NATURAL_NOTE_POSITIONS.includes(chromaticValue as typeof NATURAL_NOTE_POSITIONS[number]);
  };

  return {
    shapePositions,
    getShapeFret,
    getShapesAtPosition,
    createGradientStyle,
    isPentatonicNote,
    getPentatonicPositions,
    getNoteNameAtFret,
    shouldShowNoteName,
  };
}