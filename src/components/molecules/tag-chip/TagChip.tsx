import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { TagIcon } from '@/components/atoms/TagIcon';
import { AppChip } from '@/components/ui/AppChip';
import type { ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';

export type TagChipProps = {
  tag: ProductTag;
  variant?: 'expanded' | 'compact';
  selected?: boolean;
  onPress?: () => void;
};

const withAlpha = (color: string, alpha: string): string => `${color}${alpha}`;

export const TagChip: FC<TagChipProps> = ({
  tag,
  variant = 'expanded',
  selected = false,
  onPress,
}) => {
  const { t } = useTranslation();
  const metadata = getTagMetadata(tag);
  const label = t(metadata.translationKey);

  if (variant === 'compact') {
    return (
      <View className="p-0.5" accessibilityLabel={label}>
        <TagIcon tag={tag} size={18} />
      </View>
    );
  }

  return (
    <AppChip
      size="sm"
      variant="soft"
      label={selected ? `✓ ${label}` : label}
      startContent={<TagIcon tag={tag} size={14} />}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      accessibilityLabel={label}
      style={{
        borderWidth: 1,
        borderColor: metadata.color,
        backgroundColor: withAlpha(metadata.color, selected ? '55' : '22'),
      }}
      labelStyle={{ color: metadata.color }}
    />
  );
};
