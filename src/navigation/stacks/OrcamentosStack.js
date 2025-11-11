import { createStackNavigator } from '@react-navigation/stack';

import OrcamentoDetalheScreen from '../../screens/Orcamento/OrcamentoDetalheScreen';
import OrcamentosScreen from '../../screens/Orcamento/OrcamentosScreen';

const Stack = createStackNavigator();

export default function OrcamentosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrcamentosLista" component={OrcamentosScreen} />
      <Stack.Screen name="OrcamentoDetalhe" component={OrcamentoDetalheScreen} />
    </Stack.Navigator>
  );
}
