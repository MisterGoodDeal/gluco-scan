import { getCurrentLocale } from '@/i18n';

export const formatDecimal = (value: number, decimals = 1): string => {
  const locale = getCurrentLocale() === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDecimalForInput = (value: number): string => {
  if (value <= 0) return '';
  return formatDecimal(value, value % 1 === 0 ? 0 : 1);
};
