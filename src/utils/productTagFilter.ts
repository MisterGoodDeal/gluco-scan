import type { Product } from '@/types/product';
import type { ProductTag } from '@/types/productTag';

export const productMatchesTagFilters = (
  product: Product,
  filters: ProductTag[],
): boolean => {
  if (filters.length === 0) return true;
  return filters.some((filter) => product.tags.includes(filter));
};
