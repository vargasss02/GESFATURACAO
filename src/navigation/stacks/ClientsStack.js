import { createStackNavigator } from "@react-navigation/stack";

import ClientesScreen from "../../screens/ClientesScreen";
import ClientCreateScreen from "../../screens/Clients/ClientCreateScreen";
import ClientDetailScreen from "../../screens/Clients/ClientDetailScreen";

const Stack = createStackNavigator();

export default function ClientsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientesLista" component={ClientesScreen} />
      <Stack.Screen name="ClienteCriar" component={ClientCreateScreen} />
      <Stack.Screen name="ClienteDetalhe" component={ClientDetailScreen} />
    </Stack.Navigator>
  );
}
