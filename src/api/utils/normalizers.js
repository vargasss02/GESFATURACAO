/** =========================
 *  LISTA DE ORÇAMENTOS
 *  ========================= */
export const mapBudget = (dto = {}) => ({
  id: String(dto.id ?? ''),
  number: dto.number ?? dto.title ?? `#${dto.id ?? '-'}`,
  date: dto.date ?? null,
  expiration: dto.expiration ?? null,
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

/** helpers */
const num = (v, d = 0) => {
  if (v === null || v === undefined || v === '') return d;
  const n = Number(v);
  return Number.isNaN(n) ? d : n;
};

/** =========================
 *  LINHAS
 *  ========================= */
export const mapBudgetLine = (dto = {}) => ({
  description:
    dto.article?.name ??
    dto.description ??
    dto.designation ??
    '—',
  quantity: num(dto.quantity, 0),
  unitPrice: num(dto.price, 0),
  percentageDiscount: num(dto.percentageDiscount, 0),
  taxPercent: num(dto.tax?.value, 0),
  total: num(dto.total, 0),
});

/** =========================
 *  DETALHE DO ORÇAMENTO
 *  ========================= */
export const mapBudgetDetail = (dto = {}) => {
  return {
    id: String(dto.id ?? ''),
    number: String(dto.number ?? dto.title ?? `#${dto.id ?? '-'}`),

    // cliente
    client: mapClient(dto.client ?? {}),

    // série
    series: dto.serie?.value ?? '—',

    // datas
    date: dto.date ?? null,
    expiration: dto.expiration ?? null,
    dueDate: dto.expiration ?? null,

    reference: dto.reference ?? '—',
    observations: dto.observations ?? '',

    // moeda (usa ordem: iso > symbol > name)
    currency: dto.coin?.iso ?? dto.coin?.symbol ?? dto.coin?.name ?? 'EUR',

    discountPercent: num(dto.discount ?? 0),

    // estado
    statusId: dto?.status?.id ?? null,
    statusText: dto?.status?.description ?? '—',

    // linhas
    lines: Array.isArray(dto.lines)
      ? dto.lines.map(mapBudgetLine)
      : [],

    // totais corretos conforme API
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
