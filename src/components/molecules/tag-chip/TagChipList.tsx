import { type FC } from 'react';
import { View } from 'react-native';

import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import type { ProductTag } from '@/types/productTag';
import { sortProductTags } from '@/utils/tags/sortProductTags';

type TagChipListProps = {
  tags: ProductTag[];
  variant?: 'expanded' | 'compact';
};

export const TagChipList: FC<TagChipListProps> = ({ tags, variant = 'compact' }) => {
  if (tags.length === 0) return null;

  return (
    <View className="flex-row flex-wrap items-center gap-1">
      {sortProductTags(tags).map((tag) => (
        <TagChip key={tag} tag={tag} variant={variant} />
      ))}
    </View>
  );
};
