import { Card, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { CompositionRow } from '@/components/molecules/CompositionRow';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import type { Composition } from '@/types/composition';
import { hp } from '@/utils/screen';

type CompositionListProps = {
  compositions: Composition[];
  onEdit: (composition: Composition) => void;
  onCreateMeal: (composition: Composition) => void;
  onDelete: (composition: Composition) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentInsetTop?: number;
};

export const CompositionList: FC<CompositionListProps> = ({
  compositions,
  onEdit,
  onCreateMeal,
  onDelete,
  refreshing = false,
  onRefresh,
  contentInsetTop = 0,
}) => {
  const { t } = useTranslation();
  const [accentColor, backgroundColor] = useThemeColor(['accent', 'background']);
  const tabBarInset = useTabBarBottomInset();

  const refreshControl =
    onRefresh != null ? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={accentColor}
        colors={[accentColor]}
        progressBackgroundColor={backgroundColor}
      />
    ) : undefined;

  return (
    <View className="flex-1 px-4">
      <FlatList
        data={compositions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CompositionRow
            composition={item}
            onEdit={onEdit}
            onCreateMeal={onCreateMeal}
            onDelete={onDelete}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: hp('1.5%') }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          compositions.length === 0
            ? { flexGrow: 1, paddingTop: contentInsetTop }
            : { paddingTop: contentInsetTop, paddingBottom: tabBarInset }
        }
        refreshControl={refreshControl}
        ListEmptyComponent={
          <View
            className="grow items-center justify-center p-8"
            style={{ minHeight: hp('30%') }}>
            <Card className="p-4">
              <Text className="text-muted text-base text-center">
                {t('compositions.emptyList')}
              </Text>
            </Card>
          </View>
        }
      />
    </View>
  );
};
