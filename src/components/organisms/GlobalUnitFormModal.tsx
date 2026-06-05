import { BlurView } from 'expo-blur';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { InputNumber } from '@/components/atoms/InputNumber';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { actionButtonStyles } from '@/styles/button';
import type { GlobalUnit } from '@/types/globalUnit';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { parseManualCarbs } from '@/utils/ean';
import { topScreenSpace } from '@/utils/screen';
import { triggerNotificationError } from '@/utils/haptics';

type GlobalUnitFormModalProps = {
  visible: boolean;
  unit: GlobalUnit | null;
  onClose: () => void;
  onSave: (data: Omit<GlobalUnit, 'id'> | GlobalUnit) => Promise<void>;
};

const Overlay = styled.Pressable`
  flex-grow: 1;
  justify-content: center;
  width: 100%;
`;

const Field = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const FooterActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  ${actionButtonStyles}
`;

export const GlobalUnitFormModal: FC<GlobalUnitFormModalProps> = ({
  visible,
  unit,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { massUnit, formatMassForInput, displayToGrams } = useMassDisplay();
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [gramsText, setGramsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName(unit?.name ?? '');
    setAbbreviation(unit?.abbreviation ?? '');
    setGramsText(unit ? formatMassForInput(unit.equivalentInGrams) : '');
  }, [visible, unit, formatMassForInput]);

  const handleSave = async () => {
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView
        intensity={50}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={topScreenSpace}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              padding: theme.spacing.lg,
              paddingTop: topScreenSpace,
            }}
            keyboardShouldPersistTaps="handled">
            <Overlay onPress={onClose}>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <GlassPanel padding={theme.spacing.lg}>
                  <Text $variant="subtitle">
                    {unit ? t('settings.editUnit') : t('settings.addUnit')}
                  </Text>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('products.unitName')}
                    </Text>
                    <SearchInput
                      value={name}
                      onChangeText={setName}
                      placeholder={t('products.unitName')}
                    />
                  </Field>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('products.unitAbbreviation')}
                    </Text>
                    <SearchInput
                      value={abbreviation}
                      onChangeText={setAbbreviation}
                      placeholder={t('products.unitAbbreviation')}
                    />
                  </Field>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('products.unitMass', { unit: massUnit })}
                    </Text>
                    <InputNumber
                      value={gramsText}
                      onChangeText={setGramsText}
                      placeholder={t('products.unitMass', { unit: massUnit })}
                    />
                  </Field>

                  <FooterActions>
                    <ActionButton onPress={onClose} disabled={isSaving}>
                      <Text $variant="caption">{t('common.cancel')}</Text>
                    </ActionButton>
                    <ActionButton $primary onPress={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <ActivityIndicator color={theme.colors.text} size="small" />
                      ) : (
                        <Text $variant="caption">{t('common.save')}</Text>
                      )}
                    </ActionButton>
                  </FooterActions>
                </GlassPanel>
              </Pressable>
            </Overlay>
          </ScrollView>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};
