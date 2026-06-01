import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { TabBarIcon } from '@/components/atoms/TabBarIcon';

export const unstable_settings = {
  initialRouteName: 'meals/index',
};

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.glass.border,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}>
      <Tabs.Screen
        name="meals/index"
        options={{
          title: t('tabs.meals'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={{ ios: 'fork.knife', android: 'restaurant' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('tabs.products'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name={{ ios: 'shippingbox', android: 'inventory_2' }}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={{ ios: 'gearshape', android: 'settings' }} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
