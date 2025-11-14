// src/screens/Vendas/FaturaCriarScreen.js
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { createInvoice } from "../../api/invoices";

/**
 * Formulário simples para criar fatura. Isto é um formulário mínimo
 * — adaptável conforme o payload exato da tua API.
 */
export default function FaturaCriarScreen() {
  const nav = useNavigation();

  const [clientId, setClientId] = useState("");
  const [series, setSeries] = useState("");
  const [date, setDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [lines, setLines] = useState([
    { description: "", qty: "1", price: "0.00", taxPercent: "23" },
  ]);

  const [loading, setLoading] = useState(false);

  const addLine = () => setLines((s) => [...s, { description: "", qty: "1", price: "0.00", taxPercent: "23" }]);
  const updateLine = (idx, key, value) => {
    setLines((s) => s.map((l, i) => (i === idx ? { ...l, [key]: value } : l)));
  };
  const removeLine = (idx) => setLines((s) => s.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!clientId) return Alert.alert("Erro", "Indica o ID do cliente.");
    setLoading(true);
    try {
      // Montar payload conforme documentação da API
      const payload = {
        client_id: clientId, // adapta se a API espera `client` ou `clientId`
        series: series || undefined,
        date: date.toISOString().slice(0, 10),
        due_date: dueDate.toISOString().slice(0, 10),
        lines: lines.map((l) => ({
          description: l.description,
          quantity: Number(l.qty || 1),
          unit_price: Number(l.price || 0),
          tax_percent: Number(l.taxPercent || 0),
        })),
      };

      const res = await createInvoice(payload);
      Alert.alert("Sucesso", "Fatura criada com sucesso.");
      // navegar para detalhe (se o res devolver id)
      const newId = res.data?.id ?? res.id ?? res?.invoice?.id;
      if (newId) nav.navigate("FaturaDetalhe", { id: newId });
      else nav.goBack();
    } catch (err) {
      console.error("Erro a criar fatura:", err);
      Alert.alert("Erro", err.response?.data?.errors?.message ?? err.message ?? "Falha ao criar fatura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.label}>ID do Cliente (ex: 123)</Text>
      <TextInput style={s.input} value={clientId} onChangeText={setClientId} keyboardType="numeric" />

      <Text style={s.label}>Série</Text>
      <TextInput style={s.input} value={series} onChangeText={setSeries} />

      <Text style={s.label}>Data</Text>
      <DateTimePicker value={date} mode="date" display="default" onChange={(_, d) => d && setDate(d)} />

      <Text style={s.label}>Vencimento</Text>
      <DateTimePicker value={dueDate} mode="date" display="default" onChange={(_, d) => d && setDueDate(d)} />

      <View style={{ height: 12 }} />

      <Text style={[s.label, { marginBottom: 6 }]}>Linhas</Text>
      {lines.map((l, idx) => (
        <View key={idx} style={s.lineCard}>
          <TextInput
            placeholder="Descrição"
            style={s.input}
            value={l.description}
            onChangeText={(t) => updateLine(idx, "description", t)}
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput style={[s.input, { flex: 1 }]} value={String(l.qty)} keyboardType="numeric" onChangeText={(t) => updateLine(idx, "qty", t)} />
            <TextInput style={[s.input, { flex: 1 }]} value={String(l.price)} keyboardType="numeric" onChangeText={(t) => updateLine(idx, "price", t)} />
            <TextInput style={[s.input, { flex: 1 }]} value={String(l.taxPercent)} keyboardType="numeric" onChangeText={(t) => updateLine(idx, "taxPercent", t)} />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 6 }}>
            <TouchableOpacity onPress={() => removeLine(idx)}>
              <Text style={{ color: "#ff7777" }}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={addLine} style={s.addLineBtn}>
        <Text style={s.addLineTxt}>+ Adicionar linha</Text>
      </TouchableOpacity>

      <View style={{ height: 16 }} />

      <TouchableOpacity onPress={handleSubmit} style={s.submitBtn} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={s.submitTxt}>Criar Fatura</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  label: { color: "#e7d7c3", marginBottom: 6 },
  input: { backgroundColor: "#1b1916", color: "#fff", padding: 10, borderRadius: 8, marginBottom: 8 },
  lineCard: { backgroundColor: "#221f1a", padding: 8, borderRadius: 8, marginBottom: 10 },
  addLineBtn: { padding: 10, backgroundColor: "#7ee08110", borderRadius: 8, alignItems: "center" },
  addLineTxt: { color: "#7ee081", fontWeight: "700" },
  submitBtn: { marginTop: 8, backgroundColor: "#7ee081", padding: 12, borderRadius: 10, alignItems: "center" },
  submitTxt: { color: "#000", fontWeight: "800" },
});
