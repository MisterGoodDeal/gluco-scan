export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export const getHeatmapLevel = (carbs: number): HeatmapLevel => {
  if (carbs <= 0) return 0;
  if (carbs <= 25) return 1;
  if (carbs <= 50) return 2;
  if (carbs <= 100) return 3;
  return 4;
};

export const HEATMAP_THRESHOLDS = [
  { level: 0 as const, max: 0 },
  { level: 1 as const, max: 25 },
  { level: 2 as const, max: 50 },
  { level: 3 as const, max: 100 },
  { level: 4 as const, max: Infinity },
];
