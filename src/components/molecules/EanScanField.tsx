import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { type FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { isValidEan } from '@/utils/ean';

type EanScanFieldProps = {
  value?: string;
  onScan: (ean: string) => void;
  placeholder?: string;
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ScannerContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  height: 140px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const Camera = styled(CameraView)`
  flex: 1;
`;

const PermissionHint = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  background-color: ${({ theme }) => theme.colors.glass.background};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const PermissionButton = styled.Pressable`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const EanScanField: FC<EanScanFieldProps> = ({
  value = '',
  onScan,
  placeholder,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
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
        return;
      }

      setScanError(null);
      setIsScanning(false);
      onScan(ean);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [onScan, t],
  );

  return (
    <>
      <Row>
        <SearchInput
          value={value}
          editable={false}
          mono
          flex
          placeholder={placeholder ?? t('modal.scanPlaceholder')}
        />
        <ButtonIcon
          onPress={handleToggleScan}
          accessibilityLabel={
            isScanning ? t('modal.stopScanA11y') : t('modal.scanEanA11y')
          }>
          {isScanning ? (
            <ActivityIndicator color={theme.colors.accent} size="small" />
          ) : (
            <SymbolView
              name={{ ios: 'barcode.viewfinder', android: 'barcode_scanner' }}
              size={20}
              tintColor={theme.colors.accent}
            />
          )}
        </ButtonIcon>
      </Row>

      {scanError && (
        <Text $variant="caption" $color="error">
          {scanError}
        </Text>
      )}

      {isScanning && permission?.granted && (
        <ScannerContainer>
          <Camera
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a'],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        </ScannerContainer>
      )}

      {isScanning && permission && !permission.granted && (
        <PermissionHint>
          <Text $variant="caption" $color="textSecondary">
            {t('modal.cameraRequired')}
          </Text>
          <PermissionButton onPress={requestPermission}>
            <Text $variant="caption">{t('common.authorize')}</Text>
          </PermissionButton>
        </PermissionHint>
      )}
    </>
  );
};
