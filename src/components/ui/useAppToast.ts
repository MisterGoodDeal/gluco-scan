import { useToast } from 'heroui-native';
import { useMemo } from 'react';

import {
  triggerNotificationError,
  triggerNotificationSuccess,
  triggerNotificationWarning,
} from '@/utils/haptics';

type ToastOptions = {
  description?: string;
  /** Désactive le haptique si le feedback est déjà déclenché ailleurs. */
  haptic?: boolean;
};

/**
 * Toasts HeroUI combinés au feedback haptique de notification.
 */
export const useAppToast = () => {
  const { toast } = useToast();

  return useMemo(
    () => ({
      success: (label: string, options?: ToastOptions) => {
        if (options?.haptic !== false) triggerNotificationSuccess();
        toast.show({ variant: 'success', label, description: options?.description });
      },
      error: (label: string, options?: ToastOptions) => {
        if (options?.haptic !== false) triggerNotificationError();
        toast.show({ variant: 'danger', label, description: options?.description });
      },
      warning: (label: string, options?: ToastOptions) => {
        if (options?.haptic !== false) triggerNotificationWarning();
        toast.show({ variant: 'warning', label, description: options?.description });
      },
      info: (label: string, options?: ToastOptions) => {
        toast.show({ variant: 'default', label, description: options?.description });
      },
      hide: () => toast.hide('all'),
    }),
    [toast],
  );
};
