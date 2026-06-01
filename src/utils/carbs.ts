import type { GlobalUnit } from '@/types/globalUnit';
import type { MealItem } from '@/types/mealItem';
import type { MealItemUnitType } from '@/types/mealItem';
import type { Product } from '@/types/product';
import type { ProductUnit } from '@/types/productUnit';

export const computeCarbs = (grams: number, carbsPer100g: number): number =>
  (carbsPer100g * grams) / 100;

export const gramsFromQuantity = (
  quantity: number,
  equivalentInGrams: number,
): number => quantity * equivalentInGrams;

export const computeItemCarbs = (
  quantity: number,
  unitType: MealItemUnitType,
  carbsPer100g: number,
  equivalentInGrams = 1,
): number => {
  const grams =
    unitType === 'grams' ? quantity : gramsFromQuantity(quantity, equivalentInGrams);
  return computeCarbs(grams, carbsPer100g);
};

export const resolveUnitEquivalent = (
  unitType: MealItemUnitType,
  unitId: string | undefined,
  productUnits: ProductUnit[],
  globalUnits: GlobalUnit[],
): number => {
  if (unitType === 'grams') return 1;
  const productUnit = productUnits.find((u) => u.id === unitId);
  if (productUnit) return productUnit.equivalentInGrams;
  const globalUnit = globalUnits.find((u) => u.id === unitId);
  if (globalUnit) return globalUnit.equivalentInGrams;
  return 1;
};

export const computeMealItemCarbs = (
  item: Pick<MealItem, 'quantity' | 'unitType' | 'unitId'>,
  product: Pick<Product, 'carbsPer100g' | 'customUnits'>,
  globalUnits: GlobalUnit[],
): number => {
  const equivalent = resolveUnitEquivalent(
    item.unitType,
    item.unitId,
    product.customUnits,
    globalUnits,
  );
  return computeItemCarbs(item.quantity, item.unitType, product.carbsPer100g, equivalent);
};

export const sumCarbs = (values: number[]): number =>
  values.reduce((acc, value) => acc + value, 0);
