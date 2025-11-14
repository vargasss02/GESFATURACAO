// src/screens/Transporte/GuiasTransporteScreen.js

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

import { listTransportGuides } from "../../api/transportGuides";
import { fmtDate } from "../../api/utils/format";

export default function GuiasTransporteScreen() {
  const nav = useNavigation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { items } = await listTransportGuides();
        setItems(items);
      } catch (e) {
        setErro("Erro ao carregar guias transporte");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => nav.navigate("GuiaTransporteDetalhe", { id: item.id })}
    >
      <View style={s.card}>
        <Text style={s.num}>{item.number}</Text>

        <Text style={s.line}>
          Data: <Text style={s.val}>{fmtDate(item.date)}</Text>
        </Text>

        <Text style={s.line}>
          Cliente: <Text style={s.val}>{item.client?.name}</Text>
        </Text>

        <Text style={s.line}>
          Estado: <Text style={s.badge}>{item.status?.name}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <Text style={s.title}>Guias de Transporte</Text>

      <FlatList
        data={items}
        keyExtractor={(it, i) => it.id || String(i)}
        renderItem={renderItem}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    color: "#7ee081",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#1b1916",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  num: { color: "#f5e6d3", fontSize: 16, fontWeight: "700" },

  line: { color: "#ccc", marginTop: 2 },
  val: { color: "#fff", fontWeight: "600" },
  badge: { color: "#7ee081", fontWeight: "700" },
});
