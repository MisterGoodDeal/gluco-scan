import { type FC } from 'react';

import { TutorialInlineBanner } from '@/components/organisms/TutorialInlineBanner';

export const TutorialMealCreateBanner: FC = () => (
  <TutorialInlineBanner stepId="meal-create" includeTabBarInset={false} stacked />
);
