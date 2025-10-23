import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.gesfaturacao.pt/api',
  headers: {
    'Content-Type': 'application/json'
  },
});

export default api;
