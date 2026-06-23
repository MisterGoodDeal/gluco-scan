import { BlurView } from 'expo-blur';
import { Card, useThemeColor } from 'heroui-native';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaIcon } from '@/components/atoms/FaIcon';
import { useBlurSettings } from '@/hooks/useBlurSettings';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { ProductImage } from '@/components/atoms/ProductImage';
import { SearchInput } from '@/components/atoms/SearchInput';
import { AppPressable } from '@/components/ui/AppPressable';
import { useProductStore } from '@/store/product.store';
import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';
import { textLineClamp } from '@/utils/text';
import { productMatchesQuery } from '@/utils/productSearch';
import { hp, topScreenSpace } from '@/utils/screen';

type ProductSpotlightSearchProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
};

const filterProducts = (products: Product[], query: string): Product[] => {
  const trimmed = query.trim();
  if (!trimmed) return products;
  return products.filter((p) => productMatchesQuery(p, trimmed));
};

export const ProductSpotlightSearch: FC<ProductSpotlightSearchProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation();
  const blur = useBlurSettings();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);
  const insets = useSafeAreaInsets();
  const compactList = useProductStore((s) => s.compactList);
  const toggleCompactList = useProductStore((s) => s.toggleCompactList);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setQuery('');
    setIsLoading(true);
    void productRepository
      .getAll()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, [visible]);

  const results = useMemo(() => filterProducts(products, query), [products, query]);

  const handleSelect = (product: Product) => {
    onSelect(product);
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
              <FlatList
                style={{ flex: 1 }}
                data={results}
                extraData={compactList}
                keyExtractor={(item) => item.id}
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
                ListEmptyComponent={
                  <View className="p-8 items-center">
                    <Card className="p-4">
                      <Text className="text-muted text-base text-center">
                        {query.trim()
                          ? t('meals.searchNoResults')
                          : t('meals.searchEmptyHint')}
                      </Text>
                    </Card>
                  </View>
                }
                renderItem={({ item }) => {
                  const carbsLabel = t('common.carbsPer100g', {
                    value: formatDecimal(item.carbsPer100g),
                  });

                  return (
                    <AppPressable onPress={() => handleSelect(item)}>
                      <Card className={compactList ? 'px-3 py-2' : 'p-4'}>
                        {compactList ? (
                          <View className="flex-row items-center gap-1 min-w-0">
                            <Text
                              className="text-foreground text-base shrink"
                              {...textLineClamp(1)}>
                              {item.name}
                            </Text>
                            <Text className="text-muted text-sm" numberOfLines={1}>
                              {carbsLabel}
                            </Text>
                          </View>
                        ) : (
                          <View className="flex-row items-center gap-2">
                            {item.imageUrl ? <ProductImage uri={item.imageUrl} /> : null}
                            <View className="flex-1 min-w-0">
                              <Text className="text-foreground text-base" {...textLineClamp(2)}>
                                {item.name}
                              </Text>
                              <Text className="text-muted text-sm">
                                {carbsLabel}
                                {item.eans.length > 0 ? ` · ${item.eans.join(', ')}` : ''}
                              </Text>
                            </View>
                          </View>
                        )}
                      </Card>
                    </AppPressable>
                  );
                }}
              />
            )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </BlurView>
    </Modal>
  );
};
