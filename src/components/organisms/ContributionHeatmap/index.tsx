import { type FC, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getHeatmapLevel } from '@/features/statistics/utils/heatmapLevels';
import { parseDateKey } from '@/utils/date';
import { getCurrentLocale } from '@/i18n';

export interface ContributionHeatmapProps {
  values: {
    date: string;
    carbs: number;
  }[];
  onDayPress?: (date: string, carbs: number) => void;
}

const DAY_LABELS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAY_LABELS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const Container = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: wrap;
`;

const LegendSwatch = styled.View<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`;

type WeekColumn = {
  weekStart: string;
  days: Array<{ date: string; carbs: number } | null>;
};

const getMondayBasedIndex = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

const buildWeekColumns = (values: ContributionHeatmapProps['values']): WeekColumn[] => {
  if (values.length === 0) return [];

  const sorted = [...values].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((entry) => [entry.date, entry.carbs]));
  const firstDate = parseDateKey(sorted[0].date);
  const lastDate = parseDateKey(sorted[sorted.length - 1].date);

  const start = new Date(firstDate);
  start.setDate(start.getDate() - getMondayBasedIndex(firstDate));

  const columns: WeekColumn[] = [];
  const cursor = new Date(start);

  while (cursor <= lastDate) {
    const weekStart = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    const days: Array<{ date: string; carbs: number } | null> = [];

    for (let i = 0; i < 7; i += 1) {
      const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      if (byDate.has(dateKey)) {
        days.push({ date: dateKey, carbs: byDate.get(dateKey) ?? 0 });
      } else if (dateKey >= sorted[0].date && dateKey <= sorted[sorted.length - 1].date) {
        days.push({ date: dateKey, carbs: 0 });
      } else {
        days.push(null);
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    columns.push({ weekStart, days });
  }

  return columns;
};

export const ContributionHeatmap: FC<ContributionHeatmapProps> = ({ values, onDayPress }) => {
  const theme = useTheme();
  const locale = getCurrentLocale();
  const dayLabels = locale === 'fr' ? DAY_LABELS_FR : DAY_LABELS_EN;

  const levelColors = useMemo(
    () => ({
      0: theme.colors.glass.border,
      1: `${theme.colors.success}33`,
      2: `${theme.colors.success}66`,
      3: `${theme.colors.success}99`,
      4: theme.colors.success,
    }),
    [theme.colors.glass.border, theme.colors.success],
  );

  const columns = useMemo(() => buildWeekColumns(values), [values]);
  const cellSize = 14;
  const cellGap = 3;

  return (
    <Container>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: cellGap }}>
          <View style={{ justifyContent: 'flex-end', gap: cellGap, paddingBottom: 18 }}>
            {dayLabels.map((label, index) => (
              <Text key={`${label}-${index}`} $variant="caption" $color="textSecondary" style={{ height: cellSize, lineHeight: cellSize, fontSize: 10 }}>
                {index % 2 === 0 ? label : ''}
              </Text>
            ))}
          </View>
          {columns.map((column) => (
            <View key={column.weekStart} style={{ gap: cellGap }}>
              <View style={{ height: 14, justifyContent: 'center' }}>
                <Text $variant="caption" $color="textSecondary" style={{ fontSize: 9 }}>
                  {parseDateKey(column.weekStart).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })}
                </Text>
              </View>
              {column.days.map((day, index) => {
                if (!day) {
                  return <View key={`${column.weekStart}-${index}`} style={{ width: cellSize, height: cellSize }} />;
                }
                const level = getHeatmapLevel(day.carbs);
                return (
                  <Pressable
                    key={day.date}
                    onPress={() => onDayPress?.(day.date, day.carbs)}
                    accessibilityRole="button"
                    accessibilityLabel={`${day.date}: ${day.carbs}g`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 3,
                      backgroundColor: levelColors[level],
                      borderWidth: 1,
                      borderColor: theme.colors.glass.border,
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      <LegendRow>
        {[0, 1, 2, 3, 4].map((level) => (
          <LegendSwatch key={level} $color={levelColors[level as 0 | 1 | 2 | 3 | 4]} />
        ))}
      </LegendRow>
    </Container>
  );
};
