import { type FC } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getMaxValue } from '@/features/statistics/components/charts/chartUtils';
import { formatDecimal } from '@/utils/format';

export type VerticalBarChartPoint = {
  label: string;
  value: number;
};

type VerticalBarChartProps = {
  data: VerticalBarChartPoint[];
  height?: number;
  fillWidth?: boolean;
};

const ChartArea = styled.View<{ $height: number; $fillWidth?: boolean }>`
  height: ${({ $height }) => $height}px;
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme, $fillWidth }) => ($fillWidth ? theme.spacing.sm : theme.spacing.xs)}px;
  ${({ $fillWidth }) => ($fillWidth ? 'width: 100%;' : '')}
`;

const BarColumn = styled.View<{ $fillWidth?: boolean }>`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: ${({ $fillWidth }) => ($fillWidth ? 0 : 28)}px;
  ${({ $fillWidth }) => ($fillWidth ? 'flex: 1;' : '')}
`;

const BarTrack = styled.View<{ $height: number; $fillWidth?: boolean }>`
  width: ${({ $fillWidth }) => ($fillWidth ? '100%' : '20px')};
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

export const VerticalBarChart: FC<VerticalBarChartProps> = ({
  data,
  height = 160,
  fillWidth = false,
}) => {
  const maxValue = getMaxValue(data.map((point) => point.value));
  const trackHeight = height - 24;

  const chart = (
    <ChartArea $height={height} $fillWidth={fillWidth}>
      {data.map((point) => {
        const fillHeight = maxValue > 0 ? (point.value / maxValue) * trackHeight : 0;
        return (
          <BarColumn key={`${point.label}-${point.value}`} $fillWidth={fillWidth}>
            <BarTrack $height={trackHeight} $fillWidth={fillWidth}>
              <BarFill $fillHeight={Math.max(fillHeight, point.value > 0 ? 4 : 0)} />
            </BarTrack>
            <Text $variant="caption" $color="textSecondary" style={{ fontSize: 10, textAlign: 'center' }}>
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

  if (fillWidth) return chart;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {chart}
    </ScrollView>
  );
};
