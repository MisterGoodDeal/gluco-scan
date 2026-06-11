import { Dialog, FieldError } from 'heroui-native';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { InputNumber } from '@/components/atoms/InputNumber';
import { SearchInput } from '@/components/atoms/SearchInput';
import { AppButton } from '@/components/ui/AppButton';
import type { GlobalUnit } from '@/types/globalUnit';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { parseManualCarbs } from '@/utils/ean';
import { triggerNotificationError } from '@/utils/haptics';

type GlobalUnitFormModalProps = {
  visible: boolean;
  unit: GlobalUnit | null;
  onClose: () => void;
  onSave: (data: Omit<GlobalUnit, 'id'> | GlobalUnit) => Promise<void>;
};

export const GlobalUnitFormModal: FC<GlobalUnitFormModalProps> = ({
  visible,
  unit,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const { massUnit, formatMassForInput, displayToGrams } = useMassDisplay();
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [gramsText, setGramsText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName(unit?.name ?? '');
    setAbbreviation(unit?.abbreviation ?? '');
    setGramsText(unit ? formatMassForInput(unit.equivalentInGrams) : '');
    setSubmitted(false);
  }, [visible, unit, formatMassForInput]);

  const nameInvalid = submitted && name.trim().length === 0;
  const abbreviationInvalid = submitted && abbreviation.trim().length === 0;
  const massInvalid = submitted && parseManualCarbs(gramsText) === null;

  const handleSave = async () => {
    setSubmitted(true);
    const displayValue = parseManualCarbs(gramsText);
    if (!name.trim() || !abbreviation.trim() || displayValue === null) {
      triggerNotificationError();
      return;
    }
    const grams = displayToGrams(displayValue);
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        abbreviation: abbreviation.trim(),
        equivalentInGrams: grams,
      };
      if (unit) {
        await onSave({ ...unit, ...payload });
      } else {
        await onSave(payload);
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          pointerEvents="box-none"
          className="flex-1 justify-center">
          <Dialog.Content>
            <Dialog.Close />
            <Dialog.Title>{unit ? t('settings.editUnit') : t('settings.addUnit')}</Dialog.Title>

            <View className="gap-1 mt-4">
              <Text className="text-muted text-sm">{t('products.unitName')}</Text>
              <SearchInput
                value={name}
                onChangeText={setName}
                placeholder={t('products.unitName')}
              />
              <FieldError isInvalid={nameInvalid}>{t('common.fieldRequired')}</FieldError>
            </View>

            <View className="gap-1 mt-4">
              <Text className="text-muted text-sm">{t('products.unitAbbreviation')}</Text>
              <SearchInput
                value={abbreviation}
                onChangeText={setAbbreviation}
                placeholder={t('products.unitAbbreviation')}
              />
              <FieldError isInvalid={abbreviationInvalid}>{t('common.fieldRequired')}</FieldError>
            </View>

            <View className="gap-1 mt-4">
              <Text className="text-muted text-sm">{t('products.unitMass', { unit: massUnit })}</Text>
              <InputNumber
                value={gramsText}
                onChangeText={setGramsText}
                placeholder={t('products.unitMass', { unit: massUnit })}
              />
              <FieldError isInvalid={massInvalid}>{t('common.invalidValue')}</FieldError>
            </View>

            <View className="flex-row items-center justify-end gap-2 mt-4">
              <AppButton variant="ghost" onPress={onClose} isDisabled={isSaving}>
                {t('common.cancel')}
              </AppButton>
              <AppButton
                variant="primary"
                onPress={() => void handleSave()}
                isDisabled={isSaving}>
                {t('common.save')}
              </AppButton>
            </View>
          </Dialog.Content>
        </KeyboardAvoidingView>
      </Dialog.Portal>
    </Dialog>
  );
};
