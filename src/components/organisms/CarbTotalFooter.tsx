import { type FC, type RefObject } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { useCarbCalculator } from '@/hooks/useCarbCalculator';
import { useScanStore } from '@/store/scanStore';
import { formatDecimal } from '@/utils/format';
import { footerBottomSpace } from '@/utils/screen';

type CarbTotalFooterProps = {
  blurTarget?: RefObject<View | null>;
};

const Footer = styled.View<{ $bottomInset: number }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme, $bottomInset }) =>
    theme.spacing.md + $bottomInset + footerBottomSpace}px;
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
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const CarbTotalFooter: FC<CarbTotalFooterProps> = ({ blurTarget }) => {
  const insets = useSafeAreaInsets();
  const { totalCarbs } = useCarbCalculator();
  const reset = useScanStore((state) => state.reset);
  const hasItems = useScanStore((state) => state.scannedItems.length > 0);

  return (
    <Footer $bottomInset={insets.bottom}>
      <GlassPanel blurTarget={blurTarget} intensity={80}>
        <FooterContent>
          <TotalBlock>
            <Text $variant="caption" $color="textSecondary">
              Glucides totaux
            </Text>
            <Text $variant="title" $color="accent">
              {formatDecimal(totalCarbs)} g
            </Text>
          </TotalBlock>
          {hasItems && (
            <ResetButton onPress={reset} accessibilityLabel="Réinitialiser la session">
              <Text $variant="caption" $color="textSecondary">
                Reset
              </Text>
            </ResetButton>
          )}
        </FooterContent>
      </GlassPanel>
    </Footer>
  );
};
