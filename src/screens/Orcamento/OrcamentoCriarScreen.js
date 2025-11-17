// src/screens/Orcamento/OrcamentoCriarScreen.js
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { createBudget, listBudgets } from "../../api/budgets";
import LinhaOrcamentoItem from "../../components/Orcamentos/LinhaOrcamentoItem";
import SelecionarClienteModal from "../../components/Orcamentos/SelecionarClienteModal";

export default function OrcamentoCriarScreen({ navigation }) {
  const [client, setClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);

  const [serie, setSerie] = useState("1");
  const [number, setNumber] = useState(""); // vai ser preenchido pelo next
  const [date, setDate] = useState("");
  const [expiration, setExpiration] = useState("");
  const [reference, setReference] = useState("");
  const [observations, setObservations] = useState("");

  const [lines, setLines] = useState([]);

  // tentamos obter o "next number" a partir da última listagem de orçamentos
  useEffect(() => {
    (async () => {
      try {
        // pede 1 orçamento (o mais recente) e tenta extrair number
        const res = await listBudgets({ page: 1, perPage: 1 });
        const last = res?.items?.[0];
        if (last && last.number) {
          // tenta extrair número numérico no fim (se for string como "2025-001")
          const parsed = parseInt(String(last.number).replace(/\D/g, ""), 10);
          if (!Number.isNaN(parsed)) {
            setNumber(String(parsed + 1));
            return;
          }
        }
      } catch (e) {
        // ignore — fallback abaixo
      }
      // fallback: timestamp curto
      setNumber(String(Date.now()).slice(-6));
    })();
  }, []);

  // alterar linha (recebe from LinhaOrcamentoItem)
  function handleLineChange(index, newLine) {
    const arr = [...lines];
    arr[index] = newLine;
    setLines(arr);
  }

  function handleAddLine() {
    setLines((prev) => [
      ...prev,
      {
        id: "",
        description: "",
        quantity: "1",
        price: "0",
        tax: "23",
        discount: "0",
        retention: "0",
      },
    ]);
  }

  function handleRemoveLine(i) {
    const arr = [...lines];
    arr.splice(i, 1);
    setLines(arr);
  }

  // totais: subtotal (sem IVA), iva total, retenções/descontos, total final
  const totals = lines.reduce(
    (acc, l) => {
      const qty = Number(l.quantity) || 0;
      const price = Number(l.price) || 0;
      const discount = Number(l.discount) || 0;
      const retention = Number(l.retention) || 0;
      const net = qty * price - discount - retention;
      const taxPercent = Number(l.tax) || 0;
      const vat = (net * taxPercent) / 100;
      acc.subtotal += net;
      acc.vat += vat;
      acc.retention += retention;
      acc.discount += discount;
      return acc;
    },
    { subtotal: 0, vat: 0, retention: 0, discount: 0 }
  );

  const grandTotal = totals.subtotal + totals.vat;

  async function handleSave() {
    if (!client) {
      Alert.alert("Erro", "Seleciona um cliente.");
      return;
    }
    if (!date) {
      Alert.alert("Erro", "Data é obrigatória.");
      return;
    }
    if (lines.length === 0) {
      Alert.alert("Erro", "Adiciona pelo menos uma linha.");
      return;
    }

    try {
      const payload = {
        client: Number(client.id),
        serie,
        number: String(number),
        date,
        expiration,
        reference,
        observations,
        coin: 1,
        discount: 0,
        dueDate: 0,
        finalize: false,
        lines: lines.map((l) => ({
          id: l.id ? Number(l.id) : undefined,
          tax: Number(l.tax),
          quantity: Number(l.quantity),
          price: Number(l.price),
          description: l.description,
          discount: Number(l.discount),
          retention: Number(l.retention),
        })),
      };

      console.log("📤 ENVIANDO ORÇAMENTO:", payload);

      await createBudget(payload);

      Alert.alert("Sucesso", "Orçamento criado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.error("Erro criar orçamento:", e);
      Alert.alert("Erro", e.message || "Erro ao criar orçamento.");
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.title}>Criar Orçamento</Text>

      <TouchableOpacity
        style={s.selectBtn}
        onPress={() => setShowClientModal(true)}
      >
        <Text style={s.selectTxt}>
          {client ? `${client.name} (NIF ${client.vatNumber})` : "Selecionar Cliente"}
        </Text>
      </TouchableOpacity>

      <SelecionarClienteModal
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSelect={(c) => {
          setClient(c);
          setShowClientModal(false);
        }}
      />

      <TextInput style={s.input} placeholder="Número" value={number} onChangeText={setNumber} />
      <TextInput style={s.input} placeholder="Série" value={serie} onChangeText={setSerie} />
      <TextInput style={s.input} placeholder="Data (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput style={s.input} placeholder="Expiração (YYYY-MM-DD)" value={expiration} onChangeText={setExpiration} />
      <TextInput style={s.input} placeholder="Referência" value={reference} onChangeText={setReference} />
      <TextInput style={s.input} placeholder="Observações" value={observations} onChangeText={setObservations} />

      <Text style={s.sub}>Linhas</Text>

      {lines.map((line, i) => (
        <LinhaOrcamentoItem
          key={i}
          index={i}
          data={line}
          onChange={handleLineChange}
          onRemove={handleRemoveLine}
        />
      ))}

      <TouchableOpacity style={s.btnAdd} onPress={handleAddLine}>
        <Text style={s.btnAddTxt}>+ Adicionar Linha</Text>
      </TouchableOpacity>

      <View style={s.totalsBox}>
        <Text style={s.totLine}>s/IVA: <Text style={s.totVal}>{totals.subtotal.toFixed(2)} €</Text></Text>
        <Text style={s.totLine}>IVA: <Text style={s.totVal}>{totals.vat.toFixed(2)} €</Text></Text>
        <Text style={s.totLine}>Descontos: <Text style={s.totVal}>{totals.discount.toFixed(2)} €</Text></Text>
        <Text style={s.totLine}>Retenções: <Text style={s.totVal}>{totals.retention.toFixed(2)} €</Text></Text>
        <Text style={s.grand}>Total: <Text style={s.grandVal}>{grandTotal.toFixed(2)} €</Text></Text>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleSave}>
        <Text style={s.btnTxt}>Guardar Orçamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0e0c", padding: 16 },
  title: { color: "#7ee081", fontSize: 22, fontWeight: "700", marginBottom: 14 },

  selectBtn: {
    backgroundColor: "#1f1c19",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  selectTxt: { color: "#fff" },

  input: {
    backgroundColor: "#1b1916",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  sub: { color: "#eee", fontSize: 18, marginTop: 8, marginBottom: 8 },

  btnAdd: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  btnAddTxt: { color: "#fff", textAlign: "center" },

  totalsBox: {
    backgroundColor: "#161412",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  totLine: { color: "#cfc6bb", marginTop: 4 },
  totVal: { color: "#fff", fontWeight: "700" },
  grand: { color: "#e7d7c3", fontWeight: "800", marginTop: 8 },
  grandVal: { color: "#ffcc66", fontWeight: "900" },

  btn: {
    backgroundColor: "#7ee081",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  btnTxt: { textAlign: "center", fontWeight: "700", color: "#000" },
});
