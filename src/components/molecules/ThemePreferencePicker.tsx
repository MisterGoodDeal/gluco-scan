import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppSelect } from '@/components/ui/AppSelect';
import type { ThemePreference } from '@/types/theme';
import { usePreferencesStore } from '@/store/preferences.store';

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export const ThemePreferencePicker: FC = () => {
  const { t } = useTranslation();
  const preference = usePreferencesStore((s) => s.theme);
  const setPreference = usePreferencesStore((s) => s.setTheme);

  const options = useMemo(
    () =>
      OPTIONS.map((option) => ({
        value: option,
        label:
          option === 'system'
            ? t('settings.themeSystem')
            : option === 'light'
              ? t('settings.themeLight')
              : t('settings.themeDark'),
      })),
    [t],
  );

  const selected = options.find((option) => option.value === preference);

  return (
    <AppSelect
      value={selected}
      onValueChange={(option) => {
        if (option) void setPreference(option.value as ThemePreference);
      }}
      options={options}
      placeholder={t('settings.themeSystem')}
      listLabel={t('settings.appearance')}
    />
  );
};
