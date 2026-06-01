import { type FC, useMemo, useRef } from 'react';
import { FlatList, useWindowDimensions, type ViewToken } from 'react-native';

import { DayMealsView } from '@/components/organisms/DayMealsView';
import type { Meal } from '@/types/meal';
import { addDays } from '@/utils/date';

type MealsDayPagerProps = {
  centerDate: string;
  windowDays?: number;
  mealsByDate: Record<string, Meal[]>;
  totalsByDate: Record<string, number>;
  onDateChange: (dateKey: string) => void;
  onMealPress: (meal: Meal) => void;
};

export const MealsDayPager: FC<MealsDayPagerProps> = ({
  centerDate,
  windowDays = 30,
  mealsByDate,
  totalsByDate,
  onDateChange,
  onMealPress,
}) => {
  const { width } = useWindowDimensions();
  const dates = useMemo(() => {
    const result: string[] = [];
    const half = Math.floor(windowDays / 2);
    for (let i = -half; i <= half; i++) {
      result.push(addDays(centerDate, i));
    }
    return result;
  }, [centerDate, windowDays]);

  const initialIndex = Math.floor(windowDays / 2);
  const listRef = useRef<FlatList<string>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0]?.item as string | undefined;
      if (first) onDateChange(first);
    },
  ).current;

  return (
    <FlatList
      ref={listRef}
      data={dates}
      horizontal
      pagingEnabled
      snapToInterval={width}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      keyExtractor={(item) => item}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      renderItem={({ item }) => (
        <DayMealsView
          dateKey={item}
          meals={mealsByDate[item] ?? []}
          dayTotalCarbs={totalsByDate[item] ?? 0}
          onMealPress={onMealPress}
        />
      )}
    />
  );
};
