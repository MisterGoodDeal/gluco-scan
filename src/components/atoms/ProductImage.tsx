import { Image } from 'expo-image';
import { type FC } from 'react';
import { useTheme } from 'styled-components/native';

const DEFAULT_SIZE = 52;

type ProductImageProps = {
  uri: string;
  size?: number;
};

export const ProductImage: FC<ProductImageProps> = ({ uri, size = DEFAULT_SIZE }) => {
  const theme = useTheme();

  return (
    <Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.glass.background,
        borderWidth: 1,
        borderColor: theme.colors.glass.border,
      }}
      contentFit="cover"
      accessibilityIgnoresInvertColors
    />
  );
};
