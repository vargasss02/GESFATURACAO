// src/navigation/stacks/OrcamentosStack.js

import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity } from "react-native";

import OrcamentoCriarScreen from "../../screens/Orcamento/OrcamentoCriarScreen";
import OrcamentoDetalheScreen from "../../screens/Orcamento/OrcamentoDetalheScreen";
import OrcamentosScreen from "../../screens/Orcamento/OrcamentosScreen";

const Stack = createStackNavigator();

export default function OrcamentosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0f0e0c" },
        headerTintColor: "#7ee081",
        headerTitleStyle: { fontWeight: "bold", color: "#7ee081" },
      }}
    >

      {/* LISTA DE ORÇAMENTOS */}
      <Stack.Screen
        name="OrcamentosLista"
        component={OrcamentosScreen}
        options={({ navigation }) => ({
          title: "Orçamentos",

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Dashboard")}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={{ color: "#7ee081", fontSize: 18 }}>← Voltar</Text>
            </TouchableOpacity>
          ),

          // Botão Criar (+)
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("OrcamentoCriar")}
              style={{ paddingHorizontal: 10 }}
            >
              <Text style={{ color: "#7ee081", fontSize: 24 }}>＋</Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* DETALHES DO ORÇAMENTO */}
      <Stack.Screen
        name="OrcamentoDetalhe"
        component={OrcamentoDetalheScreen}
        options={{
          title: "Detalhes do Orçamento",
        }}
      />

      {/* CRIAR ORÇAMENTO */}
      <Stack.Screen
        name="OrcamentoCriar"
        component={OrcamentoCriarScreen}
        options={{
          title: "Criar Orçamento",
        }}
      />
    </Stack.Navigator>
  );
}
