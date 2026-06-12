import { useThemeColor } from 'heroui-native';
import { type FC, useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';

import {
  buildTutorialSpotlightDimPath,
  type TutorialSpotlightHole,
} from '@/utils/tutorialSpotlightPath';

const DIM_COLOR = 'rgba(0,0,0,0.65)';
const RING_COLOR = 'rgba(255,255,255,0.92)';
const FADE_IN_MS = 280;

type TutorialSpotlightDimProps = {
  holes: TutorialSpotlightHole[];
  fadeKey?: string | number;
};

export const TutorialSpotlightDim: FC<TutorialSpotlightDimProps> = ({ holes, fadeKey }) => {
  const { width, height } = useWindowDimensions();
  const accentColor = useThemeColor('accent');
  const opacity = useSharedValue(0);
  const hasFadedIn = useRef(false);

  useEffect(() => {
    opacity.value = 0;
    hasFadedIn.current = false;
  }, [fadeKey, opacity]);

  useEffect(() => {
    if (holes.length === 0) return;

    if (!hasFadedIn.current) {
      hasFadedIn.current = true;
      opacity.value = withTiming(1, {
        duration: FADE_IN_MS,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [holes, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dimPath =
    holes.length === 0
      ? `M0,0 H${width} V${height} H0 Z`
      : buildTutorialSpotlightDimPath(width, height, holes);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={dimPath}
          fill={DIM_COLOR}
          fillRule={holes.length === 0 ? undefined : 'evenodd'}
        />
        {holes.map((hole, index) => {
          if (hole.showRing === false) return null;

          const pad = hole.padding ?? 6;
          const x = hole.x - pad;
          const y = hole.y - pad;
          const w = hole.width + pad * 2;
          const h = hole.height + pad * 2;
          const rx = Math.min(hole.radius + pad * 0.35, w / 2, h / 2);
          const isAccent = hole.ringVariant === 'accent';

          return (
            <Rect
              key={`${x}-${y}-${index}`}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={rx}
              ry={rx}
              fill="none"
              stroke={isAccent ? accentColor : RING_COLOR}
              strokeWidth={isAccent ? 2.5 : 2}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};
