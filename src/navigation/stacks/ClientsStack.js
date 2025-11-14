// src/navigation/stacks/ClientsStack.js
import { createStackNavigator } from "@react-navigation/stack";
import ClientesScreen from "../../screens/ClientesScreen";
import ClientCreateScreen from "../../screens/Clients/ClientCreateScreen"; // <-- CERTINHO

const Stack = createStackNavigator();

export default function ClientsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ClientesLista" component={ClientesScreen} />

      <Stack.Screen
        name="ClienteCriar"
        component={ClientCreateScreen}
        options={{
          headerShown: true,
          title: "Criar Cliente",
          headerStyle: { backgroundColor: "#0f0e0c" },
          headerTintColor: "#7ee081",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  );
}
