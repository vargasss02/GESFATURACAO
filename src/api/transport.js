// src/api/transport.js
import { api, loadToken } from "./api";

/**
 * Lista guias de transporte
 * GET /transport-documents  (ou /transport/documents dependendo da tua API)
 * Ajusta a URL se necessário — actualmente uso /transport-documents
 */
export async function listTransportDocuments() {
  const token = await loadToken();
  try {
    const res = await api.get("/transport-documents", {
      headers: { Authorization: token },
    });
    console.log("📦 Guias recebidas:", res.data);
    // Suponho que a API devolve { data: [...] } similar às faturas
    return res.data.data ?? [];
  } catch (err) {
    console.error("❌ Erro ao listar guias:", err.response?.data || err);
    throw new Error("Erro ao carregar guias transporte");
  }
}

/**
 * Criar guia de transporte
 * POST /transport-documents
 * body: object com os campos esperados pela API
 */
export async function createTransportDocument(payload) {
  const token = await loadToken();
  try {
    const res = await api.post("/transport-documents", payload, {
      headers: { Authorization: token },
    });
    console.log("✅ Guia criada:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao criar guia:", err.response?.data || err);
    const message =
      err.response?.data?.errors?.message ||
      err.response?.data?.message ||
      "Erro ao criar guia";
    throw new Error(message);
  }
}

/**
 * Obter por id (opcional)
 */
export async function getTransportDocumentById(id) {
  const token = await loadToken();
  try {
    const res = await api.get(`/transport-documents/${id}`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao obter guia:", err.response?.data || err);
    throw new Error("Erro ao obter guia");
  }
}
