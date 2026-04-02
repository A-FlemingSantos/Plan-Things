import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function Card({ children, style }) {
  const { colors, isDark } = useTheme();
  
  const styles = useMemo(
    () =>
      StyleSheet.create({
        fullCard: {
          backgroundColor: isDark ? colors.surface : colors.surface,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: isDark ? colors.glassBorder : colors.glassBorder,
          padding: 20,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: isDark ? 0.4 : 0.08,
          shadowRadius: 24,
          elevation: isDark ? 10 : 8,
          overflow: 'hidden', // to keep inner border crisp
        },
      }),
    [colors, isDark]
  );
  return <View style={[styles.fullCard, style]}>{children}</View>;
}
