import { CameraView, useCameraPermissions } from 'expo-camera';
import { useThemeColor } from 'heroui-native';
import { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { AppButton } from '@/components/ui/AppButton';
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

const BAND_HEIGHT = hp('22%');

const ScannerContainer: FC<{ fill: boolean; children: ReactNode }> = ({ fill, children }) => (
  <View
    className={`overflow-hidden ${fill ? 'flex-1' : 'rounded-b-3xl'}`}
    style={fill ? undefined : { height: BAND_HEIGHT }}>
    {children}
  </View>
);

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
  const accentColor = useThemeColor('accent');
  const [permission, requestPermission] = useCameraPermissions();

  const messages = (
    <View className={fill ? 'absolute left-0 right-0 bottom-0' : ''}>
      {scanWarning && (
        <View className="px-4 py-2">
          <GlassPanel padding={8}>
            <Text className="text-warning text-sm">{scanWarning}</Text>
          </GlassPanel>
        </View>
      )}
      {scanError && (
        <View className="px-4 py-2">
          <GlassPanel padding={8}>
            <Text className="text-danger text-sm">{scanError}</Text>
          </GlassPanel>
        </View>
      )}
    </View>
  );

  const permissionContainerStyle = fill
    ? undefined
    : { minHeight: BAND_HEIGHT, paddingTop: topScreenSpace };

  if (!permission) {
    return (
      <ScannerContainer fill={fill}>
        <View
          className="flex-1 items-center justify-center p-6 gap-4"
          style={permissionContainerStyle}>
          <ActivityIndicator color={accentColor} />
        </View>
      </ScannerContainer>
    );
  }

  if (!permission.granted) {
    return (
      <>
        <ScannerContainer fill={fill}>
          <View
            className="flex-1 items-center justify-center p-6 gap-4"
            style={permissionContainerStyle}>
            <Text className="text-muted text-base text-center">
              {t('scanner.cameraPermission')}
            </Text>
            <AppButton variant="primary" onPress={() => void requestPermission()}>
              {t('scanner.authorizeCamera')}
            </AppButton>
          </View>
        </ScannerContainer>
        {!fill && messages}
      </>
    );
  }

  return (
    <>
      <ScannerContainer fill={fill}>
        <CameraView
          style={{ flex: 1 }}
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
        <View
          className={`absolute inset-0 items-center ${fill ? 'justify-center' : 'justify-start'}`}
          style={fill ? undefined : { paddingTop: topScreenSpace }}
          pointerEvents="none">
          <View
            className="border-2 border-white/40 rounded-xl"
            style={{
              width: fill ? '78%' : '70%',
              height: fill ? '72%' : '60%',
            }}
          />
        </View>
        {scanSuccessFlash && (
          <View className="absolute inset-0 bg-accent/20" pointerEvents="none" />
        )}
        {isLoadingProduct && (
          <View
            className="absolute inset-0 items-center justify-center bg-black/40"
            pointerEvents="none">
            <ActivityIndicator color={accentColor} size="large" />
          </View>
        )}
        {fill && messages}
      </ScannerContainer>
      {!fill && messages}
    </>
  );
};
