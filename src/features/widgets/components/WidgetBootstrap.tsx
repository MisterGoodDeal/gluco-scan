import { useEffect } from 'react';

import { subscribeWidgetDeepLinks } from '@/features/widgets/deepLink/handler';
import { flushWidgetSync } from '@/features/widgets/services/widgetSync.service';
import { useDatabase } from '@/hooks/useDatabase';

export const WidgetBootstrap = () => {
  const { ready } = useDatabase();

  useEffect(() => {
    return subscribeWidgetDeepLinks();
  }, []);

  useEffect(() => {
    if (!ready) return;
    void flushWidgetSync();
  }, [ready]);

  return null;
};
