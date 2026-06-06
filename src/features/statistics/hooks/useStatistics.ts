import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { loadEnrichedMeals } from '@/features/statistics/services/statisticsData.service';
import {
  computeStatistics,
  type ComputedStatistics,
} from '@/features/statistics/services/statisticsCompute.service';
import { selectMealDetailStats } from '@/features/statistics/selectors/mealDetail.selectors';
import { selectProductDetailStats } from '@/features/statistics/selectors/productDetail.selectors';

export const useStatisticsPeriod = () => {
  const [period, setPeriod] = useState<StatisticsPeriod>('30d');
  return { period, setPeriod };
};

export const useStatistics = (period: StatisticsPeriod) => {
  const [meals, setMeals] = useState<EnrichedMealRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadEnrichedMeals();
      setMeals(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const stats: ComputedStatistics = useMemo(
    () => computeStatistics(meals, period),
    [meals, period],
  );

  return { meals, stats, loading, reload };
};

export const useProductStatistics = (productId: string | null) => {
  const [meals, setMeals] = useState<EnrichedMealRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!productId) {
        setMeals([]);
        return;
      }
      void loadEnrichedMeals().then(setMeals);
    }, [productId]),
  );

  return useMemo(() => {
    if (!productId) return null;
    return selectProductDetailStats(meals, productId);
  }, [meals, productId]);
};

export const useMealStatistics = (meal: EnrichedMealRecord | null, allMeals: EnrichedMealRecord[]) =>
  useMemo(() => {
    if (!meal) return null;
    return selectMealDetailStats(allMeals, meal);
  }, [meal, allMeals]);
