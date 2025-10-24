import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const navigation = useNavigation();
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();

    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* G laranja - de preferência SVG/Icon PNG com fundo transparente */}
      <Animated.View style={{
        opacity: logoAnim,
        transform: [{
          scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] })
        }]
      }}>
        {/* Substitui por SVG se tiveres */}
        <Text style={styles.gLogo}>G</Text>
      </Animated.View>
      <Animated.Text style={[styles.text, { opacity: textAnim }]}>
        ESFATURAÇÃO
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gLogo: {
    fontSize: 120,
    color: '#ff9400', // Laranja oficial
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: -8,
    fontFamily: 'sans-serif' // Usa aqui a fonte igual à do branding se possível
  },
  text: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2
  }
});
