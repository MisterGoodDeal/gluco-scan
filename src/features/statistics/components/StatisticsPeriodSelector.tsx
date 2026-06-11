import { Tabs } from 'heroui-native';
import { type FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { STATISTICS_PERIODS } from '@/features/statistics/types/statisticsPeriod';
import { triggerImpactLight } from '@/utils/haptics';

type StatisticsPeriodSelectorProps = {
  value: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
};

export const StatisticsPeriodSelector: FC<StatisticsPeriodSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <Tabs
        value={value}
        onValueChange={(next) => {
          triggerImpactLight();
          onChange(next as StatisticsPeriod);
        }}
        variant="primary">
        <Tabs.List className="w-full self-stretch">
          <Tabs.Indicator />
          {STATISTICS_PERIODS.map((period) => (
            <Tabs.Trigger key={period} value={period} className="flex-1">
              <Tabs.Label className="text-center text-xs">
                {t(`statistics.period.${period}`)}
              </Tabs.Label>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>
    </View>
  );
};
