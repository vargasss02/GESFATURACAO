// src/navigation/stacks/TransportStack.js
import { createStackNavigator } from "@react-navigation/stack";
import GuiaCreateScreen from "../../screens/Transporte/GuiaCreateScreen";
import GuiaDetalheScreen from "../../screens/Transporte/GuiaDetalheScreen"; // opcional, apenas placeholder
import GuiasTransporteScreen from "../../screens/Transporte/GuiasTransporteScreen";

const Stack = createStackNavigator();

export default function TransportStack() {
  return (
    <Stack.Navigator initialRouteName="GuiasLista" screenOptions={{ headerStyle: { backgroundColor: '#0f0e0c' }, headerTintColor: '#7ee081' }}>
      <Stack.Screen
        name="GuiasLista"
        component={GuiasTransporteScreen}
        options={{ title: "Guias de Transporte", headerShown: true }}
      />
      <Stack.Screen
        name="GuiaNova"
        component={GuiaCreateScreen}
        options={{ title: "Nova Guia", headerShown: true }}
      />
      {/* Se quiseres um ecrã detalhe */}
      <Stack.Screen
        name="GuiaDetalhe"
        component={GuiaDetalheScreen}
        options={{ title: "Detalhe da Guia", headerShown: true }}
      />
    </Stack.Navigator>
  );
}
