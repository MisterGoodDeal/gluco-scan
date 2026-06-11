import { useThemeColor } from 'heroui-native';
import { type FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import {
  aggregateBarChartPoints,
  getChartMaxValue,
} from '@/features/statistics/components/charts/chartUtils';
import { formatDecimal } from '@/utils/format';

export type VerticalBarChartPoint = {
  label: string;
  value: number;
};

type VerticalBarChartProps = {
  data: VerticalBarChartPoint[];
  height?: number;
  maxBars?: number;
};

const MIN_IN_BAR_VALUE_HEIGHT = 22;

export const VerticalBarChart: FC<VerticalBarChartProps> = ({ data, height = 160, maxBars }) => {
  const accentForeground = useThemeColor('accent-foreground');

  const chartData = useMemo(() => {
    if (maxBars == null) return data;
    return aggregateBarChartPoints(data, maxBars);
  }, [data, maxBars]);

  const maxValue = getChartMaxValue(chartData.map((point) => point.value));
  const trackHeight = height - 24;
  const compact = chartData.length > 10;

  return (
    <View className="w-full flex-row items-end gap-1" style={{ height }}>
      {chartData.map((point, index) => {
        const fillHeight = maxValue > 0 ? (point.value / maxValue) * trackHeight : 0;
        const barHeight = Math.max(fillHeight, point.value > 0 ? 4 : 0);
        const showValueInBar = barHeight >= MIN_IN_BAR_VALUE_HEIGHT && point.value > 0;

        return (
          <View key={`${point.label}-${index}`} className="flex-1 min-w-0 items-center">
            <View
              className="w-full max-w-8 self-center justify-end rounded-lg bg-default overflow-hidden"
              style={{ height: trackHeight }}>
              <View
                className="w-full rounded-lg bg-accent justify-center items-center"
                style={{ height: barHeight }}>
                {showValueInBar ? (
                  <Text
                    style={{
                      color: accentForeground,
                      fontWeight: '700',
                      fontSize: 9,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}>
                    {formatDecimal(point.value)}
                  </Text>
                ) : null}
              </View>
            </View>

            <View className="mt-1 w-full items-center">
              <Text
                className="text-muted"
                numberOfLines={2}
                style={{ fontSize: compact ? 9 : 10, textAlign: 'center', width: '100%' }}>
                {point.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
