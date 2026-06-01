import { useEffect, useState } from 'react';

import { initDatabase } from '@/database/client';

export const useDatabase = () => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setReady(true))
      .catch(setError);
  }, []);

  return { ready, error };
};
