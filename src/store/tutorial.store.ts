import { create } from 'zustand';

import { TUTORIAL_FEATURED_PRODUCT_ID } from '@/constants/tutorial';
import {
  endTutorialSession,
  startTutorialSession,
} from '@/services/tutorial.service';
import type { TutorialStepId } from '@/types/tutorial';
import { TutorialStatus } from '@/types/tutorial';
import { resetTutorialNavigation } from '@/utils/tutorialNavigation';
import { tutorialMmkv } from '@/utils/tutorialMmkv';

const STEP_ORDER: TutorialStepId[] = [
  'products',
  'products-add',
  'product-form',
  'menus',
  'meals-day-nav',
  'meals-today',
  'meals-calendar',
  'meals-add',
  'meal-create',
  'meals-saved',
  'meals-detail',
  'statistics',
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
  tutorialSavedMealId: string | null;
  overlayMeasureTick: number;
  bumpOverlayMeasure: () => void;
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
  setTutorialSavedMealId: (mealId: string | null) => void;
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
  tutorialSavedMealId: null,
  overlayMeasureTick: 0,

  bumpOverlayMeasure: () => {
    set((state) => ({ overlayMeasureTick: state.overlayMeasureTick + 1 }));
  },

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
      openProductId:
        isRunning && STEP_ORDER[step] === 'product-form'
          ? TUTORIAL_FEATURED_PRODUCT_ID
          : null,
    });
  },

  showWelcome: () => set({ welcomeVisible: true }),

  dismissWelcome: () => {
    tutorialMmkv.setHasSeenTutorial(true);
    set({ welcomeVisible: false, hasSeenTutorial: true });
  },

  startTutorial: async () => {
    resetTutorialNavigation();
    set({
      status: TutorialStatus.STARTING,
      welcomeVisible: false,
      completedSteps: [],
      mealCreateValidated: false,
      tutorialSavedMealId: null,
    });
    try {
      await startTutorialSession();
      tutorialMmkv.setCurrentStep(0);
      set({
        status: TutorialStatus.RUNNING,
        isTutorialRunning: true,
        currentStep: 0,
        openProductId: null,
        tutorialSavedMealId: null,
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
    const nextStepId = STEP_ORDER[next];
    tutorialMmkv.setCurrentStep(next);
    set({
      currentStep: next,
      openProductId: nextStepId === 'product-form' ? TUTORIAL_FEATURED_PRODUCT_ID : null,
      mealCreateValidated:
        nextStepId === 'meal-create' ? false : get().mealCreateValidated,
    });
  },

  previousStep: () => {
    const { currentStep, status } = get();
    if (status !== TutorialStatus.RUNNING) return;
    const prev = Math.max(currentStep - 1, 0);
    const prevStepId = STEP_ORDER[prev];
    tutorialMmkv.setCurrentStep(prev);
    set({
      currentStep: prev,
      openProductId: prevStepId === 'product-form' ? TUTORIAL_FEATURED_PRODUCT_ID : null,
    });
  },

  completeTutorial: async () => {
    set({ status: TutorialStatus.COMPLETED });
    try {
      resetTutorialNavigation();
      await endTutorialSession(true);
      set({
        status: TutorialStatus.IDLE,
        isTutorialRunning: false,
        currentStep: 0,
        openProductId: null,
        hasSeenTutorial: true,
        mealCreateValidated: false,
        tutorialSavedMealId: null,
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
      resetTutorialNavigation();
      await endTutorialSession(false);
      set({
        status: TutorialStatus.IDLE,
        isTutorialRunning: false,
        currentStep: 0,
        openProductId: null,
        mealCreateValidated: false,
        tutorialSavedMealId: null,
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

  setTutorialSavedMealId: (mealId) => set({ tutorialSavedMealId: mealId }),

  getCurrentStepId: () => STEP_ORDER[get().currentStep] ?? 'products',
}));
