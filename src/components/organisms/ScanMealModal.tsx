import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { ScannerView } from '@/components/organisms/ScannerView';
import { useMealProductScan } from '@/hooks/useMealProductScan';
import type { Product } from '@/types/product';
import { ScreenHeaderBar } from '@/styles/global';

type ScanMealModalProps = {
  visible: boolean;
  onClose: () => void;
  onProductScanned: (product: Product) => void;
};

const Header = styled(ScreenHeaderBar)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ScanMealModal: FC<ScanMealModalProps> = ({
  visible,
  onClose,
  onProductScanned,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { handleScan, isLoading, error, warning, clearMessages } = useMealProductScan();

  const onScan = async (ean: string) => {
    const product = await handleScan(ean);
    if (product) {
      onProductScanned(product);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}>
        <Header>
          <Text $variant="subtitle">{t('scanner.scanModalTitle')}</Text>
          <Pressable onPress={onClose}>
            <Text $variant="body" $color="accent">
              {t('common.cancel')}
            </Text>
          </Pressable>
        </Header>
        <ScannerView
          onScan={onScan}
          isLoadingProduct={isLoading}
          scanError={error}
          scanWarning={warning}
          scanSuccessFlash={false}
          isScanning={!isLoading}
          enabled={visible}
          onClearError={clearMessages}
        />
      </View>
    </Modal>
  );
};
