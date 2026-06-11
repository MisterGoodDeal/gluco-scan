import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaIcon } from '@/components/atoms/FaIcon';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { TutorialMealCreateBanner } from '@/components/organisms/TutorialMealCreateBanner';
import { PickerField } from '@/components/atoms/PickerField';
import {
  MealMetaPickerSheet,
  type MealMetaPickerField,
} from '@/components/organisms/MealMetaPickerSheet';
import { ProductSpotlightSearch } from '@/components/organisms/ProductSpotlightSearch';
import { QuantityPickerModal } from '@/components/organisms/QuantityPickerModal';
import { ScannerView } from '@/components/organisms/ScannerView';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import { useAppToast } from '@/components/ui/useAppToast';
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
import { formatDecimal } from '@/utils/format';
import { MealItemConversionLine } from '@/components/molecules/MealItemConversionLine';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { hp, topScreenSpace } from '@/utils/screen';

export const MealCreateLayout: FC = () => {
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();
  const isEditing = Boolean(mealId);
  const { t } = useTranslation();
  const toast = useAppToast();
  const [mutedColor, dangerColor] = useThemeColor(['muted', 'danger']);
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

  const showTutorialBanner =
    !isEditing &&
    tutorialStatus === TutorialStatus.RUNNING &&
    getTutorialStepId() === 'meal-create';
  const navBottomInset = insets.bottom + 24;
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [pendingOffScan, setPendingOffScan] = useState<MealScanResult | null>(null);
  const [openMetaPicker, setOpenMetaPicker] = useState<MealMetaPickerField | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const { handleScan, isLoading, error, warning, clearMessages } = useMealProductScan();

  const timeLabel = `${String(draftMeta.hours).padStart(2, '0')}:${String(draftMeta.minutes).padStart(2, '0')}`;
  const scannerActive = step === 1 && pickerProduct === null && !searchVisible;

  useEffect(() => {
    if (error) {
      toast.error(error, { haptic: false });
      clearMessages();
    } else if (warning) {
      toast.warning(warning, { haptic: false });
      clearMessages();
    }
  }, [error, warning, toast, clearMessages]);

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
      tags: result.off.tags,
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
      toast.warning(t('meals.noItems'));
      return;
    }
    try {
      await saveMeal();
      toast.success(t('meals.saveSuccess'));
    } catch {
      toast.error(t('meals.saveError'));
      return;
    }
    if (!isEditing) {
      setMealCreateValidated(true);
      if (tutorialStatus === TutorialStatus.RUNNING && getTutorialStepId() === 'meal-create') {
        tutorialNextStep();
      }
    }
    router.back();
  };

  const renderDraftItem = (item: MealDraftItem, isLast: boolean) => (
    <View
      key={item.id}
      className={`flex-row items-center justify-between py-2 ${
        isLast ? '' : 'border-b border-separator'
      }`}>
      <AppPressable
        className="flex-1 mr-2 py-1 rounded-lg"
        accessibilityRole="button"
        accessibilityLabel={t('meals.editItemA11y', { name: item.productName })}
        onPress={() => void openEditItem(item)}>
        <MealItemConversionLine
          item={{
            ...item,
            productName: item.productName,
          }}
          product={{ tags: item.productTags, customCookingFactor: null }}
        />
      </AppPressable>
      <AppPressable onPress={() => removeDraftItem(item.id)} hitSlop={8}>
        <FaIcon name="xmark" size={18} color={dangerColor} />
      </AppPressable>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <BackgroundGradient />
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingTop: topScreenSpace }}>
        <AppPressable
          onPress={() => {
            resetDraft();
            router.back();
          }}>
          <Text className="text-accent text-base">{t('common.cancel')}</Text>
        </AppPressable>
        <Text className="text-foreground text-lg font-semibold">
          {isEditing ? t('meals.editTitle') : t('meals.createTitle')}
        </Text>
        <View className="w-[60px]" />
      </View>

      <View className="flex-row justify-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full ${step === i ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}>
        {step === 0 && (
          <>
            <View className="m-4 mb-0 gap-1">
              <Text className="text-muted text-sm">{t('meals.mealType')}</Text>
              <PickerField
                value={t(getMealTypeLabelKey(draftMeta.type))}
                onPress={() => setOpenMetaPicker('mealType')}
                accessibilityLabel={t('meals.mealType')}
              />
            </View>
            <View className="m-4 mb-0 gap-1">
              <Text className="text-muted text-sm">{t('meals.date')}</Text>
              <PickerField
                value={formatDateLabel(draftMeta.dateKey, locale)}
                onPress={() => setOpenMetaPicker('date')}
                accessibilityLabel={t('meals.date')}
              />
            </View>
            <View className="m-4 gap-1">
              <Text className="text-muted text-sm">{t('meals.time')}</Text>
              <PickerField
                value={timeLabel}
                onPress={() => setOpenMetaPicker('time')}
                accessibilityLabel={t('meals.time')}
              />
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <View className="m-4 rounded-3xl overflow-hidden" style={{ height: hp('30%') }}>
              <ScannerView
                fill
                onScan={onBarcodeScan}
                isLoadingProduct={isLoading}
                scanError={null}
                scanWarning={null}
                scanSuccessFlash={false}
                isScanning={!isLoading && scannerActive}
                enabled={scannerActive}
                onClearError={clearMessages}
              />
            </View>

            <AppPressable
              className="mx-4 mb-4 flex-row items-center gap-2 rounded-2xl border border-border bg-surface p-4"
              onPress={() => setSearchVisible(true)}
              accessibilityLabel={t('meals.searchProduct')}>
              <FaIcon name="magnifying-glass" size={18} color={mutedColor} />
              <Text className="flex-1 text-muted text-base">
                {t('meals.searchSpotlightPlaceholder')}
              </Text>
            </AppPressable>

            <View className="m-4 gap-2">
              <Text className="text-foreground text-base font-medium">
                {t('meals.stepFoods')}
              </Text>
              {draftItems.length > 0 ? (
                <Text className="text-muted text-sm">{t('meals.editItemHint')}</Text>
              ) : null}
              {draftItems.length === 0 ? (
                <Text className="text-muted text-sm">{t('scanner.scanProduct')}</Text>
              ) : (
                draftItems.map((item, index) =>
                  renderDraftItem(item, index === draftItems.length - 1),
                )
              )}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            {draftItems.map((item, index) => (
              <View key={item.id} className="mx-4">
                {renderDraftItem(item, index === draftItems.length - 1)}
              </View>
            ))}
            <Text className="text-accent text-2xl font-bold text-center mt-6">
              {t('meals.mealTotal')}: {formatDecimal(draftTotal)} g
            </Text>
            <View className="m-6 self-center">
              <AppButton variant="primary" onPress={() => void handleSave()}>
                {t('meals.saveMeal')}
              </AppButton>
            </View>
          </>
        )}
      </ScrollView>

      {showTutorialBanner ? <TutorialMealCreateBanner /> : null}
      <View
        className="flex-row justify-between p-4"
        style={{ paddingBottom: navBottomInset }}>
        {step > 0 ? (
          <AppButton variant="secondary" onPress={() => setStep(step - 1)}>
            {t('common.previous')}
          </AppButton>
        ) : (
          <View />
        )}
        {step < 2 && (
          <AppButton variant="primary" onPress={() => setStep(step + 1)}>
            {t('common.next')}
          </AppButton>
        )}
      </View>

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
    </View>
  );
};
