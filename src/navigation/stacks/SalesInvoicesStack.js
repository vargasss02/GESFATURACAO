import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InvoiceCreateScreen from "../../screens/SalesInvoices/InvoiceCreateScreen";
import InvoiceDetailScreen from "../../screens/SalesInvoices/InvoiceDetailScreen";
import InvoicesListScreen from "../../screens/SalesInvoices/InvoicesListScreen";

const Stack = createNativeStackNavigator();

export default function SalesInvoicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InvoicesList"
        component={InvoicesListScreen}
        options={{
          title: "Faturas",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="InvoiceDetail"
        component={InvoiceDetailScreen}
        options={{
          title: "Detalhes da Fatura",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="InvoiceCreate"
        component={InvoiceCreateScreen}
        options={{
          title: "Criar Fatura",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
