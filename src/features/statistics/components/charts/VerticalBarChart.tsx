import { type FC, useMemo } from 'react';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
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

const ChartArea = styled.View<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const BarColumn = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex: 1;
  min-width: 0;
`;

const BarTrack = styled.View<{ $height: number }>`
  width: 100%;
  max-width: 32px;
  align-self: center;
  height: ${({ $height }) => $height}px;
  justify-content: flex-end;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.glass.border};
  overflow: hidden;
`;

const BarFill = styled.View<{ $fillHeight: number }>`
  width: 100%;
  height: ${({ $fillHeight }) => $fillHeight}px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

export const VerticalBarChart: FC<VerticalBarChartProps> = ({ data, height = 160, maxBars }) => {
  const chartData = useMemo(() => {
    if (maxBars == null) return data;
    return aggregateBarChartPoints(data, maxBars);
  }, [data, maxBars]);
  const maxValue = getChartMaxValue(chartData.map((point) => point.value));
  const trackHeight = height - 24;
  const compact = chartData.length > 10;

  return (
    <ChartArea $height={height}>
      {chartData.map((point, index) => {
        const fillHeight = maxValue > 0 ? (point.value / maxValue) * trackHeight : 0;

        return (
          <BarColumn key={`${point.label}-${index}`}>
            <BarTrack $height={trackHeight}>
              <BarFill $fillHeight={Math.max(fillHeight, point.value > 0 ? 4 : 0)} />
            </BarTrack>
            <Text
              $variant="caption"
              $color="textSecondary"
              numberOfLines={2}
              style={{ fontSize: compact ? 9 : 10, textAlign: 'center', width: '100%' }}>
              {point.label}
            </Text>
            {point.value > 0 ? (
              <Text $variant="caption" $color="accent" style={{ fontSize: 9 }}>
                {formatDecimal(point.value)}
              </Text>
            ) : null}
          </BarColumn>
        );
      })}
    </ChartArea>
  );
};
