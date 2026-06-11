import { type FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppChip } from '@/components/ui/AppChip';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { STATISTICS_PERIODS } from '@/features/statistics/types/statisticsPeriod';

type StatisticsPeriodSelectorProps = {
  value: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
};

export const StatisticsPeriodSelector: FC<StatisticsPeriodSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row gap-1 mb-4">
      {STATISTICS_PERIODS.map((period) => {
        const selected = value === period;
        return (
          <AppChip
            key={period}
            size="sm"
            variant={selected ? 'soft' : 'tertiary'}
            color={selected ? 'accent' : 'default'}
            label={t(`statistics.period.${period}`)}
            onPress={() => onChange(period)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          />
        );
      })}
    </View>
  );
};
