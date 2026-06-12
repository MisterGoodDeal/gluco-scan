import { Toast, useThemeColor } from 'heroui-native';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react-native';
import { type FC } from 'react';
import { View } from 'react-native';

import type { ToastComponentProps } from 'heroui-native';

export type AppToastTone = 'success' | 'error' | 'warning' | 'info';

type AppToastMessageProps = ToastComponentProps & {
  title: string;
  description?: string;
  tone: AppToastTone;
};

const ICONS = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
} as const;

const ICON_BG_CLASS: Record<AppToastTone, string> = {
  success: 'bg-success/12',
  error: 'bg-danger/12',
  warning: 'bg-warning/12',
  info: 'bg-default',
};

export const AppToastMessage: FC<AppToastMessageProps> = ({
  title,
  description,
  tone,
  hide,
  show,
  ...toastProps
}) => {
  const [successColor, dangerColor, warningColor, mutedColor] = useThemeColor([
    'success',
    'danger',
    'warning',
    'muted',
  ]);
  const iconColor = {
    success: successColor,
    error: dangerColor,
    warning: warningColor,
    info: mutedColor,
  }[tone];
  const Icon = ICONS[tone];

  return (
    <Toast
      {...toastProps}
      hide={hide}
      show={show}
      variant="default"
      placement="bottom"
      className="mx-0 flex-row items-start gap-3 rounded-2xl border border-separator bg-overlay px-4 py-3 shadow-lg">
      <View
        className={`mt-0.5 h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_BG_CLASS[tone]}`}>
        <Icon size={20} color={iconColor} strokeWidth={2.25} />
      </View>
      <View className="flex-1 gap-0.5">
        <Toast.Title className="text-foreground text-base font-semibold">{title}</Toast.Title>
        {description ? (
          <Toast.Description className="text-foreground text-sm leading-5">
            {description}
          </Toast.Description>
        ) : null}
      </View>
    </Toast>
  );
};
