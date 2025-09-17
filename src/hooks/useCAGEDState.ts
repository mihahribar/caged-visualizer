import { useReducer } from 'react';
import type { ChordType, ChordQuality } from '../types';

interface CAGEDState {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  currentPosition: number;
  showAllShapes: boolean;
  showPentatonic: boolean;
  showAllNotes: boolean;
}

type CAGEDAction =
  | { type: 'SET_CHORD'; payload: ChordType }
  | { type: 'SET_CHORD_QUALITY'; payload: ChordQuality }
  | { type: 'NEXT_POSITION'; payload: { sequenceLength: number } }
  | { type: 'PREVIOUS_POSITION'; payload: { sequenceLength: number } }
  | { type: 'SET_POSITION'; payload: number }
  | { type: 'TOGGLE_SHOW_ALL_SHAPES' }
  | { type: 'TOGGLE_SHOW_PENTATONIC' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' };

function cagedReducer(state: CAGEDState, action: CAGEDAction): CAGEDState {
  switch (action.type) {
    case 'SET_CHORD':
      return {
        ...state,
        selectedChord: action.payload,
        currentPosition: 0, // Reset to first position when changing chord
      };
    case 'SET_CHORD_QUALITY':
      return {
        ...state,
        chordQuality: action.payload,
        currentPosition: 0, // Reset to first position when changing quality
      };
    case 'NEXT_POSITION':
      return {
        ...state,
        currentPosition: (state.currentPosition + 1) % action.payload.sequenceLength,
      };
    case 'PREVIOUS_POSITION':
      return {
        ...state,
        currentPosition: (state.currentPosition - 1 + action.payload.sequenceLength) % action.payload.sequenceLength,
      };
    case 'SET_POSITION':
      return {
        ...state,
        currentPosition: action.payload,
      };
    case 'TOGGLE_SHOW_ALL_SHAPES':
      return {
        ...state,
        showAllShapes: !state.showAllShapes,
      };
    case 'TOGGLE_SHOW_PENTATONIC':
      return {
        ...state,
        showPentatonic: !state.showPentatonic,
      };
    case 'TOGGLE_SHOW_ALL_NOTES':
      return {
        ...state,
        showAllNotes: !state.showAllNotes,
      };
    default:
      return state;
  }
}

const initialState: CAGEDState = {
  selectedChord: 'C',
  chordQuality: 'major',
  currentPosition: 0,
  showAllShapes: false,
  showPentatonic: false,
  showAllNotes: false,
};

export function useCAGEDState() {
  const [state, dispatch] = useReducer(cagedReducer, initialState);
  
  const actions = {
    setChord: (chord: ChordType) => dispatch({ type: 'SET_CHORD', payload: chord }),
    setChordQuality: (quality: ChordQuality) => dispatch({ type: 'SET_CHORD_QUALITY', payload: quality }),
    nextPosition: (sequenceLength: number) => dispatch({ type: 'NEXT_POSITION', payload: { sequenceLength } }),
    previousPosition: (sequenceLength: number) => dispatch({ type: 'PREVIOUS_POSITION', payload: { sequenceLength } }),
    setPosition: (position: number) => dispatch({ type: 'SET_POSITION', payload: position }),
    toggleShowAllShapes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_SHAPES' }),
    toggleShowPentatonic: () => dispatch({ type: 'TOGGLE_SHOW_PENTATONIC' }),
    toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
  };
  
  return {
    state,
    actions,
  };
}