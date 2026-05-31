import type { Product } from '@/types/product';

export type ScannedItem = {
  id: string;
  product: Product;
  grams: number;
};
