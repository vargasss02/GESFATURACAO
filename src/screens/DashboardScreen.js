import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Botão para abrir menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      {/* Botões principais */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("ClientesLista")}
      >
        <Text style={styles.btnText}>Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("ClienteCriar")}
      >
        <Text style={styles.btnText}>Criar Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Faturas")}
      >
        <Text style={styles.btnText}>Faturas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("GuiasTransporte")}
      >
        <Text style={styles.btnText}>Guias de Transporte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Orcamentos")}
      >
        <Text style={styles.btnText}>Orçamentos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0e0c",
    paddingTop: 70,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#7ee081",
    fontWeight: "bold",
    marginBottom: 40,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  menuText: {
    color: "#7ee081",
    fontSize: 32,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#1b1916",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7ee081",
  },
  btnText: {
    color: "#e7d7c3",
    fontSize: 18,
    fontWeight: "600",
  },
});
