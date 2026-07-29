import { router, useLocalSearchParams } from 'expo-router';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaIcon } from '@/components/atoms/FaIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ManualCarbsModal } from '@/components/organisms/ManualCarbsModal';
import { ProductSpotlightSearch } from '@/components/organisms/ProductSpotlightSearch';
import { QuantityPickerModal } from '@/components/organisms/QuantityPickerModal';
import { MealItemConversionLine } from '@/components/molecules/MealItemConversionLine';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import { useAppToast } from '@/components/ui/useAppToast';
import { MANUAL_CARBS_PRODUCT_ID, isManualCarbsProductId } from '@/constants/manualCarbs';
import { productRepository } from '@/repositories/product.repository';
import { useCompositionStore } from '@/store/composition.store';
import { useMealStore, type MealDraftItem } from '@/store/meal.store';
import { useSettingsStore } from '@/store/settings.store';
import type { Composition } from '@/types/composition';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';
import { generateId } from '@/utils/id';

export const CompositionEditorLayout: FC = () => {
  const { compositionId } = useLocalSearchParams<{ compositionId?: string }>();
  const isEditing = Boolean(compositionId);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const toast = useAppToast();
  const draftName = useCompositionStore((s) => s.draftName);
  const draftItems = useCompositionStore((s) => s.draftItems);
  const setDraftName = useCompositionStore((s) => s.setDraftName);
  const addDraftItem = useCompositionStore((s) => s.addDraftItem);
  const updateDraftItem = useCompositionStore((s) => s.updateDraftItem);
  const removeDraftItem = useCompositionStore((s) => s.removeDraftItem);
  const beginEditComposition = useCompositionStore((s) => s.beginEditComposition);
  const resetDraft = useCompositionStore((s) => s.resetDraft);
  const saveComposition = useCompositionStore((s) => s.saveComposition);
  const resetMealDraft = useMealStore((s) => s.resetDraft);
  const beginFromComposition = useMealStore((s) => s.beginFromComposition);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [manualCarbsVisible, setManualCarbsVisible] = useState(false);
  const [editingManualCarbs, setEditingManualCarbs] = useState<number | null>(null);

  useEffect(() => {
    if (compositionId) {
      void beginEditComposition(compositionId).then((ok) => {
        if (!ok) router.back();
      });
      return () => resetDraft();
    }
    resetDraft();
    return () => resetDraft();
  }, [beginEditComposition, compositionId, resetDraft]);

  useEffect(() => {
    void hydrateSettings();
  }, [hydrateSettings]);

  const totalCarbs = useMemo(
    () => draftItems.reduce((sum, item) => sum + item.carbs, 0),
    [draftItems],
  );

  const closeProductPicker = () => {
    setPickerProduct(null);
    setEditingItemId(null);
  };

  const pickerInitialItem =
    editingItemId != null
      ? (draftItems.find((item) => item.id === editingItemId) ?? null)
      : null;

  const openEditItem = async (item: MealDraftItem) => {
    if (isManualCarbsProductId(item.productId)) {
      setEditingItemId(item.id);
      setEditingManualCarbs(item.carbs);
      setManualCarbsVisible(true);
      return;
    }

    const product = await productRepository.getById(item.productId);
    if (!product) return;
    setEditingItemId(item.id);
    setPickerProduct(product);
  };

  const closeManualCarbsModal = () => {
    setManualCarbsVisible(false);
    setEditingManualCarbs(null);
    setEditingItemId(null);
  };

  const handleManualCarbsConfirm = (carbs: number) => {
    const item: MealDraftItem = {
      id: editingItemId ?? generateId(),
      productId: MANUAL_CARBS_PRODUCT_ID,
      quantity: carbs,
      unitType: 'grams',
      quantityType: 'raw',
      rawEquivalentQuantity: carbs,
      productName: t('meals.manualCarbsLabel'),
      carbsPer100g: 100,
      carbs,
      imageUrl: null,
      unitLabel: 'g',
      productTags: [],
    };

    if (editingItemId) {
      updateDraftItem(editingItemId, item);
    } else {
      addDraftItem(item);
    }
    closeManualCarbsModal();
  };

  const handleSave = async () => {
    if (!draftName.trim()) {
      toast.warning(t('compositions.nameRequired'));
      return;
    }
    if (draftItems.length === 0) {
      toast.warning(t('compositions.noItems'));
      return;
    }

    try {
      await saveComposition();
      toast.success(t(isEditing ? 'compositions.updatedTitle' : 'compositions.addedTitle'));
      router.back();
    } catch {
      toast.error(t('compositions.saveError'));
    }
  };

  const handleCreateMeal = async () => {
    if (!draftName.trim() || draftItems.length === 0) {
      toast.warning(!draftName.trim() ? t('compositions.nameRequired') : t('compositions.noItems'));
      return;
    }

    if (!compositionId) {
      await handleSave();
      return;
    }

    const composition: Composition = {
      id: compositionId,
      name: draftName.trim(),
      createdAt: new Date().toISOString(),
      totalCarbs,
      items: draftItems.map(
        ({
          id,
          productId,
          quantity,
          unitType,
          unitId,
          quantityType,
          rawEquivalentQuantity,
          productName,
          imageUrl,
          carbs,
          unitLabel,
        }) => ({
          id,
          productId,
          quantity,
          unitType,
          unitId,
          quantityType,
          rawEquivalentQuantity,
          productName,
          imageUrl: imageUrl ?? null,
          carbs,
          unitLabel,
        }),
      ),
    };

    resetMealDraft();
    beginFromComposition(composition, { replaceExisting: true });
    router.replace('/meal/create');
  };

  return (
    <View className="flex-1 bg-background">
      <BackgroundGradient />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}>
        <View className="flex-row items-center justify-between">
          <AppButton variant="ghost" onPress={() => router.back()}>
            {t('common.back')}
          </AppButton>
          <AppButton variant="primary" onPress={() => void handleSave()}>
            {t('common.save')}
          </AppButton>
        </View>

        <View className="mt-5 gap-1">
          <Text className="text-foreground text-2xl font-bold">
            {t(isEditing ? 'compositions.editTitle' : 'compositions.createTitle')}
          </Text>
          <Text className="text-muted">
            {t(isEditing ? 'compositions.editSubtitle' : 'compositions.createSubtitle')}
          </Text>
        </View>

        <View className="mt-5 gap-2">
          <Text className="text-foreground text-sm font-medium">{t('compositions.name')}</Text>
          <View className="min-h-12 rounded-2xl border border-field-border bg-field px-3 justify-center">
            <SearchInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder={t('compositions.namePlaceholder')}
              variant="plain"
            />
          </View>
        </View>

        <AppPressable
          className="mt-5 flex-row items-center gap-2 rounded-2xl border border-border bg-surface p-4"
          onPress={() => setSearchVisible(true)}
          accessibilityLabel={t('compositions.searchProduct')}>
          <FaIcon name="magnifying-glass" size={18} />
          <Text className="flex-1 text-muted text-base">{t('compositions.searchProduct')}</Text>
        </AppPressable>

        <AppPressable
          className="mt-3 flex-row items-center gap-2 rounded-2xl border border-border bg-surface p-4"
          onPress={() => {
            setEditingItemId(null);
            setEditingManualCarbs(null);
            setManualCarbsVisible(true);
          }}
          accessibilityLabel={t('meals.addManualCarbs')}>
          <FaIcon name="plus" size={18} />
          <Text className="flex-1 text-muted text-base">{t('meals.addManualCarbs')}</Text>
        </AppPressable>

        <View className="mt-5 rounded-3xl border border-border bg-surface p-4">
          <Text className="text-muted text-sm mb-3">
            {draftItems.length > 0 ? t('compositions.editItemHint') : t('compositions.itemsHint')}
          </Text>
          {draftItems.length === 0 ? (
            <Text className="text-muted text-sm">{t('compositions.noItemsYet')}</Text>
          ) : (
            draftItems.map((item, index) => (
              <View
                key={item.id}
                className={`flex-row items-center justify-between py-2 ${
                  index === draftItems.length - 1 ? '' : 'border-b border-separator'
                }`}>
                <AppPressable
                  className="flex-1 mr-2 py-1 rounded-lg"
                  accessibilityRole="button"
                  accessibilityLabel={t('compositions.editA11y', { name: item.productName })}
                  onPress={() => void openEditItem(item)}>
                  <MealItemConversionLine
                    item={item}
                    product={{ tags: item.productTags, customCookingFactor: null }}
                  />
                </AppPressable>
                <AppPressable onPress={() => removeDraftItem(item.id)} hitSlop={8}>
                  <FaIcon name="xmark" size={18} />
                </AppPressable>
              </View>
            ))
          )}
        </View>

        <Text className="text-accent text-2xl font-bold text-center mt-6">
          {t('compositions.totalCarbs', { value: formatDecimal(totalCarbs) })}
        </Text>

        {isEditing ? (
          <AppButton className="mt-4" variant="tertiary" onPress={() => void handleCreateMeal()}>
            {t('compositions.createMeal')}
          </AppButton>
        ) : null}
      </ScrollView>

      <QuantityPickerModal
        visible={pickerProduct !== null}
        product={pickerProduct}
        initialItem={pickerInitialItem}
        onClose={closeProductPicker}
        onConfirm={(payload) => {
          if (!pickerProduct) return;
          if (editingItemId) {
            const existing = draftItems.find((item) => item.id === editingItemId);
            if (!existing) return;
            updateDraftItem(editingItemId, {
              ...existing,
              productId: pickerProduct.id,
              ...payload,
            });
          } else {
            addDraftItem({
              id: generateId(),
              productId: pickerProduct.id,
              ...payload,
            });
          }
          closeProductPicker();
        }}
      />
      <ManualCarbsModal
        visible={manualCarbsVisible}
        initialCarbs={editingManualCarbs}
        onClose={closeManualCarbsModal}
        onConfirm={handleManualCarbsConfirm}
      />
      <ProductSpotlightSearch
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelect={(product) => setPickerProduct(product)}
      />
    </View>
  );
};
