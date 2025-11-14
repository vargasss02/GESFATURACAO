import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getInvoiceById } from '../../api/invoices';
import { fmtDate, fmtMoney } from '../../api/utils/format';

export default function FaturaDetalheScreen({ route }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const detail = await getInvoiceById(id);
        if (!mounted) return;
        setData(detail);
        setErro('');
      } catch (e) {
        setErro(e?.message || 'Falha ao obter fatura');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>A carregar…</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={s.center}>
        <Text style={{ color: 'red' }}>{erro}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={s.center}>
        <Text>Sem dados.</Text>
      </View>
    );
  }

  const LineRow = ({ it }) => (
    <View style={s.lineRow}>
      <Text style={[s.cell, { flex: 2 }]}>{it.description}</Text>
      <Text style={[s.cell, { flex: 1, textAlign: 'right' }]}>
        {it.taxPercent?.toFixed(0) ?? 0} %
      </Text>
      <Text style={[s.cell, { flex: 1, textAlign: 'right' }]}>
        {fmtMoney(it.total)}
      </Text>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>{data.number}</Text>
        <Text style={s.badge}>{data.statusText}</Text>
      </View>

      {/* Cliente */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Dados do cliente</Text>
        <Text style={s.line}>
          Cliente: <Text style={s.val}>{data.client?.name}</Text>
        </Text>
        <Text style={s.line}>
          NIF: <Text style={s.val}>{data.client?.vatNumber}</Text>
        </Text>
        <Text style={s.line}>
          Email: <Text style={s.val}>{data.client?.email}</Text>
        </Text>
      </View>

      {/* Dados fatura */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Dados da fatura</Text>
        <Text style={s.line}>
          Série: <Text style={s.val}>{data.series}</Text>
        </Text>
        <Text style={s.line}>
          Referência: <Text style={s.val}>{data.reference}</Text>
        </Text>
        <Text style={s.line}>
          Data: <Text style={s.val}>{fmtDate(data.date)}</Text>
        </Text>
        <Text style={s.line}>
          Vencimento: <Text style={s.val}>{fmtDate(data.dueDate)}</Text>
        </Text>
        <Text style={s.line}>
          Moeda: <Text style={s.val}>{data.currency}</Text>
        </Text>
      </View>

      {/* Linhas */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Linhas de Artigos</Text>

        <View style={s.tableHeader}>
          <Text style={[s.th, { flex: 2 }]}>Descrição</Text>
          <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>IVA</Text>
          <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Total</Text>
        </View>

        <FlatList
          data={data.lines || []}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <LineRow it={item} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />

        {/* Totais */}
        <View style={s.totals}>
          <Text style={s.totalLine}>
            s/IVA: <Text style={s.val}>{fmtMoney(data.subtotals?.subtotalNoVat ?? 0)}</Text>
          </Text>
          <Text style={s.totalLine}>
            IVA: <Text style={s.val}>{fmtMoney(data.subtotals?.vat ?? 0)}</Text>
          </Text>
          <Text style={s.totalLine}>
            Descontos:{' '}
            <Text style={s.val}>{fmtMoney(data.subtotals?.discounts ?? 0)}</Text>
          </Text>
          <Text style={s.totalLine}>
            Retenção:{' '}
            <Text style={s.val}>{fmtMoney(data.subtotals?.withholding ?? 0)}</Text>
          </Text>

          <Text style={s.grandTotal}>
            Total a Pagar:{' '}
            <Text style={s.grandTotalVal}>
              {fmtMoney(data.subtotals?.total ?? 0)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e0c', padding: 16 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0e0c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#f5e6d3', fontSize: 20, fontWeight: '800' },
  badge: { color: '#7ee081', fontWeight: '800' },
  block: {
    backgroundColor: '#1b1916',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  blockTitle: { color: '#e7d7c3', fontWeight: '700', marginBottom: 6 },
  line: { color: '#cfc6bb', marginBottom: 3 },
  val: { color: '#fff', fontWeight: '600' },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2621',
    marginBottom: 6,
  },
  th: { color: '#e7d7c3', fontWeight: '700' },
  lineRow: {
    flexDirection: 'row',
    backgroundColor: '#221f1a',
    padding: 10,
    borderRadius: 8,
  },
  cell: { color: '#ddd' },
  totals: { marginTop: 12 },
  totalLine: { color: '#cfc6bb', marginTop: 2 },
  grandTotal: {
    color: '#e7d7c3',
    fontWeight: '800',
    marginTop: 8,
    fontSize: 16,
  },
  grandTotalVal: { color: '#ffcc66', fontWeight: '900' },
});
