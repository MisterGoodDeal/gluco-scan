import { router } from 'expo-router';

import { TUTORIAL_STEPS } from '@/config/tutorialSteps';

let lastNavigatedStepIndex = -1;

export const resetTutorialNavigation = (): void => {
  lastNavigatedStepIndex = -1;
};

export const dismissMealCreateIfOpen = (): void => {
  if (router.canDismiss()) {
    router.dismiss();
  }
};

export const navigateToTutorialStep = (stepIndex: number): void => {
  const config = TUTORIAL_STEPS[stepIndex];
  if (!config) return;

  if (lastNavigatedStepIndex === stepIndex) return;
  lastNavigatedStepIndex = stepIndex;

  if (config.route) {
    router.replace(config.route as '/meal/create');
    return;
  }

  dismissMealCreateIfOpen();

  if (config.tab === 'products') {
    router.replace('/products');
  } else if (config.tab === 'meals') {
    router.replace('/meals');
  } else if (config.tab === 'statistics') {
    router.replace('/statistics');
  } else if (config.tab === 'settings') {
    router.replace('/settings');
  }
};
