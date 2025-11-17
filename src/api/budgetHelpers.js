// src/api/budgetHelpers.js
import { listBudgets } from "./budgets";

/**
 * Gera série automática no formato API_2025
 */
export function generateBudgetSerie() {
  const year = new Date().getFullYear();
  return `API_${year}`;
}

/**
 * Extrai o número final de "OR_API_2025/13" → 13
 */
function extractFinalNumber(str = "") {
  if (!str.includes("/")) return 0;
  const parts = str.split("/");
  const last = Number(parts[parts.length - 1]);
  return isNaN(last) ? 0 : last;
}

/**
 * Obtém o próximo número com base na lista atual
 * Exemplo: OR_API_2025/1 → 2
 */
export async function getNextBudgetNumber() {
  const { items } = await listBudgets({ page: 1, perPage: 200 });

  if (!items?.length) return 1;

  let max = 0;

  items.forEach((b) => {
    const n = extractFinalNumber(b.number);
    if (n > max) max = n;
  });

  return max + 1;
}
