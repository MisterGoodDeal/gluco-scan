import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppSelect } from '@/components/ui/AppSelect';
import { usePreferencesStore } from '@/store/preferences.store';
import { unitSystems, type UnitSystem } from '@/types/unitSystem';

export const UnitSystemPicker: FC = () => {
  const { t } = useTranslation();
  const unitSystem = usePreferencesStore((s) => s.unitSystem);
  const setUnitSystem = usePreferencesStore((s) => s.setUnitSystem);

  const options = useMemo(
    () =>
      unitSystems.map((option) => ({
        value: option,
        label:
          option === 'metric' ? t('settings.unitMetric') : t('settings.unitImperial'),
      })),
    [t],
  );

  const selected = options.find((option) => option.value === unitSystem);

  return (
    <AppSelect
      value={selected}
      onValueChange={(option) => {
        if (option) void setUnitSystem(option.value as UnitSystem);
      }}
      options={options}
      placeholder={t('settings.unitMetric')}
      listLabel={t('settings.units')}
    />
  );
};
