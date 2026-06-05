import { type FC } from 'react';
import styled from 'styled-components/native';

import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import type { ProductTag } from '@/types/productTag';
import { sortProductTags } from '@/utils/tags/sortProductTags';

type TagChipListProps = {
  tags: ProductTag[];
  variant?: 'expanded' | 'compact';
};

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
`;

export const TagChipList: FC<TagChipListProps> = ({ tags, variant = 'compact' }) => {
  if (tags.length === 0) return null;

  return (
    <Row>
      {sortProductTags(tags).map((tag) => (
        <TagChip key={tag} tag={tag} variant={variant} />
      ))}
    </Row>
  );
};
