// src/screens/Clients/ClientDetailScreen.js

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { deleteClient, getClientById } from "../../api/clients";

export default function ClientDetailScreen({ route }) {
  const { id } = route.params;
  const nav = useNavigation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const r = await getClientById(id);
      console.log("📌 DATA CLIENTE:", r);
      setData(r);
    } catch (e) {
      console.log("❌ Erro ao carregar detalhe cliente:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Eliminar Cliente",
      "Tem a certeza que deseja eliminar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteClient(id);
              console.log("🗑 Cliente eliminado:", res);

              Alert.alert("Sucesso", "Cliente eliminado com sucesso!", [
                {
                  text: "OK",
                  onPress: () => nav.goBack(),
                },
              ]);

            } catch (err) {
              const msgApi =
                err?.response?.data?.errors?.message ||
                err?.response?.data?.message ||
                err.message;

              if (msgApi === "Cannot delete a client that is already in use.") {
                Alert.alert(
                  "Cliente em uso",
                  "Não é possível eliminar este cliente porque já foi utilizado em documentos."
                );
              } else {
                Alert.alert("Erro", msgApi || "Erro ao eliminar cliente.");
              }
            }
          },
        },
      ]
    );
  }

  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#7ee081" />
      </View>
    );

  if (!data)
    return (
      <View style={s.center}>
        <Text style={{ color: "#fff" }}>Erro ao carregar cliente.</Text>
      </View>
    );

  // Campos que podem vir como objetos ou strings
  const city = data.city?.name ?? data.city ?? "—";
  const country = data.country?.name ?? data.country ?? "—";
  const region = data.region?.name ?? data.region ?? "—";
  const paymentMethod = data.paymentMethod?.name ?? data.paymentMethod ?? "—";
  const paymentTerm = data.paymentTerm?.name ?? data.paymentTerm ?? "—";
  const exemptReason = data.exemptedReason?.name ?? "—";

  const representativeName = data.representativeDetails?.name || "—";
  const representativeEmail = data.representativeDetails?.email || "—";
  const representativeMobile = data.representativeDetails?.mobile || "—";
  const representativePhone = data.representativeDetails?.telephone || "—";

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => nav.goBack()} style={s.back}>
        <Text style={s.backTxt}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.title}>{data.name}</Text>

      {/* Dados principais */}
      <View style={s.box}>
        <Text style={s.label}>NIF:</Text>
        <Text style={s.value}>{data.vatNumber}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Email:</Text>
        <Text style={s.value}>{data.email || "—"}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Telemóvel:</Text>
        <Text style={s.value}>{data.mobile || "—"}</Text>
      </View>

      {/* Morada */}
      <View style={s.box}>
        <Text style={s.label}>Cidade:</Text>
        <Text style={s.value}>{city}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Região:</Text>
        <Text style={s.value}>{region}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>País:</Text>
        <Text style={s.value}>{country}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Morada:</Text>
        <Text style={s.value}>{data.address || "—"}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Código Postal:</Text>
        <Text style={s.value}>{data.zipCode || "—"}</Text>
      </View>

      {/* Pagamentos */}
      <View style={s.box}>
        <Text style={s.label}>Método pagamento:</Text>
        <Text style={s.value}>{paymentMethod}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Condição pagamento:</Text>
        <Text style={s.value}>{paymentTerm}</Text>
      </View>

      {/* IVA */}
      <View style={s.box}>
        <Text style={s.label}>IVA Isento:</Text>
        <Text style={s.value}>{data.ivaExempted ? "Sim" : "Não"}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Motivo Isenção:</Text>
        <Text style={s.value}>{exemptReason}</Text>
      </View>

      {/* Representante */}
      <Text style={s.section}>Representante</Text>

      <View style={s.box}>
        <Text style={s.label}>Nome:</Text>
        <Text style={s.value}>{representativeName}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Email:</Text>
        <Text style={s.value}>{representativeEmail}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Telemóvel:</Text>
        <Text style={s.value}>{representativeMobile}</Text>
      </View>

      <View style={s.box}>
        <Text style={s.label}>Telefone:</Text>
        <Text style={s.value}>{representativePhone}</Text>
      </View>

      {/* BOTÃO ELIMINAR */}
      <TouchableOpacity onPress={handleDelete} style={s.deleteBtn}>
        <Text style={s.deleteTxt}>Eliminar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0e0c",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  back: { marginBottom: 15 },
  backTxt: { color: "#7ee081", fontSize: 16 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#7ee081",
    marginBottom: 20,
  },
  section: {
    marginTop: 25,
    marginBottom: 10,
    color: "#e7d7c3",
    fontSize: 18,
    fontWeight: "700",
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  label: { color: "#e7d7c3", fontSize: 16 },
  value: { color: "#fff", fontSize: 16, fontWeight: "600", maxWidth: "60%" },

  deleteBtn: {
    marginTop: 30,
    backgroundColor: "#a01818",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
