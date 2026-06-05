import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { TagIcon } from '@/components/atoms/TagIcon';
import { Text } from '@/components/atoms/Text';
import type { ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';

export type TagChipProps = {
  tag: ProductTag;
  variant?: 'expanded' | 'compact';
  selected?: boolean;
  onPress?: () => void;
};

const withAlpha = (color: string, alpha: string): string => `${color}${alpha}`;

const ExpandedChip = styled.Pressable<{ $color: string; $selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ $color }) => $color};
  background-color: ${({ $color, $selected }) =>
    $selected ? withAlpha($color, '55') : withAlpha($color, '22')};
`;

const CompactChip = styled.View`
  padding: 2px;
`;

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
      <CompactChip accessibilityLabel={label}>
        <TagIcon tag={tag} size={18} />
      </CompactChip>
    );
  }

  return (
    <ExpandedChip
      $color={metadata.color}
      $selected={selected}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      accessibilityLabel={label}>
      <TagIcon tag={tag} size={14} />
      <Text $variant="caption" style={{ color: metadata.color, fontWeight: selected ? '600' : '500' }}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </ExpandedChip>
  );
};
