export enum TutorialStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  RUNNING = 'running',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type TutorialStepId =
  | 'products'
  | 'product-form'
  | 'meals'
  | 'meal-create'
  | 'settings'
  | 'finish';
