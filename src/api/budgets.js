// src/api/budgets.js
import { api } from './api';
import { buildQuery, handleApiError } from './utils/http';
import { mapBudget, mapBudgetDetail } from './utils/normalizers';

// GET /budgets
export async function listBudgets({ page = 1, perPage = 20, search = '' } = {}) {
  try {
    const qs = buildQuery({ page, perPage, search });
    const { data } = await api.get(`/budgets${qs}`);
    return {
      items: Array.isArray(data?.data) ? data.data.map(mapBudget) : [],
      pagination: data?.pagination ?? { currentPage: 1, lastPage: 1, total: 0 },
    };
  } catch (err) {
    handleApiError(err, 'Erro ao obter orçamentos');
  }
}

// GET /budgets/{id}
export async function getBudgetById(id) {
  try {
    const { data } = await api.get(`/budgets/${id}`);
    return mapBudgetDetail(data);
  } catch (err) {
    handleApiError(err, 'Erro ao obter orçamento');
  }
}

/**
 * POST /budgets
 * Exemplo mínimo de payload (ajusta aos campos do teu Swagger real):
 * {
 *   "client": { "id": 938 },
 *   "date": "2025-11-03",
 *   "expiration": "2025-11-10",
 *   "reference": "",
 *   "observations": "",
 *   "lines": [
 *     { "article": { "id": 123 }, "quantity": 1, "price": 10.5, "tax": { "id": 1 } }
 *   ]
 * }
 */
export async function createBudget(payload) {
  try {
    const { data } = await api.post('/budgets', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    // a API normalmente responde com o objeto criado (detalhe)
    return mapBudgetDetail(data);
  } catch (err) {
    handleApiError(err, 'Erro ao criar orçamento');
  }
}

// PUT /budgets/{id}
export async function updateBudget(id, payload) {
  try {
    const { data } = await api.put(`/budgets/${id}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return mapBudgetDetail(data);
  } catch (err) {
    handleApiError(err, 'Erro ao atualizar orçamento');
  }
}

// DELETE /budgets/{id}
export async function deleteBudget(id) {
  try {
    await api.delete(`/budgets/${id}`);
    return true;
  } catch (err) {
    handleApiError(err, 'Erro ao eliminar orçamento');
  }
}

// POST /budgets/{id}/finalize  (ou /close /confirm — ajusta ao swagger real)
export async function finalizeBudget(id) {
  try {
    const { data } = await api.post(`/budgets/${id}/finalize`, {}, {
      headers: { 'Content-Type': 'application/json' },
    });
    return mapBudgetDetail(data);
  } catch (err) {
    handleApiError(err, 'Erro ao finalizar orçamento');
  }
}

// POST /budgets/{id}/email   (enviar por e-mail)
export async function emailBudget(id, { to, subject, message } = {}) {
  try {
    const body = { to, subject, message };
    const { data } = await api.post(`/budgets/${id}/email`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data; // resposta simples (ex.: { sent: true })
  } catch (err) {
    handleApiError(err, 'Erro ao enviar orçamento por e-mail');
  }
}

// GET /budgets/{id}/export (PDF) — devolve ArrayBuffer
export async function exportBudgetPdf(id) {
  try {
    const res = await api.get(`/budgets/${id}/export`, {
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf' },
    });
    return res.data; // ArrayBuffer
  } catch (err) {
    handleApiError(err, 'Erro ao exportar orçamento');
  }
}
