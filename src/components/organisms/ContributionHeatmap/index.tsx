import { type FC, useMemo, useState } from 'react';
import { Pressable, type LayoutChangeEvent } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
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

const Container = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Grid = styled.View`
  flex-direction: row;
  gap: ${CELL_GAP}px;
`;

const Column = styled.View`
  flex: 1;
  gap: ${CELL_GAP}px;
`;

const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Cell = styled.View<{ $color: string; $radius: number }>`
  width: 100%;
  border-radius: ${({ $radius }) => $radius}px;
  background-color: ${({ $color }) => $color};
`;

const LegendSwatch = styled.View<{ $color: string; $radius: number }>`
  width: ${LEGEND_SWATCH_SIZE}px;
  height: ${LEGEND_SWATCH_SIZE}px;
  border-radius: ${({ $radius }) => $radius}px;
  background-color: ${({ $color }) => $color};
`;

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
  const theme = useTheme();
  const [cellRadius, setCellRadius] = useState(4);

  const maxCarbs = useMemo(() => getHeatmapMaxCarbs(values), [values]);
  const levelColors = useMemo(() => getHeatmapLevelColors(theme.mode), [theme.mode]);
  const columns = useMemo(() => buildGridColumns(values), [values]);
  const legendRadius = Math.max(2, Math.round(LEGEND_SWATCH_SIZE * CELL_RADIUS_RATIO));

  const handleGridLayout = (event: LayoutChangeEvent) => {
    setCellRadius(getCellRadius(event.nativeEvent.layout.width));
  };

  return (
    <Container>
      <Grid onLayout={handleGridLayout}>
        {columns.map((column, columnIndex) => (
          <Column key={`col-${columnIndex}`}>
            {column.map((day, rowIndex) => {
              if (!day) {
                return (
                  <Cell
                    key={`empty-${columnIndex}-${rowIndex}`}
                    $color={levelColors[0]}
                    $radius={cellRadius}
                    style={{ aspectRatio: 1 }}
                  />
                );
              }

              const level = getHeatmapLevel(day.carbs, maxCarbs);

              return (
                <Pressable
                  key={day.date}
                  onPress={() => onDayPress?.(day.date, day.carbs)}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.date}: ${day.carbs}g`}>
                  <Cell $color={levelColors[level]} $radius={cellRadius} style={{ aspectRatio: 1 }} />
                </Pressable>
              );
            })}
          </Column>
        ))}
      </Grid>

      <LegendRow>
        <Text $variant="caption" $color="textSecondary" style={{ fontSize: 10 }}>
          {t('statistics.heatmap.less')}
        </Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <LegendSwatch
            key={level}
            $color={levelColors[level as 0 | 1 | 2 | 3 | 4]}
            $radius={legendRadius}
          />
        ))}
        <Text $variant="caption" $color="textSecondary" style={{ fontSize: 10 }}>
          {t('statistics.heatmap.more')}
        </Text>
      </LegendRow>
    </Container>
  );
};
