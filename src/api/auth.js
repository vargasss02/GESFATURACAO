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

    // Verifica se o backend retornou erro na resposta
    if (response.data?.errors === true || response.data?.type === 3) {
      // “type: 3” e “errors: true” indicam erro de autenticação
      throw new Error(response.data?.message || 'Credenciais inválidas');
    }

    // Qualquer outra resposta 200 é considerada sucesso
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error('Login inválido — verifique as credenciais.');
  }
};
