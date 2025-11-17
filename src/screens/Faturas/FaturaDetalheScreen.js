// src/screens/Faturas/FaturaDetalheScreen.js
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
    changeSalesInvoiceStatus,
    getSalesInvoiceById,
} from "../../api/invoices";

import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function FaturaDetalheScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const detail = await getSalesInvoiceById(id);
      setData(detail);
      setErro("");
    } catch (e) {
      setErro(e?.message || "Erro ao obter fatura");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(action) {
    try {
      const txt =
        action === "finalize"
          ? "finalizar"
          : action === "void"
          ? "anular"
          : action;

      const confirm = await new Promise((resolve) => {
        Alert.alert(
          "Confirmar operação",
          `Tens a certeza que queres ${txt} esta fatura?`,
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "OK", onPress: () => resolve(true) },
          ]
        );
      });

      if (!confirm) return;

      setLoading(true);
      await changeSalesInvoiceStatus(id, action);
      Alert.alert("Sucesso", `Fatura ${txt} com sucesso!`);

      load();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Erro ao alterar estado");
    } finally {
      setLoading(false);
    }
  }

  const LineRow = ({ it }) => (
    <View style={s.lineRow}>
      <Text style={[s.cell, { flex: 2 }]}>{it.description}</Text>

      <Text style={[s.cell, { flex: 1, textAlign: "right" }]}>
        {it.taxPercent}% 
      </Text>

      <Text style={[s.cell, { flex: 1, textAlign: "right" }]}>
        {fmtMoney(it.total)}
      </Text>
    </View>
  );

  // LOADING
  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
        <Text style={{ marginTop: 8, color: "#fff" }}>A carregar…</Text>
      </View>
    );

  // ERRO
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

  return (
    <View style={s.container}>
      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.title}>{data.number}</Text>
        <Text style={s.badge}>{data.status?.name}</Text>
      </View>

      {/* CLIENTE */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Cliente</Text>

        <Text style={s.line}>
          Nome: <Text style={s.val}>{data.client?.name}</Text>
        </Text>

        <Text style={s.line}>
          NIF: <Text style={s.val}>{data.client?.vatNumber}</Text>
        </Text>

        <Text style={s.line}>
          Email: <Text style={s.val}>{data.client?.email}</Text>
        </Text>
      </View>

      {/* DADOS */}
      <View style={s.block}>
        <Text style={s.blockTitle}>Dados da Fatura</Text>

        <Text style={s.line}>
          Série: <Text style={s.val}>{data.serie?.name}</Text>
        </Text>

        <Text style={s.line}>
          Referência: <Text style={s.val}>{data.reference || "-"}</Text>
        </Text>

        <Text style={s.line}>
          Data: <Text style={s.val}>{fmtDate(data.date)}</Text>
        </Text>

        <Text style={s.line}>
          Vencimento: <Text style={s.val}>{fmtDate(data.expiration)}</Text>
        </Text>

        <Text style={s.line}>
          Moeda: <Text style={s.val}>{data.coin?.iso}</Text>
        </Text>

        <Text style={s.line}>
          Desconto: <Text style={s.val}>{data.discount}%</Text>
        </Text>
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
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => <LineRow it={item} />}
        />

        <View style={s.totals}>
          <Text style={s.totalLine}>
            s/IVA: <Text style={s.val}>{fmtMoney(data.netTotal)}</Text>
          </Text>

          <Text style={s.totalLine}>
            IVA: <Text style={s.val}>{fmtMoney(data.taxPayable)}</Text>
          </Text>

          <Text style={s.totalLine}>
            Total: <Text style={s.grandTotalVal}>{fmtMoney(data.grossTotal)}</Text>
          </Text>
        </View>
      </View>

      {/* BOTÕES */}
      <View style={s.btnRow}>
        <TouchableOpacity
          style={s.btnGreen}
          onPress={() => handleStatus("finalize")}
        >
          <Text style={s.btnTxt}>Finalizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnRed}
          onPress={() => handleStatus("void")}
        >
          <Text style={s.btnTxtWhite}>Anular</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0e0c",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: { fontSize: 22, fontWeight: "800", color: "#f5e6d3" },
  badge: { color: "#7ee081", fontWeight: "700", fontSize: 16 },

  block: {
    backgroundColor: "#1b1916",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
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
    marginBottom: 4,
  },
  cell: { color: "#ddd" },

  totals: { marginTop: 10 },
  totalLine: { color: "#cfc6bb", marginTop: 3 },

  grandTotalVal: {
    color: "#ffcc66",
    fontWeight: "900",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  btnGreen: {
    backgroundColor: "#7ee081",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
  },
  btnRed: {
    backgroundColor: "#d9534f",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
  },

  btnTxt: { textAlign: "center", color: "#000", fontWeight: "700" },
  btnTxtWhite: { textAlign: "center", color: "#fff", fontWeight: "700" },
});
