import { type FC } from 'react';
import { Text, View } from 'react-native';

import { ProductImage, PRODUCT_IMAGE_THUMB_RADIUS } from '@/components/atoms/ProductImage';
import type { MealItem } from '@/types/mealItem';

type MealItemThumbnailsProps = {
  items: Pick<MealItem, 'id' | 'imageUrl'>[];
  size?: number;
  max?: number;
};

export const MealItemThumbnails: FC<MealItemThumbnailsProps> = ({
  items,
  size = 32,
  max = 4,
}) => {
  const withImage = items.filter((item) => item.imageUrl);
  if (withImage.length === 0) return null;

  const visible = withImage.slice(0, max);
  const extra = withImage.length - visible.length;

  return (
    <View className="flex-row items-center gap-1 shrink-0">
      {visible.map((item) => (
        <ProductImage key={item.id} uri={item.imageUrl!} size={size} />
      ))}
      {extra > 0 && (
        <View
          className="items-center justify-center px-1 bg-surface border border-border"
          style={{ minWidth: size, height: size, borderRadius: PRODUCT_IMAGE_THUMB_RADIUS }}>
          <Text className="text-muted text-sm">+{extra}</Text>
        </View>
      )}
    </View>
  );
};
