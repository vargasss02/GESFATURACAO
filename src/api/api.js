import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

let tokenMemory = null;
let onUnauthorized = null;

const BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ??
  Constants.manifest?.extra?.apiBaseUrl ??
  'https://api.gesfaturacao.pt/api/v1.0.4';

console.log('🌐 API base URL:', BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
});

/** ===== token helpers ===== */
export async function loadToken() {
  if (!tokenMemory) tokenMemory = await AsyncStorage.getItem('token');
  return tokenMemory;
}
export async function setToken(value) {
  tokenMemory = value || null;
  if (value) {
    await AsyncStorage.setItem('token', value);
  } else {
    await AsyncStorage.removeItem('token');
  }
}
export const setAuthToken = setToken; // alias p/ compatibilidade
export function setOnUnauthorized(cb) { onUnauthorized = cb; }

/** ===== interceptors ===== */
api.interceptors.request.use(async (config) => {
  const t = await loadToken();
  if (t) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: t,            // **token cru, sem Bearer**
      Accept: 'application/json',
    };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.errors?.code;
    if (status === 401 || code === 'TOKEN_INVALID' || code === 'TOKEN_MISSING') {
      await setToken(null);
      if (typeof onUnauthorized === 'function') onUnauthorized();
    }
    return Promise.reject(error);
  }
);
