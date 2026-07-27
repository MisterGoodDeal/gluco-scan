import type { TextProps } from 'react-native';

const ELLIPSIS = '…';

/** Lowercase + strip diacritics for accent-insensitive search. */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function truncateText(text: string, maxLength: number): string {
  const normalized = text.trim();
  if (maxLength < 1 || normalized.length <= maxLength) return normalized;
  if (maxLength === 1) return ELLIPSIS;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}${ELLIPSIS}`;
}

export function textLineClamp(
  lines: number,
): Pick<TextProps, 'numberOfLines' | 'ellipsizeMode'> {
  return { numberOfLines: lines, ellipsizeMode: 'tail' };
}
