import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  username: string;
  displayName?: string;
  profileImage?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verifica lo stato dell'autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('user_id');
      
      if (token && userId) {
        try {
          // Verifica il token con una chiamata API
          const userData = await api.get(`/api/users/${userId}`);
          setUser(userData.data);
        } catch (error) {
          // Token non valido o scaduto
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('username');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_id', response.data.id.toString());
      localStorage.setItem('username', response.data.username);
      
      setUser({
        id: response.data.id,
        username: response.data.username,
        role: response.data.role,
        displayName: response.data.displayName,
        profileImage: response.data.profileImage
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Errore di login",
        description: "Username o password non validi.",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/register', { username, password, email });
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_id', response.data.id.toString());
      localStorage.setItem('username', response.data.username);
      
      setUser({
        id: response.data.id,
        username: response.data.username,
        role: response.data.role || 'free'
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Errore durante la registrazione";
      
      toast({
        title: "Errore di registrazione",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 