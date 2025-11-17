import { StyleSheet, Text, View } from "react-native";
import DrawerMenuIcon from "../../components/DrawerMenuIcon";

export default function NotasDebitoScreen() {
  return (
    <View style={s.container}>
      <DrawerMenuIcon />

      <Text style={s.title}>Notas de Débito</Text>

      <View style={s.box}>
        <Text style={s.text}>
          Este módulo ainda não está implementado.
        </Text>
        <Text style={s.textSmall}>
          (Podes preencher esta área com a API oficial de notas de débito.)
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0e0c",
    padding: 16,
  },
  title: {
    color: "#f5e6d3",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  box: {
    backgroundColor: "#1b1916",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  textSmall: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 8,
  },
});
