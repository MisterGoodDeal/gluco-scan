import type { Product } from '@/types/product';
import type { CookingConversion } from '@/types/cookingConversion';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';

export const hasCookingConversion = (
  product: Pick<Product, 'tags' | 'customCookingFactor'>,
  userConversions: CookingConversion[] = [],
): boolean => {
  if (!product.tags.includes('starch')) return false;
  return getCookingFactor(product, userConversions) != null;
};
