import { type FC } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ChartScrollTrack } from '@/features/statistics/components/charts/ChartScrollTrack';
import {
  getMaxValue,
  MAX_VISIBLE_BAR_CHART_BARS,
} from '@/features/statistics/components/charts/chartUtils';
import { useChartScrollTrack } from '@/features/statistics/components/charts/useChartScrollTrack';
import { formatDecimal } from '@/utils/format';

export type HorizontalBarChartPoint = {
  label: string;
  value: number;
};

type HorizontalBarChartProps = {
  data: HorizontalBarChartPoint[];
};

const BAR_ROW_HEIGHT = 44;

export const HorizontalBarChart: FC<HorizontalBarChartProps> = ({ data }) => {
  const maxValue = getMaxValue(data.map((point) => point.value));
  const needsScroll = data.length > MAX_VISIBLE_BAR_CHART_BARS;
  const maxHeight = MAX_VISIBLE_BAR_CHART_BARS * BAR_ROW_HEIGHT;
  const scrollTrack = useChartScrollTrack(
    'vertical',
    needsScroll,
    data.length,
    MAX_VISIBLE_BAR_CHART_BARS,
  );

  const bars = data.map((point) => (
    <View key={`${point.label}-${point.value}`} className="gap-1 mb-2">
      <View className="flex-row justify-between gap-2">
        <Text className="text-muted text-sm flex-1" numberOfLines={1}>
          {point.label}
        </Text>
        <Text className="text-accent text-sm">{formatDecimal(point.value)}</Text>
      </View>
      <View className="h-2.5 rounded-full bg-default overflow-hidden">
        <View
          className="h-full rounded-full bg-accent"
          style={{ width: `${maxValue > 0 ? (point.value / maxValue) * 100 : 0}%` }}
        />
      </View>
    </View>
  ));

  if (needsScroll) {
    return (
      <View className="flex-row items-stretch gap-2">
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollTrack?.onScroll}
          style={{ flex: 1, maxHeight }}
        >
          {bars}
        </ScrollView>
        {scrollTrack ? (
          <ChartScrollTrack
            orientation="vertical"
            metrics={scrollTrack.metrics}
            trackSize={maxHeight}
          />
        ) : null}
      </View>
    );
  }

  return <>{bars}</>;
};
