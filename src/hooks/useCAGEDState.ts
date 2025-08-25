import { useReducer } from 'react';
import type { ChordType } from '../types';

interface CAGEDState {
  selectedChord: ChordType;
  currentPosition: number;
  showAllShapes: boolean;
}

type CAGEDAction =
  | { type: 'SET_CHORD'; payload: ChordType }
  | { type: 'NEXT_POSITION'; payload: { sequenceLength: number } }
  | { type: 'PREVIOUS_POSITION'; payload: { sequenceLength: number } }
  | { type: 'SET_POSITION'; payload: number }
  | { type: 'TOGGLE_SHOW_ALL_SHAPES' };

function cagedReducer(state: CAGEDState, action: CAGEDAction): CAGEDState {
  switch (action.type) {
    case 'SET_CHORD':
      return {
        ...state,
        selectedChord: action.payload,
        currentPosition: 0, // Reset to first position when changing chord
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
    default:
      return state;
  }
}

const initialState: CAGEDState = {
  selectedChord: 'C',
  currentPosition: 0,
  showAllShapes: false,
};

export function useCAGEDState() {
  const [state, dispatch] = useReducer(cagedReducer, initialState);
  
  const actions = {
    setChord: (chord: ChordType) => dispatch({ type: 'SET_CHORD', payload: chord }),
    nextPosition: (sequenceLength: number) => dispatch({ type: 'NEXT_POSITION', payload: { sequenceLength } }),
    previousPosition: (sequenceLength: number) => dispatch({ type: 'PREVIOUS_POSITION', payload: { sequenceLength } }),
    setPosition: (position: number) => dispatch({ type: 'SET_POSITION', payload: position }),
    toggleShowAllShapes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_SHAPES' }),
  };
  
  return {
    state,
    actions,
  };
}