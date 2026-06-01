import type { Product } from '@/types/product';

type LegacyExportProduct = Product & { ean?: string };

export const normalizeExportProduct = (product: LegacyExportProduct): Product => {
  const { ean: _legacyEan, ...rest } = product;
  return {
    ...rest,
    eans: product.eans ?? (product.ean ? [product.ean] : []),
  };
};
