// src/screens/Sales/InvoiceCreateScreen.js
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { createInvoice } from "../../api/invoices";
import DrawerMenuIcon from "../../components/DrawerMenuIcon";

export default function InvoiceCreateScreen({ navigation }) {
  const [clientId, setClientId] = useState("");
  const [serie, setSerie] = useState("");
  const [date, setDate] = useState("");

  async function handleCreate() {
    try {
      const payload = {
        client: clientId,
        serie,
        date,
        lines: [],
        finalize: false,
      };

      await createInvoice(payload);
      Alert.alert("Sucesso", "Fatura criada!");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Erro ao criar fatura.");
    }
  }

  return (
    <View style={s.container}>
      <DrawerMenuIcon />
      <Text style={s.title}>Criar Fatura</Text>

      <TextInput
        style={s.input}
        placeholder="ID Cliente"
        placeholderTextColor="#777"
        value={clientId}
        onChangeText={setClientId}
      />

      <TextInput
        style={s.input}
        placeholder="Série"
        placeholderTextColor="#777"
        value={serie}
        onChangeText={setSerie}
      />

      <TextInput
        style={s.input}
        placeholder="Data (YYYY-MM-DD)"
        placeholderTextColor="#777"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={s.btn} onPress={handleCreate}>
        <Text style={s.btnTxt}>Criar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  title: { color: "#f5e6d3", fontSize: 22, fontWeight: "800", marginBottom: 16 },
  input: {
    backgroundColor: "#1c1a17",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#7ee081",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  btnTxt: { color: "#000", textAlign: "center", fontWeight: "800" },
});
