import { type FC, type ReactNode, useEffect, useRef } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { registerTutorialAnchor } from '@/utils/tutorialAnchors';

type TutorialAnchorProps = {
  id: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const TutorialAnchor: FC<TutorialAnchorProps> = ({ id, children, style }) => {
  const ref = useRef<View>(null);

  useEffect(() => () => registerTutorialAnchor(id, null), [id]);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={style}
      onLayout={() => registerTutorialAnchor(id, ref.current)}>
      {children}
    </View>
  );
};
