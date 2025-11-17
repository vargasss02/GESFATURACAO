// src/screens/Faturas/FaturasListaScreen.js
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

import { listSalesInvoices } from "../../api/invoices";
import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function FaturasListaScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await listSalesInvoices({ search });
      setItems(res.items);
    } catch (e) {
      setErro(e?.message || "Erro ao obter faturas");
    } finally {
      setLoading(false);
    }
  }

  function openDetail(id) {
    navigation.navigate("FaturaDetalhe", { id });
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Faturas</Text>

      {/* PESQUISA */}
      <TextInput
        placeholder="Pesquisar fatura..."
        placeholderTextColor="#777"
        style={s.search}
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={load}
      />

      {/* BOTÃO CRIAR */}
      <TouchableOpacity
        style={s.btnAdd}
        onPress={() => navigation.navigate("FaturaCriar")}
      >
        <Text style={s.btnAddTxt}>+ Nova Fatura</Text>
      </TouchableOpacity>

      {/* LISTA */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#7ee081" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.item} onPress={() => openDetail(item.id)}>
              <View>
                <Text style={s.itemTitle}>{item.number}</Text>
                <Text style={s.itemClient}>{item.clientName}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.itemTotal}>{fmtMoney(item.total)}</Text>
                <Text style={s.itemDate}>{fmtDate(item.date)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {erro ? <Text style={s.err}>{erro}</Text> : null}
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
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  search: {
    backgroundColor: "#1b1916",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 10,
  },

  btnAdd: {
    backgroundColor: "#7ee081",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  btnAddTxt: {
    color: "#000",
    fontWeight: "800",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  item: {
    backgroundColor: "#1b1916",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: { color: "#E5C79C", fontWeight: "800", fontSize: 16 },
  itemClient: { color: "#ccc", marginTop: 2 },
  itemTotal: { color: "#7ee081", fontWeight: "900", fontSize: 16 },
  itemDate: { color: "#aaa", fontSize: 12, marginTop: 3 },

  err: { color: "red", marginTop: 10 },
});
