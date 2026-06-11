import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { AppPressable } from '@/components/ui/AppPressable';
import { usePreferencesStore } from '@/store/preferences.store';
import { unitSystems, type UnitSystem } from '@/types/unitSystem';

export const UnitSystemPicker: FC = () => {
  const { t } = useTranslation();
  const unitSystem = usePreferencesStore((s) => s.unitSystem);
  const setUnitSystem = usePreferencesStore((s) => s.setUnitSystem);

  const labels: Record<UnitSystem, string> = {
    metric: t('settings.unitMetric'),
    imperial: t('settings.unitImperial'),
  };

  return (
    <View className="flex-row gap-1">
      {unitSystems.map((option) => {
        const selected = unitSystem === option;
        return (
          <AppPressable
            key={option}
            className={`flex-1 items-center rounded-lg border p-2 ${
              selected ? 'border-accent bg-accent-soft' : 'border-border bg-surface-secondary'
            }`}
            onPress={() => void setUnitSystem(option)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={labels[option]}>
            <Text
              className={`text-sm ${
                selected ? 'text-accent font-semibold' : 'text-muted font-medium'
              }`}>
              {labels[option]}
            </Text>
          </AppPressable>
        );
      })}
    </View>
  );
};
