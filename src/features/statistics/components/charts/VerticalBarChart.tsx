import { useThemeColor } from "heroui-native";
import { type FC, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { ChartScrollTrack } from "@/features/statistics/components/charts/ChartScrollTrack";
import {
  getChartMaxValue,
  MAX_VISIBLE_BAR_CHART_BARS,
} from "@/features/statistics/components/charts/chartUtils";
import { useChartScrollTrack } from "@/features/statistics/components/charts/useChartScrollTrack";
import { formatDecimal } from "@/utils/format";

export type VerticalBarChartPoint = {
  label: string;
  value: number;
};

type VerticalBarChartProps = {
  data: VerticalBarChartPoint[];
  height?: number;
  compact?: boolean;
  hideLabels?: boolean;
  newestFirst?: boolean;
  barMaxWidth?: number;
};

const MIN_IN_BAR_VALUE_HEIGHT = 22;
const BAR_GAP = 4;

export const VerticalBarChart: FC<VerticalBarChartProps> = ({
  data,
  height = 160,
  compact = false,
  hideLabels = false,
  newestFirst = false,
  barMaxWidth = 32,
}) => {
  const accentForeground = useThemeColor("accent-foreground");
  const [containerWidth, setContainerWidth] = useState(0);

  const chartData = useMemo(
    () => (newestFirst ? [...data].reverse() : data),
    [data, newestFirst],
  );

  const maxValue = getChartMaxValue(chartData.map((point) => point.value));
  const trackHeight = height - 24;
  const compactText = compact ? true : chartData.length > 10;
  const needsScroll = chartData.length > MAX_VISIBLE_BAR_CHART_BARS;
  const scrollTrack = useChartScrollTrack(
    "horizontal",
    needsScroll,
    chartData.length,
    MAX_VISIBLE_BAR_CHART_BARS,
  );

  const barWidth = useMemo(() => {
    if (containerWidth <= 0) return undefined;
    const gaps = (MAX_VISIBLE_BAR_CHART_BARS - 1) * BAR_GAP;
    return (containerWidth - gaps) / MAX_VISIBLE_BAR_CHART_BARS;
  }, [containerWidth]);

  const contentWidth = useMemo(() => {
    if (!needsScroll || barWidth == null) return undefined;
    return chartData.length * barWidth + (chartData.length - 1) * BAR_GAP;
  }, [barWidth, chartData.length, needsScroll]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const bars = chartData.map((point, index) => {
    const fillHeight =
      maxValue > 0 ? (point.value / maxValue) * trackHeight : 0;
    const barHeight = Math.max(fillHeight, point.value > 0 ? 4 : 0);
    const showValueInBar =
      barHeight >= MIN_IN_BAR_VALUE_HEIGHT && point.value > 0;

    return (
      <View
        key={`${point.label}-${index}`}
        className="items-center"
        style={needsScroll && barWidth != null ? { width: barWidth } : { flex: 1, minWidth: 0 }}
      >
        <View
          className="w-full self-center justify-end rounded-lg bg-default overflow-hidden"
          style={{ height: trackHeight, maxWidth: barMaxWidth }}
        >
          <View
            className="w-full rounded-lg bg-accent justify-center items-center"
            style={{ height: barHeight }}
          >
            {showValueInBar ? (
              <Text
                style={{
                  color: accentForeground,
                  fontWeight: "700",
                  fontSize: 9,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {formatDecimal(point.value)}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="mt-1 w-full items-center">
          <Text
            className="text-muted"
            numberOfLines={2}
            style={{
              fontSize: compactText ? 8 : 10,
              textAlign: "center",
              width: "100%",
            }}
          >
            {!hideLabels ? point.label : null}
          </Text>
        </View>
      </View>
    );
  });

  return (
    <View className="w-full">
      <View style={{ height }} onLayout={handleLayout}>
        {needsScroll ? (
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={scrollTrack?.onScroll}
            contentContainerStyle={{ width: contentWidth, height }}
          >
            <View
              className="flex-row items-end"
              style={{ height, gap: BAR_GAP }}
            >
              {bars}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-row items-end gap-1" style={{ height }}>
            {bars}
          </View>
        )}
      </View>
      {scrollTrack ? (
        <ChartScrollTrack orientation="horizontal" metrics={scrollTrack.metrics} />
      ) : null}
    </View>
  );
};
