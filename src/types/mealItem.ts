export type MealItemUnitType = 'grams' | 'custom';

export interface MealItem {
  id: string;
  productId: string;
  quantity: number;
  unitType: MealItemUnitType;
  unitId?: string;
  productName?: string;
  imageUrl?: string | null;
  carbs?: number;
  unitLabel?: string;
}
