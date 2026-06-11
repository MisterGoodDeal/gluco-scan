import { BlurTargetView } from 'expo-blur';
import { type FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { StatisticsHomeScreen } from '@/features/statistics/screens/StatisticsHomeScreen';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';

export const StatisticsTabLayout: FC = () => {
  const { t } = useTranslation();
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(0);
  const bottomInset = useTabBarBottomInset();

  return (
    <View className="flex-1 bg-background">
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <StatisticsHomeScreen headerInset={headerHeight} bottomInset={bottomInset} />
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-semibold">{t('statistics.title')}</Text>
          </View>
        </BlurScreenHeader>
      </BlurTargetView>
    </View>
  );
};
