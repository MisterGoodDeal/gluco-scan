import type { Product } from '@/types/product';
import { normalizeForSearch } from '@/utils/text';

export const productMatchesQuery = (product: Product, query: string): boolean => {
  const trimmed = query.trim();
  if (!trimmed) return true;
  const normalizedQuery = normalizeForSearch(trimmed);
  return (
    normalizeForSearch(product.name).includes(normalizedQuery) ||
    product.eans.some((ean) => ean.includes(trimmed))
  );
};
