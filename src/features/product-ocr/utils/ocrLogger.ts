/**
 * OCR debug logger — Metro / Xcode console when the iPhone is connected via USB.
 * Filter by `[ocr]` in the terminal running `expo start` / `yarn ios`.
 */
export const ocrLog = (message: string, data?: unknown): void => {
  if (data === undefined) {
    console.log(`[ocr] ${message}`);
    return;
  }
  console.log(`[ocr] ${message}`, data);
};
