import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { View } from 'react-native';

import type { ChartScrollTrackMetrics } from '@/features/statistics/components/charts/useChartScrollTrack';

type ChartScrollTrackProps = {
  metrics: ChartScrollTrackMetrics;
  orientation: 'horizontal' | 'vertical';
  trackSize?: number;
};

export const ChartScrollTrack: FC<ChartScrollTrackProps> = ({
  metrics,
  orientation,
  trackSize,
}) => {
  const accentColor = useThemeColor('accent');
  const thumbSize = metrics.visibleRatio * 100;
  const thumbOffset = metrics.offsetRatio * (100 - thumbSize);

  if (orientation === 'vertical') {
    return (
      <View
        className="relative w-1 shrink-0 overflow-hidden rounded-full bg-default"
        style={{ height: trackSize }}
      >
        <View
          className="absolute left-0 right-0 rounded-full"
          style={{
            top: `${thumbOffset}%`,
            height: `${thumbSize}%`,
            backgroundColor: accentColor,
          }}
        />
      </View>
    );
  }

  return (
    <View className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-default">
      <View
        className="absolute top-0 bottom-0 rounded-full"
        style={{
          left: `${thumbOffset}%`,
          width: `${thumbSize}%`,
          backgroundColor: accentColor,
        }}
      />
    </View>
  );
};
