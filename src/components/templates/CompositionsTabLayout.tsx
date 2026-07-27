import { BlurTargetView } from 'expo-blur';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { FaIcon } from '@/components/atoms/FaIcon';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { CompositionList } from '@/components/organisms/CompositionList';
import { SearchInput } from '@/components/atoms/SearchInput';
import { AppButton } from '@/components/ui/AppButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TUTORIAL_MENUS_LIST_ANCHOR_ID } from '@/constants/tutorial';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useCompositionStore } from '@/store/composition.store';
import { useMealStore } from '@/store/meal.store';
import type { Composition } from '@/types/composition';
import { normalizeForSearch } from '@/utils/text';

export const CompositionsTabLayout: FC = () => {
  const { t } = useTranslation();
  const [mutedColor] = useThemeColor(['muted']);
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(1);
  const hydrate = useCompositionStore((s) => s.hydrate);
  const isLoading = useCompositionStore((s) => s.isLoading);
  const query = useCompositionStore((s) => s.query);
  const compositions = useCompositionStore((s) => s.compositions);
  const setQuery = useCompositionStore((s) => s.setQuery);
  const deleteComposition = useCompositionStore((s) => s.deleteComposition);
  const resetMealDraft = useMealStore((s) => s.resetDraft);
  const beginFromComposition = useMealStore((s) => s.beginFromComposition);
  const [compositionToDelete, setCompositionToDelete] = useState<Composition | null>(null);

  const filteredCompositions = useMemo(() => {
    const trimmed = normalizeForSearch(query.trim());
    if (!trimmed) return compositions;
    return compositions.filter((composition) =>
      normalizeForSearch(composition.name).includes(trimmed),
    );
  }, [compositions, query]);

  const loadCompositions = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  useFocusEffect(
    useCallback(() => {
      void loadCompositions();
    }, [loadCompositions]),
  );

  const handleCreateMeal = useCallback(
    (composition: Composition) => {
      resetMealDraft();
      beginFromComposition(composition, { replaceExisting: true });
      router.push('/meal/create');
    },
    [beginFromComposition, resetMealDraft],
  );

  return (
    <View className="flex-1 bg-background">
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <TutorialAnchor id={TUTORIAL_MENUS_LIST_ANCHOR_ID} style={{ flex: 1 }}>
          <CompositionList
            compositions={filteredCompositions}
            onEdit={(composition) => router.push(`/composition/edit?compositionId=${composition.id}`)}
            onCreateMeal={handleCreateMeal}
            onDelete={setCompositionToDelete}
            refreshing={isLoading}
            onRefresh={() => void loadCompositions()}
            contentInsetTop={headerHeight + 8}
          />
        </TutorialAnchor>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-bold">{t('compositions.title')}</Text>
            <AppButton
              size="sm"
              variant="tertiary"
              onPress={() => router.push('/composition/create')}
              accessibilityLabel={t('compositions.addButton')}>
              {t('compositions.addButton')}
            </AppButton>
          </View>
          <View className="mt-2 flex-row items-center gap-2 min-h-12 rounded-2xl border border-field-border bg-field px-3 overflow-hidden">
            <FaIcon name="magnifying-glass" size={18} color={mutedColor} />
            <SearchInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('compositions.searchPlaceholder')}
              flex
              variant="plain"
            />
          </View>
        </BlurScreenHeader>
      </BlurTargetView>
      <ConfirmDialog
        isOpen={compositionToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCompositionToDelete(null);
        }}
        title={t('compositions.deleteConfirmTitle')}
        description={t('compositions.deleteConfirmMessage')}
        destructive
        onConfirm={() => {
          if (!compositionToDelete) return;
          void deleteComposition(compositionToDelete.id);
          setCompositionToDelete(null);
        }}
      />
    </View>
  );
};
