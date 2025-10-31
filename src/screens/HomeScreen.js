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
});
