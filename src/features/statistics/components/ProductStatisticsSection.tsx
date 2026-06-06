import { type FC } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { useProductStatistics } from '@/features/statistics/hooks/useStatistics';
import { formatDecimal } from '@/utils/format';
import { formatDateLabel } from '@/utils/date';
import { getCurrentLocale } from '@/i18n';
import { getMealTypeLabelKey } from '@/utils/mealType';

type ProductStatisticsSectionProps = {
  productId: string;
};

const Section = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StatRow = styled.View`
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ProductStatisticsSection: FC<ProductStatisticsSectionProps> = ({ productId }) => {
  const { t } = useTranslation();
  const locale = getCurrentLocale();
  const stats = useProductStatistics(productId);

  if (!stats || stats.timesConsumed === 0) return null;

  return (
    <Section>
      <Text $variant="body">{t('statistics.productDetail.title')}</Text>
      <StatRow>
        <Text $variant="caption" $color="textSecondary">
          {t('statistics.productDetail.timesConsumed')}
        </Text>
        <Text $variant="caption">{stats.timesConsumed}</Text>
      </StatRow>
      <StatRow>
        <Text $variant="caption" $color="textSecondary">
          {t('statistics.productDetail.lastConsumed')}
        </Text>
        <Text $variant="caption">
          {stats.lastConsumedDate
            ? formatDateLabel(stats.lastConsumedDate, locale)
            : t('statistics.productDetail.never')}
        </Text>
      </StatRow>
      <StatRow>
        <Text $variant="caption" $color="textSecondary">
          {t('statistics.productDetail.totalCarbs')}
        </Text>
        <Text $variant="caption">{formatDecimal(stats.totalCarbs)} g</Text>
      </StatRow>
      {stats.averagePortion != null ? (
        <StatRow>
          <Text $variant="caption" $color="textSecondary">
            {t('statistics.productDetail.averagePortion')}
          </Text>
          <Text $variant="caption">
            {formatDecimal(stats.averagePortion)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.averageCookedPortion != null ? (
        <StatRow>
          <Text $variant="caption" $color="textSecondary">
            {t('statistics.productDetail.averageCookedPortion')}
          </Text>
          <Text $variant="caption">
            {formatDecimal(stats.averageCookedPortion)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.averageRawPortion != null ? (
        <StatRow>
          <Text $variant="caption" $color="textSecondary">
            {t('statistics.productDetail.averageRawPortion')}
          </Text>
          <Text $variant="caption">
            {formatDecimal(stats.averageRawPortion)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.favoriteMealType ? (
        <StatRow>
          <Text $variant="caption" $color="textSecondary">
            {t('statistics.productDetail.favoriteMealType')}
          </Text>
          <Text $variant="caption">{t(getMealTypeLabelKey(stats.favoriteMealType))}</Text>
        </StatRow>
      ) : null}
    </Section>
  );
};
