import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { ProductImage } from '@/components/atoms/ProductImage';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { useProductStore } from '@/store/product.store';
import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';
import { productMatchesQuery } from '@/utils/productSearch';
import { topScreenSpace } from '@/utils/screen';

type ProductSpotlightSearchProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
};

const Overlay = styled.View`
  flex: 1;
  padding-top: ${topScreenSpace}px;
`;

const SearchBarWrap = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const SearchRow = styled(GlassPanel)`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const ResultRow = styled.Pressable<{ $compact?: boolean }>`
  padding: ${({ theme, $compact }) =>
    $compact ? theme.spacing.sm : theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const CompactResultLine = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const DetailedResultLine = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const DetailedResultInfo = styled.View`
  flex: 1;
  min-width: 0;
`;

const EmptyWrap = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

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
  const theme = useTheme();
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
        intensity={80}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={topScreenSpace}>
          <Overlay>
            <SearchBarWrap>
            <SearchRow>
              <SymbolView
                name="magnifyingglass"
                size={20}
                tintColor={theme.colors.textSecondary}
              />
              <View style={{ flex: 1 }}>
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
                <SymbolView
                  name={{
                    ios: compactList ? 'rectangle.expand.vertical' : 'rectangle.compress.vertical',
                    android: compactList ? 'view_agenda' : 'view_compact',
                  }}
                  size={18}
                  tintColor={compactList ? theme.colors.accent : theme.colors.textSecondary}
                />
              </ButtonIcon>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text $variant="caption" $color="accent">
                  {t('common.cancel')}
                </Text>
              </Pressable>
            </SearchRow>
          </SearchBarWrap>

          {isLoading ? (
            <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 24 }} />
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
                paddingHorizontal: theme.spacing.md,
                paddingBottom: insets.bottom + theme.spacing.md,
              }}
              ListEmptyComponent={
                <EmptyWrap>
                  <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
                    {query.trim()
                      ? t('meals.searchNoResults')
                      : t('meals.searchEmptyHint')}
                  </Text>
                </EmptyWrap>
              }
              renderItem={({ item }) => {
                const carbsLabel = t('common.carbsPer100g', {
                  value: formatDecimal(item.carbsPer100g),
                });

                return (
                  <ResultRow $compact={compactList} onPress={() => handleSelect(item)}>
                    {compactList ? (
                      <CompactResultLine>
                        <Text $variant="body" numberOfLines={1} style={{ flexShrink: 1 }}>
                          {item.name}
                        </Text>
                        <Text $variant="caption" $color="textSecondary" numberOfLines={1}>
                          {carbsLabel}
                        </Text>
                      </CompactResultLine>
                    ) : (
                      <DetailedResultLine>
                        {item.imageUrl ? <ProductImage uri={item.imageUrl} /> : null}
                        <DetailedResultInfo>
                          <Text $variant="body">{item.name}</Text>
                          <Text $variant="caption" $color="textSecondary">
                            {carbsLabel}
                            {item.eans.length > 0 ? ` · ${item.eans.join(', ')}` : ''}
                          </Text>
                        </DetailedResultInfo>
                      </DetailedResultLine>
                    )}
                  </ResultRow>
                );
              }}
            />
          )}
          </Overlay>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};
