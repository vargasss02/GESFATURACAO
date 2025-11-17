// src/screens/Faturas/FaturaCriarScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import LinhaOrcamentoItem from "../../components/Orcamentos/LinhaOrcamentoItem";
import SelecionarClienteModal from "../../components/SelecionarClienteModal";
import SelecionarProdutoModal from "../../components/SelecionarProdutoModal";

import { createInvoice } from "../../api/invoices";
import { formatCurrency } from "../../utils/format";

export default function FaturaCriarScreen({ navigation }) {
  /** ===============================
   *  ESTADOS
   *  =============================== */
  const [cliente, setCliente] = useState(null);
  const [showClienteModal, setShowClienteModal] = useState(false);

  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);

  const [linhas, setLinhas] = useState([
    { id: Date.now(), product: null, quantity: 0, price: 0, iva: 0, total: 0 },
  ]);

  const [serie] = useState("API_2025");
  const [referencia, setReferencia] = useState("");
  const [obs, setObs] = useState("");
  const [descontoGlobal, setDescontoGlobal] = useState(0);

  /** ===============================
   *  RE-CALCULAR TOTAIS
   *  =============================== */
  const calcularTotais = () => {
    let subtotal = 0;
    let iva = 0;

    linhas.forEach((l) => {
      const linhaTotal = Number(l.price) * Number(l.quantity);
      const ivaLinha = (linhaTotal * (Number(l.iva) || 0)) / 100;

      subtotal += linhaTotal;
      iva += ivaLinha;
    });

    const total = subtotal + iva - (subtotal * descontoGlobal) / 100;

    return { subtotal, iva, total };
  };

  const totais = calcularTotais();

  /** ===============================
   *  ADICIONAR / REMOVER LINHAS
   *  =============================== */
  const adicionarLinha = () => {
    setLinhas((prev) => [
      ...prev,
      { id: Date.now(), product: null, quantity: 0, price: 0, iva: 0, total: 0 },
    ]);
  };

  const removerLinha = (id) => {
    setLinhas((prev) => prev.filter((l) => l.id !== id));
  };

  const atualizarLinha = (index, novo) => {
    const copy = [...linhas];
    copy[index] = { ...copy[index], ...novo };
    setLinhas(copy);
  };

  /** ===============================
   *  SELEÇÃO DE PRODUTO PARA UMA LINHA
   *  =============================== */
  const abrirSelecionarProduto = (index) => {
    setSelectedLineIndex(index);
    setShowProdutoModal(true);
  };

  const selecionarProduto = (produto) => {
    const index = selectedLineIndex;
    if (index === null) return;

    atualizarLinha(index, {
      product: produto,
      price: Number(produto?.pricePvp ?? 0),
      iva: produto?.tax?.value ?? 0,
    });

    setShowProdutoModal(false);
    setSelectedLineIndex(null);
  };

  /** ===============================
   *  SUBMETER A FATORA
   *  =============================== */
  const submeter = async () => {
    if (!cliente) {
      Alert.alert("Erro", "Selecione um cliente.");
      return;
    }

    if (linhas.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos 1 linha.");
      return;
    }

    const payload = {
      client: cliente.id,
      serie: serie,
      date: new Date().toISOString().slice(0, 10),
      expiration: new Date().toISOString().slice(0, 10),
      coin: 1, // Euro (€) segundo API
      payment: 1, // Pronto pagamento
      needsBank: false,
      finalize: false,

      lines: linhas.map((l) => ({
        article: l.product?.id ?? null,
        quantity: Number(l.quantity),
        price: Number(l.price),
        percentageDiscount: 0,
        tax: l.product?.tax?.id ?? 1,
        exemption: null,
        observations: "",
      })),

      reference: referencia,
      observations: obs,
      discount: descontoGlobal,
    };

    try {
      const data = await createInvoice(payload);

      Alert.alert("Sucesso", "Fatura criada com sucesso!");
      navigation.navigate("FaturaDetail", { id: data.id });
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falhou ao criar a fatura.");
    }
  };

  /** ===============================
   *  RENDER
   *  =============================== */
  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView style={{ padding: 16 }}>
        {/* CLIENTE */}
        <Text style={styles.label}>Cliente *</Text>

        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setShowClienteModal(true)}
        >
          <Text style={styles.selectText}>
            {cliente ? cliente.name : "Selecionar Cliente"}
          </Text>
        </TouchableOpacity>

        {/* SÉRIE */}
        <Text style={styles.label}>Série *</Text>
        <View style={styles.selectBoxDisabled}>
          <Text style={styles.selectText}>{serie}</Text>
        </View>

        {/* REFERÊNCIA */}
        <Text style={styles.label}>Referência</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{referencia}</Text>
        </View>

        {/* OBSERVAÇÕES */}
        <Text style={styles.label}>Observações</Text>
        <View style={[styles.inputBox, { height: 80 }]}></View>

        {/* LINHAS */}
        <Text style={[styles.label, { marginTop: 20 }]}>Linhas da Fatura</Text>

        {linhas.map((l, index) => (
          <LinhaOrcamentoItem
            key={l.id}
            line={l}
            index={index}
            onRemove={() => removerLinha(l.id)}
            onSelectProduct={() => abrirSelecionarProduto(index)}
            onUpdate={(novo) => atualizarLinha(index, novo)}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={adicionarLinha}>
          <Ionicons name="add-circle" size={26} color="#E5C79C" />
          <Text style={styles.addButtonText}>Adicionar Linha</Text>
        </TouchableOpacity>

        {/* TOTAL */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Subtotal: {formatCurrency(totais.subtotal)}</Text>
          <Text style={styles.totalText}>IVA: {formatCurrency(totais.iva)}</Text>
          <Text style={styles.totalTotal}>Total: {formatCurrency(totais.total)}</Text>
        </View>

        {/* BOTÃO SUBMETER */}
        <TouchableOpacity style={styles.submitButton} onPress={submeter}>
          <Text style={styles.submitText}>Criar Fatura</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
      <SelecionarClienteModal
        visible={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onSelect={(c) => {
          setCliente(c);
          setShowClienteModal(false);
        }}
      />

      <SelecionarProdutoModal
        visible={showProdutoModal}
        onClose={() => setShowProdutoModal(false)}
        onSelect={selecionarProduto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#CBBBA0",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 10,
  },
  selectBox: {
    backgroundColor: "#1B1916",
    padding: 12,
    borderRadius: 8,
    borderColor: "#5A4C35",
    borderWidth: 1,
  },
  selectBoxDisabled: {
    backgroundColor: "#252422",
    padding: 12,
    borderRadius: 8,
    borderColor: "#5A4C35",
    borderWidth: 1,
  },
  selectText: {
    color: "#E5C79C",
    fontSize: 15,
  },
  inputBox: {
    backgroundColor: "#1B1916",
    padding: 12,
    borderRadius: 8,
    borderColor: "#5A4C35",
    borderWidth: 1,
  },
  inputText: { color: "#E5C79C" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    marginLeft: 6,
    color: "#E5C79C",
    fontSize: 15,
  },
  totalBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#1B1916",
    borderRadius: 8,
  },
  totalText: {
    color: "#CBBBA0",
    fontSize: 15,
  },
  totalTotal: {
    color: "#E5C79C",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#E5C79C",
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
  },
  submitText: {
    textAlign: "center",
    color: "#1B1916",
    fontSize: 16,
    fontWeight: "bold",
  },
});
