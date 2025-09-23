// Master hook (recommended)
export { useModes } from './useModes';
export type { UseModesReturn, ModesHookOptions } from './useModes';

// Individual hooks
export { useModesState } from './useModesState';
export { useModesLogic } from './useModesLogic';
export { useModesNavigation } from './useModesNavigation';
export { useModesDisplay } from './useModesDisplay';
export { useModesKeyboard } from './useModesKeyboard';
export { useModesStorage } from './useModesStorage';

// Hook types
export type { UseModesStateReturn } from './useModesState';
export type { UseModesLogicReturn } from './useModesLogic';
export type { UseModesNavigationReturn } from './useModesNavigation';
export type { UseModesDisplayReturn } from './useModesDisplay';
export type { UseModesKeyboardReturn } from './useModesKeyboard';
export type { UseModesStorageReturn } from './useModesStorage';

// Option types
export type { ModesLogicOptions } from './useModesLogic';
export type { ModesNavigationOptions } from './useModesNavigation';
export type { ModesDisplayOptions, ModesDisplayState } from './useModesDisplay';
export type { KeyboardMapping, KeyboardNavigationOptions } from './useModesKeyboard';
export type { StorageOptions, ModesUserPreferences, ModesSessionData } from './useModesStorage';

// Validation utilities
export {
  validateModeState,
  validateSystemState,
  validateStateTransition,
  testDefaultState,
  testAllModeStates,
  testAllRootPositions,
  runStateValidations
} from './state-validation';