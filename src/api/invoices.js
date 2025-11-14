// src/api/invoices.js
import { api, loadToken } from "./api";

/**
 * Lista todas as faturas
 * GET /sales/invoices
 */
export async function listInvoices() {
  const token = await loadToken();
  try {
    const res = await api.get("/sales/invoices", {
      headers: { Authorization: token },
    });
    // A API retorna { data: [...], pagination: {...} }
    console.log("📦 Faturas recebidas:", res.data);
    return {
      items: res.data.data ?? [],
      pagination: res.data.pagination ?? { currentPage: 1, lastPage: 1 },
    };
  } catch (err) {
    console.error("❌ Erro ao listar faturas:", err.response?.data || err);
    throw err;
  }
}

/**
 * Obter fatura por ID
 * GET /sales/invoices/{id}
 */
export async function getInvoiceById(id) {
  const token = await loadToken();
  try {
    const res = await api.get(`/sales/invoices/${id}`, {
      headers: { Authorization: token },
    });
    console.log("📄 Fatura por ID:", res.data);
    // A API parece devolver o objecto diretamente ou dentro de data — adaptar conforme resposta
    return res.data.data ?? res.data;
  } catch (err) {
    console.error("❌ Erro ao obter fatura:", err.response?.data || err);
    throw err;
  }
}

/**
 * Criar fatura
 * POST /sales/invoices
 *
 * payload: object conforme documentação (ex.: clientId, series, date, lines: [{description, qty, price, taxPercent}])
 */
export async function createInvoice(payload) {
  const token = await loadToken();
  try {
    const res = await api.post("/sales/invoices", payload, {
      headers: { Authorization: token, "Content-Type": "application/json" },
    });
    console.log("✅ Fatura criada:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao criar fatura:", err.response?.data || err);
    throw err;
  }
}
