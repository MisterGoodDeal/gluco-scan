import { useThemeColor } from 'heroui-native';
import { type FC, type ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useDatabase } from '@/hooks/useDatabase';

type DatabaseGateProps = {
  children: ReactNode;
};

export const DatabaseGate: FC<DatabaseGateProps> = ({ children }) => {
  const { ready, error } = useDatabase();
  const { t } = useTranslation();
  const accentColor = useThemeColor('accent');

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-danger text-base">{error.message}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={accentColor} size="large" />
        <Text className="text-muted text-sm mt-4">{t('common.loading')}</Text>
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};
