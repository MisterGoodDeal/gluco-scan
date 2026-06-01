import { BlurView } from 'expo-blur';
import { type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { useCarbCalculator } from '@/hooks/useCarbCalculator';
import { useScanStore } from '@/store/scanStore';
import { formatDecimal } from '@/utils/format';

type CarbTotalFooterProps = {
  blurTarget?: RefObject<View | null>;
  onHeightChange?: (height: number) => void;
};

const FooterWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const FooterContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TotalBlock = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const ResetButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const CarbTotalFooter: FC<CarbTotalFooterProps> = ({
  blurTarget,
  onHeightChange,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { totalCarbs } = useCarbCalculator();
  const reset = useScanStore((state) => state.reset);
  const hasItems = useScanStore((state) => state.scannedItems.length > 0);

  const horizontalPadding = theme.spacing.sm;
  const topPadding = theme.spacing.sm;
  const bottomPadding = insets.bottom + theme.spacing.sm;

  return (
    <FooterWrapper
      onLayout={(event) => onHeightChange?.(event.nativeEvent.layout.height)}>
      <BlurView
        blurTarget={blurTarget}
        intensity={80}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={{
          overflow: 'hidden',
          borderTopWidth: 1,
          borderTopColor: theme.colors.glass.border,
          paddingTop: topPadding,
          paddingHorizontal: horizontalPadding,
          paddingBottom: bottomPadding,
        }}>
        <FooterContent>
          <TotalBlock>
            <Text $variant="caption" $color="textSecondary">
              {t('scanner.totalCarbs')}
            </Text>
            <Text $variant="title" $color="accent">
              {formatDecimal(totalCarbs)} {t('common.gramsUnit')}
            </Text>
          </TotalBlock>
          {hasItems && (
            <ResetButton onPress={reset} accessibilityLabel={t('scanner.resetSessionA11y')}>
              <Text $variant="caption" $color="textSecondary">
                {t('common.reset')}
              </Text>
            </ResetButton>
          )}
        </FooterContent>
      </BlurView>
    </FooterWrapper>
  );
};
