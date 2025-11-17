// src/api/budgets.js
import { api, loadToken } from "./api";
import { generateBudgetSerie, getNextBudgetNumber } from "./budgetHelpers";
import { buildQuery, handleApiError } from "./utils/http";
import { mapBudget, mapBudgetDetail } from "./utils/normalizers";

/* ========================================================
 * LISTAR ORÇAMENTOS
 * ====================================================== */
export async function listBudgets({ page = 1, perPage = 20, search = "" } = {}) {
  try {
    const qs = buildQuery({ rows: perPage, page, search });
    const token = await loadToken();

    const { data } = await api.get(`/budgets${qs}`, {
      headers: { Authorization: token },
    });

    return {
      items: Array.isArray(data?.data)
        ? data.data.map(mapBudget)
        : [],
      pagination:
        data?.pagination ?? { currentPage: 1, lastPage: 1, total: 0 },
    };
  } catch (err) {
    handleApiError(err, "Erro ao obter orçamentos");
  }
}

/* ========================================================
 * DETALHE DO ORÇAMENTO
 * ====================================================== */
export async function getBudgetById(id) {
  try {
    const token = await loadToken();
    const { data } = await api.get(`/budgets/${id}`, {
      headers: { Authorization: token },
    });
    return mapBudgetDetail(data);
  } catch (err) {
    handleApiError(err, "Erro ao obter orçamento");
  }
}

/* ========================================================
 * CRIAR ORÇAMENTO  (x-www-form-urlencoded)
 * ====================================================== */
export async function createBudget(payload = {}) {
  try {
    const token = await loadToken();

    if (!payload.serie) payload.serie = generateBudgetSerie();
    if (!payload.number) payload.number = await getNextBudgetNumber();

    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          body.append(key, JSON.stringify(value));
        } else {
          body.append(key, String(value));
        }
      }
    });

    const res = await api.post("/budgets", body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data?.data ?? res.data;
  } catch (err) {
    handleApiError(err, "Erro ao criar orçamento");
  }
}

/* ========================================================
 * ATUALIZAR ORÇAMENTO
 * ====================================================== */
export async function updateBudget(id, payload = {}) {
  try {
    const token = await loadToken();

    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) body.append(key, JSON.stringify(value));
        else body.append(key, String(value));
      }
    });

    const { data } = await api.put(`/budgets/${id}`, body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return mapBudgetDetail(data);
  } catch (err) {
    handleApiError(err, "Erro ao atualizar orçamento");
  }
}

/* ========================================================
 * APAGAR ORÇAMENTO
 * ====================================================== */
export async function deleteBudget(id) {
  try {
    const token = await loadToken();
    await api.delete(`/budgets/${id}`, {
      headers: { Authorization: token },
    });
    return true;
  } catch (err) {
    handleApiError(err, "Erro ao eliminar orçamento");
  }
}

/* ========================================================
 * ALTERAR ESTADO DO ORÇAMENTO
 * PATCH /budgets/{id}/{action}
 * action: finalize | accept | refuse
 * ====================================================== */
export async function changeBudgetStatus(id, action) {
  try {
    const token = await loadToken();

    const { data } = await api.patch(
      `/budgets/${id}/${action}`,
      {},
      {
        headers: { Authorization: token },
      }
    );

    return data;
  } catch (err) {
    handleApiError(err, "Erro ao alterar estado do orçamento");
  }
}
