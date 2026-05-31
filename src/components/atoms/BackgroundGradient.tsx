import { LinearGradient } from 'expo-linear-gradient';
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

export const BackgroundGradient: FC = () => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[...theme.colors.backgroundGradient]}
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
