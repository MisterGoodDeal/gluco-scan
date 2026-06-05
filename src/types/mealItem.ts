export type MealItemUnitType = 'grams' | 'custom';
export type MealItemQuantityType = 'raw' | 'cooked';

export interface MealItem {
  id: string;
  productId: string;
  quantity: number;
  unitType: MealItemUnitType;
  unitId?: string;
  quantityType?: MealItemQuantityType;
  rawEquivalentQuantity?: number;
  productName?: string;
  imageUrl?: string | null;
  carbs?: number;
  unitLabel?: string;
}
