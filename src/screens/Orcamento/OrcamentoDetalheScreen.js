import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  changeBudgetStatus,
  getBudgetById,
} from "../../api/budgets";
import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function OrcamentoDetalheScreen({ route }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const detail = await getBudgetById(id);
      setData(detail);
      setErro("");
    } catch (e) {
      setErro(e?.message || "Erro ao obter orçamento");
    } finally {
      setLoading(false);
    }
  }

  /** =========================
   * ALTERAR ESTADO
   * ========================= */
  async function handleStatusChange(action) {
    try {
      const confirm = await new Promise((resolve) => {
        Alert.alert(
          "Confirmar",
          `Tens a certeza que queres ${action} o orçamento?`,
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "OK", onPress: () => resolve(true) },
          ]
        );
      });

      if (!confirm) return;

      setLoading(true);

      await changeBudgetStatus(id, action);

      Alert.alert("Sucesso", `Orçamento ${action} com sucesso!`);
      load();
    } catch (e) {
      Alert.alert("Erro", e.message || "Erro ao alterar estado");
    } finally {
      setLoading(false);
    }
  }

  /** =========================
   * RENDER LINHA
   * ========================= */
  const LineRow = ({ it }) => (
    <View style={s.lineRow}>
      <Text style={[s.cell, { flex: 2 }]}>{it.description}</Text>
      <Text style={[s.cell, { flex: 1, textAlign: "right" }]}>
        {it.taxPercent.toFixed(2)}%
      </Text>
      <Text style={[s.cell, { flex: 1, textAlign: "right" }]}>
        {fmtMoney(it.total)}
      </Text>
    </View>
  );

  /** =========================
   * LOADING / ERRO
   * ========================= */
  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
        <Text style={{ color: "#fff", marginTop: 10 }}>A carregar…</Text>
      </View>
    );

  if (erro)
    return (
      <View style={s.center}>
        <Text style={{ color: "red" }}>{erro}</Text>
      </View>
    );

  if (!data)
    return (
      <View style={s.center}>
        <Text style={{ color: "#fff" }}>Sem dados.</Text>
      </View>
    );

  /** =========================
   * UI PRINCIPAL
   * ========================= */
  return (
    <View style={s.container}>
      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.title}># {data.number}</Text>
        <Text style={s.badge}>{data.statusText}</Text>
      </View>

      {/* CLIENTE */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Cliente</Text>
        <Text style={s.line}>Nome: <Text style={s.val}>{data.client.name}</Text></Text>
        <Text style={s.line}>NIF: <Text style={s.val}>{data.client.vatNumber}</Text></Text>
        <Text style={s.line}>Email: <Text style={s.val}>{data.client.email}</Text></Text>
      </View>

      {/* DADOS DO ORÇAMENTO */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Dados do Orçamento</Text>
        <Text style={s.line}>Série: <Text style={s.val}>{data.series}</Text></Text>
        <Text style={s.line}>Referência: <Text style={s.val}>{data.reference}</Text></Text>
        <Text style={s.line}>Data: <Text style={s.val}>{fmtDate(data.date)}</Text></Text>
        <Text style={s.line}>Vencimento: <Text style={s.val}>{fmtDate(data.dueDate)}</Text></Text>
        <Text style={s.line}>Moeda: <Text style={s.val}>{data.currency}</Text></Text>
        <Text style={s.line}>Desconto: <Text style={s.val}>{data.discountPercent}%</Text></Text>
      </View>

      {/* LINHAS */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Linhas</Text>

        <View style={s.tableHeader}>
          <Text style={[s.th, { flex: 2 }]}>Descrição</Text>
          <Text style={[s.th, { flex: 1, textAlign: "right" }]}>IVA</Text>
          <Text style={[s.th, { flex: 1, textAlign: "right" }]}>Total</Text>
        </View>

        <FlatList
          data={data.lines}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <LineRow it={item} />}
          scrollEnabled={false}
        />

        {/* TOTAIS */}
        <View style={s.totals}>
          <Text style={s.totalLine}>s/IVA: <Text style={s.val}>{fmtMoney(data.subtotals.subtotalNoVat)}</Text></Text>
          <Text style={s.totalLine}>IVA: <Text style={s.val}>{fmtMoney(data.subtotals.vat)}</Text></Text>
          <Text style={s.totalLine}>Retenção: <Text style={s.val}>{fmtMoney(data.subtotals.withholding)}</Text></Text>
          <Text style={s.totalLine}>Total: <Text style={s.grandTotalVal}>{fmtMoney(data.subtotals.total)}</Text></Text>
        </View>
      </View>

      {/* BOTÕES */}
      <View style={s.btnRow}>
        <TouchableOpacity style={s.btn} onPress={() => handleStatusChange("finalize")}>
          <Text style={s.btnTxt}>Finalizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnYellow} onPress={() => handleStatusChange("accept")}>
          <Text style={s.btnYellowTxt}>Aceitar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnRed} onPress={() => handleStatusChange("refuse")}>
          <Text style={s.btnRedTxt}>Recusar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#f5e6d3" },
  badge: { color: "#7ee081", fontWeight: "700", fontSize: 16 },

  block: { backgroundColor: "#1b1916", padding: 12, borderRadius: 10, marginBottom: 12 },
  blockTitle: { color: "#e7d7c3", fontWeight: "700", marginBottom: 6 },

  line: { color: "#cfc6bb", marginBottom: 2 },
  val: { color: "#fff", fontWeight: "600" },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2621",
    marginBottom: 6,
  },

  th: { color: "#e7d7c3", fontWeight: "700" },

  lineRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#221f1a",
    borderRadius: 8,
  },

  cell: { color: "#ddd" },

  totals: { marginTop: 10 },
  totalLine: { color: "#cfc6bb", marginTop: 3 },

  grandTotalVal: { color: "#ffcc66", fontWeight: "900" },

  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },

  btn: { backgroundColor: "#7ee081", padding: 12, borderRadius: 8, flex: 1, marginRight: 6 },
  btnTxt: { textAlign: "center", color: "#000", fontWeight: "700" },

  btnYellow: {
    backgroundColor: "#f6d65e",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  btnYellowTxt: { textAlign: "center", color: "#000", fontWeight: "700" },

  btnRed: { backgroundColor: "#d9534f", padding: 12, borderRadius: 8, flex: 1, marginLeft: 6 },
  btnRedTxt: { textAlign: "center", color: "#fff", fontWeight: "700" },
});
