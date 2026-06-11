import { Dialog } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';

export type ConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

/**
 * Dialog de confirmation HeroUI (remplace Alert.alert).
 */
export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <View className="mb-5 gap-1.5">
            <Dialog.Title>{title}</Dialog.Title>
            {description ? <Dialog.Description>{description}</Dialog.Description> : null}
          </View>
          <View className="flex-row justify-end gap-3">
            <AppButton variant="ghost" size="sm" onPress={() => onOpenChange(false)}>
              {cancelLabel ?? t('common.cancel')}
            </AppButton>
            <AppButton
              variant={destructive ? 'danger' : 'primary'}
              size="sm"
              onPress={handleConfirm}>
              {confirmLabel ?? t('common.confirm')}
            </AppButton>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
