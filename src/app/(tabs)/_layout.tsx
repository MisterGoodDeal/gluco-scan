import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

import { TabBarIcon } from '@/components/atoms/TabBarIcon';
import { TabBarBackground } from '@/components/navigation/TabBarBackground';
import { triggerImpactLight } from '@/utils/haptics';

export const unstable_settings = {
  initialRouteName: 'meals/index',
};

const hapticTabListeners = {
  tabPress: () => {
    triggerImpactLight();
  },
};

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: theme.colors.glass.border,
          elevation: 0,
          ...Platform.select({
            ios: { shadowOpacity: 0 },
            default: {},
          }),
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}>
      <Tabs.Screen
        name="products"
        listeners={hapticTabListeners}
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
        name="meals/index"
        listeners={hapticTabListeners}
        options={{
          title: t('tabs.meals'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={{ ios: 'fork.knife', android: 'restaurant' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        listeners={hapticTabListeners}
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
