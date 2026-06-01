import { createMMKV } from 'react-native-mmkv';

import { TUTORIAL_KEYS, TUTORIAL_MMKV_ID } from '@/constants/tutorial';

const storage = createMMKV({ id: TUTORIAL_MMKV_ID });

export const tutorialMmkv = {
  getHasSeenTutorial: (): boolean => storage.getBoolean(TUTORIAL_KEYS.hasSeen) ?? false,
  setHasSeenTutorial: (value: boolean) => storage.set(TUTORIAL_KEYS.hasSeen, value),

  getIsTutorialRunning: (): boolean => storage.getBoolean(TUTORIAL_KEYS.isRunning) ?? false,
  setIsTutorialRunning: (value: boolean) => storage.set(TUTORIAL_KEYS.isRunning, value),

  getCurrentStep: (): number => storage.getNumber(TUTORIAL_KEYS.currentStep) ?? 0,
  setCurrentStep: (step: number) => storage.set(TUTORIAL_KEYS.currentStep, step),
};
