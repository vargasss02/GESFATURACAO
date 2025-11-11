import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { logout } from '../api/auth';

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    // ⚠️ o Login está no navigator de nível acima (Stack raiz)
    const rootNav = navigation.getParent(); // sobe um nível (sai do Drawer)
    (rootNav || navigation).reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingBottom: 80 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={{ justifyContent: 'center' }}
        >
          Terminar sessão
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    right: 16,
  },
  logoutButton: {
    backgroundColor: '#55412E',
  },
});
