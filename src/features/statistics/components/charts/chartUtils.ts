import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';

export const CHART_COLORS = [
  '#5B8CFF',
  '#34C759',
  '#FF9500',
  '#AF52DE',
  '#FF3B30',
  '#64D2FF',
  '#FFD60A',
];

export const getChartColor = (index: number, override?: string): string =>
  override ?? CHART_COLORS[index % CHART_COLORS.length];

export const MAX_BAR_CHART_BARS = 10;

export type BarChartPoint = {
  label: string;
  value: number;
};

export const aggregateBarChartPoints = (
  points: BarChartPoint[],
  maxBars = MAX_BAR_CHART_BARS,
): BarChartPoint[] => {
  if (maxBars <= 0 || points.length <= maxBars) return points;

  const bucketSize = Math.ceil(points.length / maxBars);
  const buckets: BarChartPoint[] = [];

  for (let index = 0; index < points.length; index += bucketSize) {
    const chunk = points.slice(index, index + bucketSize);
    const value = chunk.reduce((sum, point) => sum + point.value, 0) / chunk.length;
    const firstLabel = chunk[0]?.label ?? '';
    const lastLabel = chunk[chunk.length - 1]?.label ?? firstLabel;
    const label =
      chunk.length === 1 || firstLabel === lastLabel ? firstLabel : `${firstLabel}–${lastLabel}`;

    buckets.push({ label, value });
  }

  return buckets.slice(0, maxBars);
};

export const getDailyBarChartMaxBars = (period: StatisticsPeriod): number | undefined => {
  if (period === '30d' || period === '90d' || period === '1y') {
    return MAX_BAR_CHART_BARS;
  }
  return undefined;
};

export const getMaxValue = (values: number[]): number => Math.max(...values, 0);

export const getChartMaxValue = (values: number[]): number => Math.max(...values, 1);

export const getChartLabelStep = (count: number): number => {
  if (count <= 7) return 1;
  if (count <= 14) return 2;
  if (count <= 31) return 5;
  if (count <= 90) return 9;
  return Math.max(1, Math.ceil(count / 12));
};

export const shouldShowChartValues = (count: number): boolean => count <= 14;

export const shouldShowChartLabel = (index: number, count: number): boolean => {
  const step = getChartLabelStep(count);
  return index % step === 0 || index === count - 1;
};

const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
};

export const describeDonutSlice = (
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string => {
  if (endAngle - startAngle >= 360) {
    return [
      `M ${cx} ${cy - outerRadius}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${cx - 0.01} ${cy - outerRadius}`,
      `L ${cx - 0.01} ${cy - innerRadius}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy - innerRadius}`,
      'Z',
    ].join(' ');
  }

  const startOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
};
