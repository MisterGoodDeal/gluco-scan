import { BlurTargetView } from 'expo-blur';
import { type FC, useRef } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { CarbTotalFooter } from '@/components/organisms/CarbTotalFooter';
import { ScannedList } from '@/components/organisms/ScannedList';
import { ScannerView } from '@/components/organisms/ScannerView';
import { useScanner } from '@/hooks/useScanner';
import { BackgroundLayer, BackgroundLayerBottom, Screen } from '@/styles/global';

const Content = styled.View`
  flex: 1;
`;

export const ScannerScreenLayout: FC = () => {
  const blurTargetRef = useRef<View>(null);
  const {
    handleScan,
    isLoadingProduct,
    scanError,
    scanSuccessFlash,
    isScanning,
    clearError,
  } = useScanner();

  return (
    <Screen>
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundLayer />
        <BackgroundLayerBottom />
        <Content>
          <ScannerView
            onScan={handleScan}
            isLoadingProduct={isLoadingProduct}
            scanError={scanError}
            scanSuccessFlash={scanSuccessFlash}
            isScanning={isScanning}
            onClearError={clearError}
          />
          <ScannedList blurTarget={blurTargetRef} />
        </Content>
      </BlurTargetView>
      <CarbTotalFooter blurTarget={blurTargetRef} />
    </Screen>
  );
};
