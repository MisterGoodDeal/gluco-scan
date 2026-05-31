export const createScanDebouncer = (cooldownMs: number) => {
  let lastScanAt = 0;
  let lastEan: string | null = null;

  const canScan = (ean: string): boolean => {
    const now = Date.now();
    if (ean === lastEan) return false;
    if (now - lastScanAt < cooldownMs) return false;
    return true;
  };

  const recordScan = (ean: string): void => {
    lastScanAt = Date.now();
    lastEan = ean;
    setTimeout(() => {
      if (lastEan === ean) lastEan = null;
    }, cooldownMs);
  };

  return { canScan, recordScan };
};
