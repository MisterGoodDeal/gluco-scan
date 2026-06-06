import { type FC, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
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

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const LoadingWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export const StatisticsHomeScreen: FC<StatisticsHomeScreenProps> = ({ headerInset, bottomInset }) => {
  const { t } = useTranslation();
  const { period, setPeriod } = useStatisticsPeriod();
  const { meals, stats, loading } = useStatistics(period);
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<{ date: string; carbs: number } | null>(null);

  if (loading) {
    return (
      <LoadingWrap style={{ paddingTop: headerInset }}>
        <ActivityIndicator size="large" />
        <Text $variant="caption" $color="textSecondary">
          {t('common.loading')}
        </Text>
      </LoadingWrap>
    );
  }

  const isEmpty = stats.summary.mealCount === 0;

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerInset,
          paddingBottom: bottomInset,
        }}
        showsVerticalScrollIndicator={false}>
        <Content>
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
                onHeatmapDayPress={(date, carbs) => setSelectedHeatmapDay({ date, carbs })}
              />
            </>
          )}
        </Content>
      </ScrollView>

      <HeatmapDayDetailSheet
        date={selectedHeatmapDay?.date ?? null}
        carbs={selectedHeatmapDay?.carbs ?? 0}
        meals={meals}
        onClose={() => setSelectedHeatmapDay(null)}
      />
    </Container>
  );
};
