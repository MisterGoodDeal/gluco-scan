import type { SymbolViewProps } from 'expo-symbols';

import type { ProductTag } from '@/types/productTag';

export interface ProductTagMetadata {
  tag: ProductTag;
  icon: SymbolViewProps['name'];
  color: string;
  translationKey: `tags.${ProductTag}`;
}

export const PRODUCT_TAGS: ProductTagMetadata[] = [
  {
    tag: 'starch',
    icon: { ios: 'leaf.fill', android: 'grass' },
    color: '#D4A373',
    translationKey: 'tags.starch',
  },
  {
    tag: 'pasta',
    icon: { ios: 'fork.knife', android: 'restaurant' },
    color: '#F4A261',
    translationKey: 'tags.pasta',
  },
  {
    tag: 'rice',
    icon: { ios: 'leaf', android: 'eco' },
    color: '#E9C46A',
    translationKey: 'tags.rice',
  },
  {
    tag: 'potato',
    icon: { ios: 'carrot.fill', android: 'nutrition' },
    color: '#C89F68',
    translationKey: 'tags.potato',
  },
  {
    tag: 'semolina',
    icon: { ios: 'circle.grid.2x2.fill', android: 'grain' },
    color: '#E7B95A',
    translationKey: 'tags.semolina',
  },
  {
    tag: 'couscous',
    icon: { ios: 'circle.grid.2x2', android: 'grain' },
    color: '#E7B95A',
    translationKey: 'tags.couscous',
  },
  {
    tag: 'quinoa',
    icon: { ios: 'circle.grid.3x3.fill', android: 'spa' },
    color: '#D9A05B',
    translationKey: 'tags.quinoa',
  },
  {
    tag: 'bulgur',
    icon: { ios: 'circle.grid.3x3', android: 'spa' },
    color: '#D6A15C',
    translationKey: 'tags.bulgur',
  },
  {
    tag: 'lentils',
    icon: { ios: 'circle.fill', android: 'lens' },
    color: '#8E7C68',
    translationKey: 'tags.lentils',
  },
  {
    tag: 'chickpeas',
    icon: { ios: 'circle.circle.fill', android: 'adjust' },
    color: '#D9B26F',
    translationKey: 'tags.chickpeas',
  },
  {
    tag: 'beans',
    icon: { ios: 'oval.fill', android: 'lens' },
    color: '#A66A4C',
    translationKey: 'tags.beans',
  },
  {
    tag: 'bread',
    icon: { ios: 'square.fill', android: 'bakery_dining' },
    color: '#D4A373',
    translationKey: 'tags.bread',
  },
  {
    tag: 'cereal',
    icon: { ios: 'square.grid.2x2.fill', android: 'breakfast_dining' },
    color: '#E7B95A',
    translationKey: 'tags.cereal',
  },
  {
    tag: 'fruit',
    icon: { ios: 'apple.logo', android: 'local_grocery_store' },
    color: '#EF476F',
    translationKey: 'tags.fruit',
  },
  {
    tag: 'vegetable',
    icon: { ios: 'carrot', android: 'eco' },
    color: '#2A9D8F',
    translationKey: 'tags.vegetable',
  },
  {
    tag: 'protein',
    icon: { ios: 'flame.fill', android: 'local_fire_department' },
    color: '#E76F51',
    translationKey: 'tags.protein',
  },
  {
    tag: 'dairy',
    icon: { ios: 'cup.and.saucer.fill', android: 'local_cafe' },
    color: '#8ECAE6',
    translationKey: 'tags.dairy',
  },
  {
    tag: 'dessert',
    icon: { ios: 'birthday.cake.fill', android: 'cake' },
    color: '#FF70A6',
    translationKey: 'tags.dessert',
  },
  {
    tag: 'drink',
    icon: { ios: 'drop.fill', android: 'water_drop' },
    color: '#219EBC',
    translationKey: 'tags.drink',
  },
  {
    tag: 'snack',
    icon: { ios: 'takeoutbag.and.cup.and.straw.fill', android: 'fastfood' },
    color: '#F9844A',
    translationKey: 'tags.snack',
  },
  {
    tag: 'sweet',
    icon: { ios: 'heart.fill', android: 'favorite' },
    color: '#FF5D8F',
    translationKey: 'tags.sweet',
  },
  {
    tag: 'other',
    icon: { ios: 'tag.fill', android: 'label' },
    color: '#9CA3AF',
    translationKey: 'tags.other',
  },
];
