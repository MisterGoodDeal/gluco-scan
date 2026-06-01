import type { ProductUnit } from '@/types/productUnit';

export interface Product {
  id: string;
  eans: string[];
  name: string;
  carbsPer100g: number;
  customUnits: ProductUnit[];
  usageCount?: number;
}
