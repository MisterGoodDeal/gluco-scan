import type { Product } from '@/types/product';

export const productMatchesQuery = (product: Product, query: string): boolean => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;
  return (
    product.name.toLowerCase().includes(trimmed) ||
    product.eans.some((ean) => ean.includes(trimmed))
  );
};
