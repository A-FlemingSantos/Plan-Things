export const darkColors = {
  background: '#0b1120', // azul profundo / preto azulado
  surface: 'rgba(255, 255, 255, 0.035)', // opacidade
  surfaceSoft: 'rgba(255, 255, 255, 0.06)',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  text: '#f8fafc',
  muted: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.15)',
  glassBackground: 'rgba(11, 17, 32, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  success: '#10b981',
  danger: '#f43f5e',
  shadow: 'rgba(0,0,0,0.5)',
};

export const lightColors = {
  background: '#f8fafc', // ardósia claro
  surface: '#ffffff',
  surfaceSoft: '#f1f5f9',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  text: '#0f172a',
  muted: '#64748b',
  border: 'rgba(0, 0, 0, 0.1)',
  glassBackground: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(0, 0, 0, 0.1)',
  success: '#10b981',
  danger: '#f43f5e',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const DEFAULT_THEME_MODE = 'dark';

export function getThemeColors(mode) {
  return mode === 'light' ? lightColors : darkColors;
}

// Backward-compat: código antigo importava `colors`.
export const colors = darkColors;
