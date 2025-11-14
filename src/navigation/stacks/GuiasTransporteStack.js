import { createStackNavigator } from "@react-navigation/stack";
import GuiasTransporteScreen from "../../screens/Transporte/GuiasTransporteScreen";
import GuiaTransporteDetalheScreen from "../../screens/Transporte/GuiaTransporteDetalheScreen";

const Stack = createStackNavigator();

export default function GuiasTransporteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuiasLista" component={GuiasTransporteScreen} />

      <Stack.Screen
        name="GuiaTransporteDetalhe"
        component={GuiaTransporteDetalheScreen}
        options={{
          headerShown: true,
          title: "Detalhe da Guia",
          headerStyle: { backgroundColor: "#0f0e0c" },
          headerTintColor: "#7ee081",
        }}
      />
    </Stack.Navigator>
  );
}
