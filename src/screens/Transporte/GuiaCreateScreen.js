// src/screens/Transporte/GuiaCreateScreen.js
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { createTransportDocument } from "../../api/transport";

export default function GuiaCreateScreen() {
  const nav = useNavigation();
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!clientName.trim()) return "Preenche o nome do cliente";
    if (!date.trim()) return "Preenche a data";
    if (!origin.trim()) return "Preenche a origem";
    if (!destination.trim()) return "Preenche o destino";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Formulario incompleto", err);
      return;
    }

    const payload = {
      // Ajusta os nomes dos campos conforme a API
      client_name: clientName,
      date,
      vehicle,
      driver,
      origin,
      destination,
      // lines: [] // se a API suportar linhas, podes adicionar aqui
    };

    try {
      setLoading(true);
      const res = await createTransportDocument(payload);
      Alert.alert("Sucesso", "Guia criada com sucesso");
      // voltar para lista e forçar reload
      nav.navigate("GuiasLista", { reload: true });
    } catch (e) {
      console.error("Erro criar guia:", e);
      Alert.alert("Erro", e?.message || "Falha ao criar guia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.label}>Nome do Cliente</Text>
      <TextInput style={s.input} value={clientName} onChangeText={setClientName} placeholder="Nome do cliente" placeholderTextColor="#8c857c" />

      <Text style={s.label}>Data</Text>
      <TextInput style={s.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="#8c857c" />

      <Text style={s.label}>Veículo</Text>
      <TextInput style={s.input} value={vehicle} onChangeText={setVehicle} placeholder="Matricula / descrição" placeholderTextColor="#8c857c" />

      <Text style={s.label}>Condutor</Text>
      <TextInput style={s.input} value={driver} onChangeText={setDriver} placeholder="Nome do condutor" placeholderTextColor="#8c857c" />

      <Text style={s.label}>Origem</Text>
      <TextInput style={s.input} value={origin} onChangeText={setOrigin} placeholder="Morada de origem" placeholderTextColor="#8c857c" />

      <Text style={s.label}>Destino</Text>
      <TextInput style={s.input} value={destination} onChangeText={setDestination} placeholder="Morada de destino" placeholderTextColor="#8c857c" />

      <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#0f0e0c" /> : <Text style={s.submitTxt}>Criar Guia</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  label: { color: "#e7d7c3", fontWeight: "700", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#1b1916",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "#7ee081",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitTxt: { color: "#0f0e0c", fontWeight: "800" },
});
