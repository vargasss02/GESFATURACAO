// src/navigation/stacks/FaturasStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FaturaCriarScreen from "../../screens/Faturas/FaturaCriarScreen";
import FaturaDetalheScreen from "../../screens/Faturas/FaturaDetalheScreen";
import FaturasListaScreen from "../../screens/Faturas/FaturasListaScreen";

const Stack = createNativeStackNavigator();

export default function FaturasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* LISTA */}
      <Stack.Screen
        name="FaturasLista"
        component={FaturasListaScreen}
      />

      {/* CRIAR */}
      <Stack.Screen
        name="FaturaCriar"
        component={FaturaCriarScreen}
      />

      {/* DETALHE */}
      <Stack.Screen
        name="FaturaDetalhe"
        component={FaturaDetalheScreen}
      />
    </Stack.Navigator>
  );
}
