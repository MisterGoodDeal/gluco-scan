import { type FC } from 'react';
import { View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import type { ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';

type TagIconProps = {
  tag: ProductTag;
  size?: number;
};

export const TagIcon: FC<TagIconProps> = ({ tag, size = 16 }) => {
  const metadata = getTagMetadata(tag);

  return (
    <View pointerEvents="none">
      <SymbolView name={metadata.icon} size={size} tintColor={metadata.color} />
    </View>
  );
};
