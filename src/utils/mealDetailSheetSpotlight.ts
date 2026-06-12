import { MEAL_DETAIL_SNAP_RATIO } from '@/constants/mealDetailSheet';
import { toSpotlightHole, type TutorialSpotlightHole } from '@/utils/tutorialSpotlightPath';

export const buildMealDetailSheetSpotlightHole = (
  screenWidth: number,
  screenHeight: number,
): TutorialSpotlightHole =>
  toSpotlightHole(
    {
      x: 0,
      y: screenHeight * (1 - MEAL_DETAIL_SNAP_RATIO),
      width: screenWidth,
      height: screenHeight * MEAL_DETAIL_SNAP_RATIO,
    },
    24,
    2,
    true,
    'default',
  );
