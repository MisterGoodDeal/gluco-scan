import type { UnitSystem } from '@/types/unitSystem';

export const GRAMS_PER_OZ = 28.349523125;

export const gramsToDisplayMass = (grams: number, unitSystem: UnitSystem): number =>
  unitSystem === 'metric' ? grams : grams / GRAMS_PER_OZ;

export const displayMassToGrams = (value: number, unitSystem: UnitSystem): number =>
  unitSystem === 'metric' ? value : value * GRAMS_PER_OZ;

export const defaultDisplayMassQuantity = (unitSystem: UnitSystem): number =>
  unitSystem === 'metric' ? 100 : Math.round(gramsToDisplayMass(100, 'imperial') * 10) / 10;
