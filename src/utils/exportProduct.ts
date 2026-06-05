import type { ExportProduct } from '@/types/exportPayload';
import type { Product } from '@/types/product';

type LegacyExportProduct = Product & {
  ean?: string;
  imageData?: string;
  imageMime?: 'image/jpeg';
};

export const normalizeExportProduct = (product: LegacyExportProduct): ExportProduct => {
  const { ean: _legacyEan, ...rest } = product;
  return {
    ...rest,
    eans: product.eans ?? (product.ean ? [product.ean] : []),
    tags: product.tags ?? [],
    customCookingFactor: product.customCookingFactor ?? null,
    imageUrl: product.imageUrl ?? null,
    imageData: product.imageData,
    imageMime: product.imageMime,
  };
};
