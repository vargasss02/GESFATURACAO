// src/api/utils/normalizers.js

/* =====================================================
 * HELPERS
 * ===================================================== */
const num = (v, d = 0) => {
  if (v === null || v === undefined || v === "") return d;
  const n = Number(v);
  return Number.isNaN(n) ? d : n;
};

/* =====================================================
 * CLIENTE
 * ===================================================== */
export const mapClient = (dto = {}) => ({
  id: String(dto.id ?? ""),
  name: dto.name ?? "—",
  vatNumber: dto.vatNumber ?? "—",
  email: dto.email ?? "—",
  address: dto.address ?? "—",
  zipCode: dto.zipCode ?? "—",
  city: dto.city ?? "—",
  region: dto.region ?? "—",
  country: dto.country ?? "—",
  countryCode: dto.countryCode ?? "—",
});

/* =====================================================
 * LISTA DE ORÇAMENTOS
 * ===================================================== */
export const mapBudget = (dto = {}) => ({
  id: String(dto.id ?? ""),
  number: dto.number ?? dto.title ?? `#${dto.id ?? "-"}`,
  date: dto.date ?? null,
  expiration: dto.expiration ?? null,
  total: num(dto.total ?? dto.grossTotal ?? 0),
  clientName: dto?.client?.name ?? dto?.name ?? "—",
  statusText:
    dto?.status?.description ??
    dto?.status?.name ??
    (typeof dto?.status === "string" ? dto.status : "—"),
});

/* =====================================================
 * LINHAS DE ORÇAMENTO
 * ===================================================== */
export const mapBudgetLine = (dto = {}) => ({
  description:
    dto.article?.name ??
    dto.description ??
    dto.designation ??
    "—",
  quantity: num(dto.quantity, 0),
  unitPrice: num(dto.price, 0),
  percentageDiscount: num(dto.percentageDiscount, 0),
  taxPercent: num(dto.tax?.value, 0),
  total: num(dto.total, 0),
});

/* =====================================================
 * DETALHE DO ORÇAMENTO
 * ===================================================== */
export const mapBudgetDetail = (dto = {}) => {
  const rawDue = dto.dueDate;
  const dueDate =
    typeof rawDue === "string" && rawDue.includes("-")
      ? rawDue
      : dto.expiration ?? null;

  return {
    id: String(dto.id ?? ""),
    number: String(dto.number ?? dto.title ?? `#${dto.id ?? "-"}`),
    title: dto.title ?? null,

    date: dto.date ?? null,
    expiration: dto.expiration ?? null,
    dueDate,

    client: mapClient(dto.client ?? {}),

    series: dto.serie?.value ?? dto.series ?? "—",

    currency: dto.coin?.iso ?? dto.coin?.name ?? "EUR",
    currencyLabel: dto.coin?.name ?? "Euro (€)",

    reference: dto.reference ?? "—",
    observations: dto.observations ?? "",
    discountPercent: num(dto.discount ?? 0),

    statusId: dto?.status?.id ?? null,
    statusText:
      dto?.status?.description ??
      dto?.status?.name ??
      "—",

    lines: Array.isArray(dto.lines)
      ? dto.lines.map(mapBudgetLine)
      : [],

    subtotals: {
      subtotalNoVat: num(dto.netTotal ?? 0),
      vat: num(dto.taxPayable ?? 0),
      discounts: 0,
      withholding: num(dto.retention ?? 0),
      total: num(dto.grossTotal ?? dto.total ?? 0),
    },

    remaining: num(dto.remaining ?? 0),
  };
};

/* =====================================================
 * LISTA DE INVOICES
 * ===================================================== */
export const mapInvoice = (dto = {}) => ({
  id: String(dto.id ?? ""),
  number: dto.number ?? `#${dto.id ?? "-"}`,
  date: dto.date ?? null,
  expiration: dto.expiration ?? null,

  total: num(dto.total ?? dto.grossTotal ?? 0),
  balance: num(dto.balance ?? dto.remaining ?? 0),

  clientName: dto?.client?.name ?? "—",

  statusText:
    dto?.status?.description ??
    dto?.status?.name ??
    (typeof dto?.status === "string" ? dto.status : "—"),
});

/* =====================================================
 * LINHAS DE INVOICE
 * ===================================================== */
export const mapInvoiceLine = (dto = {}) => ({
  index: dto.index ?? 0,

  description:
    dto.article?.name ??
    dto.description ??
    dto.designation ??
    "—",

  quantity: num(dto.quantity ?? dto.qty ?? 0),
  unitPrice: num(dto.price ?? dto.unitPrice ?? 0),

  percentageDiscount: num(dto.percentageDiscount ?? 0),

  taxPercent: num(dto.tax?.value ?? 0),
  taxId: dto.tax?.id ?? null,

  retention: num(dto.retention ?? 0),
  total: num(dto.total ?? 0),
});

/* =====================================================
 * DETALHE DE INVOICE
 * ===================================================== */
export const mapInvoiceDetail = (dto = {}) => ({
  id: String(dto.id ?? ""),
  number: dto.number ?? `#${dto.id ?? "-"}`,

  date: dto.date ?? null,
  expiration: dto.expiration ?? null,
  dueDate: dto.dueDate ?? dto.expiration ?? null,

  client: mapClient(dto.client ?? {}),

  serie: dto.serie ?? null,
  coin: dto.coin ?? null,

  reference: dto.reference ?? "",
  observations: dto.observations ?? "",
  discount: num(dto.discount ?? 0),

  status: dto.status ?? null,

  lines: Array.isArray(dto.lines)
    ? dto.lines.map(mapInvoiceLine)
    : [],

  netTotal: num(dto.netTotal ?? 0),
  taxPayable: num(dto.taxPayable ?? 0),
  grossTotal: num(dto.grossTotal ?? dto.total ?? 0),
  retention: num(dto.retention ?? 0),
  remaining: num(dto.remaining ?? dto.balance ?? 0),
  balance: num(dto.balance ?? dto.remaining ?? 0),
});
