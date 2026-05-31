import { type FC, type RefObject } from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { ScannedProductRow } from '@/components/molecules/ScannedProductRow';
import { useScanStore } from '@/store/scanStore';
import { hp } from '@/utils/screen';

type ScannedListProps = {
  blurTarget?: RefObject<View | null>;
};

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

export const ScannedList: FC<ScannedListProps> = ({ blurTarget }) => {
  const scannedItems = useScanStore((state) => state.scannedItems);
  const updateGrams = useScanStore((state) => state.updateGrams);
  const removeItem = useScanStore((state) => state.removeItem);

  if (scannedItems.length === 0) {
    return (
      <ListContainer>
        <EmptyContainer>
          <GlassPanel blurTarget={blurTarget}>
            <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
              Scannez un produit pour commencer
            </Text>
          </GlassPanel>
        </EmptyContainer>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
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
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </ListContainer>
  );
};
