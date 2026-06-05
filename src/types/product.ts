import type { ProductTag } from '@/types/productTag';
import type { ProductUnit } from '@/types/productUnit';

export interface Product {
  id: string;
  eans: string[];
  name: string;
  carbsPer100g: number;
  imageUrl?: string | null;
  tags: ProductTag[];
  customCookingFactor?: number | null;
  customUnits: ProductUnit[];
  usageCount?: number;
}
