import { type FC, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  ScrollRevealProvider,
  useScrollRevealOnScroll,
} from '@/components/animations/scrollRevealContext';
import { HeatmapDayDetailSheet } from '@/features/statistics/components/HeatmapDayDetailSheet';
import { StatisticsPeriodSelector } from '@/features/statistics/components/StatisticsPeriodSelector';
import { StatisticsSummaryCards } from '@/features/statistics/components/StatisticsSummaryCards';
import { StatisticsEmptyState } from '@/features/statistics/components/StatisticsWidgetCard';
import { StatisticsWidgets } from '@/features/statistics/components/StatisticsWidgets';
import { useStatistics, useStatisticsPeriod } from '@/features/statistics/hooks/useStatistics';

type StatisticsHomeScreenProps = {
  headerInset: number;
  bottomInset: number;
};

const StatisticsHomeContent: FC<StatisticsHomeScreenProps> = ({ headerInset, bottomInset }) => {
  const { t } = useTranslation();
  const { period, setPeriod } = useStatisticsPeriod();
  const { meals, stats, loading } = useStatistics(period);
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<{ date: string; carbs: number } | null>(null);
  const onScrollReveal = useScrollRevealOnScroll();

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center p-8"
        style={{ paddingTop: headerInset }}>
        <ActivityIndicator size="large" />
        <Text className="text-muted text-sm">{t('common.loading')}</Text>
      </View>
    );
  }

  const isEmpty = stats.summary.mealCount === 0;

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerInset,
          paddingBottom: bottomInset,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScrollReveal}>
        <View className="p-4">
          <StatisticsPeriodSelector value={period} onChange={setPeriod} />

          {isEmpty ? (
            <StatisticsEmptyState
              title={t('statistics.empty.title')}
              description={t('statistics.empty.description')}
            />
          ) : (
            <>
              <StatisticsSummaryCards summary={stats.summary} />
              <StatisticsWidgets
                stats={stats}
                period={period}
                onHeatmapDayPress={(date, carbs) => setSelectedHeatmapDay({ date, carbs })}
              />
            </>
          )}
        </View>
      </ScrollView>

      <HeatmapDayDetailSheet
        date={selectedHeatmapDay?.date ?? null}
        carbs={selectedHeatmapDay?.carbs ?? 0}
        meals={meals}
        onClose={() => setSelectedHeatmapDay(null)}
      />
    </View>
  );
};

export const StatisticsHomeScreen: FC<StatisticsHomeScreenProps> = (props) => (
  <ScrollRevealProvider>
    <StatisticsHomeContent {...props} />
  </ScrollRevealProvider>
);
