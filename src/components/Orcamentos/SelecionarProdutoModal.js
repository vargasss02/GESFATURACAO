// src/components/Orcamentos/SelecionarProdutoModal.js
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { searchProducts } from "../../api/products";

export default function SelecionarProdutoModal({ visible, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  async function doSearch(text) {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await searchProducts(text);

      // garantir que vem lista
      const list = Array.isArray(res?.data) ? res.data : res;

      setResults(list ?? []);
    } catch (e) {
      console.log("❌ Erro pesquisa produtos:", e);
    } finally {
      setLoading(false);
    }
  }

  function pick(item) {
    onSelect({
      id: item.id,
      description: item.name || item.description || "—",
      price: Number(item.pricePvp ?? item.price ?? 0),
      tax: item.tax?.id ?? item.tax?.value ?? 1, // SEMPRE ID OU VALUE
    });

    onClose();
  }

  function renderItem({ item }) {
    const preco = Number(item.pricePvp ?? item.price ?? 0);

    return (
      <TouchableOpacity style={s.item} onPress={() => pick(item)}>
        <View>
          <Text style={s.itemName}>
            {item.name || item.description || "Artigo sem nome"}
          </Text>

          <Text style={s.itemSmall}>
            Código: {item.code ?? "—"}
          </Text>
        </View>

        <Text style={s.itemPrice}>
          {preco.toFixed(2)} €
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={s.overlay}>
        <View style={s.box}>
          <Text style={s.title}>Selecionar Produto</Text>

          <TextInput
            style={s.input}
            placeholder="Pesquisar produto..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={doSearch}
          />

          {loading ? (
            <ActivityIndicator color="#7ee081" style={{ marginTop: 15 }} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              ListEmptyComponent={
                query.length > 0 ? (
                  <Text style={s.empty}>Nenhum produto encontrado.</Text>
                ) : null
              }
              style={{ marginTop: 10 }}
            />
          )}

          <TouchableOpacity onPress={onClose} style={s.btnClose}>
            <Text style={s.btnCloseTxt}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0009",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "#1b1916",
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    color: "#7ee081",
    fontWeight: "700",
  },
  input: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#26231f",
    color: "#fff",
    borderRadius: 8,
  },
  item: {
    padding: 12,
    backgroundColor: "#26231f",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  itemSmall: { color: "#999", fontSize: 12, marginTop: 2 },
  itemPrice: { color: "#7ee081", fontWeight: "700", fontSize: 16 },
  empty: { color: "#aaa", textAlign: "center", marginTop: 20 },
  btnClose: {
    marginTop: 15,
    padding: 14,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  btnCloseTxt: { textAlign: "center", color: "#fff", fontWeight: "700" },
});
