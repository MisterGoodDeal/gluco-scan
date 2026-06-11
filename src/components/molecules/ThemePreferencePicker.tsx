import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { AppPressable } from '@/components/ui/AppPressable';
import type { ThemePreference } from '@/types/theme';
import { usePreferencesStore } from '@/store/preferences.store';

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export const ThemePreferencePicker: FC = () => {
  const { t } = useTranslation();
  const preference = usePreferencesStore((s) => s.theme);
  const setPreference = usePreferencesStore((s) => s.setTheme);

  const labels: Record<ThemePreference, string> = {
    system: t('settings.themeSystem'),
    light: t('settings.themeLight'),
    dark: t('settings.themeDark'),
  };

  return (
    <View className="flex-row gap-1">
      {OPTIONS.map((option) => {
        const selected = preference === option;
        return (
          <AppPressable
            key={option}
            className={`flex-1 items-center rounded-lg border p-2 ${
              selected ? 'border-accent bg-accent-soft' : 'border-border bg-surface-secondary'
            }`}
            onPress={() => void setPreference(option)}
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
