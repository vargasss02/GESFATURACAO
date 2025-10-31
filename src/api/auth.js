import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: 'https://demo.gesfaturacao.pt/server',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export const login = async (username, password) => {
  try {
    const data = qs.stringify({
      username,
      password,
    });

    const response = await api.post('/login.php', data);

    if (response.data?.errors === true || response.data?.type === 3) {
      throw new Error(response.data?.message || 'Credenciais inválidas');
    }

    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error('Login inválido — verifique as credenciais.');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout.php');

    if (response.data?.data?.result !== true) {
      throw new Error('Logout falhou');
    }

    // Se guardares tokens/session, apaga aqui (ex: AsyncStorage.removeItem('token'))
    return response.data;
  } catch (error) {
    console.error('Erro no logout:', error);
    throw new Error('Erro a terminar sessão');
  }
};
