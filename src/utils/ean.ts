export const isValidEan = (ean: string): boolean => /^\d{8,14}$/.test(ean.trim());

export const normalizeEan = (ean: string): string => {
  const trimmed = ean.trim();
  if (trimmed.length === 12) return `0${trimmed}`;
  return trimmed;
};

export const parseManualCarbs = (text: string): number | null => {
  const normalized = text.replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
};
