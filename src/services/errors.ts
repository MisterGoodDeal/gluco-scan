import i18n from '@/i18n';
import type { TranslationSchema } from '@/i18n/locales/fr';

type ErrorTranslationKey = `errors.${keyof TranslationSchema['errors']}`;

export class TranslatableError extends Error {
  constructor(
    public readonly translationKey: ErrorTranslationKey,
    public readonly translationParams?: Record<string, string | number>,
  ) {
    super(translationKey);
    this.name = 'TranslatableError';
  }

  override get message(): string {
    return i18n.t(this.translationKey, this.translationParams);
  }
}

export class ProductNotFoundError extends TranslatableError {
  constructor(ean: string) {
    super('errors.productNotFound', { ean });
    this.name = 'ProductNotFoundError';
  }
}

export class MissingNutrimentsError extends TranslatableError {
  constructor(ean: string) {
    super('errors.missingNutriments', { ean });
    this.name = 'MissingNutrimentsError';
  }
}

export class NetworkError extends TranslatableError {
  constructor(
    key: ErrorTranslationKey = 'errors.network',
    params?: Record<string, string | number>,
  ) {
    super(key, params);
    this.name = 'NetworkError';
  }
}

export class InvalidBarcodeError extends TranslatableError {
  constructor() {
    super('errors.invalidBarcode');
    this.name = 'InvalidBarcodeError';
  }
}

export class OffRateLimitError extends TranslatableError {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super('errors.offRateLimit', { seconds: retryAfterSeconds });
    this.name = 'OffRateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof TranslatableError) return error.message;
  if (error instanceof Error) return error.message;
  return i18n.t('errors.generic');
};
