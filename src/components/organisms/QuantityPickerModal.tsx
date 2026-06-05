import { BlurView } from 'expo-blur';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { InputNumber } from '@/components/atoms/InputNumber';
import { Text } from '@/components/atoms/Text';
import { useSettingsStore } from '@/store/settings.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { MealDraftItem } from '@/store/meal.store';
import type { Product } from '@/types/product';
import type { MealItemQuantityType } from '@/types/mealItem';
import { computeMealItemCarbsWithCooking } from '@/utils/carbs';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { defaultDisplayMassQuantity } from '@/utils/mass';
import { formatDecimal } from '@/utils/format';
import { triggerNotificationSuccess } from '@/utils/haptics';
import { primaryButtonStyles } from '@/styles/button';

export type QuantityPickerConfirm = {
  quantity: number;
  unitType: 'grams' | 'custom';
  unitId?: string;
  quantityType?: MealItemQuantityType;
  rawEquivalentQuantity: number;
  productName: string;
  carbsPer100g: number;
  carbs: number;
  unitLabel: string;
  productTags: Product['tags'];
};

type QuantityPickerModalProps = {
  visible: boolean;
  product: Product | null;
  initialItem?: MealDraftItem | null;
  onClose: () => void;
  onConfirm: (payload: QuantityPickerConfirm) => void;
};

const resolveUnitFromItem = (item: MealDraftItem, options: UnitOption[]): UnitOption | null => {
  if (item.unitType === 'grams') {
    return options.find((opt) => opt.unitType === 'grams') ?? null;
  }
  return (
    options.find((opt) => opt.unitType === 'custom' && opt.id === item.unitId) ?? null
  );
};

type UnitOption = {
  id: string;
  label: string;
  abbreviation: string;
  equivalentInGrams: number;
  unitType: 'grams' | 'custom';
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.lg}px 0;
`;

const WeighingChip = styled.Pressable<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.glass.background};
  margin: ${({ theme }) => theme.spacing.xs}px;
`;

const UnitChip = styled.Pressable<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.glass.background};
  margin: ${({ theme }) => theme.spacing.xs}px;
`;

const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.Pressable`
  ${primaryButtonStyles}
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const QuantityPickerModal: FC<QuantityPickerModalProps> = ({
  visible,
  product,
  initialItem = null,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const globalUnits = useSettingsStore((s) => s.globalUnits);
  const userConversions = useCookingConversionStore((s) => s.conversions);
  const { unitSystem, massUnit, massLabel, displayToGrams, formatMassForInput } =
    useMassDisplay();

  const unitOptions: UnitOption[] = useMemo(() => {
    if (!product) return [];
    const productOpts: UnitOption[] = product.customUnits.map((u) => ({
      id: u.id,
      label: u.name,
      abbreviation: u.abbreviation,
      equivalentInGrams: u.equivalentInGrams,
      unitType: 'custom' as const,
    }));
    const globalOpts: UnitOption[] = globalUnits.map((u) => ({
      id: u.id,
      label: u.name,
      abbreviation: u.abbreviation,
      equivalentInGrams: u.equivalentInGrams,
      unitType: 'custom' as const,
    }));
    const gramsOpt: UnitOption = {
      id: 'grams',
      label: massLabel,
      abbreviation: massUnit,
      equivalentInGrams: 1,
      unitType: 'grams',
    };
    return [...productOpts, ...globalOpts, gramsOpt];
  }, [product, globalUnits, massLabel, massUnit]);

  const defaultUnit = useMemo((): UnitOption | null => {
    if (!product || unitOptions.length === 0) return null;
    if (product.customUnits.length > 0) return unitOptions[0];
    return unitOptions.find((opt) => opt.unitType === 'grams') ?? unitOptions[0];
  }, [product, unitOptions]);

  const [selectedUnit, setSelectedUnit] = useState<UnitOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityType, setQuantityType] = useState<MealItemQuantityType>('cooked');
  const [gramsText, setGramsText] = useState(() => String(defaultDisplayMassQuantity(unitSystem)));

  const productKey = product
    ? product.id || product.eans[0] || product.name
    : null;
  const initialItemKey = initialItem?.id ?? null;

  useEffect(() => {
    if (!visible) {
      setSelectedUnit(null);
      setQuantity(1);
      setQuantityType('cooked');
      return;
    }
    if (!product || !defaultUnit) return;

    if (initialItem && initialItem.productId === product.id) {
      const unit = resolveUnitFromItem(initialItem, unitOptions) ?? defaultUnit;
      setSelectedUnit(unit);
      if (unit.unitType === 'grams') {
        setGramsText(formatMassForInput(initialItem.quantity));
        setQuantity(1);
      } else {
        setQuantity(Math.max(1, initialItem.quantity));
        setGramsText(String(defaultDisplayMassQuantity(unitSystem)));
      }
      setQuantityType(initialItem.quantityType ?? 'raw');
      return;
    }

    setSelectedUnit(defaultUnit);
    setQuantity(1);
    setQuantityType('cooked');
    setGramsText(String(defaultDisplayMassQuantity(unitSystem)));
  }, [
    visible,
    productKey,
    initialItemKey,
    defaultUnit,
    unitSystem,
    unitOptions,
    product,
    initialItem,
    formatMassForInput,
  ]);

  if (!product) return null;

  const activeUnit =
    selectedUnit &&
    unitOptions.some(
      (opt) => opt.id === selectedUnit.id && opt.unitType === selectedUnit.unitType,
    )
      ? selectedUnit
      : defaultUnit;

  const isGrams = activeUnit?.unitType === 'grams';
  const parsedDisplay = parseFloat(gramsText.replace(',', '.')) || 0;
  const qty = isGrams ? displayToGrams(parsedDisplay) : quantity;
  const cookingEligible =
    isGrams && hasCookingConversion(product, userConversions);

  const carbsResult = activeUnit
    ? computeMealItemCarbsWithCooking(
        {
          quantity: qty,
          unitType: activeUnit.unitType,
          unitId: activeUnit.unitType === 'custom' ? activeUnit.id : undefined,
          quantityType: cookingEligible ? quantityType : 'raw',
        },
        product,
        globalUnits,
        userConversions,
      )
    : { carbs: 0, rawEquivalentQuantity: 0, quantityType: 'raw' as const };

  const handleConfirm = () => {
    if (!activeUnit) return;
    onConfirm({
      quantity: qty,
      unitType: activeUnit.unitType,
      unitId: activeUnit.unitType === 'custom' ? activeUnit.id : undefined,
      quantityType: carbsResult.quantityType,
      rawEquivalentQuantity: carbsResult.rawEquivalentQuantity,
      productName: product.name,
      carbsPer100g: product.carbsPer100g,
      carbs: carbsResult.carbs,
      unitLabel: activeUnit.abbreviation,
      productTags: product.tags,
    });
    triggerNotificationSuccess();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView
        intensity={50}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <Pressable style={{ flex: 1, justifyContent: 'center', padding: 24 }} onPress={onClose}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <GlassPanel padding={theme.spacing.lg}>
              <Text $variant="subtitle">{product.name}</Text>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.selectQuantity')}
              </Text>

              <Chips>
                {unitOptions.map((opt) => (
                  <UnitChip
                    key={opt.id}
                    $selected={activeUnit?.id === opt.id && activeUnit?.unitType === opt.unitType}
                    onPress={() => setSelectedUnit(opt)}>
                    <Text $variant="caption">{opt.abbreviation}</Text>
                  </UnitChip>
                ))}
              </Chips>

              {cookingEligible ? (
                <>
                  <Text $variant="caption" $color="textSecondary" style={{ textAlign: 'center' }}>
                    {t('meals.weighingType')}
                  </Text>
                  <Chips>
                    <WeighingChip
                      $selected={quantityType === 'raw'}
                      onPress={() => setQuantityType('raw')}>
                      <Text $variant="caption">{t('meals.weighingRaw')}</Text>
                    </WeighingChip>
                    <WeighingChip
                      $selected={quantityType === 'cooked'}
                      onPress={() => setQuantityType('cooked')}>
                      <Text $variant="caption">{t('meals.weighingCooked')}</Text>
                    </WeighingChip>
                  </Chips>
                </>
              ) : null}

              {isGrams ? (
                <InputNumber
                  value={gramsText}
                  onChangeText={setGramsText}
                  placeholder={String(defaultDisplayMassQuantity(unitSystem))}
                />
              ) : (
                <Row>
                  <ButtonIcon
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    accessibilityLabel="-">
                    <Text $variant="subtitle">−</Text>
                  </ButtonIcon>
                  <Text $variant="title">
                    {quantity} {activeUnit?.abbreviation}
                  </Text>
                  <ButtonIcon
                    onPress={() => setQuantity((q) => q + 1)}
                    accessibilityLabel="+">
                    <Text $variant="subtitle">+</Text>
                  </ButtonIcon>
                </Row>
              )}

              <Text $variant="body" $color="accent" style={{ textAlign: 'center' }}>
                {formatDecimal(carbsResult.carbs)} g
              </Text>

              <ActionButton onPress={handleConfirm}>
                <Text $variant="caption">
                  {initialItem ? t('common.save') : t('common.add')}
                </Text>
              </ActionButton>
            </GlassPanel>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};
