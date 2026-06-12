import { type FC, type ReactNode, useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

import { TutorialOverlay } from '@/components/organisms/TutorialOverlay';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';

type TutorialOverlayLayerProps = {
  children: ReactNode;
};

const TutorialOverlayShell: FC<{ stackKey: number }> = ({ stackKey }) => (
  <View style={styles.shell} pointerEvents="box-none">
    <TutorialOverlay key={stackKey} />
  </View>
);

export const TutorialOverlayLayer: FC<TutorialOverlayLayerProps> = ({ children }) => {
  const status = useTutorialStore((s) => s.status);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const openProductId = useTutorialStore((s) => s.openProductId);
  const [stackKey, setStackKey] = useState(0);

  useEffect(() => {
    if (status !== TutorialStatus.RUNNING) return;

    setStackKey((key) => key + 1);
    const timeout = setTimeout(() => setStackKey((key) => key + 1), 450);
    return () => clearTimeout(timeout);
  }, [status, currentStep, openProductId]);

  const showOverlay = status === TutorialStatus.RUNNING;

  return (
    <>
      {children}
      {showOverlay ? (
        Platform.OS === 'ios' ? (
          <FullWindowOverlay key={stackKey}>
            <TutorialOverlayShell stackKey={stackKey} />
          </FullWindowOverlay>
        ) : (
          <Modal
            visible
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => undefined}>
            <TutorialOverlayShell stackKey={stackKey} />
          </Modal>
        )
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  shell: {
    ...StyleSheet.absoluteFill,
  },
});
