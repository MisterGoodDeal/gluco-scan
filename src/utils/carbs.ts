export const computeCarbs = (grams: number, carbsPer100g: number): number =>
  (carbsPer100g * grams) / 100;
