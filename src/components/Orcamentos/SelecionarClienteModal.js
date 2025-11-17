// src/components/Orcamentos/SelecionarClienteModal.js
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
import { searchClients } from "../../api/clients";

export default function SelecionarClienteModal({
  visible,
  onClose,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(text) {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const res = await searchClients(text);
    setResults(res ?? []);
    setLoading(false);
  }

  function selectClient(item) {
    onSelect(item);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <View style={s.box}>
          <Text style={s.title}>Selecionar Cliente</Text>

          <TextInput
            style={s.search}
            placeholder="Pesquisar cliente..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={handleSearch}
          />

          {loading && <ActivityIndicator color="#7ee081" />}

          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.item}
                onPress={() => selectClient(item)}
              >
                <Text style={s.itemTitle}>{item.name}</Text>
                <Text style={s.itemNif}>NIF: {item.vatNumber}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={s.btnClose} onPress={onClose}>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  box: {
    backgroundColor: "#1b1916",
    padding: 18,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: "80%",
  },
  title: {
    color: "#7ee081",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  search: {
    backgroundColor: "#0f0e0c",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemTitle: {
    color: "#fff",
    fontSize: 16,
  },
  itemNif: {
    color: "#cbb89e",
    fontSize: 13,
    marginTop: 4,
  },
  btnClose: {
    marginTop: 15,
    backgroundColor: "#7ee081",
    padding: 12,
    borderRadius: 10,
  },
  btnCloseTxt: {
    textAlign: "center",
    color: "#000",
    fontWeight: "700",
  },
});
