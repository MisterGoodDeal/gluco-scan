import type { ProductTag } from '@/types/productTag';

export type ProductTagFilter = ProductTag | 'all';

export const PRODUCT_TAG_FILTERS: ProductTagFilter[] = [
  'all',
  'starch',
  'pasta',
  'rice',
  'potato',
  'quinoa',
  'lentils',
  'fruit',
  'vegetable',
];
