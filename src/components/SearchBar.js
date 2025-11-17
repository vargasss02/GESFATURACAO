import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar({ value, onChange }) {
  return (
    <View style={s.box}>
      <Ionicons name="search" size={20} color="#aaa" style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Pesquisar..."
        placeholderTextColor="#777"
        style={s.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    flexDirection: "row",
    backgroundColor: "#1d1b17",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
});
