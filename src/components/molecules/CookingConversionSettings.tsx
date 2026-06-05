import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { InputNumber } from '@/components/atoms/InputNumber';
import { Text } from '@/components/atoms/Text';
import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import { DEFAULT_COOKING_CONVERSIONS } from '@/constants/cooking-conversions';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { ProductTag } from '@/types/productTag';
import { parseManualCarbs } from '@/utils/ean';

const Section = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const FactorInput = styled.View`
  width: 72px;
`;

export const CookingConversionSettings: FC = () => {
  const { t } = useTranslation();
  const conversions = useCookingConversionStore((s) => s.conversions);
  const updateConversion = useCookingConversionStore((s) => s.updateConversion);

  const getFactor = (tag: ProductTag): number => {
    const stored = conversions.find((entry) => entry.tag === tag);
    if (stored) return stored.cookedFactor;
    return DEFAULT_COOKING_CONVERSIONS.find((entry) => entry.tag === tag)?.cookedFactor ?? 1;
  };

  const handleChange = async (tag: ProductTag, value: string) => {
    const parsed = parseManualCarbs(value);
    if (parsed == null || parsed <= 0) return;
    await updateConversion({ tag, cookedFactor: parsed });
  };

  return (
    <Section>
      <Text $variant="caption" $color="textSecondary">
        {t('settings.cookingConversionsHint')}
      </Text>
      {DEFAULT_COOKING_CONVERSIONS.map((entry) => (
        <Row key={entry.tag}>
          <TagChip tag={entry.tag} variant="expanded" />
          <FactorInput>
            <InputNumber
              value={String(getFactor(entry.tag)).replace('.', ',')}
              onChangeText={(text) => void handleChange(entry.tag, text)}
            />
          </FactorInput>
        </Row>
      ))}
    </Section>
  );
};
