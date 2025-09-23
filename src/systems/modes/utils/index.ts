// Core music theory utilities
export {
  CHROMATIC_NOTES,
  NOTE_TO_NUMBER,
  STANDARD_TUNING,
  noteToNumber,
  numberToNote,
  getInterval,
  transposeNote,
  transposeIntervals,
  getNoteAtFret,
  getChromaticScale,
  areEnharmonic,
  getFretInterval,
  isValidChromaticNote
} from './musicTheory';

// Mode calculation functions
export {
  calculateModeIntervals,
  calculateModePattern,
  getRootPositions,
  calculateModeBox,
  getModeScaleDegrees,
  findNearestRoot,
  getModeInfo,
  validateModePattern
} from './modeCalculations';

// Fretboard mapping utilities
export {
  modePositionToFretboardPosition,
  modePositionsToFretboardPositions,
  getModePositionsForDisplay,
  getRootPositionsForDisplay,
  createDisplayPositions,
  filterPositionsByFretRange,
  groupPositionsByString,
  getPositionBoxPositions,
  getOptimalDisplayRange,
  positionsOverlap,
  removeDuplicatePositions
} from './fretboardMapping';

export type { DisplayModePosition } from './fretboardMapping';

// Interval calculation helpers
export {
  INTERVAL_NAMES,
  SCALE_DEGREE_NAMES,
  getIntervalName,
  getScaleDegree,
  getScaleDegreeName,
  calculateInterval,
  getModeIntervalInfo,
  findNotesAtInterval,
  getModeCharacteristics,
  calculateHarmonicIntervals,
  getPerfectIntervals,
  analyzeModeStructure
} from './intervalHelpers';

// Note name resolution utilities
export {
  ENHARMONIC_EQUIVALENTS,
  getPreferredNoteName,
  formatNoteForDisplay,
  getPositionDisplayInfo,
  resolvePatternNoteNames,
  getUniqueNoteNames,
  createNoteNameMap,
  getScaleNoteNames,
  isValidNoteName,
  parseNoteName,
  calculateOctave,
  formatNoteWithOctave
} from './noteResolution';

export type { NoteNamingContext } from './noteResolution';

// Shared integration utilities
export {
  convertModesToSharedString,
  convertSharedToModesString,
  getSharedNoteAtFret,
  getSharedNoteNameAtFret,
  modePositionToSharedFretboard,
  sharedFretboardToModePosition,
  validateStringMapping,
  crossValidateCalculations,
  runIntegrationValidations,
  getChromaticValue,
  getChromaticNoteName
} from './sharedIntegration';

// Final validation and production readiness
export {
  runFinalValidation,
  isProductionReady,
  getFinalValidationReport
} from './final-validation';

export type { FinalValidationResult } from './final-validation';
