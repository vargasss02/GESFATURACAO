// src/screens/Faturas/InvoiceListScreen.js
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

import { listSalesInvoices } from "../../api/invoices/salesInvoices";
import { fmtDate, fmtMoney } from "../../api/utils/format";
import DrawerMenuIcon from "../../components/DrawerMenuIcon";

export default function InvoiceListScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const { items } = await listSalesInvoices({ search });
      setItems(items);
    } catch (e) {
      console.log("Erro ao carregar faturas:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(text) {
    setSearch(text);
    if (text.length >= 1) load();
    if (text.length === 0) load();
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={s.card}
        onPress={() =>
          navigation.navigate("InvoiceDetail", { id: item.id })
        }
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={s.number}>{item.number}</Text>
          <Text style={s.status}>{item.statusText}</Text>
        </View>

        <Text style={s.client}>{item.clientName}</Text>

        <View style={s.row}>
          <Text style={s.date}>{fmtDate(item.date)}</Text>
          <Text style={s.total}>{fmtMoney(item.total)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.container}>
      <DrawerMenuIcon />

      <Text style={s.title}>Faturas</Text>

      <TextInput
        style={s.search}
        placeholder="Pesquisar..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#7ee081" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ color: "#bbb", textAlign: "center", marginTop: 20 }}>
              Sem resultados.
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={s.addBtn}
        onPress={() => navigation.navigate("InvoiceCreate")}
      >
        <Text style={s.addTxt}>+ Criar Fatura</Text>
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

  title: {
    color: "#f5e6d3",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },

  search: {
    backgroundColor: "#1c1a17",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#1b1916",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  number: { color: "#e7d7c3", fontWeight: "700", fontSize: 16 },
  status: { color: "#7ee081", fontWeight: "700" },
  client: { color: "#fff", marginTop: 4, marginBottom: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  date: { color: "#aaa" },
  total: { color: "#ffcc66", fontWeight: "800" },

  center: { justifyContent: "center", alignItems: "center", flex: 1 },

  addBtn: {
    backgroundColor: "#7ee081",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  addTxt: {
    color: "#000",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
});
