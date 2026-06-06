import { type FC } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { STATISTICS_PERIODS } from '@/features/statistics/types/statisticsPeriod';

type StatisticsPeriodSelectorProps = {
  value: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
};

const Chip = styled.Pressable<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : 'transparent'};
`;

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const StatisticsPeriodSelector: FC<StatisticsPeriodSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Row>
      {STATISTICS_PERIODS.map((period) => (
        <Chip
          key={period}
          $selected={value === period}
          onPress={() => onChange(period)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === period }}>
          <Text $variant="caption" $color={value === period ? 'accent' : 'textSecondary'}>
            {t(`statistics.period.${period}`)}
          </Text>
        </Chip>
      ))}
    </Row>
  );
};
