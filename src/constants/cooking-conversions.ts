import type { CookingConversion } from '@/types/cookingConversion';

export const DEFAULT_COOKING_CONVERSIONS: CookingConversion[] = [
  { tag: 'pasta', cookedFactor: 2.5 },
  { tag: 'rice', cookedFactor: 3 },
  { tag: 'semolina', cookedFactor: 2.7 },
  { tag: 'couscous', cookedFactor: 2.7 },
  { tag: 'quinoa', cookedFactor: 2.7 },
  { tag: 'bulgur', cookedFactor: 2.5 },
  { tag: 'lentils', cookedFactor: 2.3 },
  { tag: 'chickpeas', cookedFactor: 2.4 },
  { tag: 'beans', cookedFactor: 2.3 },
  { tag: 'potato', cookedFactor: 1 },
  { tag: 'bread', cookedFactor: 1 },
  { tag: 'cereal', cookedFactor: 1.5 },
];
