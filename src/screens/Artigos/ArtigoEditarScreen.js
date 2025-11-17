import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { getProductById, updateProduct } from "../../api/products";

export default function ArtigoEditarScreen({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getProductById(id);
      setItem(data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar o artigo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    setLoading(true);

    try {
      const payload = {
        code: item.code,
        name: item.description,
        pvp: item.pricePvp,
        price: item.price,
        tax: item.tax?.id,
        type: "P",
        unit: 1
      };

      await updateProduct(id, payload);

      Alert.alert("Sucesso", "Artigo atualizado!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao atualizar artigo.");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !item) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
      </View>
    );
  }

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>Editar Artigo</Text>

      <TextInput
        style={s.input}
        value={item.description}
        onChangeText={(v) => setItem({ ...item, description: v })}
      />

      <TextInput
        style={s.input}
        value={item.code}
        onChangeText={(v) => setItem({ ...item, code: v })}
      />

      <TextInput
        style={s.input}
        value={String(item.price)}
        onChangeText={(v) => setItem({ ...item, price: v })}
        keyboardType="numeric"
      />

      <TextInput
        style={s.input}
        value={String(item.pricePvp)}
        onChangeText={(v) => setItem({ ...item, pricePvp: v })}
        keyboardType="numeric"
      />

      <TouchableOpacity style={s.btn} onPress={handleSave}>
        <Text style={s.btnTxt}>Guardar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, color: "#7ee081", fontWeight: "800", marginBottom: 20 },

  input: {
    backgroundColor: "#1b1916",
    padding: 12,
    color: "#fff",
    borderRadius: 8,
    marginBottom: 12
  },

  btn: {
    backgroundColor: "#7ee081",
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },

  btnTxt: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700"
  }
});
