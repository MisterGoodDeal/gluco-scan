import type { Product } from '@/types/product';
import type { ProductTagFilter } from '@/constants/product-tag-filters';

export const productMatchesTagFilter = (
  product: Product,
  filter: ProductTagFilter,
): boolean => {
  if (filter === 'all') return true;
  if (filter === 'starch') return product.tags.includes('starch');
  return product.tags.includes(filter);
};
