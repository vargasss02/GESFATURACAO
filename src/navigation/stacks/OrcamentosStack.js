import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity } from 'react-native';

import OrcamentoDetalheScreen from '../../screens/Orcamento/OrcamentoDetalheScreen';
import OrcamentosScreen from '../../screens/Orcamento/OrcamentosScreen';

const Stack = createStackNavigator();

export default function OrcamentosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f0e0c' },
        headerTintColor: '#7ee081',
        headerTitleStyle: { fontWeight: 'bold', color: '#7ee081' },
      }}
    >

      {/* LISTA — FORÇA BACKBUTTON */}
      <Stack.Screen
        name="OrcamentosLista"
        component={OrcamentosScreen}
        options={({ navigation }) => ({
          title: 'Orçamentos',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={{ color: '#7ee081', fontSize: 18 }}>← Voltar</Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* DETALHE — sem alterações */}
      <Stack.Screen
        name="OrcamentoDetalhe"
        component={OrcamentoDetalheScreen}
        options={{
          title: 'Detalhes do Orçamento',
        }}
      />
    </Stack.Navigator>
  );
}
