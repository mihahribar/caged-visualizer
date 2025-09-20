/**
 * Shared module barrel exports
 *
 * This file re-exports all shared modules for easy importing
 * across different learning systems.
 */

// Type exports
export type * from './types/core';
export type * from './types/fretboard';

// Utility exports
export * from './utils/musicTheory';
export * from './utils/chordUtils';

// Hook exports
export * from './hooks';

// Constant exports
export * from './constants/magicNumbers';

// Component exports
export { default as FretboardDisplay } from './components/FretboardDisplay';