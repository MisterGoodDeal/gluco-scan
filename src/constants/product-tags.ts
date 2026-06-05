import type { FaIconName } from '@/constants/fontAwesome';
import type { ProductTag } from '@/types/productTag';

export interface ProductTagMetadata {
  tag: ProductTag;
  icon: FaIconName;
  color: string;
  translationKey: `tags.${ProductTag}`;
}

export const PRODUCT_TAGS: ProductTagMetadata[] = [
  {
    tag: 'starch',
    icon: 'wheat',
    color: '#D4A373',
    translationKey: 'tags.starch',
  },
  {
    tag: 'pasta',
    icon: 'plate-wheat',
    color: '#F4A261',
    translationKey: 'tags.pasta',
  },
  {
    tag: 'rice',
    icon: 'bowl-rice',
    color: '#E9C46A',
    translationKey: 'tags.rice',
  },
  {
    tag: 'potato',
    icon: 'pumpkin',
    color: '#C89F68',
    translationKey: 'tags.potato',
  },
  {
    tag: 'semolina',
    icon: 'cookie',
    color: '#E7B95A',
    translationKey: 'tags.semolina',
  },
  {
    tag: 'couscous',
    icon: 'stroopwafel',
    color: '#E7B95A',
    translationKey: 'tags.couscous',
  },
  {
    tag: 'quinoa',
    icon: 'bowl-food',
    color: '#D9A05B',
    translationKey: 'tags.quinoa',
  },
  {
    tag: 'bulgur',
    icon: 'bowl-scoop',
    color: '#D6A15C',
    translationKey: 'tags.bulgur',
  },
  {
    tag: 'lentils',
    icon: 'cloud-meatball',
    color: '#8E7C68',
    translationKey: 'tags.lentils',
  },
  {
    tag: 'chickpeas',
    icon: 'falafel',
    color: '#D9B26F',
    translationKey: 'tags.chickpeas',
  },
  {
    tag: 'beans',
    icon: 'seedling',
    color: '#A66A4C',
    translationKey: 'tags.beans',
  },
  {
    tag: 'bread',
    icon: 'bread-loaf',
    color: '#D4A373',
    translationKey: 'tags.bread',
  },
  {
    tag: 'cereal',
    icon: 'jar-wheat',
    color: '#E7B95A',
    translationKey: 'tags.cereal',
  },
  {
    tag: 'fruit',
    icon: 'apple-whole',
    color: '#EF476F',
    translationKey: 'tags.fruit',
  },
  {
    tag: 'vegetable',
    icon: 'carrot',
    color: '#2A9D8F',
    translationKey: 'tags.vegetable',
  },
  {
    tag: 'protein',
    icon: 'steak',
    color: '#E76F51',
    translationKey: 'tags.protein',
  },
  {
    tag: 'dairy',
    icon: 'cheese-swiss',
    color: '#8ECAE6',
    translationKey: 'tags.dairy',
  },
  {
    tag: 'dessert',
    icon: 'cake-slice',
    color: '#FF70A6',
    translationKey: 'tags.dessert',
  },
  {
    tag: 'drink',
    icon: 'cup-straw-swoosh',
    color: '#219EBC',
    translationKey: 'tags.drink',
  },
  {
    tag: 'snack',
    icon: 'sandwich',
    color: '#F9844A',
    translationKey: 'tags.snack',
  },
  {
    tag: 'sweet',
    icon: 'lollipop',
    color: '#FF5D8F',
    translationKey: 'tags.sweet',
  },
  {
    tag: 'other',
    icon: 'tag',
    color: '#9CA3AF',
    translationKey: 'tags.other',
  },
];
