// src/api/auth.js

import api from './client'; // Este ficheiro deve ter o baseURL configurado

export const login = async (email, password) => {
  try {
    // Chama POST /login com os dados do formulário
    const response = await api.post('/login', {
      email: email,
      password: password
    });
    return response.data; // normalmente { token, user }
  } catch (error) {
    // Retorna mensagem de erro do backend ou default
    throw error.response?.data || { message: 'Login inválido!' };
  }
};
