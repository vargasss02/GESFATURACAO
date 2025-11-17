// src/screens/Orcamento/OrcamentosScreen.js
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { listBudgets } from "../../api/budgets";
import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function OrcamentosScreen() {
  const nav = useNavigation();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    loadBudgets();
  }, [page]);

  async function loadBudgets() {
    try {
      setLoading(true);

      const { items: data, pagination } = await listBudgets({
        page,
        rows: 20,
      });

      setItems((prev) => (page === 1 ? data : [...prev, ...data]));

      setHasMore(pagination.currentPage < pagination.lastPage);

      setErro("");
    } catch (e) {
      console.error("❌ Erro em OrcamentosScreen:", e);
      setErro(e?.message || "Erro ao carregar orçamentos");
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => nav.navigate("OrcamentoDetalhe", { id: item.id })}
      activeOpacity={0.7}
    >
      <View style={s.card}>
        {/* Topo */}
        <View style={s.top}>
          <Text style={s.topLeft}>{item.number}</Text>
          <Text style={s.topRight}>{fmtMoney(item.total)}</Text>
        </View>

        {/* Cliente */}
        <Text style={s.line}>
          Cliente: <Text style={s.val}>{item.clientName}</Text>
        </Text>

        {/* Estado */}
        <Text style={s.line}>
          Estado: <Text style={s.badge}>{item.statusText}</Text>
        </Text>

        {/* Data */}
        <Text style={s.line}>
          Data: <Text style={s.val}>{fmtDate(item.date)}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && items.length === 0) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
        <Text style={{ marginTop: 8, color: "#fff" }}>A carregar…</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={s.center}>
        <Text style={{ color: "red" }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <FlatList
        data={items}
        keyExtractor={(it, i) => String(it.id ?? i)}
        renderItem={renderItem}
        onEndReached={() => hasMore && setPage((p) => p + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color="#7ee081" style={{ marginVertical: 12 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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

  card: {
    backgroundColor: "#1b1916",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  top: { flexDirection: "row", justifyContent: "space-between" },

  topLeft: { color: "#f5e6d3", fontWeight: "700", fontSize: 16 },
  topRight: { color: "#f5e6d3", fontWeight: "700", fontSize: 16 },

  line: { color: "#cfc6bb", marginTop: 4 },
  val: { color: "#eee", fontWeight: "600" },

  badge: { color: "#7ee081", fontWeight: "700" },
});
