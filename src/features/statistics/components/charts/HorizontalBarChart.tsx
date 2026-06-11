import { type FC } from 'react';
import { Text, View } from 'react-native';

import { getMaxValue } from '@/features/statistics/components/charts/chartUtils';
import { formatDecimal } from '@/utils/format';

export type HorizontalBarChartPoint = {
  label: string;
  value: number;
};

type HorizontalBarChartProps = {
  data: HorizontalBarChartPoint[];
};

export const HorizontalBarChart: FC<HorizontalBarChartProps> = ({ data }) => {
  const maxValue = getMaxValue(data.map((point) => point.value));

  return (
    <>
      {data.map((point) => (
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
      ))}
    </>
  );
};
