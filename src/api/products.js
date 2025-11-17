// src/api/products.js
import { api, loadToken } from "./api";

/* ===================================================
 * LISTAR PRODUTOS — paginação
 * GET /products/{rows}/{page}
 * =================================================== */
export async function listProducts(rows = 50, page = 1) {
  const token = await loadToken();

  try {
    const res = await api.get(`/products/${rows}/${page}`, {
      headers: { Authorization: token },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Erro ao listar produtos:", err.response?.data || err);
    throw new Error("Erro ao listar produtos");
  }
}

/* ===================================================
 * PESQUISA — GET /products/search/{search}
 * =================================================== */
export async function searchProducts(search = "") {
  const token = await loadToken();
  if (!search.trim()) return [];

  try {
    const res = await api.get(
      `/products/search/${encodeURIComponent(search)}`,
      {
        headers: { Authorization: token },
      }
    );

    return res.data?.data ?? res.data ?? [];
  } catch (err) {
    console.error("❌ Erro na pesquisa de produtos:", err.response?.data || err);
    return [];
  }
}

/* ===================================================
 * DETALHE — GET /products/{id}
 * =================================================== */
export async function getProductById(id) {
  const token = await loadToken();

  try {
    const res = await api.get(`/products/${id}`, {
      headers: { Authorization: token },
    });

    return res.data?.data ?? res.data;
  } catch (err) {
    console.error("❌ Erro no detalhe produto:", err.response?.data || err);
    throw new Error("Erro ao carregar produto");
  }
}

/* ===================================================
 * CRIAR PRODUTO — POST /products
 * =================================================== */
export async function createProduct(payload = {}) {
  const token = await loadToken();

  const body = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) body.append(k, String(v));
  });

  try {
    const res = await api.post("/products", body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {
    console.log("❌ ERRO AO CRIAR PRODUTO:", err.response?.data || err);

    throw new Error(
      err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Erro ao criar produto"
    );
  }
}

/* ===================================================
 * EDITAR PRODUTO — PUT /products/{id}
 * =================================================== */
export async function updateProduct(id, payload = {}) {
  const token = await loadToken();

  const body = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) body.append(k, String(v));
  });

  try {
    const res = await api.put(`/products/${id}`, body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Erro ao atualizar produto:", err.response?.data || err);

    throw new Error(
      err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Erro ao atualizar produto"
    );
  }
}

/* ===================================================
 * APAGAR — DELETE /products/{id}
 * =================================================== */
export async function deleteProduct(id) {
  const token = await loadToken();

  try {
    const res = await api.delete(`/products/${id}`, {
      headers: { Authorization: token },
    });

    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Erro ao eliminar produto"
    );
  }
}

/* ===================================================
 * PRÓXIMO CÓDIGO — GET /products/code
 * =================================================== */
export async function getNextProductCode() {
  const token = await loadToken();

  const res = await api.get(`/products/code`, {
    headers: { Authorization: token },
  });

  return res.data?.data ?? res.data;
}
