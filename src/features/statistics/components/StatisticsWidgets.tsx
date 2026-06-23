import { type FC, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, type ViewProps } from "react-native";

import { CountUpText } from "@/components/animations/CountUpText";
import { ContributionHeatmap } from "@/components/organisms/ContributionHeatmap";
import { HorizontalBarChart } from "@/features/statistics/components/charts/HorizontalBarChart";
import { LineChart } from "@/features/statistics/components/charts/LineChart";
import { PieChart } from "@/features/statistics/components/charts/PieChart";
import { VerticalBarChart } from "@/features/statistics/components/charts/VerticalBarChart";
import { StatisticsWidgetCard } from "@/features/statistics/components/StatisticsWidgetCard";
import type { ComputedStatistics } from "@/features/statistics/services/statisticsCompute.service";
import { getPeriodBounds } from "@/features/statistics/utils/periodFilter";
import type { StatisticsPeriod } from "@/features/statistics/types/statisticsPeriod";
import { getRelativeDayOffset } from "@/utils/date";
import { getCurrentLocale } from "@/i18n";
import { formatDateLabel } from "@/utils/date";
import { formatDecimal } from "@/utils/format";
import { getMealTypeLabelKey } from "@/utils/mealType";
import { twMerge } from "tailwind-merge";

type StatisticsWidgetsProps = {
  stats: ComputedStatistics;
  period: StatisticsPeriod;
  onHeatmapDayPress?: (date: string, carbs: number) => void;
};

const ListRow: FC<ViewProps & { isLastChild?: boolean }> = ({
  children,
  isLastChild = false,
  ...rest
}) => (
  <View
    className={twMerge(
      "py-2 border-b border-separator",
      isLastChild ? "border-b-0" : "",
    )}
    {...rest}
  >
    {children}
  </View>
);

const RecordLine: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <Text className="text-foreground text-base">
    {label} {children}
  </Text>
);

const emptyCopy = {
  title: "statistics.empty.title",
  description: "statistics.empty.description",
} as const;

export const StatisticsWidgets: FC<StatisticsWidgetsProps> = ({
  stats,
  period,
  onHeatmapDayPress,
}) => {
  const { t } = useTranslation();
  const locale = getCurrentLocale();
  const referenceDate = getPeriodBounds(period).endDate;
  const emptyTitle = t(emptyCopy.title);
  const emptyDescription = t(emptyCopy.description);

  const formatRelativeDayLabel = (date: string): string => {
    const offset = getRelativeDayOffset(date, referenceDate);
    if (offset === 0) return t("statistics.chart.relativeDayToday");
    return t("statistics.chart.relativeDayPast", { offset });
  };

  return (
    <>
      <StatisticsWidgetCard
        revealDelay={40}
        title={t("statistics.widgets.dailyCarbs")}
        empty={stats.dailyCarbs.every((point) => point.carbs === 0)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <VerticalBarChart
          newestFirst
          data={stats.dailyCarbs.map((point) => ({
            label: formatRelativeDayLabel(point.date),
            value: point.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={80}
        title={t("statistics.widgets.trend")}
        empty={stats.trend.every((point) => point.carbs === 0)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <LineChart
          data={stats.trend.map((point) => ({
            label: point.label,
            value: point.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={120}
        title={t("statistics.widgets.byMealType")}
        empty={stats.carbsByMealType.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <PieChart
          data={stats.carbsByMealType.map((slice) => ({
            label: `${t(getMealTypeLabelKey(slice.type))} ${formatDecimal(slice.percentage)}% (${formatDecimal(slice.carbs)} g)`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={160}
        title={t("statistics.widgets.byCategory")}
        empty={stats.carbsByCategory.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <PieChart
          data={stats.carbsByCategory.map((slice) => ({
            label: `${t(`tags.${slice.tag}`)} ${formatDecimal(slice.percentage)}% (${formatDecimal(slice.carbs)} g)`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={200}
        title={t("statistics.widgets.topProducts")}
        empty={stats.topProductsByOccurrences.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <HorizontalBarChart
          data={stats.topProductsByOccurrences.map((entry) => ({
            label: entry.name,
            value: entry.value,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={240}
        title={t("statistics.widgets.topCarbs")}
        empty={stats.topProductsByCarbs.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <HorizontalBarChart
          data={stats.topProductsByCarbs.map((entry) => ({
            label: entry.name,
            value: entry.value,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={280}
        title={t("statistics.widgets.starchBreakdown")}
        empty={stats.starchBreakdown.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <PieChart
          data={stats.starchBreakdown.map((slice) => ({
            label: `${t(`tags.${slice.tag}`)} ${formatDecimal(slice.percentage)}%`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={320}
        title={t("statistics.widgets.mealDistribution")}
        empty={stats.averageCarbsByMealType.every((entry) => entry.mealCount === 0)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <VerticalBarChart
          barMaxWidth={48}
          data={stats.averageCarbsByMealType.map((entry) => ({
            label: t(getMealTypeLabelKey(entry.type)),
            value: entry.averageCarbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={360}
        title={t("statistics.widgets.cookedVsRaw")}
        empty={stats.cookedVsRaw.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <PieChart
          data={stats.cookedVsRaw.map((slice) => ({
            label: `${t(`statistics.cookedRaw.${slice.key}`)} ${formatDecimal(slice.percentage)}%`,
            value: slice.carbs,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={400}
        title={t("statistics.widgets.favoriteMeals")}
        empty={stats.favoriteMeals.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        {stats.favoriteMeals.map((entry, index: number) => (
          <ListRow
            key={entry.fingerprint}
            isLastChild={index === stats.favoriteMeals.length - 1}
          >
            <Text className="text-foreground text-base">{entry.name}</Text>
            <Text className="text-muted text-sm">
              {t("statistics.favoriteMeals.line", {
                count: entry.count,
                average: formatDecimal(entry.averageCarbs),
              })}
            </Text>
          </ListRow>
        ))}
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={440}
        title={t("statistics.widgets.mostConsumedTags")}
        empty={stats.mostConsumedTags.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <HorizontalBarChart
          data={stats.mostConsumedTags.map((entry) => ({
            label: t(`tags.${entry.tag}`),
            value: entry.count,
          }))}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={480}
        title={t("statistics.widgets.heatmap")}
        empty={!stats.heatmapDays.some((day) => day.carbs > 0)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <ContributionHeatmap
          values={stats.heatmapDays}
          onDayPress={onHeatmapDayPress}
        />
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={520}
        title={t("statistics.widgets.consistency")}
        empty={stats.consistency.dayCount < 2}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        <CountUpText
          className="text-accent text-3xl font-bold"
          value={stats.consistency.score}
          decimals={0}
          formatValue={(value) => `${Math.round(value)}%`}
        />
        <Text className="text-muted text-sm italic">
          {t("statistics.consistency.description")}
        </Text>
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={560}
        title={t("statistics.widgets.bestDays")}
        empty={stats.bestDays.length === 0}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        {stats.bestDays.map((entry) => (
          <ListRow key={entry.date}>
            <Text className="text-foreground text-base">
              {formatDateLabel(entry.date, locale)}
            </Text>
            <CountUpText
              className="text-accent text-sm"
              value={entry.carbs}
              formatValue={(value) => `${formatDecimal(value)} g`}
            />
          </ListRow>
        ))}
      </StatisticsWidgetCard>

      <StatisticsWidgetCard
        revealDelay={600}
        title={t("statistics.widgets.records")}
        empty={!stats.records.highestCarbMeal}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      >
        {stats.records.highestCarbMeal ? (
          <>
            <RecordLine label={t("statistics.records.highestMealLabel")}>
              <CountUpText
                className="font-bold"
                value={stats.records.highestCarbMeal.carbs}
                formatValue={(value) => `${formatDecimal(value)} g`}
              />
            </RecordLine>
            <RecordLine label={t("statistics.records.highestDayLabel")}>
              <CountUpText
                className="font-bold"
                value={stats.records.highestCarbDay?.carbs ?? 0}
                formatValue={(value) => `${formatDecimal(value)} g`}
              />
            </RecordLine>
            <RecordLine label={t("statistics.records.mostProductLabel")}>
              <Text className="font-bold">
                {stats.records.mostConsumedProduct?.name ?? "—"}
              </Text>
            </RecordLine>
            <RecordLine label={t("statistics.records.mostCategoryLabel")}>
              <Text className="font-bold">
                {stats.records.mostConsumedCategory
                  ? t(`tags.${stats.records.mostConsumedCategory.tag}`)
                  : "—"}
              </Text>
            </RecordLine>
          </>
        ) : null}
      </StatisticsWidgetCard>
    </>
  );
};
