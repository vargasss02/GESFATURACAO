// src/api/utils/http.js

// 🧮 junta params em querystring (ignora null/undefined/'')
export function buildQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined || v === '') return;
    usp.set(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

// ⚠️ normaliza erros vindos da API GesFaturação
export function handleApiError(err, fallback = 'Erro na comunicação com a API') {
  const msg =
    err?.response?.data?.errors?.message ||
    err?.response?.data?.message ||
    err?.message ||
    fallback;
  const code =
    err?.response?.data?.errors?.code ||
    err?.response?.status ||
    'API_ERROR';

  console.error('❌ API Error:', code, msg);
  const e = new Error(msg);
  e.code = code;
  throw e;
}
