import { DEFAULT_COOKING_CONVERSIONS } from '@/constants/cooking-conversions';
import type { CookingConversion } from '@/types/cookingConversion';
import type { ProductTag } from '@/types/productTag';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';

/** Tags that carry a raw↔cooked conversion factor (excl. starch itself). */
export const OCR_COOKING_TYPE_TAGS: ProductTag[] = DEFAULT_COOKING_CONVERSIONS.map(
  (conversion) => conversion.tag,
);

/**
 * GlucoScan stores `carbsPer100g` on a raw basis.
 * Cooked label value → raw: multiply by cookedFactor (cooked g per 1 g raw).
 */
export const convertCookedCarbsPer100gToRaw = (
  cookedCarbsPer100g: number,
  tags: ProductTag[],
  userConversions: CookingConversion[] = [],
): number | null => {
  const factor = getCookingFactor(
    { tags: tags.includes('starch') ? tags : ['starch', ...tags], customCookingFactor: null },
    userConversions,
  );
  if (factor == null || factor <= 0) return null;
  const raw = cookedCarbsPer100g * factor;
  if (!Number.isFinite(raw) || raw < 0) return null;
  // Round to 1 decimal (label precision)
  return Math.round(raw * 10) / 10;
};

export const buildOcrCookingTags = (cookingType: ProductTag): ProductTag[] => {
  if (cookingType === 'starch') return ['starch'];
  return ['starch', cookingType];
};
