// src/api/auth.js
import qs from 'qs';
import { api, setToken } from './api';

// 🔐 Login e guardar token
export async function login(username, password) {
  try {
    const body = qs.stringify({ username, password });
    const { data } = await api.post('/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = data?._token || data?.token;
    if (!token) throw new Error('Token não encontrado na resposta.');

    await setToken(token);   // guarda memória + AsyncStorage
    return token;
  } catch (err) {
    const msg =
      err?.response?.data?.errors?.map?.((e) => e.message).join('\n') ||
      err?.response?.data?.message ||
      err?.message ||
      'Erro no login';
    throw new Error(msg);
  }
}

// ✅ validar token (a API espera Authorization: <token cru>)
export async function validateToken(token) {
  try {
    const { data } = await api.post(
      '/validate-token',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // **sem Bearer**
        },
      }
    );
    return data; // { _token: "..." }
  } catch (err) {
    const msg =
      err?.response?.data?.errors?.message ||
      err?.response?.data?.message ||
      'Token inválido';
    throw new Error(msg);
  }
}

// 🚪 logout
export async function logout() {
  await setToken(null);
}
