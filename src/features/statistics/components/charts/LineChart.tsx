import { useThemeColor } from 'heroui-native';
import { type FC, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import {
  getChartMaxValue,
  shouldShowChartLabel,
} from '@/features/statistics/components/charts/chartUtils';

export type LineChartPoint = {
  label: string;
  value: number;
};

type LineChartProps = {
  data: LineChartPoint[];
  height?: number;
};

export const LineChart: FC<LineChartProps> = ({ data, height = 160 }) => {
  const [accentColor, borderColor] = useThemeColor(['accent', 'border']);
  const chartHeight = height - 20;
  const padding = 12;
  const [width, setWidth] = useState(0);
  const maxValue = getChartMaxValue(data.map((point) => point.value));
  const compact = data.length > 31;

  const points = useMemo(() => {
    if (width <= 0 || data.length === 0) return [];

    const innerWidth = width - padding * 2;
    const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;

    return data.map((point, index) => {
      const x = padding + index * step;
      const y =
        padding +
        (chartHeight - padding * 2) * (1 - (maxValue > 0 ? point.value / maxValue : 0));
      return { ...point, x, y };
    });
  }, [chartHeight, data, maxValue, padding, width]);

  return (
    <View className="w-full gap-1">
      <View
        onLayout={(event) => {
          const nextWidth = event.nativeEvent.layout.width;
          if (nextWidth !== width) setWidth(nextWidth);
        }}>
        {width > 0 ? (
          <Svg width={width} height={chartHeight}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding + (chartHeight - padding * 2) * ratio;
              return (
                <Polyline
                  key={ratio}
                  points={`${padding},${y} ${width - padding},${y}`}
                  fill="none"
                  stroke={borderColor}
                  strokeWidth={1}
                />
              );
            })}
            {points.length > 1 ? (
              <Path
                d={`M ${points.map((point) => `${point.x} ${point.y}`).join(' L ')}`}
                fill="none"
                stroke={accentColor}
                strokeWidth={2}
              />
            ) : null}
            {points.map((point, index) => (
              <Circle
                key={`${point.label}-${index}`}
                cx={point.x}
                cy={point.y}
                r={data.length <= 14 ? 3 : 0}
                fill={accentColor}
              />
            ))}
          </Svg>
        ) : (
          <View style={{ height: chartHeight }} />
        )}
      </View>
      <View className="flex-row w-full">
        {data.map((point, index) => {
          const showLabel = shouldShowChartLabel(index, data.length);
          return (
            <View key={`label-${point.label}-${index}`} className="flex-1 items-center min-w-0">
              {showLabel ? (
                <Text
                  className="text-muted"
                  numberOfLines={1}
                  style={{ fontSize: compact ? 8 : 10, textAlign: 'center', width: '100%' }}>
                  {point.label}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};
