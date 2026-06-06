import type { MealItemQuantityType, MealItemUnitType } from '@/types/mealItem';
import type { MealType } from '@/types/mealType';
import type { ProductTag } from '@/types/productTag';

export type EnrichedMealItem = {
  id: string;
  productId: string;
  productName: string;
  productTags: ProductTag[];
  quantity: number;
  unitType: MealItemUnitType;
  unitId?: string;
  quantityType?: MealItemQuantityType;
  rawEquivalentQuantity?: number;
  carbs: number;
};

export type EnrichedMealRecord = {
  id: string;
  type: MealType;
  date: string;
  createdAt: string;
  totalCarbs: number;
  items: EnrichedMealItem[];
};
