import type { AppPreferences } from '@/types/appPreferences';
import type { GlobalUnit } from '@/types/globalUnit';
import type { Meal } from '@/types/meal';
import type { Product } from '@/types/product';

export interface ExportPayload {
  version: number;
  exportedAt: string;
  products: Product[];
  meals: Meal[];
  globalUnits: GlobalUnit[];
  preferences?: AppPreferences;
  metadata?: {
    tutorial?: boolean;
  };
}
