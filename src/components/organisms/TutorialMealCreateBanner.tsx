import { type FC } from 'react';

import { TutorialInlineBanner } from '@/components/organisms/TutorialInlineBanner';

type TutorialMealCreateBannerProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  cardBottom?: number;
  fabBottom?: number;
};

export const TutorialMealCreateBanner: FC<TutorialMealCreateBannerProps> = ({
  collapsed,
  onCollapsedChange,
  cardBottom,
  fabBottom,
}) => (
  <TutorialInlineBanner
    stepId="meal-create"
    includeTabBarInset={false}
    anchored
    collapsed={collapsed}
    onCollapsedChange={onCollapsedChange}
    cardBottom={cardBottom}
    fabBottom={fabBottom}
  />
);
