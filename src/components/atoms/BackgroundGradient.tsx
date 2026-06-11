import { LinearGradient } from 'expo-linear-gradient';
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { useUniwind } from 'uniwind';

const GRADIENTS = {
  dark: ['#060D10', '#0C2A33', '#123E4A'],
  light: ['#EAF7FA', '#DCF0F5', '#F0FAFC'],
} as const;

export const BackgroundGradient: FC = () => {
  const { theme } = useUniwind();
  const colors = theme === 'light' ? GRADIENTS.light : GRADIENTS.dark;

  return (
    <LinearGradient
      colors={[...colors]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.gradient}
    />
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
