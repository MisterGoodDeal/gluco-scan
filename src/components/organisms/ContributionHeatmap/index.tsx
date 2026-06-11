import { type FC, useMemo, useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUniwind } from 'uniwind';

import { AppPressable } from '@/components/ui/AppPressable';
import {
  getHeatmapLevel,
  getHeatmapLevelColors,
  getHeatmapMaxCarbs,
  HEATMAP_GRID_COLUMNS,
  HEATMAP_GRID_ROWS,
} from '@/features/statistics/utils/heatmapLevels';

export interface ContributionHeatmapProps {
  values: {
    date: string;
    carbs: number;
  }[];
  onDayPress?: (date: string, carbs: number) => void;
}

const CELL_GAP = 3;
const LEGEND_SWATCH_SIZE = 10;
const CELL_RADIUS_RATIO = 0.24;

const getCellRadius = (gridWidth: number): number => {
  const cellWidth =
    (gridWidth - (HEATMAP_GRID_COLUMNS - 1) * CELL_GAP) / HEATMAP_GRID_COLUMNS;
  return Math.max(3, Math.round(cellWidth * CELL_RADIUS_RATIO));
};

const buildGridColumns = (
  values: ContributionHeatmapProps['values'],
): Array<Array<{ date: string; carbs: number } | null>> => {
  const columns: Array<Array<{ date: string; carbs: number } | null>> = Array.from(
    { length: HEATMAP_GRID_COLUMNS },
    () => Array.from({ length: HEATMAP_GRID_ROWS }, () => null),
  );

  values.slice(-HEATMAP_GRID_ROWS * HEATMAP_GRID_COLUMNS).forEach((day, index) => {
    const column = Math.floor(index / HEATMAP_GRID_ROWS);
    const row = index % HEATMAP_GRID_ROWS;
    columns[column][row] = day;
  });

  return columns;
};

export const ContributionHeatmap: FC<ContributionHeatmapProps> = ({ values, onDayPress }) => {
  const { t } = useTranslation();
  const { theme } = useUniwind();
  const [cellRadius, setCellRadius] = useState(4);

  const maxCarbs = useMemo(() => getHeatmapMaxCarbs(values), [values]);
  const levelColors = useMemo(
    () => getHeatmapLevelColors(theme === 'dark' ? 'dark' : 'light'),
    [theme],
  );
  const columns = useMemo(() => buildGridColumns(values), [values]);
  const legendRadius = Math.max(2, Math.round(LEGEND_SWATCH_SIZE * CELL_RADIUS_RATIO));

  const handleGridLayout = (event: LayoutChangeEvent) => {
    setCellRadius(getCellRadius(event.nativeEvent.layout.width));
  };

  return (
    <View className="gap-2">
      <View className="flex-row" style={{ gap: CELL_GAP }} onLayout={handleGridLayout}>
        {columns.map((column, columnIndex) => (
          <View key={`col-${columnIndex}`} className="flex-1" style={{ gap: CELL_GAP }}>
            {column.map((day, rowIndex) => {
              if (!day) {
                return (
                  <View
                    key={`empty-${columnIndex}-${rowIndex}`}
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                      borderRadius: cellRadius,
                      backgroundColor: levelColors[0],
                    }}
                  />
                );
              }

              const level = getHeatmapLevel(day.carbs, maxCarbs);

              return (
                <AppPressable
                  key={day.date}
                  onPress={() => onDayPress?.(day.date, day.carbs)}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.date}: ${day.carbs}g`}>
                  <View
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                      borderRadius: cellRadius,
                      backgroundColor: levelColors[level],
                    }}
                  />
                </AppPressable>
              );
            })}
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-end gap-1">
        <Text className="text-muted" style={{ fontSize: 10 }}>
          {t('statistics.heatmap.less')}
        </Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={{
              width: LEGEND_SWATCH_SIZE,
              height: LEGEND_SWATCH_SIZE,
              borderRadius: legendRadius,
              backgroundColor: levelColors[level as 0 | 1 | 2 | 3 | 4],
            }}
          />
        ))}
        <Text className="text-muted" style={{ fontSize: 10 }}>
          {t('statistics.heatmap.more')}
        </Text>
      </View>
    </View>
  );
};
