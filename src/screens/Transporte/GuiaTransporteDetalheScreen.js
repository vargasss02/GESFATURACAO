// src/screens/Transporte/GuiaTransporteDetalheScreen.js

import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getTransportGuideById } from "../../api/transportGuides";
import { fmtDate, fmtMoney } from "../../api/utils/format";

export default function GuiaTransporteDetalheScreen({ route }) {
  const { id } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getTransportGuideById(id);
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" />
        <Text>A carregar…</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={s.center}>
        <Text>Falha ao carregar guia.</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>{data.number}</Text>

      <View style={s.block}>
        <Text style={s.blockTitle}>Dados</Text>
        <Text style={s.line}>Data: <Text style={s.val}>{fmtDate(data.date)}</Text></Text>
        <Text style={s.line}>Cliente: <Text style={s.val}>{data.client?.name}</Text></Text>
      </View>

      <View style={s.block}>
        <Text style={s.blockTitle}>Linhas</Text>
        {data.lines?.map((l, i) => (
          <Text key={i} style={s.line}>
            {l.description} — {fmtMoney(l.total)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  title: { color: "#7ee081", fontSize: 22, fontWeight: "700", marginBottom: 12 },

  block: {
    backgroundColor: "#1b1916",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  blockTitle: { color: "#e7d7c3", fontWeight: "700", marginBottom: 4 },

  line: { color: "#ccc", marginTop: 2 },
  val: { color: "#fff", fontWeight: "600" },
});
