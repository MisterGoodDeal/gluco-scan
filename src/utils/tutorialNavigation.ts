import { router } from 'expo-router';

import { TUTORIAL_STEPS } from '@/config/tutorialSteps';

export const dismissMealCreateIfOpen = (): void => {
  if (router.canDismiss()) {
    router.dismiss();
    return;
  }
  if (router.canGoBack()) {
    router.back();
  }
};

export const navigateToTutorialStep = (stepIndex: number): void => {
  const config = TUTORIAL_STEPS[stepIndex];
  if (!config) return;

  if (config.route) {
    router.push(config.route as '/meal/create');
    return;
  }

  dismissMealCreateIfOpen();

  if (config.tab === 'products') {
    router.push('/products');
  } else if (config.tab === 'meals') {
    router.push('/meals');
  } else if (config.tab === 'settings') {
    router.push('/settings');
  }
};
