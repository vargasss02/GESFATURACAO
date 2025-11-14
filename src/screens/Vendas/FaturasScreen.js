// src/screens/Vendas/FaturasScreen.js
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

import { listInvoices } from "../../api/invoices";
import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function FaturasScreen() {
  const nav = useNavigation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const loadAll = async () => {
    try {
      const data = await listInvoices(); // agora lista todas as faturas
      setItems(data.items || []);
      setErro("");
    } catch (e) {
      console.error("❌ Erro ao carregar faturas:", e);
      setErro("Erro ao carregar faturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => nav.navigate("FaturaDetalhe", { id: item.id })}
      activeOpacity={0.7}
    >
      <View style={s.card}>
        <View style={s.top}>
          <Text style={s.topLeft}>{item.number}</Text>
          <Text style={s.topRight}>{fmtMoney(item.total)}</Text>
        </View>

        <Text style={s.line}>
          Cliente: <Text style={s.val}>{item.client?.name}</Text>
        </Text>

        <Text style={s.line}>
          Estado: <Text style={s.badge}>{item.status?.name}</Text>
        </Text>

        <Text style={s.line}>
          Data: <Text style={s.val}>{fmtDate(item.date)}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={{ color: "red" }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.title}>Faturas</Text>

        <TouchableOpacity
          onPress={() => nav.navigate("FaturaCriar")}
          style={s.createBtn}
        >
          <Text style={s.createTxt}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it, i) => it.id || String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
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
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { color: "#7ee081", fontWeight: "700", fontSize: 22 },
  createBtn: { backgroundColor: "#7ee08120", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  createTxt: { color: "#7ee081", fontWeight: "700" },

  card: {
    backgroundColor: "#1b1916",
    padding: 12,
    borderRadius: 10,
  },

  top: { flexDirection: "row", justifyContent: "space-between" },
  topLeft: { color: "#f5e6d3", fontWeight: "700" },
  topRight: { color: "#f5e6d3", fontWeight: "700" },

  line: { color: "#cfc6bb", marginTop: 2 },
  val: { color: "#eee", fontWeight: "600" },

  badge: { color: "#7ee081", fontWeight: "700" },
});
