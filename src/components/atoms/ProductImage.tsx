import { Image } from 'expo-image';
import { type FC } from 'react';
import { useTheme } from 'styled-components/native';

const DEFAULT_SIZE = 52;
const THUMB_MAX_SIZE = 40;
export const PRODUCT_IMAGE_THUMB_RADIUS = 4;

type ProductImageProps = {
  uri: string;
  size?: number;
};

export const ProductImage: FC<ProductImageProps> = ({ uri, size = DEFAULT_SIZE }) => {
  const theme = useTheme();
  const borderRadius =
    size <= THUMB_MAX_SIZE ? PRODUCT_IMAGE_THUMB_RADIUS : theme.radius.sm;

  return (
    <Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: theme.colors.glass.background,
        borderWidth: 1,
        borderColor: theme.colors.glass.border,
      }}
      contentFit="cover"
      accessibilityIgnoresInvertColors
    />
  );
};
