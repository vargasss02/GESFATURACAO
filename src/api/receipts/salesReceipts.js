// src/api/receipts/salesReceipts.js

import { api, loadToken } from "../api";
import { buildQuery, handleApiError } from "../utils/http";
import { mapInvoice, mapInvoiceDetail } from "../utils/normalizers";

/* ========================================================
 * LISTA DE RECIBOS (SALES)
 * GET /sales/receipts
 * ====================================================== */
export async function listSalesReceipts({
  page = 1,
  perPage = 20,
  search = "",
} = {}) {
  try {
    const qs = buildQuery({ rows: perPage, page, search });
    const token = await loadToken();

    const { data } = await api.get(`/sales/receipts${qs}`, {
      headers: { Authorization: token },
    });

    return {
      items: Array.isArray(data?.data)
        ? data.data.map(mapInvoice) // usa o mesmo mapeador das invoices
        : [],
      pagination: data?.pagination ?? {
        currentPage: 1,
        lastPage: 1,
        total: 0,
      },
    };
  } catch (err) {
    handleApiError(err, "Erro ao obter recibos");
  }
}

/* ========================================================
 * DETALHE DO RECIBO (SALES)
 * GET /sales/receipts/{id}
 * ====================================================== */
export async function getSalesReceiptById(id) {
  try {
    const token = await loadToken();

    const { data } = await api.get(`/sales/receipts/${id}`, {
      headers: { Authorization: token },
    });

    const dto = data?.data ?? data;
    return mapInvoiceDetail(dto);
  } catch (err) {
    handleApiError(err, "Erro ao obter detalhe do recibo");
  }
}

/* ========================================================
 * ANULAR RECIBO
 * PATCH /sales/receipts/{id}/{action}
 * action: void
 * ====================================================== */
export async function changeSalesReceiptStatus(id, action) {
  try {
    const token = await loadToken();

    const { data } = await api.patch(
      `/sales/receipts/${id}/${action}`,
      {},
      { headers: { Authorization: token } }
    );

    return data;
  } catch (err) {
    handleApiError(err, "Erro ao alterar estado do recibo");
  }
}
