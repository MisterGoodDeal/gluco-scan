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
import { productUnitRepository } from '@/repositories/productUnit.repository';
import { fetchOffPartialByEAN } from '@/services/openFoodFacts.service';
import { useProductStore } from '@/store/product.store';
import type { Product } from '@/types/product';
import type { ProductUnit } from '@/types/productUnit';
import { isValidEan, parseManualCarbs } from '@/utils/ean';
import { generateId } from '@/utils/id';

type ProductFormModalProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
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

const UnitRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-self: flex-end;
`;

export const ProductFormModal: FC<ProductFormModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const create = useProductStore((s) => s.create);
  const update = useProductStore((s) => s.update);

  const [ean, setEan] = useState('');
  const [name, setName] = useState('');
  const [carbsText, setCarbsText] = useState('');
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitAbbr, setNewUnitAbbr] = useState('');
  const [newUnitGrams, setNewUnitGrams] = useState('');

  useEffect(() => {
    if (!visible) return;
    setEan(product?.ean ?? '');
    setName(product?.name ?? '');
    setCarbsText(
      product?.carbsPer100g != null ? String(product.carbsPer100g).replace('.', ',') : '',
    );
    setUnits(product?.customUnits ?? []);
    setError(null);
  }, [visible, product]);

  const handleLookup = async (scannedEan: string) => {
    setEan(scannedEan);
    setIsLookupLoading(true);
    try {
      const partial = await fetchOffPartialByEAN(scannedEan);
      if (partial.name) setName(partial.name);
      if (partial.carbsPer100g != null) {
        setCarbsText(String(partial.carbsPer100g).replace('.', ','));
      }
    } finally {
      setIsLookupLoading(false);
    }
  };

  const addUnit = () => {
    const grams = parseManualCarbs(newUnitGrams);
    if (!newUnitName.trim() || !newUnitAbbr.trim() || grams === null) return;
    setUnits((prev) => [
      ...prev,
      {
        id: generateId(),
        name: newUnitName.trim(),
        abbreviation: newUnitAbbr.trim(),
        equivalentInGrams: grams,
      },
    ]);
    setNewUnitName('');
    setNewUnitAbbr('');
    setNewUnitGrams('');
  };

  const removeUnit = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const carbs = parseManualCarbs(carbsText);
    const trimmedEan = ean.trim();

    if (!trimmedName) {
      setError(t('modal.nameRequired'));
      return;
    }
    if (carbs === null) {
      setError(t('modal.invalidCarbs'));
      return;
    }
    if (trimmedEan && !isValidEan(trimmedEan)) {
      setError(t('modal.invalidEan'));
      return;
    }

    setIsSaving(true);
    try {
      if (product) {
        const updated: Product = {
          ...product,
          ean: trimmedEan || undefined,
          name: trimmedName,
          carbsPer100g: carbs,
          customUnits: units,
        };
        await update(updated);
        const existingIds = new Set(product.customUnits.map((u) => u.id));
        for (const unit of units) {
          if (existingIds.has(unit.id)) {
            await productUnitRepository.update(unit, product.id);
          } else {
            await productUnitRepository.create(product.id, unit);
          }
        }
        for (const old of product.customUnits) {
          if (!units.find((u) => u.id === old.id)) {
            await productUnitRepository.delete(old.id);
          }
        }
      } else {
        const created = await create({
          name: trimmedName,
          carbsPer100g: carbs,
          ean: trimmedEan || undefined,
        });
        for (const unit of units) {
          await productUnitRepository.create(created.id, unit);
        }
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
          keyboardVerticalOffset={insets.top}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              padding: theme.spacing.lg,
            }}
            keyboardShouldPersistTaps="handled">
            <Overlay onPress={onClose}>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <GlassPanel padding={theme.spacing.lg}>
                  <Text $variant="subtitle">
                    {product ? t('products.editProduct') : t('products.addProduct')}
                  </Text>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('modal.eanLabel')}
                    </Text>
                    <EanScanField value={ean} onScan={handleLookup} />
                  </Field>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('modal.nameLabel')}
                    </Text>
                    <SearchInput value={name} onChangeText={setName} placeholder={t('modal.namePlaceholder')} />
                  </Field>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('modal.carbsLabel')}
                    </Text>
                    <InputNumber value={carbsText} onChangeText={setCarbsText} />
                  </Field>

                  <Field>
                    <Text $variant="caption" $color="textSecondary">
                      {t('products.customUnits')}
                    </Text>
                    {units.map((unit) => (
                      <UnitRow key={unit.id}>
                        <Text $variant="caption">
                          1 {unit.abbreviation} = {unit.equivalentInGrams}g ({unit.name})
                        </Text>
                        <Pressable onPress={() => removeUnit(unit.id)}>
                          <Text $color="error">×</Text>
                        </Pressable>
                      </UnitRow>
                    ))}
                    <SearchInput
                      value={newUnitName}
                      onChangeText={setNewUnitName}
                      placeholder={t('products.unitName')}
                    />
                    <SearchInput
                      value={newUnitAbbr}
                      onChangeText={setNewUnitAbbr}
                      placeholder={t('products.unitAbbreviation')}
                    />
                    <InputNumber
                      value={newUnitGrams}
                      onChangeText={setNewUnitGrams}
                      placeholder={t('products.unitGrams')}
                    />
                    <Pressable onPress={addUnit}>
                      <Text $variant="caption" $color="accent">
                        {t('products.addUnit')}
                      </Text>
                    </Pressable>
                  </Field>

                  {error && (
                    <Text $variant="caption" $color="error" style={{ marginTop: 8 }}>
                      {error}
                    </Text>
                  )}

                  {isLookupLoading && <ActivityIndicator color={theme.colors.accent} />}

                  <Pressable
                    onPress={onClose}
                    style={{ marginTop: theme.spacing.sm, alignSelf: 'flex-start' }}>
                    <Text $variant="caption">{t('common.cancel')}</Text>
                  </Pressable>
                  <ActionButton $primary onPress={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <ActivityIndicator color={theme.colors.text} size="small" />
                    ) : (
                      <Text $variant="caption">{t('common.save')}</Text>
                    )}
                  </ActionButton>
                </GlassPanel>
              </Pressable>
            </Overlay>
          </ScrollView>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};
