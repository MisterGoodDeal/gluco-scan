import { type FC } from 'react';
import styled from 'styled-components/native';

import { ProductImage, PRODUCT_IMAGE_THUMB_RADIUS } from '@/components/atoms/ProductImage';
import { Text } from '@/components/atoms/Text';
import type { MealItem } from '@/types/mealItem';

type MealItemThumbnailsProps = {
  items: Pick<MealItem, 'id' | 'imageUrl'>[];
  size?: number;
  max?: number;
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-shrink: 0;
`;

const MoreBadge = styled.View`
  min-width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  padding: 0 ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${PRODUCT_IMAGE_THUMB_RADIUS}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

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
    <Row>
      {visible.map((item) => (
        <ProductImage key={item.id} uri={item.imageUrl!} size={size} />
      ))}
      {extra > 0 && (
        <MoreBadge style={{ minWidth: size, height: size }}>
          <Text $variant="caption" $color="textSecondary">
            +{extra}
          </Text>
        </MoreBadge>
      )}
    </Row>
  );
};
