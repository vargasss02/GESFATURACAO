// src/api/invoices/salesInvoices.js

import { api, loadToken } from "../api";
import { buildQuery, handleApiError } from "../utils/http";
import { mapInvoice, mapInvoiceDetail } from "../utils/normalizers";

/* ========================================================
 * LISTAR FATURAS (GET /sales/invoices)
 * ====================================================== */
export async function listSalesInvoices({ page = 1, perPage = 20, search = "" } = {}) {
  try {
    const token = await loadToken();
    const qs = buildQuery({ rows: perPage, page, search });

    const { data } = await api.get(`/sales/invoices${qs}`, {
      headers: { Authorization: token },
    });

    return {
      items: Array.isArray(data?.data) ? data.data.map(mapInvoice) : [],
      pagination: data?.pagination ?? {},
    };
  } catch (err) {
    handleApiError(err, "Erro ao obter faturas");
  }
}

/* ========================================================
 * DETALHE DA FATURA (GET /sales/invoices/{id})
 * ====================================================== */
export async function getSalesInvoiceById(id) {
  try {
    const token = await loadToken();

    const { data } = await api.get(`/sales/invoices/${id}`, {
      headers: { Authorization: token },
    });

    // A API devolve { data: {...} }
    const dto = data?.data ?? data;

    return mapInvoiceDetail(dto);
  } catch (err) {
    handleApiError(err, "Erro ao obter fatura");
  }
}

/* ========================================================
 * CRIAR FATURA (POST /sales/invoices)
 * Body = x-www-form-urlencoded
 * ====================================================== */
export async function createSalesInvoice(payload = {}) {
  try {
    const token = await loadToken();
    const body = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : String(value)
        );
      }
    });

    const res = await api.post("/sales/invoices", body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data?.data ?? res.data;
  } catch (err) {
    handleApiError(err, "Erro ao criar fatura");
  }
}

/* ========================================================
 * ATUALIZAR FATURA (PUT /sales/invoices/{id})
 * ====================================================== */
export async function updateSalesInvoice(id, payload = {}) {
  try {
    const token = await loadToken();
    const body = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : String(value)
        );
      }
    });

    const { data } = await api.put(`/sales/invoices/${id}`, body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const dto = data?.data ?? data;

    return mapInvoiceDetail(dto);
  } catch (err) {
    handleApiError(err, "Erro ao atualizar fatura");
  }
}

/* ========================================================
 * ELIMINAR FATURA (DELETE /sales/invoices/{id})
 * ====================================================== */
export async function deleteSalesInvoice(id) {
  try {
    const token = await loadToken();

    await api.delete(`/sales/invoices/${id}`, {
      headers: { Authorization: token },
    });

    return true;
  } catch (err) {
    handleApiError(err, "Erro ao eliminar fatura");
  }
}

/* ========================================================
 * ALTERAR ESTADO (PATCH /sales/invoices/{id}/{action})
 * action = finalize | void
 * ====================================================== */
export async function changeSalesInvoiceStatus(id, action) {
  try {
    const token = await loadToken();

    const { data } = await api.patch(
      `/sales/invoices/${id}/${action}`,
      {},
      {
        headers: { Authorization: token },
      }
    );

    return data;
  } catch (err) {
    handleApiError(err, "Erro ao alterar estado da fatura");
  }
}
