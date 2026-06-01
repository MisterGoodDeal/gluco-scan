import { CameraView, useCameraPermissions } from 'expo-camera';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
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
  /** Remplit le conteneur parent (ex. bottom sheet) au lieu d'une bande fixe. */
  fill?: boolean;
};

const ScannerContainer = styled.View<{ $fill?: boolean }>`
  ${({ $fill }) => ($fill ? 'flex: 1;' : `height: ${hp('22%')}px;`)}
  overflow: hidden;
  ${({ $fill, theme }) =>
    $fill
      ? ''
      : `
    border-bottom-left-radius: ${theme.radius.lg}px;
    border-bottom-right-radius: ${theme.radius.lg}px;
  `}
`;

const Camera = styled(CameraView)`
  flex: 1;
`;

const Overlay = styled.View<{ $fill?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: ${({ $fill }) => ($fill ? 'center' : 'flex-start')};
  padding-top: ${({ $fill, theme }) => ($fill ? 0 : topScreenSpace)}px;
`;

const ScanFrame = styled.View<{ $fill?: boolean }>`
  width: ${({ $fill }) => ($fill ? '78%' : '70%')};
  height: ${({ $fill }) => ($fill ? '72%' : '60%')};
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

const MessageStack = styled.View<{ $fill?: boolean }>`
  ${({ $fill }) =>
    $fill
      ? `
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `
      : ''}
`;

const ErrorBanner = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const WarningBanner = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const PermissionContainer = styled.View<{ $fill?: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  ${({ $fill }) => (!$fill ? `min-height: ${hp('22%')}px; padding-top: ${topScreenSpace}px;` : '')}
  gap: ${({ theme }) => theme.spacing.md}px;
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
  fill = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  const messages = (
    <MessageStack $fill={fill}>
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
    </MessageStack>
  );

  if (!permission) {
    return (
      <ScannerContainer $fill={fill}>
        <PermissionContainer $fill={fill}>
          <ActivityIndicator color={theme.colors.accent} />
        </PermissionContainer>
      </ScannerContainer>
    );
  }

  if (!permission.granted) {
    return (
      <>
        <ScannerContainer $fill={fill}>
          <PermissionContainer $fill={fill}>
            <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
              {t('scanner.cameraPermission')}
            </Text>
            <PermissionButton onPress={requestPermission}>
              <Text>{t('scanner.authorizeCamera')}</Text>
            </PermissionButton>
          </PermissionContainer>
        </ScannerContainer>
        {!fill && messages}
      </>
    );
  }

  return (
    <>
      <ScannerContainer $fill={fill}>
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
        <Overlay $fill={fill} pointerEvents="none">
          <ScanFrame $fill={fill} />
        </Overlay>
        {scanSuccessFlash && <FlashOverlay pointerEvents="none" />}
        {isLoadingProduct && (
          <LoadingOverlay pointerEvents="none">
            <ActivityIndicator color={theme.colors.accent} size="large" />
          </LoadingOverlay>
        )}
        {fill && messages}
      </ScannerContainer>
      {!fill && messages}
    </>
  );
};
