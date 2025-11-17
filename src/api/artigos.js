import { api, loadToken } from "./api";

/**
 * CRIAR ARTIGO (API ANTIGA)
 * POST /gesfaturacao/artigos/novo
 */
export async function createArtigo(payload = {}) {
  const token = await loadToken();

  const body = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      body.append(key, String(value));
    }
  });

  try {
    const res = await api.post(
      "/gesfaturacao/artigos/novo",
      body.toString(),
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;

  } catch (err) {
    console.log("❌ ERRO AO CRIAR ARTIGO:", err.response?.data || err);
    throw new Error(
      err.response?.data?.errors?.message ||
      err.response?.data?.message ||
      "Erro ao criar artigo"
    );
  }
}

/**
 * EDITAR ARTIGO
 * POST /gesfaturacao/artigos/editar/{id}
 */
export async function updateArtigo(id, payload = {}) {
  const token = await loadToken();

  const body = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      body.append(k, String(v));
    }
  });

  try {
    const res = await api.post(
      `/gesfaturacao/artigos/editar/${id}`,
      body.toString(),
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;

  } catch (err) {
    console.log("❌ ERRO AO EDITAR ARTIGO:", err.response?.data || err);
    throw new Error("Erro ao editar artigo");
  }
}

/**
 * APAGAR ARTIGO
 * POST /gesfaturacao/artigos/apagar/{id}
 */
export async function deleteArtigo(id) {
  const token = await loadToken();

  try {
    const res = await api.post(
      `/gesfaturacao/artigos/apagar/${id}`,
      "",
      { headers: { Authorization: token } }
    );
    return res.data;

  } catch (err) {
    console.log("❌ ERRO AO APAGAR ARTIGO:", err.response?.data || err);
    throw new Error("Não é possível eliminar (artigo em uso?)");
  }
}
