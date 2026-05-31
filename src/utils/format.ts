export const formatDecimal = (value: number, decimals = 1): string =>
  value.toFixed(decimals).replace('.', ',');
