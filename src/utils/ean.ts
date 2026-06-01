export const isValidEan = (ean: string): boolean => /^\d{8,14}$/.test(ean.trim());

export const parseManualCarbs = (text: string): number | null => {
  const normalized = text.replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
};
