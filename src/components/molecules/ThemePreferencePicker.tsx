import { Tabs } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { ThemePreference } from '@/types/theme';
import { usePreferencesStore } from '@/store/preferences.store';
import { triggerImpactLight } from '@/utils/haptics';

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export const ThemePreferencePicker: FC = () => {
  const { t } = useTranslation();
  const preference = usePreferencesStore((s) => s.theme);
  const setPreference = usePreferencesStore((s) => s.setTheme);

  const getLabel = (option: ThemePreference): string => {
    if (option === 'system') return t('settings.themeSystem');
    if (option === 'light') return t('settings.themeLight');
    return t('settings.themeDark');
  };

  return (
    <Tabs
      value={preference}
      onValueChange={(value) => {
        triggerImpactLight();
        void setPreference(value as ThemePreference);
      }}
      variant="primary">
      <Tabs.List className="w-full self-stretch">
        <Tabs.Indicator />
        {OPTIONS.map((option) => (
          <Tabs.Trigger key={option} value={option} className="flex-1">
            <Tabs.Label className="text-center">{getLabel(option)}</Tabs.Label>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
};
