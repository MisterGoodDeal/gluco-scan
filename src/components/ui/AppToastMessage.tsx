import { Toast, useThemeColor } from 'heroui-native';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react-native';
import { type FC } from 'react';
import { View } from 'react-native';

import type { ToastComponentProps } from 'heroui-native';

import { GlassPanel } from '@/components/atoms/GlassPanel';

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
      className="mx-0 bg-transparent p-0 shadow-lg">
      <GlassPanel padding={0} borderRadius={16}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          <View
            className={`h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_BG_CLASS[tone]}`}>
            <Icon size={20} color={iconColor} strokeWidth={2.25} />
          </View>
          <View className="flex-1 justify-center gap-0.5">
            <Toast.Title className="text-foreground text-base font-semibold leading-5">
              {title}
            </Toast.Title>
            {description ? (
              <Toast.Description className="text-foreground text-sm leading-5">
                {description}
              </Toast.Description>
            ) : null}
          </View>
        </View>
      </GlassPanel>
    </Toast>
  );
};
