import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { type BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import { type ComponentProps, type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { InputNumber } from '@/components/atoms/InputNumber';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { EanScanField } from '@/components/molecules/EanScanField';
import { ProductUnitFormModal } from '@/components/organisms/ProductUnitFormModal';
import { productUnitRepository } from '@/repositories/productUnit.repository';
import { fetchOffPartialByEAN } from '@/services/openFoodFacts.service';
import { useProductStore } from '@/store/product.store';
import type { Product } from '@/types/product';
import type { ProductUnit } from '@/types/productUnit';
import { isValidEan, parseManualCarbs } from '@/utils/ean';

type ProductFormSheetProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
};

const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const Field = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const UnitsSection = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const UnitRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const AddUnitButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const FooterActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ProductFormSheet: FC<ProductFormSheetProps> = ({
  visible,
  product,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetModalType>(null);
  const snapPoints = useMemo(() => ['88%'], []);
  const create = useProductStore((s) => s.create);
  const update = useProductStore((s) => s.update);

  const [ean, setEan] = useState('');
  const [name, setName] = useState('');
  const [carbsText, setCarbsText] = useState('');
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ProductUnit | null>(null);

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    setEan(product?.ean ?? '');
    setName(product?.name ?? '');
    setCarbsText(
      product?.carbsPer100g != null ? String(product.carbsPer100g).replace('.', ',') : '',
    );
    setUnits(product?.customUnits ?? []);
    setError(null);
    setUnitModalVisible(false);
    setEditingUnit(null);
  }, [visible, product]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

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

  const openAddUnit = () => {
    setEditingUnit(null);
    setUnitModalVisible(true);
  };

  const openEditUnit = (unit: ProductUnit) => {
    setEditingUnit(unit);
    setUnitModalVisible(true);
  };

  const handleUnitSave = (saved: ProductUnit) => {
    setUnits((prev) => {
      const exists = prev.some((u) => u.id === saved.id);
      if (exists) {
        return prev.map((u) => (u.id === saved.id ? saved : u));
      }
      return [...prev, saved];
    });
    setEditingUnit(null);
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
      sheetRef.current?.dismiss();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderColor: theme.colors.glass.border,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.glass.highlight }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize">
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}>
          <SheetHeader>
            <Text $variant="subtitle">
              {product ? t('products.editProduct') : t('products.addProduct')}
            </Text>
            <Pressable onPress={handleDismiss} hitSlop={8}>
              <Text $variant="body" $color="accent">
                {t('common.cancel')}
              </Text>
            </Pressable>
          </SheetHeader>

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
            <InputNumber value={carbsText} onChangeText={setCarbsText} />
          </Field>

          <UnitsSection>
            <SectionTitleRow>
              <Text $variant="body">{t('products.customUnits')}</Text>
              <AddUnitButton onPress={openAddUnit} accessibilityLabel={t('products.addUnit')}>
                <Text $variant="caption" $color="accent">
                  {t('products.addUnit')}
                </Text>
              </AddUnitButton>
            </SectionTitleRow>
            {units.length === 0 ? (
              <Text $variant="caption" $color="textSecondary">
                {t('products.noCustomUnits')}
              </Text>
            ) : (
              units.map((unit) => (
                <UnitRow key={unit.id} onPress={() => openEditUnit(unit)}>
                  <Text $variant="caption" style={{ flex: 1 }}>
                    1 {unit.abbreviation} = {unit.equivalentInGrams}g ({unit.name})
                  </Text>
                  <Pressable onPress={() => removeUnit(unit.id)} hitSlop={8}>
                    <Text $color="error">×</Text>
                  </Pressable>
                </UnitRow>
              ))
            )}
          </UnitsSection>

          {error && (
            <Text $variant="caption" $color="error" style={{ marginTop: 8 }}>
              {error}
            </Text>
          )}

          {isLookupLoading && (
            <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 8 }} />
          )}

          <FooterActions>
            <ActionButton onPress={handleDismiss} disabled={isSaving}>
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
        </BottomSheetScrollView>
      </BottomSheetModal>

      <ProductUnitFormModal
        visible={unitModalVisible}
        unit={editingUnit}
        onClose={() => {
          setUnitModalVisible(false);
          setEditingUnit(null);
        }}
        onSave={handleUnitSave}
      />
    </>
  );
};
