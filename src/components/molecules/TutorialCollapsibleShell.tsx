import { useThemeColor } from 'heroui-native';
import { type FC, type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FaIcon } from '@/components/atoms/FaIcon';
import { AppButton } from '@/components/ui/AppButton';

const HIDE_DURATION_MS = 220;
const SHOW_DURATION_MS = 260;
const SHOW_EASING = Easing.out(Easing.quad);
const HIDE_EASING = Easing.in(Easing.quad);

type TutorialCollapsibleShellProps = {
  collapsible: boolean;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  children: ReactNode;
  cardContainerStyle?: ViewStyle | ViewStyle[];
  fabBottom?: number;
  fullScreen?: boolean;
};

export const TutorialCollapsibleShell: FC<TutorialCollapsibleShellProps> = ({
  collapsible,
  collapsed,
  onCollapsedChange,
  children,
  cardContainerStyle,
  fabBottom = 16,
  fullScreen = false,
}) => {
  const { t } = useTranslation();
  const accentForeground = useThemeColor('accent-foreground');
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(collapsed ? 1 : 0, {
      duration: collapsed ? HIDE_DURATION_MS : SHOW_DURATION_MS,
      easing: collapsed ? HIDE_EASING : SHOW_EASING,
    });
  }, [collapsed, progress]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (!collapsible) return {};
    return {
      opacity: interpolate(progress.value, [0, 0.7], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [0, 20], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [0.88, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  if (!collapsible) {
    const positionedCard = cardContainerStyle ? (
      <View pointerEvents="box-none" style={cardContainerStyle}>
        {children}
      </View>
    ) : (
      children
    );

    if (fullScreen) {
      return (
        <View pointerEvents="box-none" style={styles.fullScreen}>
          {positionedCard}
        </View>
      );
    }

    return <>{positionedCard}</>;
  }

  const rootStyle = fullScreen ? styles.fullScreen : undefined;

  return (
    <Animated.View pointerEvents="box-none" style={rootStyle}>
      <Animated.View
        pointerEvents={collapsed ? 'none' : 'box-none'}
        style={[cardContainerStyle, cardAnimatedStyle]}>
        {children}
      </Animated.View>
      <Animated.View
        pointerEvents={collapsed ? 'auto' : 'none'}
        style={[styles.fab, { bottom: fabBottom }, fabAnimatedStyle]}>
        <AppButton
          isIconOnly
          variant="primary"
          size="lg"
          onPress={() => onCollapsedChange(false)}
          accessibilityLabel={t('tutorial.collapse.fabA11y')}
          style={styles.fabButton}>
          <FaIcon name="graduation-cap" size={20} color={accentForeground} />
        </AppButton>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
  },
  fab: {
    position: 'absolute',
    left: 16,
    zIndex: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
});
