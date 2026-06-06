import { type FC, useMemo } from 'react';
import styled, { useTheme } from 'styled-components/native';

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

const MIN_IN_BAR_VALUE_HEIGHT = 22;

const ChartArea = styled.View<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const BarColumn = styled.View`
  flex: 1;
  min-width: 0;
  align-items: center;
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
  justify-content: center;
  align-items: center;
`;

const LabelWrap = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  width: 100%;
  align-items: center;
`;

export const VerticalBarChart: FC<VerticalBarChartProps> = ({ data, height = 160, maxBars }) => {
  const theme = useTheme();

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
        const barHeight = Math.max(fillHeight, point.value > 0 ? 4 : 0);
        const showValueInBar = barHeight >= MIN_IN_BAR_VALUE_HEIGHT && point.value > 0;

        return (
          <BarColumn key={`${point.label}-${index}`}>
            <BarTrack $height={trackHeight}>
              <BarFill $fillHeight={barHeight}>
                {showValueInBar ? (
                  <Text
                    $variant="caption"
                    style={{
                      color: theme.colors.onAccent,
                      fontWeight: '700',
                      fontSize: 9,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}>
                    {formatDecimal(point.value)}
                  </Text>
                ) : null}
              </BarFill>
            </BarTrack>

            <LabelWrap>
              <Text
                $variant="caption"
                $color="textSecondary"
                numberOfLines={2}
                style={{ fontSize: compact ? 9 : 10, textAlign: 'center', width: '100%' }}>
                {point.label}
              </Text>
            </LabelWrap>
          </BarColumn>
        );
      })}
    </ChartArea>
  );
};
