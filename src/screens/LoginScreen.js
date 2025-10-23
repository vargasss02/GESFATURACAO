import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { login } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      // Aqui podes guardar o token em AsyncStorage se quiseres persistir a sessão
      // await AsyncStorage.setItem('token', result.token);
      navigation.navigate('Home'); // Troca para a tua próxima página (ex: Dashboard)
    } catch (err) {
      setError(err.message || 'Login inválido');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="file-document-edit" size={75} color={colors.primary} />
        <Text variant="headlineMedium" style={styles.title}>GESFaturação</Text>
        <Text variant="bodyMedium" style={{ color: '#555', marginBottom: 6 }}>Entrar na sua conta</Text>
      </View>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        left={<TextInput.Icon icon="email-outline"/>}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        left={<TextInput.Icon icon="lock-outline"/>}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        style={styles.button}
        onPress={handleLogin}
        disabled={loading || !email || !password}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Entrar'}
      </Button>
      <Text style={styles.footerText}>Esqueceu a senha?</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#f4f7fa',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    marginBottom: 18,
  },
  button: {
    marginTop: 10,
    paddingVertical: 4,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#888',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  }
});
