import { Card } from 'heroui-native';
import { type FC } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { SummaryStats } from '@/features/statistics/selectors/summary.selectors';
import { formatDecimal } from '@/utils/format';

type StatisticsSummaryCardsProps = {
  summary: SummaryStats;
};

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
    <View className="flex-row flex-wrap gap-2 mb-4">
      {cards.map((card) => (
        <Card key={card.label} className="w-[48%] grow p-4 gap-1">
          <Text className="text-muted text-sm">{card.label}</Text>
          <Text className="text-accent text-lg font-semibold">{card.value}</Text>
        </Card>
      ))}
    </View>
  );
};
