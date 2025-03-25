import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginSection = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Stati per i form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Gestione login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const { token, user } = await response.json();
      
      login(token, user);
      toast({
        title: "Login effettuato",
        description: `Benvenuto, ${username}!`,
      });
      
      window.location.reload(); // Ricarica la pagina per aggiornare lo stato di autenticazione
    } catch (error) {
      console.error('Errore login:', error);
      toast({
        title: "Errore di connessione",
        description: "Errore durante il login. Verifica le credenziali.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGitHubLogin = () => {
    window.location.href = '/api/auth/github';
  };
  
  // Gestione registrazione
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Errore di validazione",
        description: "Le password non corrispondono",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Registrazione completata",
          description: "Account creato con successo! Ora puoi accedere.",
        });
        
        // Passa automaticamente alla tab di login
        setActiveTab('login');
        setPassword('');
      } else {
        toast({
          title: "Errore di registrazione",
          description: data.message || "Errore durante la registrazione",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Errore di connessione",
        description: "Si è verificato un errore durante la registrazione. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] rounded-xl p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'login' ? 'text-[#0BEFF7] border-b-2 border-[#0BEFF7]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('login')}
        >
          Accedi
        </button>
        <button 
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'register' ? 'text-[#0BEFF7] border-b-2 border-[#0BEFF7]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('register')}
        >
          Registrati
        </button>
      </div>
      
      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oppure</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGitHubLogin}
              className="w-full px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>Accedi con GitHub</span>
            </button>
          </div>
        </form>
      )}
      
      {/* Register Form */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="reg-username" className="block text-sm text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              id="reg-username" 
              className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
              placeholder="Scegli un username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="reg-password" className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              id="reg-password" 
              className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
              placeholder="Crea una password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm text-gray-400 mb-1">Conferma Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
              placeholder="Conferma la password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <motion.button 
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-[#8A2BE2] text-white font-bold mt-6 flex items-center justify-center"
            whileHover={{ 
              boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Registrazione in corso...' : 'Crea Account'}
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default LoginSection; 