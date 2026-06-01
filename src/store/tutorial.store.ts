import { create } from 'zustand';

import { TUTORIAL_FEATURED_PRODUCT_ID } from '@/constants/tutorial';
import {
  endTutorialSession,
  startTutorialSession,
} from '@/services/tutorial.service';
import type { TutorialStepId } from '@/types/tutorial';
import { TutorialStatus } from '@/types/tutorial';
import { tutorialMmkv } from '@/utils/tutorialMmkv';

const STEP_ORDER: TutorialStepId[] = [
  'products',
  'product-form',
  'meals',
  'meal-create',
  'settings',
  'finish',
];

export interface TutorialState {
  status: TutorialStatus;
  currentStep: number;
  completedSteps: string[];
  isTutorialRunning: boolean;
  hasSeenTutorial: boolean;
  welcomeVisible: boolean;
  openProductId: string | null;
  mealCreateValidated: boolean;
  hydrateFlags: () => void;
  showWelcome: () => void;
  dismissWelcome: () => void;
  startTutorial: () => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  completeTutorial: () => Promise<void>;
  cancelTutorial: () => Promise<void>;
  markStepCompleted: (stepId: TutorialStepId) => void;
  setMealCreateValidated: (value: boolean) => void;
  getCurrentStepId: () => TutorialStepId;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  status: TutorialStatus.IDLE,
  currentStep: 0,
  completedSteps: [],
  isTutorialRunning: false,
  hasSeenTutorial: false,
  welcomeVisible: false,
  openProductId: null,
  mealCreateValidated: false,

  hydrateFlags: () => {
    const hasSeen = tutorialMmkv.getHasSeenTutorial();
    const isRunning = tutorialMmkv.getIsTutorialRunning();
    const step = tutorialMmkv.getCurrentStep();
    set({
      hasSeenTutorial: hasSeen,
      isTutorialRunning: isRunning,
      currentStep: step,
      status: isRunning ? TutorialStatus.RUNNING : TutorialStatus.IDLE,
      welcomeVisible: !hasSeen && !isRunning,
      openProductId: isRunning && step === 1 ? TUTORIAL_FEATURED_PRODUCT_ID : null,
    });
  },

  showWelcome: () => set({ welcomeVisible: true }),

  dismissWelcome: () => {
    tutorialMmkv.setHasSeenTutorial(true);
    set({ welcomeVisible: false, hasSeenTutorial: true });
  },

  startTutorial: async () => {
    set({
      status: TutorialStatus.STARTING,
      welcomeVisible: false,
      completedSteps: [],
      mealCreateValidated: false,
    });
    try {
      await startTutorialSession();
      tutorialMmkv.setCurrentStep(0);
      set({
        status: TutorialStatus.RUNNING,
        isTutorialRunning: true,
        currentStep: 0,
        openProductId: null,
      });
    } catch (error) {
      set({ status: TutorialStatus.IDLE, isTutorialRunning: false });
      throw error;
    }
  },

  nextStep: () => {
    const { currentStep, status } = get();
    if (status !== TutorialStatus.RUNNING) return;
    const stepId = STEP_ORDER[currentStep];
    if (stepId) {
      get().markStepCompleted(stepId);
    }
    const next = Math.min(currentStep + 1, STEP_ORDER.length - 1);
    tutorialMmkv.setCurrentStep(next);
    set({
      currentStep: next,
      openProductId: next === 1 ? TUTORIAL_FEATURED_PRODUCT_ID : null,
      mealCreateValidated: next === 3 ? false : get().mealCreateValidated,
    });
  },

  previousStep: () => {
    const { currentStep, status } = get();
    if (status !== TutorialStatus.RUNNING) return;
    const prev = Math.max(currentStep - 1, 0);
    tutorialMmkv.setCurrentStep(prev);
    set({
      currentStep: prev,
      openProductId: prev === 1 ? TUTORIAL_FEATURED_PRODUCT_ID : null,
    });
  },

  completeTutorial: async () => {
    set({ status: TutorialStatus.COMPLETED });
    try {
      await endTutorialSession(true);
      set({
        status: TutorialStatus.IDLE,
        isTutorialRunning: false,
        currentStep: 0,
        openProductId: null,
        hasSeenTutorial: true,
        mealCreateValidated: false,
        completedSteps: [...STEP_ORDER],
      });
    } catch (error) {
      set({ status: TutorialStatus.RUNNING });
      throw error;
    }
  },

  cancelTutorial: async () => {
    set({ status: TutorialStatus.CANCELLED });
    try {
      await endTutorialSession(false);
      set({
        status: TutorialStatus.IDLE,
        isTutorialRunning: false,
        currentStep: 0,
        openProductId: null,
        mealCreateValidated: false,
      });
    } catch (error) {
      set({ status: TutorialStatus.RUNNING });
      throw error;
    }
  },

  markStepCompleted: (stepId) => {
    set((state) => ({
      completedSteps: state.completedSteps.includes(stepId)
        ? state.completedSteps
        : [...state.completedSteps, stepId],
    }));
  },

  setMealCreateValidated: (value) => set({ mealCreateValidated: value }),

  getCurrentStepId: () => STEP_ORDER[get().currentStep] ?? 'products',
}));
