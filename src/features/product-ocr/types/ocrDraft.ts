import type { ProductTag } from '@/types/productTag';

export type ProductAddMethod = 'ean' | 'ocr' | 'off';

/** Whether the matched nutrition values are for raw or cooked product. */
export type NutritionLabelBasis = 'raw' | 'cooked' | 'unknown';

export type ProductFormDraft = {
  ean?: string;
  name?: string;
  carbsPer100g?: number;
  imageUrl?: string;
  tags?: ProductTag[];
  source: 'off' | 'ocr' | 'manual';
};

export type ParsedNutritionLabel = {
  /** Value as printed on the label (raw or cooked / 100 g depending on `basis`). */
  carbsPer100g: number | null;
  name: string | null;
  confidence: 'high' | 'medium' | 'low';
  matchedLine?: string;
  sectionHeader?: string;
  basis: NutritionLabelBasis;
  rawText: string;
};
