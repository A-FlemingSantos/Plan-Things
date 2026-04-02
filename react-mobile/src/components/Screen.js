import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function Screen({ children, style }) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: colors.background },
        container: { flex: 1, backgroundColor: 'transparent' },
      }),
    [colors]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}
