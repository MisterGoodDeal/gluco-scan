import type { ProductTag } from '@/types/productTag';
import { sortProductTags } from '@/utils/tags/sortProductTags';

export const CATEGORY_TAGS: ProductTag[] = [
  'pasta',
  'rice',
  'potato',
  'fruit',
  'dessert',
  'drink',
  'vegetable',
];

export const STARCH_BREAKDOWN_TAGS: ProductTag[] = [
  'pasta',
  'rice',
  'potato',
  'semolina',
  'couscous',
  'quinoa',
  'lentils',
];

export const getPrimaryTag = (tags: ProductTag[]): ProductTag | null => {
  const sorted = sortProductTags(tags).filter((tag) => tag !== 'starch');
  return sorted[0] ?? null;
};

export const getStarchBreakdownTag = (tags: ProductTag[]): ProductTag | null => {
  if (!tags.includes('starch')) return null;
  for (const tag of STARCH_BREAKDOWN_TAGS) {
    if (tags.includes(tag)) return tag;
  }
  return null;
};
