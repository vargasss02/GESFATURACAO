import { createStackNavigator } from "@react-navigation/stack";

import ArtigoDetalhesScreen from "../../screens/Artigos/ArtigoDetalhesScreen";
import ArtigosScreen from "../../screens/Artigos/ArtigosScreen";

import ArtigoCriarScreen from "../../screens/Artigos/ArtigoCriarScreen";
import ArtigoEditarScreen from "../../screens/Artigos/ArtigoEditarScreen";

const Stack = createStackNavigator();

export default function ArtigosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* LISTA */}
      <Stack.Screen name="ArtigosLista" component={ArtigosScreen} />

      {/* DETALHE */}
      <Stack.Screen name="ArtigoDetalhes" component={ArtigoDetalhesScreen} />

      {/* CRIAR */}
      <Stack.Screen name="ArtigoCriar" component={ArtigoCriarScreen} />

      {/* EDITAR */}
      <Stack.Screen name="ArtigoEditar" component={ArtigoEditarScreen} />

    </Stack.Navigator>
  );
}
