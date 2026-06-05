import type { ProductTag } from '@/types/productTag';

const TAG_PRIORITY: ProductTag[] = [
  'pasta',
  'rice',
  'potato',
  'semolina',
  'couscous',
  'quinoa',
  'bulgur',
  'lentils',
  'chickpeas',
  'beans',
  'bread',
  'cereal',
  'starch',
  'protein',
  'dairy',
  'fruit',
  'vegetable',
  'dessert',
  'drink',
  'snack',
  'sweet',
  'other',
];

const priorityIndex = new Map<ProductTag, number>(
  TAG_PRIORITY.map((tag, index) => [tag, index]),
);

export const sortProductTags = (tags: ProductTag[]): ProductTag[] =>
  [...tags].sort(
    (left, right) =>
      (priorityIndex.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (priorityIndex.get(right) ?? Number.MAX_SAFE_INTEGER),
  );
