// src/api/clients.js
import { api } from './api';
import { buildQuery, handleApiError } from './utils/http';
import { mapClient } from './utils/normalizers';

// 📄 GET /clients → lista paginada
export async function listClients({ page = 1, perPage = 20, search = '' } = {}) {
  try {
    const qs = buildQuery({ page, perPage, search });
    const { data } = await api.get(`/clients${qs}`);
    const items = Array.isArray(data?.data) ? data.data.map(mapClient) : [];
    console.log(`👥 Clientes recebidos: ${items.length}`);
    return {
      items,
      pagination: data?.pagination ?? { currentPage: 1, lastPage: 1, total: 0 },
    };
  } catch (err) {
    handleApiError(err, 'Erro ao obter clientes');
  }
}

// 📄 GET /clients/{id}
export async function getClientById(id) {
  try {
    const { data } = await api.get(`/clients/${id}`);
    return mapClient(data);
  } catch (err) {
    handleApiError(err, 'Erro ao obter cliente');
  }
}

// ➕ POST /clients
export async function createClient(payload) {
  try {
    const { data } = await api.post('/clients', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return mapClient(data);
  } catch (err) {
    handleApiError(err, 'Erro ao criar cliente');
  }
}

// ✏️ PUT /clients/{id}
export async function updateClient(id, payload) {
  try {
    const { data } = await api.put(`/clients/${id}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return mapClient(data);
  } catch (err) {
    handleApiError(err, 'Erro ao atualizar cliente');
  }
}

// 🗑️ DELETE /clients/{id}
export async function deleteClient(id) {
  try {
    await api.delete(`/clients/${id}`);
    return true;
  } catch (err) {
    handleApiError(err, 'Erro ao eliminar cliente');
  }
}
