import { type FC, useEffect, useMemo, useRef } from 'react';
import { FlatList, useWindowDimensions, type ViewToken } from 'react-native';

import { DayMealsView } from '@/components/organisms/DayMealsView';
import type { Meal } from '@/types/meal';
import { addDays, toDateKey } from '@/utils/date';

type MealsDayPagerProps = {
  centerDate: string;
  windowDays?: number;
  mealsByDate: Record<string, Meal[]>;
  totalsByDate: Record<string, number>;
  onDateChange: (dateKey: string) => void;
  onMealPress: (meal: Meal) => void;
  onMealDelete: (mealId: string) => void;
  scrollToDateKey?: string | null;
  onScrollToDateDone?: () => void;
};

export const MealsDayPager: FC<MealsDayPagerProps> = ({
  centerDate,
  windowDays = 30,
  mealsByDate,
  totalsByDate,
  onDateChange,
  onMealPress,
  onMealDelete,
  scrollToDateKey,
  onScrollToDateDone,
}) => {
  const { width } = useWindowDimensions();
  const todayKey = toDateKey(new Date());

  const hasAnyMeals = useMemo(
    () => Object.values(mealsByDate).some((list) => list.length > 0),
    [mealsByDate],
  );

  const dates = useMemo(() => {
    if (!hasAnyMeals) {
      return [todayKey];
    }
    const result: string[] = [];
    const half = Math.floor(windowDays / 2);
    for (let i = -half; i <= half; i++) {
      result.push(addDays(centerDate, i));
    }
    return result;
  }, [centerDate, windowDays, hasAnyMeals, todayKey]);

  const initialIndex = hasAnyMeals ? Math.floor(windowDays / 2) : 0;
  const listRef = useRef<FlatList<string>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!hasAnyMeals) return;
      const first = viewableItems[0]?.item as string | undefined;
      if (first) onDateChange(first);
    },
  ).current;

  useEffect(() => {
    if (!scrollToDateKey) return;
    const index = dates.indexOf(scrollToDateKey);
    if (index < 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index, animated: hasAnyMeals });
      onScrollToDateDone?.();
    });
  }, [scrollToDateKey, dates, hasAnyMeals, onScrollToDateDone]);

  return (
    <FlatList
      ref={listRef}
      data={dates}
      horizontal
      pagingEnabled
      scrollEnabled={hasAnyMeals}
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
      onScrollToIndexFailed={({ index }) => {
        listRef.current?.scrollToOffset({
          offset: width * index,
          animated: false,
        });
      }}
      renderItem={({ item }) => (
        <DayMealsView
          dateKey={item}
          isToday={item === todayKey}
          meals={mealsByDate[item] ?? []}
          dayTotalCarbs={totalsByDate[item] ?? 0}
          onMealPress={onMealPress}
          onMealDelete={onMealDelete}
        />
      )}
    />
  );
};
