import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { deleteProduct, getProductById } from "../../api/products";

export default function ArtigoDetalhesScreen({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, []);

  async function loadDetails() {
    try {
      const produto = await getProductById(id);
      setData(produto);
    } catch (err) {
      console.log("❌ Erro a carregar detalhe:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Eliminar Artigo",
      "Tens a certeza que queres eliminar este artigo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);
              Alert.alert("Sucesso", "Artigo eliminado.");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Erro", err.message || "Não foi possível eliminar.");
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#fff" }}>Erro ao carregar detalhe.</Text>
      </View>
    );
  }

  const item = data;

  return (
    <ScrollView style={s.container}>
      <Image source={{ uri: item.image }} style={s.image} />

      <Text style={s.title}>{item.description}</Text>
      <Text style={s.code}>Código: {item.code}</Text>

      <View style={s.box}>
        <Text style={s.label}>Preço venda (PVP):</Text>
        <Text style={s.value}>{item.pricePvp} €</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Preço custo:</Text>
        <Text style={s.value}>{item.price} €</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Taxa IVA:</Text>
        <Text style={s.value}>{item.tax?.value ?? "—"} %</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Tipo:</Text>
        <Text style={s.value}>{item.type}</Text>
      </View>

      <View style={s.btnRow}>
        <TouchableOpacity
          style={s.btnEdit}
          onPress={() => navigation.navigate("ArtigoEditar", { id })}
        >
          <Text style={s.btnEditTxt}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnDelete} onPress={handleDelete}>
          <Text style={s.btnDeleteTxt}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0e0c",
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#222",
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7ee081",
    marginBottom: 8,
  },

  code: {
    color: "#d8c7b2",
    marginBottom: 15,
  },

  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  label: { color: "#d8c7b2", fontSize: 16 },
  value: { color: "#fff", fontSize: 16, fontWeight: "600" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  btnEdit: {
    flex: 1,
    backgroundColor: "#7ee081",
    padding: 14,
    borderRadius: 10,
    marginRight: 8,
  },
  btnEditTxt: { textAlign: "center", fontWeight: "700", color: "#000" },

  btnDelete: {
    flex: 1,
    backgroundColor: "#d9534f",
    padding: 14,
    borderRadius: 10,
    marginLeft: 8,
  },
  btnDeleteTxt: { textAlign: "center", fontWeight: "700", color: "#fff" },
});
