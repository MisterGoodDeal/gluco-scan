import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { View } from 'react-native';

import { ProductImage } from '@/components/atoms/ProductImage';
import type { Composition } from '@/types/composition';

type CompositionImageMosaicProps = {
  composition: Composition;
  size?: number;
};

export const CompositionImageMosaic: FC<CompositionImageMosaicProps> = ({
  composition,
  size = 56,
}) => {
  const [surfaceColor, borderColor] = useThemeColor(['surface-secondary', 'border']);
  const images = composition.items
    .map((item) => item.imageUrl ?? null)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
    .slice(0, 4);

  if (images.length === 0) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: surfaceColor,
          borderWidth: 1,
          borderColor,
        }}
      />
    );
  }

  if (images.length === 1) {
    return <ProductImage uri={images[0]} size={size} />;
  }

  const tileSize = Math.floor((size - 4) / 2);

  return (
    <View
      className="flex-row flex-wrap gap-1"
      style={{
        width: size,
        height: size,
      }}>
      {images.map((uri, index) => (
        <ProductImage key={`${uri}:${index}`} uri={uri} size={tileSize} />
      ))}
    </View>
  );
};
