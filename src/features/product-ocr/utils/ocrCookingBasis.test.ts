import { describe, expect, it } from 'vitest';

import {
  buildOcrCookingTags,
  convertCookedCarbsPer100gToRaw,
} from '@/features/product-ocr/utils/ocrCookingBasis';

describe('ocrCookingBasis', () => {
  it('converts cooked carbs to raw using pasta factor 2.5', () => {
    // 11.7 g / 100 g cooked × 2.5 ≈ 29.3 g / 100 g raw
    expect(convertCookedCarbsPer100gToRaw(11.7, ['starch', 'pasta'])).toBe(29.3);
  });

  it('converts using lentils factor 2.3', () => {
    expect(convertCookedCarbsPer100gToRaw(11.7, buildOcrCookingTags('lentils'))).toBe(26.9);
  });

  it('returns null without a convertible tag', () => {
    expect(convertCookedCarbsPer100gToRaw(11.7, ['starch'])).toBeNull();
  });

  it('buildOcrCookingTags always includes starch', () => {
    expect(buildOcrCookingTags('rice')).toEqual(['starch', 'rice']);
  });
});
