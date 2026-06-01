import { useState } from 'react';

import { estimateBlurHeaderHeight } from '@/components/organisms/BlurScreenHeader';

export const useBlurHeaderInset = (extraRows = 0) => {
  const [headerHeight, setHeaderHeight] = useState(() => estimateBlurHeaderHeight(extraRows));

  return {
    headerHeight,
    onHeaderLayout: setHeaderHeight,
  };
};
