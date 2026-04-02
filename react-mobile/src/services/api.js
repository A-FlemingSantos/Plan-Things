import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function normalizeError(error) {
  const fallback = 'Não foi possível completar a operação.';
  if (!error.response) return 'Sem conexão com o servidor.';
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
