import { Platform, type TextStyle } from 'react-native';

import type { AppTheme } from '@/styles/theme';

export const getPickerColors = (theme: AppTheme) => ({
  text: theme.colors.text,
  background: theme.colors.background,
});

export const getPickerStyle = (theme: AppTheme): TextStyle => ({
  color: theme.colors.text,
  backgroundColor: 'transparent',
});

export const getPickerItemStyle = (theme: AppTheme): TextStyle | undefined =>
  Platform.OS === 'ios'
    ? {
        color: theme.colors.text,
        fontSize: 18,
      }
    : undefined;

export const getSheetPickerStyle = (theme: AppTheme): TextStyle => ({
  color: theme.colors.text,
  backgroundColor: theme.colors.sheet.background,
});
