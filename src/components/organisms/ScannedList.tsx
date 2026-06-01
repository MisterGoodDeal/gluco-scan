import { router } from 'expo-router';
import { type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { FAB_SIZE, FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { ScannedProductRow } from '@/components/molecules/ScannedProductRow';
import { useScanStore } from '@/store/scanStore';
import { hp } from '@/utils/screen';

type ScannedListProps = {
  blurTarget?: RefObject<View | null>;
  bottomInset?: number;
};

const ListWrapper = styled.View`
  flex: 1;
  position: relative;
`;

const ListContainer = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const Separator = styled.View`
  height: ${hp('2%')}px;
`;

export const ScannedList: FC<ScannedListProps> = ({ blurTarget, bottomInset = 0 }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const scannedItems = useScanStore((state) => state.scannedItems);
  const updateGrams = useScanStore((state) => state.updateGrams);
  const removeItem = useScanStore((state) => state.removeItem);

  const fabBottom = bottomInset + theme.spacing.md;
  const listBottomPadding =
    (bottomInset > 0 ? bottomInset : hp('14%')) + FAB_SIZE + theme.spacing.md * 2;

  return (
    <ListWrapper>
      <ListContainer>
        {scannedItems.length === 0 ? (
          <EmptyContainer style={{ paddingBottom: listBottomPadding }}>
            <GlassPanel blurTarget={blurTarget}>
              <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
                {t('scanner.emptyList')}
              </Text>
            </GlassPanel>
          </EmptyContainer>
        ) : (
          <FlatList
            data={scannedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ScannedProductRow
                item={item}
                blurTarget={blurTarget}
                onGramsChange={updateGrams}
                onRemove={removeItem}
              />
            )}
            ItemSeparatorComponent={Separator}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: listBottomPadding }}
          />
        )}
      </ListContainer>
      <FloatingActionButton
        bottom={fabBottom}
        blurTarget={blurTarget}
        onPress={() => router.push('/products')}
        accessibilityLabel={t('scanner.myProductsA11y')}
        label="☰"
      />
    </ListWrapper>
  );
};
