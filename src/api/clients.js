// src/api/clients.js
import { api, loadToken } from "./api";

/**
 * Create client
 * POST /clients
 * The API example expects application/x-www-form-urlencoded
 */
export async function createClient(payload = {}) {
  const token = await loadToken();

  // Convert to URLSearchParams to match application/x-www-form-urlencoded
  const body = new URLSearchParams();
  Object.keys(payload).forEach((k) => {
    // only append non-null/undefined values
    const val = payload[k];
    if (val !== undefined && val !== null) body.append(k, String(val));
  });

  try {
    const res = await api.post("/clients", body.toString(), {
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("🟢 Cliente criado:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao criar cliente:", err.response?.data || err);
    // rethrow an Error with a friendly message, but keep server info on console
    const server = err.response?.data;
    const msg =
      server?.errors?.message ||
      server?.message ||
      server?.error ||
      "Erro ao criar cliente";
    throw new Error(msg);
  }
}

/**
 * Get next internal code
 * GET /clients/code
 */
export async function getNextClientCode() {
  const token = await loadToken();
  try {
    const res = await api.get("/clients/code", {
      headers: { Authorization: token },
    });
    console.log("📌 Next client code:", res.data);
    // API may return number or object — return raw data for caller to handle
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao obter código interno:", err.response?.data || err);
    return null;
  }
}
