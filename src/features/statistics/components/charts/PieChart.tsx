import { type FC, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import {
  describeDonutSlice,
  getChartColor,
} from '@/features/statistics/components/charts/chartUtils';

export type PieChartSlice = {
  label: string;
  value: number;
  color?: string;
};

type PieChartProps = {
  data: PieChartSlice[];
  radius?: number;
};

export const PieChart: FC<PieChartProps> = ({ data, radius = 80 }) => {
  const theme = useTheme();
  const innerRadius = radius * 0.55;
  const size = radius * 2;
  const center = radius;
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  const slices = useMemo(() => {
    if (total <= 0) return [];

    let currentAngle = 0;
    return data.map((slice, index) => {
      const sweep = (slice.value / total) * 360;
      const path = describeDonutSlice(
        center,
        center,
        radius,
        innerRadius,
        currentAngle,
        currentAngle + sweep,
      );
      const color = getChartColor(index, slice.color);
      currentAngle += sweep;
      return { ...slice, path, color };
    });
  }, [center, data, innerRadius, radius, total]);

  if (slices.length === 0) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
      <Svg width={size} height={size}>
        {slices.map((slice) => (
          <Path key={slice.label} d={slice.path} fill={slice.color} />
        ))}
      </Svg>
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        {slices.map((slice) => (
          <View key={slice.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: slice.color,
              }}
            />
            <Text $variant="caption" $color="textSecondary" style={{ flex: 1 }}>
              {slice.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
