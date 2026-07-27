import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheet, Switch, useThemeColor } from 'heroui-native';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaIcon } from '@/components/atoms/FaIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { OffSearchResultRow } from '@/components/molecules/OffSearchResultRow';
import { AppButton } from '@/components/ui/AppButton';
import { useOffProductSearch } from '@/hooks/useOffProductSearch';
import type { OffSearchHit } from '@/services/openFoodFacts.service';
import { hp } from '@/utils/screen';

type ProductOffSearchSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (hit: OffSearchHit) => void;
  isSelecting?: boolean;
};

export const ProductOffSearchSheet: FC<ProductOffSearchSheetProps> = ({
  visible,
  onClose,
  onSelect,
  isSelecting = false,
}) => {
  const { t } = useTranslation();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);
  const insets = useSafeAreaInsets();

  const {
    query,
    setQuery,
    filteredHits,
    isLoading,
    isLoadingMore,
    error,
    showWithoutCarbs,
    toggleShowWithoutCarbs,
    loadMore,
    canSearch,
    clearQuery,
    resetSearch,
  } = useOffProductSearch({ enabled: visible });

  useEffect(() => {
    if (!visible) {
      clearQuery();
      resetSearch();
    }
  }, [visible, clearQuery, resetSearch]);

  const emptyMessage = !canSearch
    ? t('products.searchOffHint')
    : error ?? t('products.searchOffNoResults');

  return (
    <BottomSheet
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open && !isSelecting) onClose();
      }}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['90%']}
          enableOverDrag={false}
          enableDynamicSizing={false}
          enablePanDownToClose={!isSelecting}
          contentContainerClassName="h-full"
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize">
          <View className="flex-1 px-4">
            <View className="flex-row items-center justify-between py-4 border-b border-separator">
              <Text className="text-foreground text-lg font-semibold flex-1 pr-2">
                {t('products.searchOffTitle')}
              </Text>
              <AppButton
                variant="tertiary"
                size="sm"
                onPress={onClose}
                isDisabled={isSelecting}>
                {t('common.cancel')}
              </AppButton>
            </View>

            <View className="mt-3 flex-row items-center gap-2 min-h-12 rounded-2xl border border-field-border bg-field px-3">
              <FaIcon name="magnifying-glass" size={18} color={mutedColor} />
              <SearchInput
                value={query}
                onChangeText={setQuery}
                placeholder={t('products.searchOffPlaceholder')}
                autoFocus
                flex
                variant="plain"
              />
            </View>

            <View className="mt-3 flex-row items-center justify-between gap-3 pb-2">
              <Text className="text-muted text-sm flex-1">
                {t('products.searchOffShowWithoutCarbs')}
              </Text>
              <Switch
                isSelected={showWithoutCarbs}
                onSelectedChange={toggleShowWithoutCarbs}
              />
            </View>

            {isSelecting ? (
              <View className="flex-1 min-h-0 items-center justify-center gap-2">
                <ActivityIndicator color={accentColor} />
                <Text className="text-muted text-sm">{t('products.searchOffAdding')}</Text>
              </View>
            ) : isLoading && filteredHits.length === 0 ? (
              <View className="flex-1 min-h-0 items-center justify-center">
                <ActivityIndicator color={accentColor} />
              </View>
            ) : (
              <View className="flex-1 min-h-0">
                <BottomSheetFlatList
                  style={{ flex: 1 }}
                  data={filteredHits}
                  keyExtractor={(item) => item.code}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    paddingTop: 8,
                    paddingBottom: insets.bottom + 24,
                    flexGrow: filteredHits.length === 0 ? 1 : undefined,
                  }}
                  ItemSeparatorComponent={() => <View style={{ height: hp('1.5%') }} />}
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.4}
                  ListEmptyComponent={
                    <View className="flex-1 items-center justify-center p-8">
                      <Text
                        className={`text-base text-center ${
                          error ? 'text-warning' : 'text-muted'
                        }`}>
                        {emptyMessage}
                      </Text>
                    </View>
                  }
                  ListFooterComponent={
                    isLoadingMore ? (
                      <ActivityIndicator
                        color={accentColor}
                        style={{ marginVertical: 16 }}
                      />
                    ) : null
                  }
                  renderItem={({ item }) => (
                    <OffSearchResultRow hit={item} onPress={onSelect} />
                  )}
                />
              </View>
            )}
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
