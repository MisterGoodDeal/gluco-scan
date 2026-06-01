import { CameraView, useCameraPermissions } from 'expo-camera';
import { type FC } from 'react';
import { ActivityIndicator } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { hp, topScreenSpace } from '@/utils/screen';

type ScannerViewProps = {
  onScan: (ean: string) => void;
  isLoadingProduct: boolean;
  scanError: string | null;
  scanWarning?: string | null;
  scanSuccessFlash: boolean;
  isScanning: boolean;
  enabled?: boolean;
  onClearError: () => void;
};

const ScannerContainer = styled.View`
  height: ${hp('22%')}px;
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
  justify-content: flex-start;
  padding-top: ${topScreenSpace}px;
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

const WarningBanner = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const PermissionContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${topScreenSpace}px;
  gap: ${({ theme }) => theme.spacing.md}px;
  min-height: ${hp('22%')}px;
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
  scanWarning = null,
  scanSuccessFlash,
  isScanning,
  enabled = true,
  onClearError,
}) => {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <>
        <ScannerContainer>
          <PermissionContainer>
            <ActivityIndicator color={theme.colors.accent} />
          </PermissionContainer>
        </ScannerContainer>
      </>
    );
  }

  if (!permission.granted) {
    return (
      <>
        <ScannerContainer style={{ minHeight: hp('22%') }}>
          <PermissionContainer>
            <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
              GlucoScan a besoin de la caméra pour scanner les codes-barres.
            </Text>
            <PermissionButton onPress={requestPermission}>
              <Text>Autoriser la caméra</Text>
            </PermissionButton>
          </PermissionContainer>
        </ScannerContainer>
      </>
    );
  }

  return (
    <>
      <ScannerContainer>
        <Camera
          active={enabled}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a'],
          }}
          onBarcodeScanned={
            enabled && isScanning && !isLoadingProduct
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
      {scanWarning && (
        <WarningBanner>
          <GlassPanel padding={theme.spacing.sm}>
            <Text $variant="caption" $color="accent">
              {scanWarning}
            </Text>
          </GlassPanel>
        </WarningBanner>
      )}
      {scanError && (
        <ErrorBanner>
          <GlassPanel padding={theme.spacing.sm}>
            <Text $variant="caption" $color="error">
              {scanError}
            </Text>
          </GlassPanel>
        </ErrorBanner>
      )}
    </>
  );
};
