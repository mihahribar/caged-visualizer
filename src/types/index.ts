export interface CAGEDShape {
  name: string;
  color: string;
  pattern: number[];
  fingers: number[];
}

export interface CAGEDShapeData {
  [key: string]: CAGEDShape;
}

export type ChordType = 'C' | 'A' | 'G' | 'E' | 'D';

export interface ChromaticValues {
  [key: string]: number;
}

export interface ShapePositions {
  [key: string]: number;
}