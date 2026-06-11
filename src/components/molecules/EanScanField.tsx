import { CameraView, useCameraPermissions } from 'expo-camera';
import { FieldError, useThemeColor } from 'heroui-native';
import { type FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { AppButton, AppButtonLabel } from '@/components/ui/AppButton';
import { isValidEan } from '@/utils/ean';
import { triggerImpactLight, triggerNotificationError } from '@/utils/haptics';

type EanScanFieldProps = {
  onScan: (ean: string) => void;
};

export const EanScanField: FC<EanScanFieldProps> = ({ onScan }) => {
  const { t } = useTranslation();
  const accentColor = useThemeColor('accent');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleToggleScan = useCallback(async () => {
    setScanError(null);

    if (isScanning) {
      setIsScanning(false);
      return;
    }

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        setScanError(t('modal.cameraRequired'));
        triggerNotificationError();
        return;
      }
    }

    setIsScanning(true);
  }, [isScanning, permission?.granted, requestPermission, t]);

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      const ean = data.trim();
      if (!isValidEan(ean)) {
        setScanError(t('modal.invalidBarcode'));
        triggerNotificationError();
        return;
      }

      setScanError(null);
      setIsScanning(false);
      onScan(ean);
      triggerImpactLight();
    },
    [onScan, t],
  );

  return (
    <>
      <AppButton
        variant="tertiary"
        className="self-start mt-2"
        onPress={() => void handleToggleScan()}
        accessibilityLabel={isScanning ? t('modal.stopScanA11y') : t('modal.scanEanA11y')}>
        {isScanning ? (
          <ActivityIndicator color={accentColor} size="small" />
        ) : (
          <FaIcon name="barcode" size={16} color={accentColor} />
        )}
        <AppButtonLabel>
          {isScanning ? t('modal.stopScanA11y') : t('modal.scanPlaceholder')}
        </AppButtonLabel>
      </AppButton>

      <FieldError isInvalid={scanError !== null} className="mt-1">
        {scanError ?? ''}
      </FieldError>

      {isScanning && permission?.granted && (
        <View className="mt-2 h-[140px] rounded-lg overflow-hidden border border-border">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a'],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        </View>
      )}

      {isScanning && permission && !permission.granted && (
        <View className="mt-2 p-2 rounded-lg border border-border bg-surface gap-2">
          <Text className="text-muted text-sm">{t('modal.cameraRequired')}</Text>
          <AppButton
            variant="primary"
            className="self-start"
            onPress={() => void requestPermission()}>
            {t('common.authorize')}
          </AppButton>
        </View>
      )}
    </>
  );
};
