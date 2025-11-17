// src/screens/ClientesScreen.js
import { useNavigation } from "@react-navigation/native";
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

import { listClients } from "../api/clients";

export default function ClientesScreen() {
  const nav = useNavigation();

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [endReached, setEndReached] = useState(false);

  async function loadPage(p = 1) {
    if (endReached || loadingMore) return;

    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await listClients({ rows: 50, page: p });
      const newItems = res.data ?? res.items ?? [];

      if (newItems.length === 0) {
        setEndReached(true);
        return;
      }

      if (p === 1) setItems(newItems);
      else setItems(prev => [...prev, ...newItems]);
      setPage(p);
    } catch (e) {
      console.log("❌ Erro ao listar clientes:", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadPage(1);
  }, []);

  // FILTRO LOCAL
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
      return;
    }

    const txt = search.toLowerCase();
    setFiltered(
      items.filter(
        c =>
          `${c.name}`.toLowerCase().includes(txt) ||
          `${c.vatNumber}`.toLowerCase().includes(txt) ||
          `${c.id}`.toLowerCase().includes(txt)
      )
    );
  }, [search, items]);

  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          A carregar clientes…
        </Text>
      </View>
    );

  return (
    <View style={s.container}>
      <TextInput
        placeholder="Pesquisar clientes..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={s.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.row}
            onPress={() =>
              nav.navigate("ClienteDetalhe", { id: String(item.id) })
            }
          >
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.sub}>{item.vatNumber || "—"}</Text>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (!search.trim()) loadPage(page + 1);
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={{ marginVertical: 10 }}
              color="#7ee081"
            />
          ) : null
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0e0c",
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0e0c",
  },
  input: {
    backgroundColor: "#1b1916",
    padding: 12,
    color: "#fff",
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    backgroundColor: "#1b1916",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    color: "#7ee081",
    fontWeight: "700",
    fontSize: 16,
  },
  sub: {
    color: "#d8c7b2",
    marginTop: 4,
  },
});
