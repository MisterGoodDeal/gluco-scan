import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { type RefObject, useCallback, useEffect, useRef } from 'react';

export const useBottomSheetModalVisibility = (
  ref: RefObject<BottomSheetModal | null>,
  open: boolean,
) => {
  const isPresentedRef = useRef(false);

  useEffect(() => {
    if (open) {
      isPresentedRef.current = true;
      ref.current?.present();
      return;
    }
    if (!isPresentedRef.current) return;
    isPresentedRef.current = false;
    ref.current?.dismiss();
  }, [open, ref]);

  const markDismissed = useCallback(() => {
    isPresentedRef.current = false;
  }, []);

  return { markDismissed };
};
