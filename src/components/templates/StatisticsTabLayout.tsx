import { BlurTargetView } from 'expo-blur';
import { type FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { Text } from '@/components/atoms/Text';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { StatisticsHomeScreen } from '@/features/statistics/screens/StatisticsHomeScreen';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { Screen } from '@/styles/global';

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StatisticsTabLayout: FC = () => {
  const { t } = useTranslation();
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(0);
  const bottomInset = useTabBarBottomInset();

  return (
    <Screen>
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <StatisticsHomeScreen headerInset={headerHeight} bottomInset={bottomInset} />
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <TitleRow>
            <Text $variant="title">{t('statistics.title')}</Text>
          </TitleRow>
        </BlurScreenHeader>
      </BlurTargetView>
    </Screen>
  );
};
