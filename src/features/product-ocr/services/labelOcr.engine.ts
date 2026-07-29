import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import { ocrLog } from '@/features/product-ocr/utils/ocrLogger';

/**
 * On-device OCR via expo-mlkit-ocr (ML Kit / Apple Vision).
 * Requires a native rebuild (EAS / expo run) — not available in Expo Go.
 */
const OCR_MAX_WIDTH = 1800;
const OCR_JPEG_QUALITY = 0.92;

export const isLabelOcrSupported = async (): Promise<boolean> => {
  try {
    const { isSupported } = await import('expo-mlkit-ocr');
    return isSupported();
  } catch {
    return false;
  }
};

export const preprocessLabelImage = async (imageUri: string): Promise<string> => {
  const result = await manipulateAsync(
    imageUri,
    [{ resize: { width: OCR_MAX_WIDTH } }],
    { compress: OCR_JPEG_QUALITY, format: SaveFormat.JPEG },
  );
  return result.uri;
};

export const recognizeLabelText = async (imageUri: string): Promise<string> => {
  const { recognizeText, isSupported } = await import('expo-mlkit-ocr');
  if (!isSupported()) {
    ocrLog('recognizeLabelText: unsupported device');
    throw new Error('OCR_UNSUPPORTED');
  }
  ocrLog('recognizeLabelText: start', { imageUri });
  const preparedUri = await preprocessLabelImage(imageUri);
  ocrLog('recognizeLabelText: preprocessed', { preparedUri });
  const result = await recognizeText(preparedUri);
  const text = (result.text ?? '').trim();
  ocrLog('recognizeLabelText: done', {
    textLength: text.length,
    blockCount: result.blocks?.length ?? 0,
    lineCount: result.blocks?.reduce((n, b) => n + (b.lines?.length ?? 0), 0) ?? 0,
    text,
  });
  return text;
};
