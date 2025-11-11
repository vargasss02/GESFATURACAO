// src/screens/LoginScreen.jsx
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { login, validateToken } from '../api/auth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await login(username, password); // guarda token internamente
      await validateToken(token);                     // valida já
      navigation.replace('Home');                    // segue
    } catch (err) {
      setError(err?.message || 'Login inválido');
      console.log('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    WebBrowser.openBrowserAsync('https://www.gesfaturacao.pt/planos.php');
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="file-document-edit" size={75} color={colors.primary} />
        <Text variant="headlineMedium" style={styles.title}>GESFaturação</Text>
        <Text variant="bodyMedium" style={{ color: '#555', marginBottom: 6 }}>
          Entrar na sua conta
        </Text>
      </View>

      <TextInput
        label="Nome de Utilizador"
        value={username}
        onChangeText={setUsername}
        left={<TextInput.Icon icon="account-outline" />}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        left={<TextInput.Icon icon="lock-outline" />}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" style={styles.button} onPress={handleLogin} disabled={loading || !username || !password}>
        {loading ? <ActivityIndicator color="#fff" /> : 'Entrar'}
      </Button>

      <Button mode="text" style={styles.registerButton} onPress={handleRegister}>
        Registar nova conta
      </Button>

      <Text style={styles.footerText}>Esqueceu a senha?</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f4f7fa' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  title: { marginTop: 10, fontWeight: 'bold', color: '#333' },
  input: { marginBottom: 18 },
  button: { marginTop: 10, paddingVertical: 4 },
  registerButton: { marginTop: 14 },
  footerText: { textAlign: 'center', marginTop: 15, color: '#888' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});
