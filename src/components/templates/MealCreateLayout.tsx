import { SymbolView } from 'expo-symbols';
import { router, useLocalSearchParams } from 'expo-router';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { TutorialMealCreateBanner } from '@/components/organisms/TutorialMealCreateBanner';
import { PickerField } from '@/components/atoms/PickerField';
import { Text } from '@/components/atoms/Text';
import {
  MealMetaPickerSheet,
  type MealMetaPickerField,
} from '@/components/organisms/MealMetaPickerSheet';
import { ProductSpotlightSearch } from '@/components/organisms/ProductSpotlightSearch';
import { QuantityPickerModal } from '@/components/organisms/QuantityPickerModal';
import { ScannerView } from '@/components/organisms/ScannerView';
import {
  persistOffProduct,
  useMealProductScan,
  type MealScanResult,
} from '@/hooks/useMealProductScan';
import { getCurrentLocale } from '@/i18n';
import { productRepository } from '@/repositories/product.repository';
import { useSettingsStore } from '@/store/settings.store';
import { useMealStore, type MealDraftItem } from '@/store/meal.store';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import type { Product } from '@/types/product';
import { generateId } from '@/utils/id';
import { formatDateLabel } from '@/utils/date';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { formatDecimal } from '@/utils/format';
import { formatMealItemQuantity } from '@/utils/formatMealItemQuantity';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { listRowDivider } from '@/styles/listRow';
import { hp } from '@/utils/screen';
import { Screen, ScreenHeaderBar } from '@/styles/global';

const Header = styled(ScreenHeaderBar)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StepIndicator = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Dot = styled.View<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.glass.border};
`;

const Field = styled.View`
  margin: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const NavRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const ScannerSection = styled.View`
  height: ${hp('30%')}px;
  margin: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
`;

const SearchTrigger = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin: 0 ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const ItemsSection = styled.View`
  margin: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ItemRow = styled.View<{ $isLast?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  ${listRowDivider}
`;

const ItemTouchable = styled(TouchableOpacity)`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

export const MealCreateLayout: FC = () => {
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();
  const isEditing = Boolean(mealId);
  const { t } = useTranslation();
  const { formatMassValue, massUnit } = useMassDisplay();
  const locale = getCurrentLocale();
  const step = useMealStore((s) => s.step);
  const setStep = useMealStore((s) => s.setStep);
  const draftMeta = useMealStore((s) => s.draftMeta);
  const setDraftMeta = useMealStore((s) => s.setDraftMeta);
  const draftItems = useMealStore((s) => s.draftItems);
  const removeDraftItem = useMealStore((s) => s.removeDraftItem);
  const addDraftItem = useMealStore((s) => s.addDraftItem);
  const updateDraftItem = useMealStore((s) => s.updateDraftItem);
  const beginEditMeal = useMealStore((s) => s.beginEditMeal);
  const resetDraft = useMealStore((s) => s.resetDraft);
  const saveMeal = useMealStore((s) => s.saveMeal);
  const setMealCreateValidated = useTutorialStore((s) => s.setMealCreateValidated);
  const tutorialStatus = useTutorialStore((s) => s.status);
  const tutorialNextStep = useTutorialStore((s) => s.nextStep);
  const getTutorialStepId = useTutorialStore((s) => s.getCurrentStepId);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const showTutorialBanner =
    !isEditing &&
    tutorialStatus === TutorialStatus.RUNNING &&
    getTutorialStepId() === 'meal-create';
  const navBottomInset = insets.bottom + theme.spacing.lg;
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [pendingOffScan, setPendingOffScan] = useState<MealScanResult | null>(null);
  const [openMetaPicker, setOpenMetaPicker] = useState<MealMetaPickerField | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const { handleScan, isLoading, error, warning, clearMessages } = useMealProductScan();

  const timeLabel = `${String(draftMeta.hours).padStart(2, '0')}:${String(draftMeta.minutes).padStart(2, '0')}`;
  const scannerActive = step === 1 && pickerProduct === null && !searchVisible;

  const openProductPicker = (result: MealScanResult) => {
    if (result.kind === 'existing') {
      setPendingOffScan(null);
      setPickerProduct(result.product);
      return;
    }
    setPendingOffScan(result);
    setPickerProduct({
      id: '',
      eans: [result.off.ean],
      name: result.off.name,
      carbsPer100g: result.off.carbsPer100g,
      imageUrl: result.off.imageUrl ?? null,
      customUnits: [],
    });
  };

  const closeProductPicker = () => {
    setPickerProduct(null);
    setPendingOffScan(null);
    setEditingItemId(null);
  };

  const pickerInitialItem =
    editingItemId != null
      ? (draftItems.find((item) => item.id === editingItemId) ?? null)
      : null;

  useEffect(() => {
    if (mealId) {
      void beginEditMeal(mealId).then((ok) => {
        if (!ok) router.back();
      });
      return () => resetDraft();
    }
    resetDraft();
    return () => resetDraft();
  }, [mealId, beginEditMeal, resetDraft]);

  useEffect(() => {
    void hydrateSettings();
  }, [hydrateSettings]);

  useEffect(() => {
    if (step !== 0) setOpenMetaPicker(null);
  }, [step]);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.carbs, 0);

  const onBarcodeScan = async (ean: string) => {
    const result = await handleScan(ean);
    if (result) openProductPicker(result);
  };

  const openEditItem = async (item: MealDraftItem) => {
    const product = await productRepository.getById(item.productId);
    if (!product) return;
    setEditingItemId(item.id);
    setPendingOffScan(null);
    setPickerProduct(product);
  };

  const handleSave = async () => {
    if (draftItems.length === 0) {
      Alert.alert(t('meals.noItems'));
      return;
    }
    await saveMeal();
    if (!isEditing) {
      setMealCreateValidated(true);
      if (tutorialStatus === TutorialStatus.RUNNING && getTutorialStepId() === 'meal-create') {
        tutorialNextStep();
      }
    }
    router.back();
  };

  const renderDraftItem = (item: MealDraftItem, isLast: boolean) => (
    <ItemRow key={item.id} $isLast={isLast}>
      <ItemTouchable
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={t('meals.editItemA11y', { name: item.productName })}
        onPress={() => void openEditItem(item)}>
        <Text $variant="body">
          {t('meals.itemLinePortion', {
            name: item.productName,
            portion: formatMealItemQuantity(
              item.quantity,
              item.unitType,
              item.unitLabel,
              formatMassValue,
              massUnit,
            ),
            carbs: formatDecimal(item.carbs),
          })}
        </Text>
      </ItemTouchable>
      <Pressable onPress={() => removeDraftItem(item.id)} hitSlop={8}>
        <Text $color="error">×</Text>
      </Pressable>
    </ItemRow>
  );

  return (
    <Screen>
      <BackgroundGradient />
      <Header>
        <Pressable
          onPress={() => {
            resetDraft();
            router.back();
          }}>
          <Text $variant="body" $color="accent">
            {t('common.cancel')}
          </Text>
        </Pressable>
        <Text $variant="subtitle">
          {isEditing ? t('meals.editTitle') : t('meals.createTitle')}
        </Text>
        <View style={{ width: 60 }} />
      </Header>

      <StepIndicator>
        {[0, 1, 2].map((i) => (
          <Dot key={i} $active={step === i} />
        ))}
      </StepIndicator>

      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: theme.spacing.md }}>
        {step === 0 && (
          <>
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.mealType')}
              </Text>
              <PickerField
                value={t(getMealTypeLabelKey(draftMeta.type))}
                onPress={() => setOpenMetaPicker('mealType')}
                accessibilityLabel={t('meals.mealType')}
              />
            </Field>
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.date')}
              </Text>
              <PickerField
                value={formatDateLabel(draftMeta.dateKey, locale)}
                onPress={() => setOpenMetaPicker('date')}
                accessibilityLabel={t('meals.date')}
              />
            </Field>
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.time')}
              </Text>
              <PickerField
                value={timeLabel}
                onPress={() => setOpenMetaPicker('time')}
                accessibilityLabel={t('meals.time')}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <ScannerSection>
              <ScannerView
                fill
                onScan={onBarcodeScan}
                isLoadingProduct={isLoading}
                scanError={error}
                scanWarning={warning}
                scanSuccessFlash={false}
                isScanning={!isLoading && scannerActive}
                enabled={scannerActive}
                onClearError={clearMessages}
              />
            </ScannerSection>

            <SearchTrigger
              onPress={() => setSearchVisible(true)}
              accessibilityLabel={t('meals.searchProduct')}>
              <SymbolView
                name="magnifyingglass"
                size={18}
                tintColor={theme.colors.textSecondary}
              />
              <Text $variant="body" $color="textSecondary" style={{ flex: 1 }}>
                {t('meals.searchSpotlightPlaceholder')}
              </Text>
            </SearchTrigger>

            <ItemsSection>
              <Text $variant="body">{t('meals.stepFoods')}</Text>
              {draftItems.length > 0 ? (
                <Text $variant="caption" $color="textSecondary">
                  {t('meals.editItemHint')}
                </Text>
              ) : null}
              {draftItems.length === 0 ? (
                <Text $variant="caption" $color="textSecondary">
                  {t('scanner.scanProduct')}
                </Text>
              ) : (
                draftItems.map((item, index) =>
                  renderDraftItem(item, index === draftItems.length - 1),
                )
              )}
            </ItemsSection>
          </>
        )}

        {step === 2 && (
          <>
            {draftItems.map((item, index) => (
              <View key={item.id} style={{ marginHorizontal: 16 }}>
                {renderDraftItem(item, index === draftItems.length - 1)}
              </View>
            ))}
            <Text $variant="title" $color="accent" style={{ textAlign: 'center', marginTop: 24 }}>
              {t('meals.mealTotal')}: {formatDecimal(draftTotal)} g
            </Text>
            <View style={{ margin: 24, alignSelf: 'center' }}>
              <ActionButton $primary onPress={handleSave}>
                <Text $variant="caption">{t('meals.saveMeal')}</Text>
              </ActionButton>
            </View>
          </>
        )}
      </ScrollView>

      {showTutorialBanner ? <TutorialMealCreateBanner /> : null}
      <NavRow style={{ paddingBottom: navBottomInset }}>
        {step > 0 ? (
          <ActionButton onPress={() => setStep(step - 1)}>
            <Text $variant="caption">{t('common.previous')}</Text>
          </ActionButton>
        ) : (
          <View />
        )}
        {step < 2 && (
          <ActionButton $primary onPress={() => setStep(step + 1)}>
            <Text $variant="caption">{t('common.next')}</Text>
          </ActionButton>
        )}
      </NavRow>

      <QuantityPickerModal
        visible={pickerProduct !== null}
        product={pickerProduct}
        initialItem={pickerInitialItem}
        onClose={closeProductPicker}
        onConfirm={async (payload) => {
          const product =
            pendingOffScan?.kind === 'off'
              ? await persistOffProduct(pendingOffScan.off)
              : pickerProduct;
          if (!product) return;

          if (editingItemId) {
            const existing = draftItems.find((item) => item.id === editingItemId);
            if (!existing) return;
            updateDraftItem(editingItemId, {
              ...existing,
              productId: product.id,
              ...payload,
            });
          } else {
            addDraftItem({
              id: generateId(),
              productId: product.id,
              ...payload,
            });
          }
          closeProductPicker();
        }}
      />
      <MealMetaPickerSheet
        field={openMetaPicker}
        draftMeta={draftMeta}
        onChange={setDraftMeta}
        onClose={() => setOpenMetaPicker(null)}
      />
      <ProductSpotlightSearch
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelect={(product) => {
          setPendingOffScan(null);
          setPickerProduct(product);
        }}
      />
    </Screen>
  );
};
