import type { AppTheme } from '@/styles/theme';

export const getBottomSheetProps = (theme: AppTheme) => ({
  backgroundStyle: {
    backgroundColor: theme.colors.sheet.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.glass.border,
  },
  handleIndicatorStyle: { backgroundColor: theme.colors.glass.highlight },
});
