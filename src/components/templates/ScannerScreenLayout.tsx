import { BlurTargetView } from 'expo-blur';
import { type FC, useRef, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { CarbTotalFooter } from '@/components/organisms/CarbTotalFooter';
import { ProductManualEntryModal } from '@/components/organisms/ProductManualEntryModal';
import { ScannedList } from '@/components/organisms/ScannedList';
import { ScannerView } from '@/components/organisms/ScannerView';
import { useScanner } from '@/hooks/useScanner';
import { Screen } from '@/styles/global';

const Main = styled.View`
  flex: 1;
  position: relative;
`;

const Content = styled.View`
  flex: 1;
`;

export const ScannerScreenLayout: FC = () => {
  const blurTargetRef = useRef<View>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const {
    handleScan,
    isLoadingProduct,
    scanError,
    scanSuccessFlash,
    isScanning,
    clearError,
    manualEntry,
    closeManualEntry,
    submitManualEntry,
  } = useScanner();

  return (
    <Screen>
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <Main>
          <Content>
            <ScannerView
              onScan={handleScan}
              isLoadingProduct={isLoadingProduct}
              scanError={scanError}
              scanSuccessFlash={scanSuccessFlash}
              isScanning={isScanning}
              onClearError={clearError}
            />
            <ScannedList blurTarget={blurTargetRef} bottomInset={footerHeight} />
          </Content>
          <CarbTotalFooter
            blurTarget={blurTargetRef}
            onHeightChange={setFooterHeight}
          />
        </Main>
      </BlurTargetView>
      <ProductManualEntryModal
        visible={manualEntry !== null}
        initial={manualEntry}
        subtitle="Produit introuvable ou incomplet — complétez les informations."
        submitLabel="Ajouter au repas"
        onClose={closeManualEntry}
        onSubmit={submitManualEntry}
      />
    </Screen>
  );
};
