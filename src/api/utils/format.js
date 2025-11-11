// src/api/utils/format.js
export const fmtMoney = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return '—';
  return n.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
};

export const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('pt-PT');
};
