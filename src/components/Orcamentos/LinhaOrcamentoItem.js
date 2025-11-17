// src/components/Orcamentos/LinhaOrcamentoItem.js
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SelecionarProdutoModal from "./SelecionarProdutoModal";

export default function LinhaOrcamentoItem({ index, data, onChange, onRemove }) {
  const [line, setLine] = useState({
    id: data?.id ?? "",
    description: data?.description ?? "",
    quantity: data?.quantity ?? "1",
    price: data?.price ?? "0",
    tax: data?.tax ?? "23",
    discount: data?.discount ?? "0",
    retention: data?.retention ?? "0",
  });

  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    onChange(index, line);
  }, [line]); // eslint-disable-line

  function updateField(k, v) {
    setLine((prev) => ({ ...prev, [k]: v }));
  }

  function handleSelectProduct(p) {
    setLine((prev) => ({
      ...prev,
      id: p.id ?? prev.id,
      description: p.description ?? p.name ?? prev.description,
      price: String(p.pricePvp ?? p.price ?? prev.price ?? 0),
      tax: String(p.tax?.value ?? prev.tax ?? 23),
    }));
  }

  // cálculos
  const qty = Number(line.quantity) || 0;
  const price = Number(line.price) || 0;
  const discount = Number(line.discount) || 0;
  const retention = Number(line.retention) || 0;
  const netLine = qty * price - discount - retention;
  const taxPercent = Number(line.tax) || 0;
  const vat = (netLine * taxPercent) / 100;
  const totalWithVat = netLine + vat;

  return (
    <View style={s.box}>
      <View style={s.header}>
        <Text style={s.title}>Linha {index + 1}</Text>
        <TouchableOpacity onPress={() => onRemove(index)}>
          <Text style={s.remove}>✕</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.selectBtn} onPress={() => setShowProductModal(true)}>
        <Text style={s.selectTxt}>
          {line.description ? line.description : "Selecionar Artigo (opcional)"}
        </Text>
      </TouchableOpacity>

      <View style={s.row}>
        <View style={s.col}>
          <Text style={s.label}>Qtd</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={String(line.quantity)}
            onChangeText={(v) => updateField("quantity", v)}
          />
        </View>

        <View style={s.col}>
          <Text style={s.label}>Preço</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={String(line.price)}
            onChangeText={(v) => updateField("price", v)}
          />
        </View>

        <View style={s.col}>
          <Text style={s.label}>IVA %</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={String(line.tax)}
            onChangeText={(v) => updateField("tax", v)}
          />
        </View>
      </View>

      <View style={s.row}>
        <View style={s.col}>
          <Text style={s.label}>Desconto</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={String(line.discount)}
            onChangeText={(v) => updateField("discount", v)}
          />
        </View>

        <View style={s.col}>
          <Text style={s.label}>Retenção</Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            value={String(line.retention)}
            onChangeText={(v) => updateField("retention", v)}
          />
        </View>

        <View style={s.col}>
          <Text style={s.label}>Total</Text>
          <Text style={s.total}>
            {Number(totalWithVat || 0).toFixed(2)} €
          </Text>
        </View>
      </View>

      <SelecionarProdutoModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelect={handleSelectProduct}
      />
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    backgroundColor: "#191612",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { color: "#cbb89e", fontWeight: "700" },
  remove: { color: "#ff6b6b", fontSize: 18, fontWeight: "700" },

  selectBtn: {
    backgroundColor: "#26231f",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectTxt: { color: "#fff" },

  row: { flexDirection: "row", marginBottom: 10 },
  col: { flex: 1, marginRight: 8 },
  label: { color: "#aaa", marginBottom: 4 },
  input: {
    backgroundColor: "#1f1c19",
    padding: 8,
    borderRadius: 6,
    color: "#fff",
  },

  total: {
    color: "#7ee081",
    fontWeight: "700",
    paddingTop: 10,
    fontSize: 16,
  },
});
