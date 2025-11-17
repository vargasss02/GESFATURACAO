// src/screens/Sales/InvoiceDetailScreen.js
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getInvoiceById } from "../../api/invoices";
import DrawerMenuIcon from "../../components/DrawerMenuIcon";

export default function InvoiceDetailScreen({ route }) {
  const { id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const detail = await getInvoiceById(id);
      setData(detail);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
      </View>
    );

  return (
    <View style={s.container}>
      <DrawerMenuIcon />
      <Text style={s.title}>{data.number}</Text>

      <View style={s.box}>
        <Text style={s.label}>Cliente:</Text>
        <Text style={s.val}>{data.client?.name}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Data:</Text>
        <Text style={s.val}>{data.date}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Total:</Text>
        <Text style={s.val}>{data.grossTotal} €</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#f5e6d3", fontSize: 22, fontWeight: "800", marginBottom: 16 },
  box: {
    backgroundColor: "#1b1916",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: { color: "#aaa" },
  val: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
