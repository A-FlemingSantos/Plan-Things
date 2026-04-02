import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

function resolveExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost ||
    null;

  if (!hostUri) return null;
  return hostUri.split(':')[0];
}

function resolveApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const expoHost = resolveExpoHost();
  if (expoHost) return `http://${expoHost}:8080/api/v1`;

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
    return `Sem conexão com o servidor (${baseURL}). Verifique EXPO_PUBLIC_API_URL.`;
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
