import { type FC } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { ContributionHeatmap } from '@/components/organisms/ContributionHeatmap';
import { HorizontalBarChart } from '@/features/statistics/components/charts/HorizontalBarChart';
import { LineChart } from '@/features/statistics/components/charts/LineChart';
import { PieChart } from '@/features/statistics/components/charts/PieChart';
import { VerticalBarChart } from '@/features/statistics/components/charts/VerticalBarChart';
import { StatisticsWidgetCard } from '@/features/statistics/components/StatisticsWidgetCard';
import type { ComputedStatistics } from '@/features/statistics/services/statisticsCompute.service';
import { formatDecimal } from '@/utils/format';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { formatDateLabel } from '@/utils/date';
import { getCurrentLocale } from '@/i18n';

type StatisticsWidgetsProps = {
  stats: ComputedStatistics;
  onHeatmapDayPress?: (date: string, carbs: number) => void;
};

const ListRow = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const RecordLine: FC<{ label: string; value: string }> = ({ label, value }) => (
  <Text $variant="body">
    {label}{' '}
    <Text $variant="body" style={{ fontWeight: '700' }}>
      {value}
    </Text>
  </Text>
);

const emptyCopy = {
  title: 'statistics.empty.title',
  description: 'statistics.empty.description',
} as const;

export const StatisticsWidgets: FC<StatisticsWidgetsProps> = ({ stats, onHeatmapDayPress }) => {
  const { t } = useTranslation();
  const locale = getCurrentLocale();
  const emptyTitle = t(emptyCopy.title);
  const emptyDescription = t(emptyCopy.description);

  return (
    <>
      <StatisticsWidgetCard
        title={t('statistics.widgets.dailyCarbs')}
        empty={stats.dailyCarbs.every((point) => point.carbs === 0)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <VerticalBarChart
          data={stats.dailyCarbs.map((point) => ({ label: point.label, value: point.carbs }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.trend')}
        empty={stats.trend.every((point) => point.carbs === 0)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <LineChart data={stats.trend.map((point) => ({ label: point.label, value: point.carbs }))} />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.byMealType')}
        empty={stats.carbsByMealType.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <PieChart
          data={stats.carbsByMealType.map((slice) => ({
            label: `${t(getMealTypeLabelKey(slice.type))} ${formatDecimal(slice.percentage)}% (${formatDecimal(slice.carbs)} g)`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.byCategory')}
        empty={stats.carbsByCategory.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <PieChart
          data={stats.carbsByCategory.map((slice) => ({
            label: `${t(`tags.${slice.tag}`)} ${formatDecimal(slice.percentage)}% (${formatDecimal(slice.carbs)} g)`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.topProducts')}
        empty={stats.topProductsByOccurrences.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <HorizontalBarChart
          data={stats.topProductsByOccurrences.map((entry) => ({
            label: entry.name,
            value: entry.value,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.topCarbs')}
        empty={stats.topProductsByCarbs.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <HorizontalBarChart
          data={stats.topProductsByCarbs.map((entry) => ({
            label: entry.name,
            value: entry.value,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.starchBreakdown')}
        empty={stats.starchBreakdown.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <PieChart
          data={stats.starchBreakdown.map((slice) => ({
            label: `${t(`tags.${slice.tag}`)} ${formatDecimal(slice.percentage)}%`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.mealDistribution')}
        empty={stats.averageCarbsByMealType.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <VerticalBarChart
          fillWidth
          data={stats.averageCarbsByMealType.map((entry) => ({
            label: t(getMealTypeLabelKey(entry.type)),
            value: entry.averageCarbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.cookedVsRaw')}
        empty={stats.cookedVsRaw.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <PieChart
          data={stats.cookedVsRaw.map((slice) => ({
            label: `${t(`statistics.cookedRaw.${slice.key}`)} ${formatDecimal(slice.percentage)}%`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.favoriteMeals')}
        empty={stats.favoriteMeals.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        {stats.favoriteMeals.map((entry) => (
          <ListRow key={entry.fingerprint}>
            <Text $variant="body">{entry.name}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('statistics.favoriteMeals.line', {
                count: entry.count,
                average: formatDecimal(entry.averageCarbs),
              })}
            </Text>
          </ListRow>
        ))}
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.mostConsumedTags')}
        empty={stats.mostConsumedTags.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <HorizontalBarChart
          data={stats.mostConsumedTags.map((entry) => ({
            label: t(`tags.${entry.tag}`),
            value: entry.count,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.heatmap')}
        empty={stats.heatmapDays.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <ContributionHeatmap values={stats.heatmapDays} onDayPress={onHeatmapDayPress} />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.consistency')}
        empty={stats.consistency.dayCount < 2}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        <Text $variant="title" $color="accent">
          {stats.consistency.score}%
        </Text>
        <Text $variant="caption" $color="textSecondary" style={{ fontStyle: 'italic' }}>
          {t('statistics.consistency.description')}
        </Text>
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.bestDays')}
        empty={stats.bestDays.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        {stats.bestDays.map((entry) => (
          <ListRow key={entry.date}>
            <Text $variant="body">{formatDateLabel(entry.date, locale)}</Text>
            <Text $variant="caption" $color="accent">
              {formatDecimal(entry.carbs)} g
            </Text>
          </ListRow>
        ))}
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        title={t('statistics.widgets.records')}
        empty={!stats.records.highestCarbMeal}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}>
        {stats.records.highestCarbMeal ? (
          <>
            <RecordLine
              label={t('statistics.records.highestMealLabel')}
              value={`${formatDecimal(stats.records.highestCarbMeal.carbs)} g`}
            />
            <RecordLine
              label={t('statistics.records.highestDayLabel')}
              value={`${formatDecimal(stats.records.highestCarbDay?.carbs ?? 0)} g`}
            />
            <RecordLine
              label={t('statistics.records.mostProductLabel')}
              value={stats.records.mostConsumedProduct?.name ?? '—'}
            />
            <RecordLine
              label={t('statistics.records.mostCategoryLabel')}
              value={
                stats.records.mostConsumedCategory
                  ? t(`tags.${stats.records.mostConsumedCategory.tag}`)
                  : '—'
              }
            />
          </>
        ) : null}
      </StatisticsWidgetCard>
    </>
  );
};
