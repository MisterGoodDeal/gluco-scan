import { router } from 'expo-router';
import * as Linking from 'expo-linking';

import { setPendingAddProduct } from '@/features/widgets/deepLink/pendingAction';

const ROUTES: Record<string, string> = {
  statistics: '/(tabs)/statistics',
  products: '/(tabs)/products',
  meals: '/(tabs)/meals',
  settings: '/(tabs)/settings',
};

const getRouteKey = (url: string): string => {
  const parsed = Linking.parse(url);
  const host = parsed.hostname ?? '';
  const path = (parsed.path ?? '').replace(/^\//, '');
  return path ? `${host}/${path}` : host;
};

export const handleWidgetDeepLink = (url: string | null): void => {
  if (url == null) return;

  const routeKey = getRouteKey(url);

  if (routeKey === 'meal/create') {
    router.push('/meal/create');
    return;
  }

  if (routeKey === 'products/add') {
    router.push('/(tabs)/products');
    setPendingAddProduct();
    return;
  }

  const host = routeKey.split('/')[0] ?? '';
  const route = ROUTES[host];

  if (route) {
    router.push(route as never);
  }
};

export const subscribeWidgetDeepLinks = (): (() => void) => {
  const handleUrl = ({ url }: { url: string }) => {
    handleWidgetDeepLink(url);
  };

  const subscription = Linking.addEventListener('url', handleUrl);

  void Linking.getInitialURL().then(handleWidgetDeepLink);

  return () => {
    subscription.remove();
  };
};
