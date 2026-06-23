import { useCallback, useMemo, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type ChartScrollTrackMetrics = {
  visibleRatio: number;
  offsetRatio: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const getInitialChartScrollTrackMetrics = (
  itemCount: number,
  maxVisibleItems: number,
): ChartScrollTrackMetrics => ({
  visibleRatio: clamp(maxVisibleItems / itemCount, 0.15, 1),
  offsetRatio: 0,
});

export const useChartScrollTrack = (
  direction: 'horizontal' | 'vertical',
  enabled: boolean,
  itemCount: number,
  maxVisibleItems: number,
) => {
  const initialMetrics = useMemo(
    () => getInitialChartScrollTrackMetrics(itemCount, maxVisibleItems),
    [itemCount, maxVisibleItems],
  );

  const [metrics, setMetrics] = useState<ChartScrollTrackMetrics>(initialMetrics);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!enabled) return;

      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const isHorizontal = direction === 'horizontal';
      const viewportSize = isHorizontal
        ? layoutMeasurement.width
        : layoutMeasurement.height;
      const contentLength = isHorizontal ? contentSize.width : contentSize.height;
      const offset = isHorizontal ? contentOffset.x : contentOffset.y;
      const scrollable = Math.max(contentLength - viewportSize, 0);

      setMetrics({
        visibleRatio: clamp(viewportSize / contentLength, 0.15, 1),
        offsetRatio: scrollable > 0 ? clamp(offset / scrollable, 0, 1) : 0,
      });
    },
    [direction, enabled],
  );

  if (!enabled) return null;

  return { metrics, onScroll };
};
