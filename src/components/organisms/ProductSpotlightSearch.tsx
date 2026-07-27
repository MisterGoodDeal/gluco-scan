import { BlurView } from 'expo-blur';
import { Card, useThemeColor } from 'heroui-native';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompositionImageMosaic } from '@/components/atoms/CompositionImageMosaic';
import { FaIcon } from '@/components/atoms/FaIcon';
import { useBlurSettings } from '@/hooks/useBlurSettings';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { ProductImage } from '@/components/atoms/ProductImage';
import { SearchInput } from '@/components/atoms/SearchInput';
import { AppPressable } from '@/components/ui/AppPressable';
import { compositionRepository } from '@/repositories/composition.repository';
import { useProductStore } from '@/store/product.store';
import { productRepository } from '@/repositories/product.repository';
import type { Composition } from '@/types/composition';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';
import { textLineClamp } from '@/utils/text';
import { hp, topScreenSpace } from '@/utils/screen';

type ProductSpotlightSearchProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  includeCompositions?: boolean;
  onSelectComposition?: (composition: Composition) => void;
};

type SearchResultItem =
  | { kind: 'product'; value: Product }
  | { kind: 'composition'; value: Composition };

export const ProductSpotlightSearch: FC<ProductSpotlightSearchProps> = ({
  visible,
  onClose,
  onSelect,
  includeCompositions = false,
  onSelectComposition,
}) => {
  const { t } = useTranslation();
  const blur = useBlurSettings();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);
  const insets = useSafeAreaInsets();
  const compactList = useProductStore((s) => s.compactList);
  const toggleCompactList = useProductStore((s) => s.toggleCompactList);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= 3;

  useEffect(() => {
    if (!visible) return;
    setQuery('');
    setProducts([]);
    setCompositions([]);
    setIsLoading(false);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (!canSearch) {
      setProducts([]);
      setCompositions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    void Promise.all([
      productRepository.search(trimmedQuery),
      includeCompositions ? compositionRepository.search(trimmedQuery) : Promise.resolve([]),
    ])
      .then(([nextProducts, nextCompositions]) => {
        if (cancelled) return;
        setProducts(nextProducts);
        setCompositions(nextCompositions);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [visible, trimmedQuery, canSearch, includeCompositions]);

  const sections = useMemo(
    () =>
      [
        products.length > 0
          ? {
              title: t('tabs.products'),
              data: products.map((product) => ({ kind: 'product' as const, value: product })),
            }
          : null,
        includeCompositions && compositions.length > 0
          ? {
              title: t('tabs.compositions'),
              data: compositions.map((composition) => ({
                kind: 'composition' as const,
                value: composition,
              })),
            }
          : null,
      ].filter(Boolean) as Array<{ title: string; data: SearchResultItem[] }>,
    [products, compositions, includeCompositions, t],
  );

  const handleSelect = (product: Product) => {
    onSelect(product);
    onClose();
  };

  const handleSelectComposition = (composition: Composition) => {
    onSelectComposition?.(composition);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <BlurView
        intensity={blur.intensity}
        tint={blur.tint}
        blurMethod={blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <View className="flex-1 bg-background/75">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={topScreenSpace}>
            <View className="flex-1" style={{ paddingTop: topScreenSpace }}>
              <View className="px-4 pb-2">
                <View className="flex-row items-center gap-2 px-4 min-h-12 rounded-2xl border border-border bg-overlay overflow-hidden">
                <FaIcon name="magnifying-glass" size={20} color={mutedColor} />
                <View className="flex-1">
                  <SearchInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={t('meals.searchSpotlightPlaceholder')}
                    autoFocus
                    flex
                    variant="plain"
                  />
                </View>
                <ButtonIcon
                  onPress={toggleCompactList}
                  accessibilityLabel={
                    compactList ? t('products.compactListOnA11y') : t('products.compactListOffA11y')
                  }
                  accessibilityState={{ selected: compactList }}>
                  <FaIcon
                    name={compactList ? 'grip-lines' : 'list'}
                    size={18}
                    color={compactList ? accentColor : mutedColor}
                  />
                </ButtonIcon>
                <AppPressable onPress={onClose} hitSlop={8}>
                  <Text className="text-accent text-sm">{t('common.cancel')}</Text>
                </AppPressable>
              </View>
            </View>

            {isLoading ? (
              <ActivityIndicator color={accentColor} style={{ marginTop: 24 }} />
            ) : (
              <SectionList
                style={{ flex: 1 }}
                sections={sections}
                extraData={compactList}
                keyExtractor={(item) => `${item.kind}:${item.value.id}`}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingTop: 8,
                  paddingBottom: insets.bottom + 16,
                }}
                ItemSeparatorComponent={() => (
                  <View style={{ height: compactList ? 4 : hp('1.5%') }} />
                )}
                renderSectionHeader={({ section }) => (
                  <Text className="text-muted text-xs font-medium uppercase mt-3 mb-1 px-1">
                    {section.title}
                  </Text>
                )}
                ListEmptyComponent={
                  <View className="p-8 items-center">
                    <Card className="p-4">
                      <Text className="text-muted text-base text-center">
                        {!trimmedQuery || trimmedQuery.length < 3
                          ? t('meals.searchMinCharsHint')
                          : t('meals.searchNoResults')}
                      </Text>
                    </Card>
                  </View>
                }
                renderItem={({ item }) => {
                  if (item.kind === 'composition') {
                    return (
                      <AppPressable onPress={() => handleSelectComposition(item.value)}>
                        <Card className={compactList ? 'px-3 py-2' : 'p-4'}>
                          <View className="flex-row items-center gap-2">
                            {!compactList ? (
                              <CompositionImageMosaic composition={item.value} size={48} />
                            ) : null}
                            <View className="flex-1 min-w-0">
                              <Text
                                className="text-foreground text-base"
                                {...textLineClamp(compactList ? 1 : 2)}>
                                {item.value.name}
                              </Text>
                              <Text className="text-muted text-sm">
                                {t('compositions.totalCarbs', {
                                  value: formatDecimal(item.value.totalCarbs),
                                })}
                                {` · ${t('compositions.itemCount', { count: item.value.items.length })}`}
                              </Text>
                            </View>
                          </View>
                        </Card>
                      </AppPressable>
                    );
                  }

                  const carbsLabel = t('common.carbsPer100g', {
                    value: formatDecimal(item.value.carbsPer100g),
                  });

                  return (
                    <AppPressable onPress={() => handleSelect(item.value)}>
                      <Card className={compactList ? 'px-3 py-2' : 'p-4'}>
                        {compactList ? (
                          <View className="flex-row items-center gap-1 min-w-0">
                            <Text
                              className="text-foreground text-base shrink"
                              {...textLineClamp(1)}>
                              {item.value.name}
                            </Text>
                            <Text className="text-muted text-sm" numberOfLines={1}>
                              {carbsLabel}
                            </Text>
                          </View>
                        ) : (
                          <View className="flex-row items-center gap-2">
                            {item.value.imageUrl ? <ProductImage uri={item.value.imageUrl} /> : null}
                            <View className="flex-1 min-w-0">
                              <Text className="text-foreground text-base" {...textLineClamp(2)}>
                                {item.value.name}
                              </Text>
                              <Text className="text-muted text-sm">
                                {carbsLabel}
                                {item.value.eans.length > 0 ? ` · ${item.value.eans.join(', ')}` : ''}
                              </Text>
                            </View>
                          </View>
                        )}
                      </Card>
                    </AppPressable>
                  );
                }}
                ListFooterComponent={<View style={{ height: 8 }} />}
              />
            )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </BlurView>
    </Modal>
  );
};
