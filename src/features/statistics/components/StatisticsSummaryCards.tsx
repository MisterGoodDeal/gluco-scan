import { type FC } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import type { SummaryStats } from '@/features/statistics/selectors/summary.selectors';
import { formatDecimal } from '@/utils/format';

type StatisticsSummaryCardsProps = {
  summary: SummaryStats;
};

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Card = styled.View`
  width: 48%;
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  background-color: ${({ theme }) => theme.colors.glass.background};
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const StatisticsSummaryCards: FC<StatisticsSummaryCardsProps> = ({ summary }) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t('statistics.summary.totalCarbs'),
      value: `${formatDecimal(summary.totalCarbs)} g`,
    },
    {
      label: t('statistics.summary.averagePerDay'),
      value: `${formatDecimal(summary.averagePerDay)} g / ${t('statistics.summary.day')}`,
    },
    {
      label: t('statistics.summary.mealCount'),
      value: String(summary.mealCount),
    },
    {
      label: t('statistics.summary.productCount'),
      value: String(summary.uniqueProductCount),
    },
    {
      label: t('statistics.summary.mostConsumedProduct'),
      value: summary.mostConsumedProduct?.name ?? '—',
    },
  ];

  return (
    <Grid>
      {cards.map((card) => (
        <Card key={card.label}>
          <Text $variant="caption" $color="textSecondary">
            {card.label}
          </Text>
          <Text $variant="subtitle" $color="accent">
            {card.value}
          </Text>
        </Card>
      ))}
    </Grid>
  );
};
