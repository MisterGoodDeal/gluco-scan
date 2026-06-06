import { type FC } from 'react';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getMaxValue } from '@/features/statistics/components/charts/chartUtils';
import { formatDecimal } from '@/utils/format';

export type HorizontalBarChartPoint = {
  label: string;
  value: number;
};

type HorizontalBarChartProps = {
  data: HorizontalBarChartPoint[];
};

const Row = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const LabelRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Track = styled.View`
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.glass.border};
  overflow: hidden;
`;

const Fill = styled.View<{ $widthPercent: number }>`
  height: 100%;
  width: ${({ $widthPercent }) => $widthPercent}%;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.full}px;
`;

export const HorizontalBarChart: FC<HorizontalBarChartProps> = ({ data }) => {
  const maxValue = getMaxValue(data.map((point) => point.value));

  return (
    <>
      {data.map((point) => (
        <Row key={`${point.label}-${point.value}`}>
          <LabelRow>
            <Text $variant="caption" $color="textSecondary" style={{ flex: 1 }} numberOfLines={1}>
              {point.label}
            </Text>
            <Text $variant="caption" $color="accent">
              {formatDecimal(point.value)}
            </Text>
          </LabelRow>
          <Track>
            <Fill $widthPercent={maxValue > 0 ? (point.value / maxValue) * 100 : 0} />
          </Track>
        </Row>
      ))}
    </>
  );
};
