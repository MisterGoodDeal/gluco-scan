import { type FC } from 'react';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { TagIcon } from '@/components/atoms/TagIcon';
import type { MealItem } from '@/types/mealItem';
import type { Product } from '@/types/product';
import { formatMealItemConversion, type FormatMealItemConversionParams } from '@/utils/formatMealItemConversion';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { useTranslation } from 'react-i18next';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import { sortProductTags } from '@/utils/tags/sortProductTags';

type MealItemConversionLineProps = {
  item: MealItem;
  product?: Pick<Product, 'tags' | 'customCookingFactor'> | null;
  showName?: boolean;
  compactIcons?: boolean;
};

const Row = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

export const MealItemConversionLine: FC<MealItemConversionLineProps> = ({
  item,
  product,
  showName = true,
  compactIcons = true,
}) => {
  const { t } = useTranslation();
  const { formatMassValue, massUnit } = useMassDisplay();
  const userConversions = useCookingConversionStore((s) => s.conversions);
  const { primaryLine, equivalentLine, carbsLine, productTags } = formatMealItemConversion({
    item,
    product,
    formatMassValue,
    massUnit,
    userConversions,
    t: t as FormatMealItemConversionParams['t'],
  });

  return (
    <Row>
      {showName ? (
        <NameRow>
          {compactIcons ? (
            <IconRow>
              {sortProductTags(productTags).map((tag) => (
                <TagIcon key={tag} tag={tag} size={16} />
              ))}
            </IconRow>
          ) : null}
          <Text $variant="body">{item.productName}</Text>
        </NameRow>
      ) : null}
      <Text $variant="caption" $color="textSecondary">
        {primaryLine}
      </Text>
      {equivalentLine ? (
        <Text $variant="caption" $color="textSecondary">
          {equivalentLine}
        </Text>
      ) : null}
      <Text $variant="caption" $color="accent">
        {carbsLine}
      </Text>
    </Row>
  );
};
