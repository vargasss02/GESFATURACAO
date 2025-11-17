// src/api/clients.js
import { api, loadToken } from "./api";

/* ===================================================
 * LISTAR CLIENTES (1 página)
 * GET /clients/{rows}/{page}
 * =================================================== */
export async function listClients({ rows = 50, page = 1 } = {}) {
  const token = await loadToken();

  try {
    const res = await api.get(`/clients/${rows}/${page}`, {
      headers: { Authorization: token },
    });

    return res.data; // { data, pagination }
  } catch (err) {
    console.error("❌ Erro ao listar clientes:", err.response?.data || err);
    throw new Error("Erro ao listar clientes");
  }
}

/* ===================================================
 * LISTAR TODOS (todas as páginas)
 * =================================================== */
export async function listAllClients() {
  let page = 1;
  const rows = 100;
  let all = [];
  let hasMore = true;

  while (hasMore) {
    const res = await listClients({ rows, page });

    all = [...all, ...(res.data ?? res.items ?? [])];

    if (res.pagination?.currentPage >= res.pagination?.lastPage) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return all;
}

/* ===================================================
 * PESQUISA — GET /clients/search/{search}
 * =================================================== */
export async function searchClients(search = "") {
  const token = await loadToken();
  if (!search.trim()) return [];

  try {
    const res = await api.get(
      `/clients/search/${encodeURIComponent(search)}`,
      {
        headers: { Authorization: token },
      }
    );

    const d = res.data;

    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.items)) return d.items;

    return [];
  } catch (err) {
    console.error("❌ Erro na pesquisa de clientes:", err.response?.data || err);
    return [];
  }
}

/* ===================================================
 * CRIAR CLIENTE — POST /clients
 * =================================================== */
export async function createClient(payload = {}) {
  const token = await loadToken();

  const body = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) body.append(k, String(v));
  });

  try {
    const res = await api.post("/clients", body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {
    const s = err.response?.data;
    const msg =
      s?.errors?.message ||
      s?.message ||
      s?.error ||
      "Erro ao criar cliente";

    throw new Error(msg);
  }
}

/* ===================================================
 * PRÓXIMO CÓDIGO — GET /clients/code
 * =================================================== */
export async function getNextClientCode() {
  const token = await loadToken();

  try {
    const res = await api.get("/clients/code", {
      headers: { Authorization: token },
    });

    return res.data?.data ?? res.data;
  } catch {
    return null;
  }
}

/* ===================================================
 * DETALHE — GET /clients/{id}
 * =================================================== */
export async function getClientById(id) {
  const token = await loadToken();

  try {
    const res = await api.get(`/clients/${id}`, {
      headers: { Authorization: token },
    });

    return res.data?.data ?? res.data;
  } catch (err) {
    console.error("❌ Erro no detalhe cliente:", err.response?.data || err);
    throw new Error("Erro ao carregar detalhe do cliente");
  }
}

/* ===================================================
 * ELIMINAR — DELETE /clients/{id}
 * =================================================== */
export async function deleteClient(id) {
  const token = await loadToken();

  try {
    const res = await api.delete(`/clients/${id}`, {
      headers: { Authorization: token },
    });

    return res.data;
  } catch (err) {
    const s = err.response?.data;
    throw new Error(
      s?.message ||
        s?.error ||
        "Erro ao eliminar cliente"
    );
  }
}
