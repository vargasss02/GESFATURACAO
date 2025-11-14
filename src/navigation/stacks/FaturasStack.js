// src/navigation/stacks/FaturasStack.js
import { createStackNavigator } from "@react-navigation/stack";
import FaturaCriarScreen from "../../screens/Vendas/FaturaCriarScreen";
import FaturaDetalheScreen from "../../screens/Vendas/FaturaDetalheScreen";
import FaturasScreen from "../../screens/Vendas/FaturasScreen";

const Stack = createStackNavigator();

export default function FaturasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // por padrão escondemos headers para a lista
      }}
    >
      <Stack.Screen name="FaturasLista" component={FaturasScreen} />

      <Stack.Screen
        name="FaturaDetalhe"
        component={FaturaDetalheScreen}
        options={{
          headerShown: true,
          title: "Detalhes da Fatura",
          headerStyle: { backgroundColor: "#0f0e0c" },
          headerTintColor: "#7ee081",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <Stack.Screen
        name="FaturaCriar"
        component={FaturaCriarScreen}
        options={{
          headerShown: true,
          title: "Criar Fatura",
          headerStyle: { backgroundColor: "#0f0e0c" },
          headerTintColor: "#7ee081",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  );
}
