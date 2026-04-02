import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function resolveApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  return 'http://localhost:8080/api/v1';
}

const baseURL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL,
  timeout: 15000,
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
