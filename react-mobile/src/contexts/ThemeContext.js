import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeColors, DEFAULT_THEME_MODE } from '../theme/colors';

const ThemeContext = createContext(null);
const KEY = 'planthings_theme';

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(DEFAULT_THEME_MODE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw === 'light' || raw === 'dark') setMode(raw);
      })
      .finally(() => setLoading(false));
  }, []);

  const setTheme = useCallback(async (nextMode) => {
    const normalized = nextMode === 'light' ? 'light' : 'dark';
    await AsyncStorage.setItem(KEY, normalized);
    setMode(normalized);
  }, []);

  const toggleTheme = useCallback(async () => {
    await setTheme(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setTheme]);

  const value = useMemo(() => {
    const colors = getThemeColors(mode);
    return {
      mode,
      isDark: mode === 'dark',
      loading,
      colors,
      setTheme,
      toggleTheme,
    };
  }, [mode, loading, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme fora do provider');
  return ctx;
}
