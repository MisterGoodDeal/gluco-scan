import type { TutorialStepId } from '@/types/tutorial';

export type TutorialStepConfig = {
  id: TutorialStepId;
  tab?: 'products' | 'compositions' | 'meals' | 'statistics' | 'settings';
  route?: string;
  anchorIds: string[];
  titleKey:
    | 'tutorial.steps.products.title'
    | 'tutorial.steps.productsAdd.title'
    | 'tutorial.steps.productForm.title'
    | 'tutorial.steps.menus.title'
    | 'tutorial.steps.mealsDayNav.title'
    | 'tutorial.steps.mealsToday.title'
    | 'tutorial.steps.mealsCalendar.title'
    | 'tutorial.steps.mealsAdd.title'
    | 'tutorial.steps.mealCreate.title'
    | 'tutorial.steps.mealsSaved.title'
    | 'tutorial.steps.mealsDetail.title'
    | 'tutorial.steps.statistics.title'
    | 'tutorial.steps.settings.title'
    | 'tutorial.steps.finish.title';
  messageKey:
    | 'tutorial.steps.products.message'
    | 'tutorial.steps.productsAdd.message'
    | 'tutorial.steps.productForm.message'
    | 'tutorial.steps.menus.message'
    | 'tutorial.steps.mealsDayNav.message'
    | 'tutorial.steps.mealsToday.message'
    | 'tutorial.steps.mealsCalendar.message'
    | 'tutorial.steps.mealsAdd.message'
    | 'tutorial.steps.mealCreate.message'
    | 'tutorial.steps.mealsSaved.message'
    | 'tutorial.steps.mealsDetail.message'
    | 'tutorial.steps.statistics.message'
    | 'tutorial.steps.settings.message'
    | 'tutorial.steps.finish.message';
  requiresAction?: boolean;
  cardPlacement?: 'top' | 'bottom';
  /** When false, only the step card is shown (no dim / spotlight cutout). */
  showSpotlight?: boolean;
  /** Bouton pour réduire la carte en bas de l'écran. */
  cardCollapsible?: boolean;
  /** Rounded spotlight holes (one per target, measured independently). */
  spotlightTargets?: Array<{
    anchorId: string;
    cornerRadius: number;
    padding?: number;
    showRing?: boolean;
    ringVariant?: 'default' | 'accent';
  }>;
};

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    id: 'products',
    tab: 'products',
    anchorIds: [],
    titleKey: 'tutorial.steps.products.title',
    messageKey: 'tutorial.steps.products.message',
    cardPlacement: 'bottom',
    spotlightTargets: [
      { anchorId: 'tutorial-products-list', cornerRadius: 20, padding: 6 },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'products-add',
    tab: 'products',
    anchorIds: [],
    titleKey: 'tutorial.steps.productsAdd.title',
    messageKey: 'tutorial.steps.productsAdd.message',
    cardPlacement: 'bottom',
    spotlightTargets: [
      { anchorId: 'tutorial-products-add', cornerRadius: 12, padding: 5, showRing: true },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'product-form',
    tab: 'products',
    anchorIds: [],
    titleKey: 'tutorial.steps.productForm.title',
    messageKey: 'tutorial.steps.productForm.message',
    cardPlacement: 'bottom',
    cardCollapsible: true,
  },
  {
    id: 'menus',
    tab: 'compositions',
    anchorIds: [],
    titleKey: 'tutorial.steps.menus.title',
    messageKey: 'tutorial.steps.menus.message',
    cardPlacement: 'bottom',
    spotlightTargets: [
      { anchorId: 'tutorial-menus-list', cornerRadius: 20, padding: 6 },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'meals-day-nav',
    tab: 'meals',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealsDayNav.title',
    messageKey: 'tutorial.steps.mealsDayNav.message',
    cardPlacement: 'top',
    spotlightTargets: [
      { anchorId: 'tutorial-meals-day-nav', cornerRadius: 20, padding: 6 },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'meals-today',
    tab: 'meals',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealsToday.title',
    messageKey: 'tutorial.steps.mealsToday.message',
    cardPlacement: 'bottom',
    spotlightTargets: [
      { anchorId: 'tutorial-meals-go-today', cornerRadius: 12, padding: 5 },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'meals-calendar',
    tab: 'meals',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealsCalendar.title',
    messageKey: 'tutorial.steps.mealsCalendar.message',
    cardPlacement: 'top',
    spotlightTargets: [
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'meals-add',
    tab: 'meals',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealsAdd.title',
    messageKey: 'tutorial.steps.mealsAdd.message',
    cardPlacement: 'bottom',
    spotlightTargets: [
      { anchorId: 'tutorial-meals-add', cornerRadius: 12, padding: 5, showRing: true },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'meal-create',
    route: '/meal/create',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealCreate.title',
    messageKey: 'tutorial.steps.mealCreate.message',
    requiresAction: true,
    cardPlacement: 'bottom',
    cardCollapsible: true,
  },
  {
    id: 'meals-saved',
    tab: 'meals',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealsSaved.title',
    messageKey: 'tutorial.steps.mealsSaved.message',
    cardPlacement: 'bottom',
    spotlightTargets: [
      { anchorId: 'tutorial-meals-saved-meal', cornerRadius: 16, padding: 6, showRing: true },
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'meals-detail',
    tab: 'meals',
    anchorIds: [],
    titleKey: 'tutorial.steps.mealsDetail.title',
    messageKey: 'tutorial.steps.mealsDetail.message',
    cardPlacement: 'top',
    spotlightTargets: [
      { anchorId: 'tutorial-step-card', cornerRadius: 24, padding: 2, ringVariant: 'accent' },
    ],
  },
  {
    id: 'statistics',
    tab: 'statistics',
    anchorIds: [],
    titleKey: 'tutorial.steps.statistics.title',
    messageKey: 'tutorial.steps.statistics.message',
    cardPlacement: 'bottom',
    cardCollapsible: true,
    showSpotlight: false,
  },
  {
    id: 'settings',
    tab: 'settings',
    anchorIds: [],
    titleKey: 'tutorial.steps.settings.title',
    messageKey: 'tutorial.steps.settings.message',
    cardPlacement: 'bottom',
    cardCollapsible: true,
    showSpotlight: false,
  },
  {
    id: 'finish',
    anchorIds: [],
    titleKey: 'tutorial.steps.finish.title',
    messageKey: 'tutorial.steps.finish.message',
  },
];
