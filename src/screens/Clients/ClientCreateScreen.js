// src/screens/Clients/ClientCreateScreen.js
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { createClient, getNextClientCode } from "../../api/clients";

export default function ClientCreateScreen() {
  const nav = useNavigation();

  // Main fields (from swagger)
  const [name, setName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [local, setLocal] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [mobile, setMobile] = useState("");
  const [telephone, setTelephone] = useState("");
  const [fax, setFax] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [representativeEmail, setRepresentativeEmail] = useState("");
  const [representativeMobile, setRepresentativeMobile] = useState("");
  const [representativeTelephone, setRepresentativeTelephone] = useState("");
  const [accountType, setAccountType] = useState(""); // integer
  const [ivaExempted, setIvaExempted] = useState(false); // boolean
  const [exemptedReason, setExemptedReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentConditions, setPaymentConditions] = useState("");
  const [discount, setDiscount] = useState("");
  const [internalCode, setInternalCode] = useState("");
  const [comments, setComments] = useState("");

  const [loading, setLoading] = useState(false);
  const [gettingCode, setGettingCode] = useState(false);

  useEffect(() => {
    // try to preload next internal code (non-blocking)
    (async () => {
      try {
        setGettingCode(true);
        const res = await getNextClientCode();
        // swagger might return { code: '...' } or a plain string/number
        if (res?.code) setInternalCode(String(res.code));
        else if (typeof res === "string" || typeof res === "number")
          setInternalCode(String(res));
      } catch (e) {
        // ignore
      } finally {
        setGettingCode(false);
      }
    })();
  }, []);

  function validate() {
    if (!name.trim()) {
      Alert.alert("Validação", "O campo 'Nome' é obrigatório.");
      return false;
    }
    if (!country.trim()) {
      Alert.alert("Validação", "O campo 'País' é obrigatório.");
      return false;
    }
    // email minimal check
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Validação", "Indique um email válido.");
      return false;
    }
    return true;
  }

  async function handleSave() {
    if (!validate()) return;

    setLoading(true);
    try {
      // Build payload only with fields that have value or are required
      const payload = {
        name: name.trim(),
        vatNumber: vatNumber.trim() || undefined,
        country: country.trim(),
        address: address.trim() || undefined,
        zipCode: zipCode.trim() || undefined,
        region: region.trim() || undefined,
        city: city.trim() || undefined,
        local: local.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        mobile: mobile.trim() || undefined,
        telephone: telephone.trim() || undefined,
        fax: fax.trim() || undefined,
        representativeName: representativeName.trim() || undefined,
        representativeEmail: representativeEmail.trim() || undefined,
        representativeMobile: representativeMobile.trim() || undefined,
        representativeTelephone: representativeTelephone.trim() || undefined,
        accountType: accountType ? Number(accountType) : undefined,
        ivaExempted: ivaExempted ? 1 : undefined, // API may expect boolean/0-1
        exemptedReason: exemptedReason ? Number(exemptedReason) : undefined,
        paymentMethod: paymentMethod.trim() || undefined,
        paymentConditions: paymentConditions.trim() || undefined,
        discount: discount ? Number(discount) : undefined,
        internalCode: internalCode.trim() || undefined,
        comments: comments.trim() || undefined,
      };

      const res = await createClient(payload);

      // success
      Alert.alert("Sucesso", "Cliente criado com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            // try to go back to previous screen (list), fallback to drawer Clients
            if (nav.canGoBack()) nav.goBack();
            else nav.navigate("Clientes");
          },
        },
      ]);
    } catch (e) {
      // show server message if present
      Alert.alert("Erro", e.message || "Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0f0e0c" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Criar Cliente</Text>

        {/* Dados Principais */}
        <Text style={styles.section}>Dados principais</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nome *"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={vatNumber}
          onChangeText={setVatNumber}
          placeholder="NIF / VAT"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={country}
          onChangeText={setCountry}
          placeholder="País *"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Morada */}
        <Text style={styles.section}>Morada</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Endereço"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={zipCode}
          onChangeText={setZipCode}
          placeholder="Código Postal"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Cidade"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={region}
          onChangeText={setRegion}
          placeholder="Região"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={local}
          onChangeText={setLocal}
          placeholder="Local"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Contactos */}
        <Text style={styles.section}>Contactos</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="Telemóvel"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          value={telephone}
          onChangeText={setTelephone}
          placeholder="Telefone"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Representante */}
        <Text style={styles.section}>Representante</Text>
        <TextInput
          value={representativeName}
          onChangeText={setRepresentativeName}
          placeholder="Nome do representante"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={representativeEmail}
          onChangeText={setRepresentativeEmail}
          placeholder="Email represent."
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={representativeMobile}
          onChangeText={setRepresentativeMobile}
          placeholder="Telemóvel represent."
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Financeiro / Outras */}
        <Text style={styles.section}>Financeiro / Outras</Text>
        <TextInput
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          placeholder="Método de pagamento"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={paymentConditions}
          onChangeText={setPaymentConditions}
          placeholder="Condições de pagamento"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={discount}
          onChangeText={setDiscount}
          placeholder="Desconto (%)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          value={internalCode}
          onChangeText={setInternalCode}
          placeholder={gettingCode ? "A obter código..." : "Código interno"}
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={comments}
          onChangeText={setComments}
          placeholder="Comentários"
          placeholderTextColor="#999"
          style={[styles.input, { height: 90 }]}
          multiline
        />

        {/* Ações */}
        <View style={{ height: 12 }} />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Salvar cliente" onPress={handleSave} color="#7ee081" />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#7ee081",
    marginBottom: 12,
  },
  section: {
    color: "#e7d7c3",
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1b1916",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});
