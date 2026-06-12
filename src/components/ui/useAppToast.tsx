import { useToast } from 'heroui-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppToastMessage, type AppToastTone } from '@/components/ui/AppToastMessage';
import { formatDecimal } from '@/utils/format';
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

type MealSavedToastOptions = {
  isEditing: boolean;
  mealType: string;
  carbs: number;
};

/**
 * Toasts HeroUI avec icône, titre, description et placement bas.
 */
export const useAppToast = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMemo(() => {
    const show = (title: string, tone: AppToastTone, options?: ToastOptions) => {
      toast.show({
        component: (props) => (
          <AppToastMessage
            {...props}
            title={title}
            description={options?.description}
            tone={tone}
          />
        ),
      });
    };

    return {
      success: (title: string, options?: ToastOptions) => {
        if (options?.haptic !== false) triggerNotificationSuccess();
        show(title, 'success', options);
      },
      error: (title: string, options?: ToastOptions) => {
        if (options?.haptic !== false) triggerNotificationError();
        show(title, 'error', options);
      },
      warning: (title: string, options?: ToastOptions) => {
        if (options?.haptic !== false) triggerNotificationWarning();
        show(title, 'warning', options);
      },
      info: (title: string, options?: ToastOptions) => {
        show(title, 'info', options);
      },
      mealSaved: ({ isEditing, mealType, carbs }: MealSavedToastOptions) => {
        triggerNotificationSuccess();
        show(
          t(isEditing ? 'meals.updatedTitle' : 'meals.addedTitle'),
          'success',
          {
            description: t(
              isEditing ? 'meals.updatedDescription' : 'meals.addedDescription',
              { mealType, carbs: formatDecimal(carbs) },
            ),
          },
        );
      },
      hide: () => toast.hide('all'),
    };
  }, [t, toast]);
};
