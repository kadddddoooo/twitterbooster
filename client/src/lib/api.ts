import axios from 'axios';

// Crea un'istanza personalizzata di axios
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aggiungi un intercettore per le richieste
api.interceptors.request.use(
  (config) => {
    // Aggiungi token di autenticazione a ogni richiesta
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Aggiungi un intercettore per le risposte
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se riceviamo un errore 401 (Non autorizzato) e non abbiamo già tentato di aggiornare il token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Reindirizza l'utente alla pagina di login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Funzione di utilità per effettuare richieste API
export async function apiRequest(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
  } = {}
) {
  const { method = 'GET', data, params } = options;
  
  try {
    const response = await api.request({
      url,
      method,
      data,
      params,
    });
    
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
}

export default api; 