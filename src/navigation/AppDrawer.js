import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';

// Stacks
import OrcamentosStack from './stacks/OrcamentosStack';

// Screens “soltas”
import ArtigosScreen from '../screens/ArtigosScreen';
import ClientesScreen from '../screens/ClientesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DefinicoesScreen from '../screens/DefinicoesScreen';
import GuiasTransporteScreen from '../screens/Transporte/GuiasTransporteScreen';
import FaturasReciboScreen from '../screens/Vendas/FaturasReciboScreen';
import FaturasScreen from '../screens/Vendas/FaturasScreen';
import FaturasSimplificadasScreen from '../screens/Vendas/FaturasSimplificadasScreen';
import NotasCreditoScreen from '../screens/Vendas/NotasCreditoScreen';
import NotasDebitoScreen from '../screens/Vendas/NotasDebitoScreen';
import RecibosScreen from '../screens/Vendas/RecibosScreen';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#E5C79C',
        drawerInactiveTintColor: '#CBBBA0',
        drawerStyle: {
          backgroundColor: '#1B1916',
          width: 260,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
        },
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerLabel: 'Início' }}
      />

      {/* 👉 Stack: Lista + Detalhe (sem conflito de nomes) */}
      <Drawer.Screen
        name="Orcamentos"
        component={OrcamentosStack}
        options={{ drawerLabel: 'Orçamentos' }}
      />

      <Drawer.Screen
        name="GuiasTransporte"
        component={GuiasTransporteScreen}
        options={{ drawerLabel: 'Guias de Transporte' }}
      />

      <Drawer.Screen
        name="Faturas"
        component={FaturasScreen}
        options={{ drawerLabel: 'Faturas' }}
      />

      <Drawer.Screen
        name="FaturasSimplificadas"
        component={FaturasSimplificadasScreen}
        options={{ drawerLabel: 'Faturas Simplificadas' }}
      />

      <Drawer.Screen
        name="FaturasRecibo"
        component={FaturasReciboScreen}
        options={{ drawerLabel: 'Faturas Recibo' }}
      />

      <Drawer.Screen
        name="Recibos"
        component={RecibosScreen}
        options={{ drawerLabel: 'Recibos' }}
      />

      <Drawer.Screen
        name="NotasCredito"
        component={NotasCreditoScreen}
        options={{ drawerLabel: 'Notas de Crédito' }}
      />

      <Drawer.Screen
        name="NotasDebito"
        component={NotasDebitoScreen}
        options={{ drawerLabel: 'Notas de Débito' }}
      />

      <Drawer.Screen
        name="Artigos"
        component={ArtigosScreen}
        options={{ drawerLabel: 'Artigos' }}
      />

      <Drawer.Screen
        name="Clientes"
        component={ClientesScreen}
        options={{ drawerLabel: 'Clientes' }}
      />

      <Drawer.Screen
        name="Definicoes"
        component={DefinicoesScreen}
        options={{ drawerLabel: 'Definições' }}
      />
    </Drawer.Navigator>
  );
}
