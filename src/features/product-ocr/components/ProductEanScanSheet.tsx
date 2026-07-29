import { BottomSheet } from 'heroui-native';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScannerView } from '@/components/organisms/ScannerView';
import { AppButton } from '@/components/ui/AppButton';
import { persistOffProduct } from '@/hooks/useMealProductScan';
import { productRepository } from '@/repositories/product.repository';
import { getErrorMessage } from '@/services/errors';
import {
  fetchOffPartialByEAN,
  fetchProductByEAN,
} from '@/services/openFoodFacts.service';
import type { Product } from '@/types/product';
import type { ProductFormDraft } from '@/features/product-ocr/types/ocrDraft';
import { isValidEan, normalizeEan } from '@/utils/ean';
import {
  triggerImpactLight,
  triggerNotificationError,
  triggerNotificationSuccess,
} from '@/utils/haptics';
import { SCAN_COOLDOWN_MS } from '@/constants/api';

export type ProductEanScanResult =
  | { kind: 'existing'; product: Product }
  | { kind: 'created'; product: Product }
  | { kind: 'draft'; draft: ProductFormDraft };

type ProductEanScanSheetProps = {
  visible: boolean;
  onClose: () => void;
  onResolved: (result: ProductEanScanResult) => void;
};

export const ProductEanScanSheet: FC<ProductEanScanSheetProps> = ({
  visible,
  onClose,
  onResolved,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccessFlash, setScanSuccessFlash] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const lastScanAtRef = useRef(0);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setIsLoading(false);
      setScanError(null);
      setScanSuccessFlash(false);
      setIsScanning(true);
      inFlightRef.current = false;
      return;
    }
    setIsScanning(true);
  }, [visible]);

  const handleScan = useCallback(
    async (raw: string) => {
      const now = Date.now();
      if (now - lastScanAtRef.current < SCAN_COOLDOWN_MS) return;
      if (inFlightRef.current || isLoading) return;

      const code = normalizeEan(raw);
      if (!isValidEan(code)) {
        setScanError(t('modal.invalidBarcode'));
        triggerNotificationError();
        return;
      }

      lastScanAtRef.current = now;
      inFlightRef.current = true;
      setIsLoading(true);
      setScanError(null);
      setIsScanning(false);

      try {
        const existing = await productRepository.getByEan(code);
        if (existing) {
          setScanSuccessFlash(true);
          triggerNotificationSuccess();
          onResolved({ kind: 'existing', product: existing });
          return;
        }

        try {
          const fromOff = await fetchProductByEAN(code);
          const product = await persistOffProduct({ ...fromOff, ean: code });
          setScanSuccessFlash(true);
          triggerImpactLight();
          onResolved({ kind: 'created', product });
          return;
        } catch {
          const partial = await fetchOffPartialByEAN(code);
          if (partial.name && partial.carbsPer100g != null) {
            const product = await persistOffProduct({
              ean: code,
              name: partial.name,
              carbsPer100g: partial.carbsPer100g,
              imageUrl: partial.imageUrl,
              tags: partial.tags ?? [],
            });
            setScanSuccessFlash(true);
            triggerImpactLight();
            onResolved({ kind: 'created', product });
            return;
          }

          onResolved({
            kind: 'draft',
            draft: {
              ean: code,
              name: partial.name,
              carbsPer100g: partial.carbsPer100g,
              imageUrl: partial.imageUrl,
              tags: partial.tags,
              source: 'off',
            },
          });
        }
      } catch (err) {
        setScanError(getErrorMessage(err));
        triggerNotificationError();
        setIsScanning(true);
      } finally {
        inFlightRef.current = false;
        setIsLoading(false);
      }
    },
    [isLoading, onResolved, t],
  );

  return (
    <BottomSheet
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['90%']}
          enableDynamicSizing={false}
          enablePanDownToClose={!isLoading}
          contentContainerClassName="h-full">
          <View className="flex-1 px-4" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
            <View className="flex-row items-center justify-between py-4 border-b border-separator">
              <Text className="text-foreground text-lg font-semibold flex-1 pr-2">
                {t('products.addMethod.ean')}
              </Text>
              <AppButton variant="tertiary" size="sm" onPress={onClose} isDisabled={isLoading}>
                {t('common.cancel')}
              </AppButton>
            </View>

            <Text className="text-muted text-sm mt-3 mb-3">
              {t('products.addMethod.eanDescription')}
            </Text>

            <View className="flex-1 min-h-0 rounded-2xl overflow-hidden">
              <ScannerView
                fill
                onScan={(ean) => void handleScan(ean)}
                isLoadingProduct={isLoading}
                scanError={scanError}
                scanSuccessFlash={scanSuccessFlash}
                isScanning={isScanning && visible}
                enabled={visible}
                onClearError={() => setScanError(null)}
              />
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
