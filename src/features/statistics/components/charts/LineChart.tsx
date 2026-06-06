import { type FC, useMemo } from 'react';
import { ScrollView } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getMaxValue } from '@/features/statistics/components/charts/chartUtils';

export type LineChartPoint = {
  label: string;
  value: number;
};

type LineChartProps = {
  data: LineChartPoint[];
  height?: number;
};

const Wrapper = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const LabelsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const LabelCell = styled.View`
  width: 32px;
  align-items: center;
`;

export const LineChart: FC<LineChartProps> = ({ data, height = 160 }) => {
  const theme = useTheme();
  const chartHeight = height - 20;
  const pointSpacing = 32;
  const width = Math.max(data.length * pointSpacing, 280);
  const padding = 12;
  const maxValue = getMaxValue(data.map((point) => point.value));

  const points = useMemo(
    () =>
      data.map((point, index) => {
        const x = padding + index * pointSpacing;
        const y =
          padding +
          (chartHeight - padding * 2) * (1 - (maxValue > 0 ? point.value / maxValue : 0));
        return { ...point, x, y };
      }),
    [chartHeight, data, maxValue],
  );

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <Wrapper>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={width} height={chartHeight}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + (chartHeight - padding * 2) * ratio;
            return (
              <Polyline
                key={ratio}
                points={`${padding},${y} ${width - padding},${y}`}
                fill="none"
                stroke={theme.colors.glass.border}
                strokeWidth={1}
              />
            );
          })}
          {points.length > 1 ? (
            <Path
              d={`M ${points.map((point) => `${point.x} ${point.y}`).join(' L ')}`}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={2}
            />
          ) : null}
          {points.map((point) => (
            <Circle
              key={`${point.label}-${point.value}`}
              cx={point.x}
              cy={point.y}
              r={data.length <= 14 ? 3 : 0}
              fill={theme.colors.accent}
            />
          ))}
        </Svg>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LabelsRow style={{ width }}>
          {points.map((point) => (
            <LabelCell key={`label-${point.label}-${point.value}`}>
              <Text $variant="caption" $color="textSecondary" style={{ fontSize: 10 }}>
                {point.label}
              </Text>
            </LabelCell>
          ))}
        </LabelsRow>
      </ScrollView>
    </Wrapper>
  );
};
