import { CameraView, useCameraPermissions } from 'expo-camera';
import { type FC, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { InputNumber } from '@/components/atoms/InputNumber';
import { Text } from '@/components/atoms/Text';
import {
  scannerHeight,
  scannerMinHeight,
  scannerPermissionHeight,
  topScreenSpace,
} from '@/utils/screen';

type ScannerViewProps = {
  onScan: (ean: string) => void;
  isLoadingProduct: boolean;
  scanError: string | null;
  scanSuccessFlash: boolean;
  isScanning: boolean;
  onClearError: () => void;
};

const ScannerWrapper = styled.View`
  padding-top: ${topScreenSpace}px;
`;

const ScannerContainer = styled.View`
  height: ${scannerHeight}px;
  border-bottom-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-bottom-right-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
`;

const Camera = styled(CameraView)`
  flex: 1;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
`;

const ScanFrame = styled.View`
  width: 70%;
  height: 60%;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.glass.highlight};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const FlashOverlay = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.accentMuted};
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ErrorBanner = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const WebContainer = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const WebRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const AddButton = styled.Pressable<{ $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const PermissionContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.md}px;
  min-height: ${scannerPermissionHeight}px;
`;

const PermissionButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const ScannerView: FC<ScannerViewProps> = ({
  onScan,
  isLoadingProduct,
  scanError,
  scanSuccessFlash,
  isScanning,
  onClearError,
}) => {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [manualEan, setManualEan] = useState('');

  const handleManualSubmit = () => {
    if (manualEan.trim()) {
      onScan(manualEan.trim());
      setManualEan('');
    }
  };

  if (Platform.OS === 'web') {
    return (
      <ScannerWrapper>
        <ScannerContainer style={{ minHeight: scannerMinHeight }}>
          <GlassPanel padding={theme.spacing.md}>
          <WebContainer>
            <Text $variant="subtitle">Saisie manuelle EAN</Text>
            <WebRow>
              <InputNumber
                value={manualEan}
                onChangeText={setManualEan}
                placeholder="8076800105735"
              />
              <AddButton onPress={handleManualSubmit} $disabled={isLoadingProduct}>
                <Text $color="text">Ajouter</Text>
              </AddButton>
            </WebRow>
          </WebContainer>
        </GlassPanel>
        {scanError && (
          <ErrorBanner>
            <GlassPanel padding={theme.spacing.sm}>
              <Text $variant="caption" $color="error">
                {scanError}
              </Text>
            </GlassPanel>
          </ErrorBanner>
        )}
      </ScannerContainer>
      </ScannerWrapper>
    );
  }

  if (!permission) {
    return (
      <ScannerWrapper>
        <ScannerContainer>
        <PermissionContainer>
          <ActivityIndicator color={theme.colors.accent} />
        </PermissionContainer>
      </ScannerContainer>
      </ScannerWrapper>
    );
  }

  if (!permission.granted) {
    return (
      <ScannerWrapper>
        <ScannerContainer style={{ minHeight: scannerPermissionHeight }}>
        <PermissionContainer>
          <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
            GlucoScan a besoin de la caméra pour scanner les codes-barres.
          </Text>
          <PermissionButton onPress={requestPermission}>
            <Text>Autoriser la caméra</Text>
          </PermissionButton>
        </PermissionContainer>
      </ScannerContainer>
      </ScannerWrapper>
    );
  }

  return (
    <ScannerWrapper>
      <ScannerContainer>
        <Camera
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a'],
          }}
          onBarcodeScanned={
            isScanning && !isLoadingProduct
              ? ({ data }) => {
                  onClearError();
                  onScan(data);
                }
              : undefined
          }
        />
        <Overlay pointerEvents="none">
          <ScanFrame />
        </Overlay>
        {scanSuccessFlash && <FlashOverlay pointerEvents="none" />}
        {isLoadingProduct && (
          <LoadingOverlay pointerEvents="none">
            <ActivityIndicator color={theme.colors.accent} size="large" />
          </LoadingOverlay>
        )}
      </ScannerContainer>
      {scanError && (
        <ErrorBanner>
          <GlassPanel padding={theme.spacing.sm}>
            <Text $variant="caption" $color="error">
              {scanError}
            </Text>
          </GlassPanel>
        </ErrorBanner>
      )}
    </ScannerWrapper>
  );
};
