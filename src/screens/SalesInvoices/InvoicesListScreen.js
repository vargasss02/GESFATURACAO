// src/screens/SalesInvoices/InvoicesListScreen.js

import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { listSalesInvoices } from "../../api/invoices/salesInvoices"; // ✅ CORRETO
import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function InvoicesListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load(keyword = "") {
    try {
      setLoading(true);
      const res = await listSalesInvoices({ search: keyword });
      setItems(res.items || []);
      setError("");
    } catch (e) {
      setError(e.message || "Erro ao carregar faturas");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(text) {
    setSearch(text);
    load(text);
  }

  const Row = ({ it }) => (
    <TouchableOpacity
      style={s.row}
      onPress={() => navigation.navigate("InvoiceDetail", { id: it.id })}
    >
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{it.number}</Text>
        <Text style={s.rowSub}>{it.clientName}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={s.rowVal}>{fmtMoney(it.total)}</Text>
        <Text style={s.rowDate}>{fmtDate(it.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      {/* PESQUISA */}
      <TextInput
        style={s.search}
        placeholder="Pesquisar..."
        placeholderTextColor="#a59d92"
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#E5C79C" />
        </View>
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => <Row it={item} />}
        />
      )}

      {/* BOTÃO NOVA FATURA */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate("InvoiceCreate")}
      >
        <Text style={s.fabTxt}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0e0c",
    padding: 16,
  },

  search: {
    backgroundColor: "#1b1916",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    backgroundColor: "#1b1916",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
  },

  rowTitle: { color: "#E5C79C", fontSize: 16, fontWeight: "700" },
  rowSub: { color: "#b9b1a6", fontSize: 13, marginTop: 3 },

  rowVal: { color: "#7ee081", fontWeight: "800", fontSize: 15 },
  rowDate: { color: "#c9c1b8", fontSize: 12, marginTop: 3 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 25,
    backgroundColor: "#E5C79C",
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fabTxt: { color: "#000", fontSize: 32, marginTop: -4 },
});
