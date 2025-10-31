import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { logout } from '../api/auth'; // ajusta o path se necessário

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // substitui pelo nome correto do teu ecrã login!
      });
    } catch {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingBottom: 80 }}>
        <DrawerItemList {...props} />
        {/* outros items se precisares */}
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
    backgroundColor: '#55412E', // muda para o castanho da tua app se quiseres
  },
});
