export enum TutorialStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  RUNNING = 'running',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type TutorialStepId =
  | 'products'
  | 'products-add'
  | 'product-form'
  | 'meals-day-nav'
  | 'meals-today'
  | 'meals-calendar'
  | 'meals-add'
  | 'meal-create'
  | 'meals-saved'
  | 'meals-detail'
  | 'statistics'
  | 'settings'
  | 'finish';
