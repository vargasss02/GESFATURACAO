// src/screens/Artigos/ArtigosScreen.js

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { listProducts } from "../../api/products";

export default function ArtigosScreen() {
  const navigation = useNavigation();

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

      const res = await listProducts(50, p);

      const newItems = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.data)
        ? res.data
        : [];

      if (newItems.length === 0) {
        setEndReached(true);
        return;
      }

      if (p === 1) {
        setItems(newItems);
        setFiltered(newItems);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setFiltered((prev) => [...prev, ...newItems]);
      }

      setPage(p);
    } catch (err) {
      console.log("❌ Erro a carregar artigos:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadPage(1);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
      return;
    }

    const txt = search.toLowerCase();

    setFiltered(
      items.filter(
        (i) =>
          String(i.description || "").toLowerCase().includes(txt) ||
          String(i.code || "").toLowerCase().includes(txt)
      )
    );
  }, [search, items]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
        <Text style={{ marginTop: 10, color: "#fff" }}>A carregar artigos…</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <TextInput
        style={s.input}
        placeholder="Pesquisar artigos..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.id ?? index}_${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ArtigoDetalhes", { id: String(item.id) })
            }
          >
            <View style={s.card}>
              <Image source={{ uri: item.image }} style={s.image} />

              <View style={{ flex: 1 }}>
                <Text style={s.title}>{item.description}</Text>
                <Text style={s.sub}>Código: {item.code}</Text>
                <Text style={s.sub}>Preço: {item.pricePvp} €</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (!search.trim()) loadPage(page + 1);
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore && !search.trim() ? (
            <ActivityIndicator style={{ marginVertical: 15 }} color="#7ee081" />
          ) : null
        }
      />

      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate("ArtigoCriar")}
      >
        <Text style={s.fabTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 12 },

  input: {
    backgroundColor: "#1b1916",
    padding: 12,
    color: "#fff",
    borderRadius: 10,
    marginBottom: 12,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0e0c",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1b1916",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#222",
  },

  title: { color: "#7ee081", fontWeight: "700", fontSize: 15 },
  sub: { color: "#d8c7b2", marginTop: 3 },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#7ee081",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  fabTxt: {
    color: "#000",
    fontSize: 32,
    fontWeight: "800",
    marginTop: -2,
  },
});
