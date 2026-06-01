import { type FC, type ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';

import { TutorialOverlay } from '@/components/organisms/TutorialOverlay';
import { TutorialWelcomeModal } from '@/components/organisms/TutorialWelcomeModal';
import { useTutorialStore } from '@/store/tutorial.store';
import { tutorialMmkv } from '@/utils/tutorialMmkv';

type TutorialHostProps = {
  children: ReactNode;
};

export const TutorialHost: FC<TutorialHostProps> = ({ children }) => {
  const hydrateFlags = useTutorialStore((s) => s.hydrateFlags);
  const cancelTutorial = useTutorialStore((s) => s.cancelTutorial);

  useEffect(() => {
    hydrateFlags();
  }, [hydrateFlags]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' && tutorialMmkv.getIsTutorialRunning()) {
        void cancelTutorial();
      }
    });
    return () => sub.remove();
  }, [cancelTutorial]);

  return (
    <>
      {children}
      <TutorialWelcomeModal />
      <TutorialOverlay />
    </>
  );
};
