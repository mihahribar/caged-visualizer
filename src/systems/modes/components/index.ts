// Main components
export { ModesVisualizer } from './ModesVisualizer';
export { ModesNavigation } from './ModesNavigation';
export { ModesDisplay } from './ModesDisplay';
export { ModesToggles } from './ModesToggles';
export { ModesInfo } from './ModesInfo';

// Component types
export type { ModesVisualizerProps } from './ModesVisualizer';
export type { ModesNavigationProps } from './ModesNavigation';
export type { ModesDisplayProps } from './ModesDisplay';
export type { ModesTogglesProps } from './ModesToggles';
export type { ModesInfoProps } from './ModesInfo';

// Default exports (for easier importing)
export { default as ModesVisualizerDefault } from './ModesVisualizer';
export { default as ModesNavigationDefault } from './ModesNavigation';
export { default as ModesDisplayDefault } from './ModesDisplay';
export { default as ModesTogglesDefault } from './ModesToggles';
export { default as ModesInfoDefault } from './ModesInfo';

// Validation utilities
export {
  validateModesHookReturn,
  validateComponentProps,
  validateDisplayPositions,
  testComponentSafety,
  validateKeyboardHandling,
  runComponentValidations
} from './component-validation';