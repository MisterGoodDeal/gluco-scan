import type { ProductTag } from '@/types/productTag';

type OffTagMapping = {
  categories: string[];
  tags: ProductTag[];
};

const OFF_TAG_MAPPINGS: OffTagMapping[] = [
  {
    categories: ['en:pasta', 'en:penne', 'en:spaghetti', 'en:macaroni', 'en:tagliatelle', 'en:lasagna'],
    tags: ['starch', 'pasta'],
  },
  {
    categories: ['en:rice', 'en:white-rice', 'en:brown-rice'],
    tags: ['starch', 'rice'],
  },
  {
    categories: ['en:potatoes', 'en:potato-products', 'en:french-fries', 'en:mashed-potatoes'],
    tags: ['starch', 'potato'],
  },
  { categories: ['en:semolina'], tags: ['starch', 'semolina'] },
  { categories: ['en:couscous'], tags: ['starch', 'couscous'] },
  { categories: ['en:quinoa'], tags: ['starch', 'quinoa'] },
  { categories: ['en:bulgur'], tags: ['starch', 'bulgur'] },
  { categories: ['en:lentils'], tags: ['starch', 'lentils'] },
  { categories: ['en:chickpeas'], tags: ['starch', 'chickpeas'] },
  {
    categories: ['en:beans', 'en:red-beans', 'en:white-beans', 'en:kidney-beans'],
    tags: ['starch', 'beans'],
  },
  {
    categories: ['en:bread', 'en:baguettes', 'en:sandwich-breads'],
    tags: ['starch', 'bread'],
  },
];

export const mapOffCategoriesToTags = (categories: string[]): ProductTag[] => {
  const normalized = new Set(categories.map((category) => category.toLowerCase()));
  const tags = new Set<ProductTag>();

  for (const mapping of OFF_TAG_MAPPINGS) {
    if (mapping.categories.some((category) => normalized.has(category))) {
      for (const tag of mapping.tags) {
        tags.add(tag);
      }
    }
  }

  return [...tags];
};
