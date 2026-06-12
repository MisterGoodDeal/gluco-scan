import { MEALS_DATE_PICKER_SNAP_RATIO } from '@/constants/mealsDatePicker';
import { toSpotlightHole, type TutorialSpotlightHole } from '@/utils/tutorialSpotlightPath';

export const buildMealsDateSheetSpotlightHole = (
  screenWidth: number,
  screenHeight: number,
): TutorialSpotlightHole => {
  const height = screenHeight * MEALS_DATE_PICKER_SNAP_RATIO;

  return toSpotlightHole(
    { x: 0, y: screenHeight - height, width: screenWidth, height },
    24,
    2,
    true,
    'default',
  );
};
