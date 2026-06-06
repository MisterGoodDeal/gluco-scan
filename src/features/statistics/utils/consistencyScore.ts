export const computeConsistencyScore = (dailyTotals: number[]): number => {
  if (dailyTotals.length < 2) return 100;

  const mean = dailyTotals.reduce((sum, value) => sum + value, 0) / dailyTotals.length;
  if (mean === 0) return 100;

  const variance =
    dailyTotals.reduce((sum, value) => sum + (value - mean) ** 2, 0) / dailyTotals.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;

  return Math.max(0, Math.min(100, Math.round(100 - coefficientOfVariation * 100)));
};
