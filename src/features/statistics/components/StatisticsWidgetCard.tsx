import { Card, useThemeColor } from 'heroui-native';
import { type FC, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';

type StatisticsEmptyStateProps = {
  title: string;
  description: string;
};

export const StatisticsEmptyState: FC<StatisticsEmptyStateProps> = ({ title, description }) => {
  const mutedColor = useThemeColor('muted');

  return (
    <View className="items-center gap-2 p-6">
      <FaIcon name="utensils" size={32} color={mutedColor} />
      <Text className="text-foreground text-lg font-semibold text-center">{title}</Text>
      <Text className="text-muted text-sm text-center">{description}</Text>
    </View>
  );
};

type StatisticsWidgetCardProps = {
  title: string;
  children: ReactNode;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export const StatisticsWidgetCard: FC<StatisticsWidgetCardProps> = ({
  title,
  children,
  empty = false,
  emptyTitle,
  emptyDescription,
}) => (
  <View className="mb-4">
    <Text className="text-foreground text-lg font-semibold mb-2">{title}</Text>
    <Card className="p-4">
      {empty ? (
        <StatisticsEmptyState
          title={emptyTitle ?? title}
          description={emptyDescription ?? ''}
        />
      ) : (
        children
      )}
    </Card>
  </View>
);
