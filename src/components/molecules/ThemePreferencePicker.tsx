import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import type { ThemePreference } from '@/styles/theme';
import { useThemeStore } from '@/store/theme.store';

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Option = styled.Pressable<{ $selected?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
`;

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export const ThemePreferencePicker: FC = () => {
  const { t } = useTranslation();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const labels: Record<ThemePreference, string> = {
    system: t('settings.themeSystem'),
    light: t('settings.themeLight'),
    dark: t('settings.themeDark'),
  };

  return (
    <Row>
      {OPTIONS.map((option) => (
        <Option
          key={option}
          $selected={preference === option}
          onPress={() => setPreference(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: preference === option }}
          accessibilityLabel={labels[option]}>
          <Text
            $variant="caption"
            $color={preference === option ? 'accent' : 'textSecondary'}
            style={{ fontWeight: preference === option ? '600' : '500' }}>
            {labels[option]}
          </Text>
        </Option>
      ))}
    </Row>
  );
};
