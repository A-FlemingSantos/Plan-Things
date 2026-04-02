import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function normalizeApiBaseUrl(input) {
  if (!input) return null;

  const raw = String(input).trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const path = (url.pathname || '').trim();

    // Se vier só o host (com ou sem '/'), assume o prefixo padrão da API.
    if (path === '' || path === '/') {
      url.pathname = '/api/v1';
    }

    // Remove barra final para evitar "//" ao concatenar rotas.
    url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    // Fallback simples para strings não parseáveis via URL().
    return raw.replace(/\/+$/, '');
  }
}

function resolveApiBaseUrl() {
  const fromEnv = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_URL);
  if (fromEnv) return fromEnv;
  return 'http://localhost:8080/api/v1';
}

const baseURL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export function normalizeError(error) {
  const fallback = 'Não foi possível completar a operação.';
  if (!error.response) {
    return `Sem conexão com o servidor (${baseURL}). Defina EXPO_PUBLIC_API_URL no arquivo .env.`;
  }
  return error.response.data?.message || error.response.data?.error || fallback;
}

export async function clearSession() {
  await AsyncStorage.removeItem('planthings_session');
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearSession();
    }
    return Promise.reject(error);
  }
);
