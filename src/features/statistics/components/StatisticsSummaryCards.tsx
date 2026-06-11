import { Card } from 'heroui-native';
import { type FC } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CountUpText } from '@/components/animations/CountUpText';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
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
      value: (
        <CountUpText
          className="text-accent text-lg font-semibold"
          value={summary.totalCarbs}
          formatValue={(value) => `${formatDecimal(value)} g`}
        />
      ),
    },
    {
      label: t('statistics.summary.averagePerDay'),
      value: (
        <CountUpText
          className="text-accent text-lg font-semibold"
          value={summary.averagePerDay}
          formatValue={(value) =>
            `${formatDecimal(value)} g / ${t('statistics.summary.day')}`
          }
        />
      ),
    },
    {
      label: t('statistics.summary.mealCount'),
      value: (
        <CountUpText
          className="text-accent text-lg font-semibold"
          value={summary.mealCount}
          decimals={0}
        />
      ),
    },
    {
      label: t('statistics.summary.productCount'),
      value: (
        <CountUpText
          className="text-accent text-lg font-semibold"
          value={summary.uniqueProductCount}
          decimals={0}
        />
      ),
    },
    {
      label: t('statistics.summary.mostConsumedProduct'),
      value: (
        <Text className="text-accent text-lg font-semibold">
          {summary.mostConsumedProduct?.name ?? '—'}
        </Text>
      ),
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-2 mb-4">
      {cards.map((card, index) => (
        <ScrollReveal key={card.label} delay={index * 50} className="w-[48%] grow">
          <Card className="p-4 gap-1">
            <Text className="text-muted text-sm">{card.label}</Text>
            {card.value}
          </Card>
        </ScrollReveal>
      ))}
    </View>
  );
};
