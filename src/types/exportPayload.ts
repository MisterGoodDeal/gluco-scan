import type { AppPreferences } from '@/types/appPreferences';
import type { CookingConversion } from '@/types/cookingConversion';
import type { GlobalUnit } from '@/types/globalUnit';
import type { Meal } from '@/types/meal';
import type { Product } from '@/types/product';

export type ExportProduct = Product & {
  imageData?: string;
  imageMime?: 'image/jpeg';
};

export interface ExportPayload {
  version: number;
  exportedAt: string;
  products: ExportProduct[];
  meals: Meal[];
  globalUnits: GlobalUnit[];
  cookingConversions?: CookingConversion[];
  preferences?: AppPreferences;
  metadata?: {
    tutorial?: boolean;
  };
}
