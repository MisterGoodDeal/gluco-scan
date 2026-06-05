import type { AppTheme } from '@/styles/theme';

export const BOTTOM_SHEET_Z_INDEX = 1000;

export const getBottomSheetProps = (theme: AppTheme) => ({
  backgroundStyle: {
    backgroundColor: theme.colors.sheet.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.glass.border,
  },
  handleIndicatorStyle: { backgroundColor: theme.colors.glass.highlight },
  style: { zIndex: BOTTOM_SHEET_Z_INDEX },
  containerStyle: { zIndex: BOTTOM_SHEET_Z_INDEX, elevation: BOTTOM_SHEET_Z_INDEX },
});

export const getBottomSheetScrollPadding = (
  bottomInset: number,
  extra = 0,
): { paddingBottom: number } => ({
  paddingBottom: bottomInset + extra,
});
