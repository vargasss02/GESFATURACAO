// src/api/tabelas.js
import { api, loadToken } from "./api";

/* ------------------------------
   🟦 COUNTRIES (Países)
-------------------------------- */
export async function getCountries() {
  const token = await loadToken();
  const res = await api.get("/countries", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   🟩 REGIONS (Regiões)
-------------------------------- */
export async function getRegions() {
  const token = await loadToken();
  const res = await api.get("/regions", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   🟨 CITIES (Cidades)
-------------------------------- */
export async function getCities() {
  const token = await loadToken();
  const res = await api.get("/cities", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   💳 PAYMENT METHODS (Métodos de Pagamento)
-------------------------------- */
export async function getPaymentMethods() {
  const token = await loadToken();
  const res = await api.get("/payment-methods", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   📆 PAYMENT TERMS (Condições de Pagamento)
-------------------------------- */
export async function getPaymentTerms() {
  const token = await loadToken();
  const res = await api.get("/payment-terms", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   🧾 TAXES (Taxas de IVA)
-------------------------------- */
export async function getTaxes() {
  const token = await loadToken();
  const res = await api.get("/taxes", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   🔢 SERIES (Series das faturas)
-------------------------------- */
export async function getSeries() {
  const token = await loadToken();
  const res = await api.get("/series", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}

/* ------------------------------
   📦 PRODUCTS (Pesquisa)
-------------------------------- */
export async function searchProducts(text = "") {
  const token = await loadToken();
  if (!text) return [];

  const res = await api.get(`/products/search/${text}`, {
    headers: { Authorization: token },
  });

  return res.data?.data ?? res.data;
}

/* ------------------------------
   🟥 EXEMPTION REASONS (Códigos de isenção)
-------------------------------- */
export async function getExemptionReasons() {
  const token = await loadToken();
  const res = await api.get("/exemption-reasons", {
    headers: { Authorization: token },
  });
  return res.data?.data ?? res.data;
}
