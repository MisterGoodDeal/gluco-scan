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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { InputNumber } from '@/components/atoms/InputNumber';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { EanScanField } from '@/components/molecules/EanScanField';
import type { Product } from '@/types/product';
import { isValidEan, parseManualCarbs } from '@/utils/ean';
import { formatDecimalForInput } from '@/utils/format';

export type ManualProductInitial = {
  ean: string;
  name?: string;
  carbsPer100g?: number;
  originalEan?: string;
};

type ProductManualEntryModalProps = {
  visible: boolean;
  initial: ManualProductInitial | null;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  isLookupLoading?: boolean;
  lookupWarning?: string | null;
  onClose: () => void;
  onLookup?: (ean: string) => Promise<void>;
  onSubmit: (product: Product) => void;
};

const Overlay = styled.Pressable`
  flex-grow: 1;
  justify-content: center;
  width: 100%;
`;

const KeyboardAvoid = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ModalScrollView = styled(ScrollView).attrs({
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
  bounces: false,
})`
  flex: 1;
`;

const ModalCard = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const FormFields = styled.View`
  gap: ${({ theme }) => theme.spacing.lg}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const Field = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const ErrorText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean; $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

export const ProductManualEntryModal: FC<ProductManualEntryModalProps> = ({
  visible,
  initial,
  title,
  subtitle,
  submitLabel,
  isLookupLoading = false,
  lookupWarning = null,
  onClose,
  onLookup,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [ean, setEan] = useState('');
  const [name, setName] = useState('');
  const [carbsText, setCarbsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resolvedTitle = title ?? t('scanner.completeProduct');
  const resolvedSubmitLabel = submitLabel ?? t('common.save');

  useEffect(() => {
    if (!visible || !initial) return;
    setEan(initial.ean);
    setName(initial.name ?? '');
    setCarbsText(
      initial.carbsPer100g !== undefined
        ? formatDecimalForInput(initial.carbsPer100g)
        : '',
    );
    setError(null);
  }, [visible, initial]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleEanScanned = async (scannedEan: string) => {
    setEan(scannedEan);
    setError(null);
    if (onLookup) {
      await onLookup(scannedEan);
    }
  };

  const handleLookup = async () => {
    if (!onLookup || !isValidEan(ean)) {
      setError(t('modal.invalidEan'));
      return;
    }
    setError(null);
    await onLookup(ean.trim());
  };

  const handleSubmit = () => {
    const trimmedEan = ean.trim();
    const trimmedName = name.trim();
    const carbsPer100g = parseManualCarbs(carbsText);

    if (!isValidEan(trimmedEan)) {
      setError(t('modal.invalidEan'));
      return;
    }
    if (!trimmedName) {
      setError(t('modal.nameRequired'));
      return;
    }
    if (carbsPer100g === null) {
      setError(t('modal.invalidCarbs'));
      return;
    }

    onSubmit({
      ean: trimmedEan,
      name: trimmedName,
      carbsPer100g,
    });
  };

  if (!initial) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <BlurView
        intensity={50}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <KeyboardAvoid
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={insets.top}>
          <ModalScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              padding: theme.spacing.lg,
            }}>
            <Overlay onPress={handleClose}>
              <Pressable onPress={(event) => event.stopPropagation()}>
                <ModalCard>
                  <GlassPanel padding={theme.spacing.lg}>
                    <Text $variant="subtitle">{resolvedTitle}</Text>
                    {subtitle && (
                      <Text $variant="caption" $color="textSecondary">
                        {subtitle}
                      </Text>
                    )}

                    <FormFields>
                      <Field>
                        <Text $variant="caption" $color="textSecondary">
                          {t('modal.eanLabel')}
                        </Text>
                        <EanScanField value={ean} onScan={handleEanScanned} />
                      </Field>

                      <Field>
                        <Text $variant="caption" $color="textSecondary">
                          {t('modal.nameLabel')}
                        </Text>
                        <SearchInput
                          value={name}
                          onChangeText={setName}
                          placeholder={t('modal.namePlaceholder')}
                        />
                      </Field>

                      <Field>
                        <Text $variant="caption" $color="textSecondary">
                          {t('modal.carbsLabel')}
                        </Text>
                        <InputNumber
                          value={carbsText}
                          onChangeText={setCarbsText}
                          placeholder="10"
                        />
                      </Field>
                    </FormFields>

                    {lookupWarning && (
                      <ErrorText $variant="caption" $color="accent">
                        {lookupWarning}
                      </ErrorText>
                    )}

                    {error && (
                      <ErrorText $variant="caption" $color="error">
                        {error}
                      </ErrorText>
                    )}

                    <Actions>
                      <ActionButton onPress={handleClose}>
                        <Text $variant="caption">{t('common.cancel')}</Text>
                      </ActionButton>
                      {onLookup && (
                        <ActionButton onPress={handleLookup} $disabled={isLookupLoading || !ean}>
                          {isLookupLoading ? (
                            <ActivityIndicator color={theme.colors.text} size="small" />
                          ) : (
                            <Text $variant="caption">{t('modal.importOff')}</Text>
                          )}
                        </ActionButton>
                      )}
                      <ActionButton $primary onPress={handleSubmit}>
                        <Text $variant="caption">{resolvedSubmitLabel}</Text>
                      </ActionButton>
                    </Actions>
                  </GlassPanel>
                </ModalCard>
              </Pressable>
            </Overlay>
          </ModalScrollView>
        </KeyboardAvoid>
      </BlurView>
    </Modal>
  );
};
