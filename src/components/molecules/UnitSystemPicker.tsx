import { Tabs } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { usePreferencesStore } from '@/store/preferences.store';
import { unitSystems, type UnitSystem } from '@/types/unitSystem';
import { triggerImpactLight } from '@/utils/haptics';

export const UnitSystemPicker: FC = () => {
  const { t } = useTranslation();
  const unitSystem = usePreferencesStore((s) => s.unitSystem);
  const setUnitSystem = usePreferencesStore((s) => s.setUnitSystem);

  const getLabel = (option: UnitSystem): string =>
    option === 'metric' ? t('settings.unitMetric') : t('settings.unitImperial');

  return (
    <Tabs
      value={unitSystem}
      onValueChange={(value) => {
        triggerImpactLight();
        void setUnitSystem(value as UnitSystem);
      }}
      variant="primary">
      <Tabs.List className="w-full self-stretch">
        <Tabs.Indicator />
        {unitSystems.map((option) => (
          <Tabs.Trigger key={option} value={option} className="flex-1">
            <Tabs.Label className="text-center">{getLabel(option)}</Tabs.Label>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
};
