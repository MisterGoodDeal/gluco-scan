import type { TutorialStepId } from '@/types/tutorial';

export type TutorialStepConfig = {
  id: TutorialStepId;
  tab?: 'products' | 'meals' | 'settings';
  route?: string;
  anchorIds: string[];
  titleKey:
    | 'tutorial.steps.products.title'
    | 'tutorial.steps.productForm.title'
    | 'tutorial.steps.meals.title'
    | 'tutorial.steps.mealCreate.title'
    | 'tutorial.steps.settings.title'
    | 'tutorial.steps.finish.title';
  messageKey:
    | 'tutorial.steps.products.message'
    | 'tutorial.steps.productForm.message'
    | 'tutorial.steps.meals.message'
    | 'tutorial.steps.mealCreate.message'
    | 'tutorial.steps.settings.message'
    | 'tutorial.steps.finish.message';
  requiresAction?: boolean;
  cardPlacement?: 'top' | 'bottom';
};

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    id: 'products',
    tab: 'products',
    anchorIds: ['tutorial-products-list', 'tutorial-products-search', 'tutorial-products-add'],
    titleKey: 'tutorial.steps.products.title',
    messageKey: 'tutorial.steps.products.message',
  },
  {
    id: 'product-form',
    tab: 'products',
    anchorIds: [],
    titleKey: 'tutorial.steps.productForm.title',
    messageKey: 'tutorial.steps.productForm.message',
    cardPlacement: 'top',
  },
  {
    id: 'meals',
    tab: 'meals',
    anchorIds: ['tutorial-meals-pager', 'tutorial-meals-summary'],
    titleKey: 'tutorial.steps.meals.title',
    messageKey: 'tutorial.steps.meals.message',
  },
  {
    id: 'meal-create',
    route: '/meal/create',
    anchorIds: ['tutorial-meal-create'],
    titleKey: 'tutorial.steps.mealCreate.title',
    messageKey: 'tutorial.steps.mealCreate.message',
    requiresAction: true,
  },
  {
    id: 'settings',
    tab: 'settings',
    anchorIds: ['tutorial-settings-units', 'tutorial-settings-data'],
    titleKey: 'tutorial.steps.settings.title',
    messageKey: 'tutorial.steps.settings.message',
    cardPlacement: 'top',
  },
  {
    id: 'finish',
    anchorIds: [],
    titleKey: 'tutorial.steps.finish.title',
    messageKey: 'tutorial.steps.finish.message',
  },
];
