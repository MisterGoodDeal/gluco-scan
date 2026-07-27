import { Tabs } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '@/components/atoms/TabBarIcon';
import { TabBarBackground } from '@/components/navigation/TabBarBackground';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/tabBar';
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
  const insets = useSafeAreaInsets();
  const [accentColor, mutedColor, borderColor] = useThemeColor(['accent', 'muted', 'border']);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => <TabBarBackground />,
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
          paddingTop: 2,
          paddingBottom: insets.bottom,
          backgroundColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: borderColor,
          elevation: 0,
          ...Platform.select({
            ios: { shadowOpacity: 0 },
            default: {},
          }),
        },
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: mutedColor,
      }}>
      <Tabs.Screen
        name="products"
        listeners={hapticTabListeners}
        options={{
          title: t('tabs.products'),
          tabBarIcon: ({ color }) => <TabBarIcon name="basket-shopping" color={color} />,
        }}
      />
      <Tabs.Screen
        name="compositions"
        listeners={hapticTabListeners}
        options={{
          title: t('tabs.compositions'),
          tabBarIcon: ({ color }) => <TabBarIcon name="hamburger" color={color} />,
        }}
      />
      <Tabs.Screen
        name="meals/index"
        listeners={hapticTabListeners}
        options={{
          title: t('tabs.meals'),
          tabBarIcon: ({ color }) => <TabBarIcon name="utensils" color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        listeners={hapticTabListeners}
        options={{
          title: t('tabs.statistics'),
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-line" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        listeners={hapticTabListeners}
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
};
