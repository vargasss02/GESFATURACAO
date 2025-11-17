// src/api/getProduct.js
import { api } from "./api";
import { handleApiError } from "./utils/http";

export async function getProductDetails(id) {
  try {
    console.log("🔎 GET:", `/products/${id}`);

    const res = await api.get(`/products/${id}`);

    // 👇 A API devolve os dados dentro de "data"
    const produto = res.data?.data;

    if (!produto) {
      throw new Error("Resposta inválida da API");
    }

    console.log("📦 Produto recebido:", produto);
    return produto;

  } catch (err) {
    console.log("❌ Erro API produtos:", err?.response?.data || err);
    handleApiError(err, "Erro ao obter detalhes do produto");
  }
}
