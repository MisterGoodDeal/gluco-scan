import type { MealItem } from '@/types/mealItem';
import type { MealType } from '@/types/mealType';

export interface Meal {
  id: string;
  type: MealType;
  date: string;
  createdAt: string;
  items: MealItem[];
  totalCarbs: number;
  sourceCompositionId?: string | null;
  sourceCompositionName?: string | null;
}
