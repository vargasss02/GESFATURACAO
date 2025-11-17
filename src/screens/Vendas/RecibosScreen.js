import { StyleSheet, Text, View } from "react-native";
import DrawerMenuIcon from "../../components/DrawerMenuIcon";

export default function RecibosScreen() {
  return (
    <View style={s.container}>
      <DrawerMenuIcon />

      <Text style={s.title}>Recibos</Text>

      <View style={s.box}>
        <Text style={s.text}>
          O módulo de recibos ainda não está implementado.
        </Text>
        <Text style={s.textSmall}>
          (Podes ligar isto à API oficial quando quiseres.)
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
