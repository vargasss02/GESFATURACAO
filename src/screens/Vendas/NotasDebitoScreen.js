import { StyleSheet, Text, View } from 'react-native';

export default function NotasDebitoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas de Débito</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#654321',
    textAlign: 'center',
  },
});
