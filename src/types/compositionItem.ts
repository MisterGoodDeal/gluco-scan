import type { MealItem } from '@/types/mealItem';

export interface CompositionItem extends MealItem {
  productName: string;
  imageUrl?: string | null;
  carbs: number;
  unitLabel: string;
  rawEquivalentQuantity: number;
}
