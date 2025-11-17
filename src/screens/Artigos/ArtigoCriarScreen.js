import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import { createProduct } from "../../api/products";
import { generateProductCode } from "../../api/utils/generate-code";

export default function ArtigoCriarScreen() {
  const navigation = useNavigation();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [pvp, setPvp] = useState("");
  const [tax, setTax] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(generateProductCode());
  }, []);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome é obrigatório.");
      return;
    }

    if (!pvp.trim()) {
      Alert.alert("Erro", "O preço PVP é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code,
        name,
        pvp,
        tax,
        type: "P",
        unit: 1
      };

      console.log("📤 ENVIADO:", payload);
      await createProduct(payload);

      Alert.alert("Sucesso", "Artigo criado!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao criar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>Criar Artigo</Text>

      <TextInput style={s.input} value={code} editable={false} />

      <TextInput
        style={s.input}
        placeholder="Nome"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={s.input}
        placeholder="Preço PVP"
        placeholderTextColor="#777"
        value={pvp}
        onChangeText={setPvp}
        keyboardType="numeric"
      />

      <TextInput
        style={s.input}
        placeholder="IVA (1,2,3)"
        placeholderTextColor="#777"
        value={tax}
        onChangeText={setTax}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator color="#7ee081" />
      ) : (
        <TouchableOpacity style={s.btn} onPress={handleSave}>
          <Text style={s.btnTxt}>Guardar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  title: { color: "#7ee081", fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    backgroundColor: "#1b1916",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  btn: {
    backgroundColor: "#7ee081",
    padding: 14,
    borderRadius: 10
  },
  btnTxt: { textAlign: "center", fontWeight: "700", color: "#000" }
});
