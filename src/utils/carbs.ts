import type { GlobalUnit } from '@/types/globalUnit';
import type { MealItem, MealItemQuantityType } from '@/types/mealItem';
import type { MealItemUnitType } from '@/types/mealItem';
import type { Product } from '@/types/product';
import type { ProductUnit } from '@/types/productUnit';
import type { CookingConversion } from '@/types/cookingConversion';
import { convertCookedToRaw } from '@/utils/cooking/convertCookedToRaw';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';

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

export const resolveItemGrams = (
  item: Pick<MealItem, 'quantity' | 'unitType' | 'unitId'>,
  product: Pick<Product, 'customUnits'>,
  globalUnits: GlobalUnit[],
): number => {
  const equivalent = resolveUnitEquivalent(
    item.unitType,
    item.unitId,
    product.customUnits,
    globalUnits,
  );
  return item.unitType === 'grams' ? item.quantity : gramsFromQuantity(item.quantity, equivalent);
};

export type MealItemCarbsResult = {
  carbs: number;
  rawEquivalentQuantity: number;
  quantityType: MealItemQuantityType;
};

export const computeMealItemCarbsWithCooking = (
  item: Pick<MealItem, 'quantity' | 'unitType' | 'unitId' | 'quantityType'>,
  product: Pick<Product, 'carbsPer100g' | 'customUnits' | 'tags' | 'customCookingFactor'>,
  globalUnits: GlobalUnit[],
  userConversions: CookingConversion[] = [],
): MealItemCarbsResult => {
  const grams = resolveItemGrams(item, product, globalUnits);
  const quantityType = item.quantityType ?? 'raw';

  const cookingApplies =
    item.unitType === 'grams' && hasCookingConversion(product, userConversions);
  const factor = cookingApplies ? getCookingFactor(product, userConversions) : null;

  if (cookingApplies && factor != null) {
    const rawEquivalentQuantity =
      quantityType === 'cooked' ? convertCookedToRaw(grams, factor) : grams;
    return {
      carbs: computeCarbs(rawEquivalentQuantity, product.carbsPer100g),
      rawEquivalentQuantity,
      quantityType,
    };
  }

  return {
    carbs: computeCarbs(grams, product.carbsPer100g),
    rawEquivalentQuantity: grams,
    quantityType: 'raw',
  };
};

export const computeMealItemCarbs = (
  item: Pick<MealItem, 'quantity' | 'unitType' | 'unitId' | 'quantityType'>,
  product: Pick<Product, 'carbsPer100g' | 'customUnits' | 'tags' | 'customCookingFactor'>,
  globalUnits: GlobalUnit[],
  userConversions: CookingConversion[] = [],
): number =>
  computeMealItemCarbsWithCooking(item, product, globalUnits, userConversions).carbs;

export const sumCarbs = (values: number[]): number =>
  values.reduce((acc, value) => acc + value, 0);
