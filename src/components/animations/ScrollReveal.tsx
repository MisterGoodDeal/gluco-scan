import { createContext, type FC, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useScrollRevealContext } from '@/components/animations/scrollRevealContext';

export const ScrollRevealActiveContext = createContext(true);

const VIEWPORT_TOP_INSET = 72;
const VIEWPORT_BOTTOM_INSET = 32;

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export const ScrollReveal: FC<ScrollRevealProps> = ({ children, delay = 0, className }) => {
  const { subscribe } = useScrollRevealContext();
  const { height: windowHeight } = useWindowDimensions();
  const ref = useRef<Animated.View>(null);
  const revealedRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  const markActive = useCallback(() => {
    setIsActive(true);
  }, []);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    runOnJS(markActive)();
    opacity.value = withDelay(delay, withTiming(1, { duration: 420 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 170 }));
  }, [delay, markActive, opacity, translateY]);

  const check = useCallback(() => {
    if (revealedRef.current) return;
    ref.current?.measureInWindow((_x, y, _width, height) => {
      const visibleTop = y + height > VIEWPORT_TOP_INSET;
      const visibleBottom = y < windowHeight - VIEWPORT_BOTTOM_INSET;
      if (visibleTop && visibleBottom) {
        reveal();
      }
    });
  }, [reveal, windowHeight]);

  useEffect(() => {
    const unsubscribe = subscribe(check);
    const timer = setTimeout(check, 64);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [check, subscribe]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScrollRevealActiveContext.Provider value={isActive}>
      <Animated.View ref={ref} style={animatedStyle} className={className} collapsable={false}>
        {children}
      </Animated.View>
    </ScrollRevealActiveContext.Provider>
  );
};
