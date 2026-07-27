import { Dialog } from 'heroui-native';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { InputNumber } from '@/components/atoms/InputNumber';
import { AppButton } from '@/components/ui/AppButton';
import { parseManualCarbs } from '@/utils/ean';
import { formatDecimal } from '@/utils/format';
import { triggerNotificationSuccess } from '@/utils/haptics';

type ManualCarbsModalProps = {
  visible: boolean;
  initialCarbs?: number | null;
  onClose: () => void;
  onConfirm: (carbs: number) => void;
};

export const ManualCarbsModal: FC<ManualCarbsModalProps> = ({
  visible,
  initialCarbs = null,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [carbsText, setCarbsText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCarbsText('');
      setSubmitted(false);
      return;
    }
    setCarbsText(initialCarbs != null ? String(initialCarbs) : '');
    setSubmitted(false);
  }, [visible, initialCarbs]);

  const parsedCarbs = parseManualCarbs(carbsText);
  const isInvalid = submitted && parsedCarbs === null;

  const handleConfirm = () => {
    setSubmitted(true);
    if (parsedCarbs === null) return;
    onConfirm(parsedCarbs);
    triggerNotificationSuccess();
    onClose();
  };

  return (
    <Dialog isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={{ flex: 1, justifyContent: 'center' }}>
          <Dialog.Content>
            <Dialog.Close />
            <View className="gap-1 mb-3 pr-8">
              <Dialog.Title>{t('meals.manualCarbsTitle')}</Dialog.Title>
              <Dialog.Description>{t('meals.manualCarbsDescription')}</Dialog.Description>
            </View>

            <InputNumber
              value={carbsText}
              onChangeText={setCarbsText}
              placeholder="0"
            />
            {isInvalid ? (
              <Text className="text-danger text-sm mt-2">{t('meals.manualCarbsInvalid')}</Text>
            ) : null}

            {parsedCarbs != null ? (
              <Text className="text-accent text-base font-semibold text-center mt-3">
                {formatDecimal(parsedCarbs)} g
              </Text>
            ) : null}

            <AppButton
              variant="primary"
              className="mt-4"
              haptic={false}
              onPress={handleConfirm}>
              {initialCarbs != null ? t('common.save') : t('common.add')}
            </AppButton>
          </Dialog.Content>
        </KeyboardAvoidingView>
      </Dialog.Portal>
    </Dialog>
  );
};
