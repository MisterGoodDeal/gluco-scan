import { type FC } from 'react';
import styled from 'styled-components/native';

import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import { ALL_PRODUCT_TAGS, type ProductTag } from '@/types/productTag';

type TagSelectorProps = {
  value: ProductTag[];
  onChange: (tags: ProductTag[]) => void;
};

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const TagSelector: FC<TagSelectorProps> = ({ value, onChange }) => {
  const toggleTag = (tag: ProductTag) => {
    if (value.includes(tag)) {
      onChange(value.filter((entry) => entry !== tag));
      return;
    }
    onChange([...value, tag]);
  };

  return (
    <Row>
      {ALL_PRODUCT_TAGS.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          variant="expanded"
          selected={value.includes(tag)}
          onPress={() => toggleTag(tag)}
        />
      ))}
    </Row>
  );
};
