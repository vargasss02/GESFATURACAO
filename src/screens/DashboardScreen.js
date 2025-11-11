import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';


export default function DashboardScreen() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ecrã Principal (Dashboard)</Text>
      <Button
        title="Ir para Orçamentos"
        onPress={() => navigation.navigate('Orcamentos')}
      />
      <Button
        title="Ir para Clientes"
        onPress={() => navigation.navigate('Clientes')}
      />
      <Button
        title="Ir para Faturas"
        onPress={() => navigation.navigate('Faturas')}
      />
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
    marginBottom: 18,
    color: '#654321',
    textAlign: 'center',
  },
});
