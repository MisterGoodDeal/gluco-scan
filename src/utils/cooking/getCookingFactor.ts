import { DEFAULT_COOKING_CONVERSIONS } from '@/constants/cooking-conversions';
import type { CookingConversion } from '@/types/cookingConversion';
import type { Product } from '@/types/product';
import type { ProductTag } from '@/types/productTag';
import { sortProductTags } from '@/utils/tags/sortProductTags';

const DEFAULT_FACTOR_BY_TAG = new Map<ProductTag, number>(
  DEFAULT_COOKING_CONVERSIONS.map((conversion) => [conversion.tag, conversion.cookedFactor]),
);

const CONVERTIBLE_TAGS = new Set<ProductTag>(
  DEFAULT_COOKING_CONVERSIONS.map((conversion) => conversion.tag),
);

export const getConvertibleTag = (tags: ProductTag[]): ProductTag | null => {
  const sorted = sortProductTags(tags);
  return sorted.find((tag) => CONVERTIBLE_TAGS.has(tag)) ?? null;
};

export const getCookingFactor = (
  product: Pick<Product, 'tags' | 'customCookingFactor'>,
  userConversions: CookingConversion[] = [],
): number | null => {
  if (product.customCookingFactor != null && product.customCookingFactor > 0) {
    return product.customCookingFactor;
  }

  const convertibleTag = getConvertibleTag(product.tags);
  if (!convertibleTag) return null;

  const userConversion = userConversions.find((conversion) => conversion.tag === convertibleTag);
  if (userConversion) return userConversion.cookedFactor;

  return DEFAULT_FACTOR_BY_TAG.get(convertibleTag) ?? null;
};
