// src/api/utils/normalizers.js

/** =========================
 *  LISTA DE ORÇAMENTOS
 *  (GET /budgets)
 *  ========================= */
export const mapBudget = (dto = {}) => ({
  id: String(dto.id ?? ''),
  number: dto.number ?? dto.title ?? `#${dto.id ?? '-'}`,
  date: dto.date ?? null,
  expiration: dto.expiration ?? null,
  // na lista algumas APIs devolvem 'total'; no detalhe é 'grossTotal'
  total: Number(dto.total ?? dto.grossTotal ?? 0),
  clientName: dto?.client?.name ?? dto?.name ?? '—',
  statusText:
    dto?.status?.description ??
    dto?.status?.name ??
    (typeof dto?.status === 'string' ? dto.status : '—'),
});

/** =========================
 *  CLIENTE
 *  ========================= */
export const mapClient = (dto = {}) => ({
  id: String(dto.id ?? ''),
  name: dto.name ?? '—',
  vatNumber: dto.vatNumber ?? '—',
  email: dto.email ?? '—',
  address: dto.address ?? '—',
  zipCode: dto.zipCode ?? '—',
  city: dto.city ?? '—',
  region: dto.region ?? '—',
  country: dto.country ?? '—',
  countryCode: dto.countryCode ?? '—',
});

/** =========================
 *  HELPERS
 *  ========================= */
const num = (v, d = 0) => {
  if (v === null || v === undefined || v === '') return d;
  const n = Number(v);
  return Number.isNaN(n) ? d : n;
};

/** =========================
 *  LINHAS DO ORÇAMENTO
 *  (schema /budgets/{id})
 *  ========================= */
export const mapBudgetLine = (dto = {}) => ({
  description:
    dto.article?.name ??
    dto.description ??
    dto.designation ??
    '—',
  quantity: num(dto.quantity, 0),            // vem como string -> número
  unitPrice: num(dto.price, 0),              // vem como string -> número
  percentageDiscount: num(dto.percentageDiscount, 0),
  taxPercent: num(dto.tax?.value, 0),        // string -> número
  total: num(dto.total, 0),                  // string -> número
});

/** =========================
 *  DETALHE DO ORÇAMENTO
 *  (GET /budgets/{id})
 *  ========================= */
export const mapBudgetDetail = (dto = {}) => {
  // dueDate no swagger aparece como "0" (número) — se não vier ISO, usa expiration
  const rawDue = dto.dueDate;
  const dueDate =
    typeof rawDue === 'string' && rawDue.includes('-')
      ? rawDue
      : (dto.expiration ?? null);

  return {
    // base (compatível com a lista)
    id: String(dto.id ?? ''),
    number: String(dto.number ?? dto.title ?? `#${dto.id ?? '-'}`),
    title: dto.title ?? null,
    date: dto.date ?? null,
    expiration: dto.expiration ?? null,
    dueDate,

    // cliente
    client: mapClient(dto.client ?? {}),

    // série e moeda (segundo schema do detalhe)
    series: dto.serie?.value ?? dto.series ?? '—',
    currency: dto.coin?.iso ?? dto.coin?.name ?? 'EUR',
    currencyLabel: dto.coin?.name ?? 'Euro (€)',

    // meta
    reference: dto.reference ?? '—',
    observations: dto.observations ?? '',
    discountPercent: num(dto.discount ?? 0),

    // estado
    statusId: dto?.status?.id ?? null,
    statusText:
      dto?.status?.description ??
      dto?.status?.name ??
      '—',

    // linhas
    lines: Array.isArray(dto.lines) ? dto.lines.map(mapBudgetLine) : [],

    // totais (nomes do schema do detalhe)
    subtotals: {
      subtotalNoVat: num(dto.netTotal ?? 0),       // s/ IVA
      vat: num(dto.taxPayable ?? 0),               // IVA
      discounts: 0,                                // não vem desagregado
      withholding: num(dto.retention ?? 0),        // retenção
      total: num(dto.grossTotal ?? dto.total ?? 0) // total c/ IVA
    },

    remaining: num(dto.remaining ?? 0),
  };
};
