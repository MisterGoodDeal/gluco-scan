export type WidgetHeatmapDay = {
  date: string;
  carbs: number;
};

export type WidgetSummary = {
  todayCarbs: number;
  weekAverageCarbs: number;
  monthAverageCarbs: number;
  maxDayCarbs: number;
  totalMealsToday: number;
  lastUpdate: string;
};

export type WidgetData = {
  summary: WidgetSummary;
  heatmap: WidgetHeatmapDay[];
};

export const WIDGET_SNAPSHOT_KEY = 'widgetDataSnapshot';
export { HEATMAP_GRID_DAYS as WIDGET_HEATMAP_DAYS } from '@/features/statistics/utils/heatmapLevels';
