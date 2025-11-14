// src/api/transportGuides.js
import { api, loadToken } from "./api";

/**
 * LISTAR TODAS AS GUIAS
 * GET /transport-guides
 */
export async function listTransportGuides() {
  const token = await loadToken();

  try {
    const res = await api.get("/transport-guides", {
      headers: { Authorization: token },
    });

    console.log("📦 Guias recebidas:", res.data);

    return {
      items: res.data.data ?? [],
      pagination: res.data.pagination ?? {},
    };
  } catch (err) {
    console.error("❌ Erro ao listar guias:", err.response?.data || err);
    throw new Error("Erro ao carregar guias transporte");
  }
}

/**
 * OBTER GUIA POR ID
 * GET /transport-guides/{id}
 */
export async function getTransportGuideById(id) {
  const token = await loadToken();

  try {
    const res = await api.get(`/transport-guides/${id}`, {
      headers: { Authorization: token },
    });

    console.log("📄 Guia por ID:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao obter guia:", err.response?.data || err);
    throw new Error("Erro ao obter guia transporte");
  }
}

/**
 * CRIAR GUIA
 * POST /transport-guides
 */
export async function createTransportGuide(payload) {
  const token = await loadToken();

  try {
    const res = await api.post("/transport-guides", payload, {
      headers: { Authorization: token },
    });

    console.log("🟢 Guia criada:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao criar guia:", err.response?.data || err);
    throw new Error("Erro ao criar guia transporte");
  }
}
