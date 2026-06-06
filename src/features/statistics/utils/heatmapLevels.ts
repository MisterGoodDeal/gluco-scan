export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export const HEATMAP_GRID_ROWS = 7;
export const HEATMAP_GRID_COLUMNS = 16;
export const HEATMAP_GRID_DAYS = HEATMAP_GRID_ROWS * HEATMAP_GRID_COLUMNS;

export const getHeatmapMaxCarbs = (values: { carbs: number }[]): number =>
  values.reduce((max, { carbs }) => Math.max(max, carbs), 0);

export const getHeatmapLevel = (carbs: number, maxCarbs: number): HeatmapLevel => {
  if (carbs <= 0) return 0;
  if (maxCarbs <= 0) return 1;

  const ratio = carbs / maxCarbs;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
};

export const getHeatmapLevelColors = (mode: 'light' | 'dark'): Record<HeatmapLevel, string> => {
  if (mode === 'dark') {
    return {
      0: '#1A2030',
      1: '#0F3D2E',
      2: '#136B3A',
      3: '#22A055',
      4: '#3DDC84',
    };
  }

  return {
    0: '#E2E8F0',
    1: '#DCFCE7',
    2: '#86EFAC',
    3: '#22C55E',
    4: '#15803D',
  };
};
