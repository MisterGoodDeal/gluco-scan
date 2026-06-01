import { type FC } from 'react';
import { View } from 'react-native';

import { TutorialInlineBanner } from '@/components/organisms/TutorialInlineBanner';

export const TutorialMealCreateBanner: FC = () => (
  <View
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 20,
      elevation: 20,
    }}
    pointerEvents="box-none">
    <TutorialInlineBanner stepId="meal-create" includeTabBarInset={false} />
  </View>
);
