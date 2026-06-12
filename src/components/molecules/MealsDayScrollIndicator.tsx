import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { View } from 'react-native';

import type { Meal } from '@/types/meal';
import { addDays } from '@/utils/date';

const DOT_OFFSETS = [-2, -1, 0, 1, 2] as const;

type MealsDayScrollIndicatorProps = {
  selectedDate: string;
  pagerCenter: string;
  mealsByDate: Record<string, Meal[]>;
  windowHalf?: number;
};

export const MealsDayScrollIndicator: FC<MealsDayScrollIndicatorProps> = ({
  selectedDate,
  pagerCenter,
  mealsByDate,
  windowHalf = 15,
}) => {
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');

  return (
    <View className="flex-row items-center gap-1.5" pointerEvents="none">
      {DOT_OFFSETS.map((offset) => {
        const dateKey = addDays(selectedDate, offset);
        const windowStart = addDays(pagerCenter, -windowHalf);
        const windowEnd = addDays(pagerCenter, windowHalf);
        const inWindow = dateKey >= windowStart && dateKey <= windowEnd;
        const isActive = offset === 0;
        const hasMeals = (mealsByDate[dateKey]?.length ?? 0) > 0;

        let opacity = 0.35;
        if (!inWindow) opacity = 0.2;
        else if (isActive || hasMeals) opacity = 1;

        return (
          <View
            key={offset}
            className={`rounded-full ${isActive ? 'h-1.5 w-5' : 'h-1.5 w-1.5'}`}
            style={{
              backgroundColor: isActive ? accentColor : mutedColor,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
};
