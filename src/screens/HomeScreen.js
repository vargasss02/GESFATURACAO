import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      {/* Botão para abrir o Drawer */}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Icon name="menu" size={36} color="#222" />
      </TouchableOpacity>

      <Text style={styles.text}>Login efetuado com sucesso!</Text>

      {/* 🔥 Botão NOVA FATURA */}
      <TouchableOpacity
        style={styles.newInvoiceBtn}
        onPress={() =>
          navigation.navigate("Faturas", { screen: "CriarFatura" })
        }
      >
        <Text style={styles.newInvoiceTxt}>+ Criar Nova Fatura</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F0FF',
  },

  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 30,
  },

  menuButton: {
    position: 'absolute',
    left: 24,
    top: 54,
    zIndex: 1000,
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 24,
  },

  /* 🔥 Novo botão */
  newInvoiceBtn: {
    marginTop: 30,
    backgroundColor: "#7ee081",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },

  newInvoiceTxt: {
    color: "#000",
    fontWeight: "700",
    fontSize: 18,
  },
});
