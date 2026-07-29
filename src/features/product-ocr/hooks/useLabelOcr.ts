import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  isLabelOcrSupported,
  recognizeLabelText,
} from '@/features/product-ocr/services/labelOcr.engine';
import { parseNutritionLabel } from '@/features/product-ocr/services/nutritionLabelParser';
import type { ParsedNutritionLabel } from '@/features/product-ocr/types/ocrDraft';
import { getCurrentLocale } from '@/i18n';
import { ocrLog } from '@/features/product-ocr/utils/ocrLogger';
import {
  requestProductCameraPermission,
  requestProductPhotoLibraryPermission,
  type ProductPhotoSource,
} from '@/services/productImage.service';

export type LabelOcrState = {
  imageUri: string | null;
  parsed: ParsedNutritionLabel | null;
  isProcessing: boolean;
  error: string | null;
};

const pickLabelImageUri = async (source: ProductPhotoSource): Promise<string | null> => {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 1,
  };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
};

export const useLabelOcr = () => {
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedNutritionLabel | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setImageUri(null);
    setParsed(null);
    setIsProcessing(false);
    setError(null);
  }, []);

  const processImage = useCallback(
    async (uri: string) => {
      setIsProcessing(true);
      setError(null);
      setImageUri(uri);
      ocrLog('processImage: start', { uri });
      try {
        const supported = await isLabelOcrSupported();
        if (!supported) {
          ocrLog('processImage: unsupported');
          setError(t('products.ocr.unsupported'));
          setParsed({
            carbsPer100g: null,
            name: null,
            confidence: 'low',
            basis: 'unknown',
            rawText: '',
          });
          return;
        }

        const text = await recognizeLabelText(uri);
        const locale = getCurrentLocale() === 'en' ? 'en' : 'fr';
        const result = parseNutritionLabel(text, locale);
        ocrLog('processImage: parsed', {
          locale,
          carbsPer100g: result.carbsPer100g,
          name: result.name,
          confidence: result.confidence,
          basis: result.basis,
          sectionHeader: result.sectionHeader,
          matchedLine: result.matchedLine,
        });
        setParsed(result);
        if (result.carbsPer100g == null) {
          setError(t('products.ocr.parseFailed'));
        }
      } catch (err) {
        ocrLog('processImage: error', {
          message: err instanceof Error ? err.message : String(err),
        });
        setError(t('products.ocr.parseFailed'));
        setParsed({
          carbsPer100g: null,
          name: null,
          confidence: 'low',
          basis: 'unknown',
          rawText: '',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [t],
  );

  const captureFromSource = useCallback(
    async (
      source: ProductPhotoSource,
      options?: { onStarted?: () => void },
    ): Promise<'ok' | 'cancelled' | 'denied'> => {
      const granted =
        source === 'camera'
          ? await requestProductCameraPermission()
          : await requestProductPhotoLibraryPermission();

      if (!granted) {
        ocrLog('captureFromSource: permission denied', { source });
        setError(
          source === 'camera'
            ? t('products.ocr.permissionDenied')
            : t('products.photoPermissionDenied'),
        );
        return 'denied';
      }

      const uri = await pickLabelImageUri(source);
      if (!uri) {
        ocrLog('captureFromSource: cancelled', { source });
        return 'cancelled';
      }
      setImageUri(uri);
      setIsProcessing(true);
      setError(null);
      options?.onStarted?.();
      await processImage(uri);
      return 'ok';
    },
    [processImage, t],
  );

  return {
    imageUri,
    parsed,
    isProcessing,
    error,
    reset,
    processImage,
    captureFromSource,
    setParsed,
    setError,
  };
};
