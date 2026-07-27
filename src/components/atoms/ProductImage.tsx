import { Image } from 'expo-image';
import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';

import { resolveProductImage } from '@/services/productImage.service';

const DEFAULT_SIZE = 52;
const THUMB_MAX_SIZE = 40;
export const PRODUCT_IMAGE_THUMB_RADIUS = 4;

type ProductImageProps = {
  uri: string | null | undefined;
  size?: number;
};

export const ProductImage: FC<ProductImageProps> = ({ uri, size = DEFAULT_SIZE }) => {
  const [surfaceColor, borderColor] = useThemeColor(['surface-secondary', 'border']);
  const resolved = resolveProductImage(uri);
  const borderRadius = size <= THUMB_MAX_SIZE ? PRODUCT_IMAGE_THUMB_RADIUS : 12;

  if (!resolved) return null;

  return (
    <Image
      key={resolved.cacheKey}
      source={{ uri: resolved.uri, cacheKey: resolved.cacheKey }}
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: surfaceColor,
        borderWidth: 1,
        borderColor,
      }}
      contentFit="cover"
      accessibilityIgnoresInvertColors
    />
  );
};
