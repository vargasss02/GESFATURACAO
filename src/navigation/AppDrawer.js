import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';

// STACKS
import ClientsStack from './stacks/ClientsStack';
import FaturasStack from './stacks/FaturasStack';
import OrcamentosStack from './stacks/OrcamentosStack';

// SCREENS SOLTAS
import ArtigosScreen from '../screens/ArtigosScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DefinicoesScreen from '../screens/DefinicoesScreen';
import GuiasTransporteScreen from '../screens/Transporte/GuiasTransporteScreen';
import FaturasReciboScreen from '../screens/Vendas/FaturasReciboScreen';
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
        drawerStyle: { backgroundColor: '#1B1916', width: 260 },
        drawerLabelStyle: { fontSize: 15, fontWeight: '500' },
      }}
      initialRouteName="Dashboard"
    >
      {/* DASHBOARD */}
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerLabel: 'Início' }}
      />

      {/* ORÇAMENTOS */}
      <Drawer.Screen
        name="Orcamentos"
        component={OrcamentosStack}
        options={{ drawerLabel: 'Orçamentos' }}
      />

      {/* CLIENTES */}
      <Drawer.Screen
        name="Clientes"
        component={ClientsStack}
        options={{ drawerLabel: 'Clientes' }}
      />

      {/* GUIAS DE TRANSPORTE */}
      <Drawer.Screen
        name="GuiasTransporte"
        component={GuiasTransporteScreen}
        options={{ drawerLabel: 'Guias de Transporte' }}
      />

      {/* FATURAS (STACK COMPLETA) */}
      <Drawer.Screen
        name="Faturas"
        component={FaturasStack}
        options={{ drawerLabel: 'Faturas' }}
      />

      {/* FATURAS SIMPLIFICADAS */}
      <Drawer.Screen
        name="FaturasSimplificadas"
        component={FaturasSimplificadasScreen}
        options={{ drawerLabel: 'Faturas Simplificadas' }}
      />

      {/* FATURAS RECIBO */}
      <Drawer.Screen
        name="FaturasRecibo"
        component={FaturasReciboScreen}
        options={{ drawerLabel: 'Faturas Recibo' }}
      />

      {/* RECIBOS */}
      <Drawer.Screen
        name="Recibos"
        component={RecibosScreen}
        options={{ drawerLabel: 'Recibos' }}
      />

      {/* NOTAS DE CRÉDITO */}
      <Drawer.Screen
        name="NotasCredito"
        component={NotasCreditoScreen}
        options={{ drawerLabel: 'Notas de Crédito' }}
      />

      {/* NOTAS DE DÉBITO */}
      <Drawer.Screen
        name="NotasDebito"
        component={NotasDebitoScreen}
        options={{ drawerLabel: 'Notas de Débito' }}
      />

      {/* ARTIGOS */}
      <Drawer.Screen
        name="Artigos"
        component={ArtigosScreen}
        options={{ drawerLabel: 'Artigos' }}
      />

      {/* DEFINIÇÕES */}
      <Drawer.Screen
        name="Definicoes"
        component={DefinicoesScreen}
        options={{ drawerLabel: 'Definições' }}
      />
    </Drawer.Navigator>
  );
}
