// src/navigation/AppDrawer.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";

// STACKS
import ArtigosStack from "./stacks/ArtigosStack";
import ClientsStack from "./stacks/ClientsStack";
import OrcamentosStack from "./stacks/OrcamentosStack";
import SalesInvoicesStack from "./stacks/SalesInvoicesStack"; // ✅ NOVO

// SCREENS soltas
import DashboardScreen from "../screens/DashboardScreen";
import DefinicoesScreen from "../screens/DefinicoesScreen";
import GuiasTransporteScreen from "../screens/Transporte/GuiasTransporteScreen";
import FaturasReciboScreen from "../screens/Vendas/FaturasReciboScreen";
import {
  default as FaturasSimplificadasScreen,
  default as NotasDebitoScreen,
} from "../screens/Vendas/FaturasSimplificadasScreen";
import NotasCreditoScreen from "../screens/Vendas/NotasCreditoScreen";
import RecibosScreen from "../screens/Vendas/RecibosScreen";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#E5C79C",
        drawerInactiveTintColor: "#CBBBA0",
        drawerStyle: { backgroundColor: "#1B1916", width: 260 },
        drawerLabelStyle: { fontSize: 15, fontWeight: "500" },
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerLabel: "Início" }}
      />

      <Drawer.Screen
        name="Orcamentos"
        component={OrcamentosStack}
        options={{ drawerLabel: "Orçamentos" }}
      />

      <Drawer.Screen
        name="Clientes"
        component={ClientsStack}
        options={{ drawerLabel: "Clientes" }}
      />

      <Drawer.Screen
        name="GuiasTransporte"
        component={GuiasTransporteScreen}
        options={{ drawerLabel: "Guias de Transporte" }}
      />

      {/* --------------------------------------------- */}
      {/* NOVO MÓDULO OFICIAL DE FATURAS (sales/invoices) */}
      {/* --------------------------------------------- */}
      <Drawer.Screen
        name="SalesInvoices"
        component={SalesInvoicesStack}
        options={{ drawerLabel: "Faturas (Venda)" }}
      />

      {/* RESTO – módulos antigos sociais */}
      <Drawer.Screen
        name="FaturasSimplificadas"
        component={FaturasSimplificadasScreen}
        options={{ drawerLabel: "Faturas Simplificadas" }}
      />

      <Drawer.Screen
        name="FaturasRecibo"
        component={FaturasReciboScreen}
        options={{ drawerLabel: "Faturas Recibo" }}
      />

      <Drawer.Screen
        name="Recibos"
        component={RecibosScreen}
        options={{ drawerLabel: "Recibos" }}
      />

      <Drawer.Screen
        name="NotasCredito"
        component={NotasCreditoScreen}
        options={{ drawerLabel: "Notas de Crédito" }}
      />

      <Drawer.Screen
        name="NotasDebito"
        component={NotasDebitoScreen}
        options={{ drawerLabel: "Notas de Débito" }}
      />

      <Drawer.Screen
        name="Artigos"
        component={ArtigosStack}
        options={{ drawerLabel: "Artigos" }}
      />

      <Drawer.Screen
        name="Definicoes"
        component={DefinicoesScreen}
        options={{ drawerLabel: "Definições" }}
      />
    </Drawer.Navigator>
  );
}
