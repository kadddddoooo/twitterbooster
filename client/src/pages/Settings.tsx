import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { TWITTER_API_LIMITS, HUGGING_FACE_MODELS } from '@/lib/constants';
import axios from 'axios';
import { generateContent } from '@/lib/huggingface';
import { useAuth } from '@/contexts/AuthContext';
import LoginSection from '@/components/LoginSection';

const Settings = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // State for settings
  const [apiKeys, setApiKeys] = useState({
    twitterApiKey: '',
    twitterApiSecret: '',
    openaiApiKey: ''
  });
  
  const [accountSettings, setAccountSettings] = useState({
    username: user?.username || '',
    email: 'user@example.com',
    notificationsEnabled: true,
    darkMode: true,
    autoScheduling: false
  });
  
  const [apiLimits, setApiLimits] = useState({
    dailyTweetsLimit: 5,
    dailyLikesLimit: 20,
    dailyFollowsLimit: 10
  });
  
  // User info
  const [userInfo] = useState({
    name: 'CryptoPunk',
    role: 'Pro Account',
  });
  
  // Settings state
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [twitterConnecting, setTwitterConnecting] = useState(false);
  const [twitterConnectionStep, setTwitterConnectionStep] = useState(0);
  const [twitterAccessToken, setTwitterAccessToken] = useState('');
  const [twitterAccessTokenSecret, setTwitterAccessTokenSecret] = useState('');
  const [twitterAuthUrl, setTwitterAuthUrl] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [isValidatingApi, setIsValidatingApi] = useState(false);
  
  // Hugging Face API settings
  const [huggingFaceApiKey, setHuggingFaceApiKey] = useState('');
  const [huggingFaceConnected, setHuggingFaceConnected] = useState(false);
  const [huggingFaceConnecting, setHuggingFaceConnecting] = useState(false);
  const [huggingFaceSelectedModel, setHuggingFaceSelectedModel] = useState(HUGGING_FACE_MODELS.TEXT_GENERATION);

  // General settings
  const [aiModel, setAiModel] = useState('standard');
  const [notifications, setNotifications] = useState(true);
  const [autoTweet, setAutoTweet] = useState(true);
  const [autoReply, setAutoReply] = useState(true);
  const [autoLike, setAutoLike] = useState(true);
  const [tweetLimit, setTweetLimit] = useState(TWITTER_API_LIMITS.tweetsPerDay / 2);
  const [likeLimit, setLikeLimit] = useState(TWITTER_API_LIMITS.likesPerDay / 2);
  
  // Check for existing API keys on load
  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        // In a real app, these would be stored in a backend and retrieved securely
        const storedTwitterApiKey = localStorage.getItem('twitter_api_key');
        const storedTwitterApiSecret = localStorage.getItem('twitter_api_secret');
        const storedHuggingFaceKey = localStorage.getItem('huggingface_api_key');
        
        if (storedTwitterApiKey && storedTwitterApiSecret) {
          // Verifica le chiavi API salvate
          const isValid = await validateTwitterKeys(storedTwitterApiKey, storedTwitterApiSecret);
          
          if (isValid) {
          setTwitterConnected(true);
          setTwitterUsername(localStorage.getItem('twitter_username') || 'Connected Account');
            setApiKeys(prev => ({
              ...prev,
              twitterApiKey: storedTwitterApiKey,
              twitterApiSecret: storedTwitterApiSecret
            }));
          } else {
            // Chiavi non valide, rimuoviamo dal localStorage
            localStorage.removeItem('twitter_api_key');
            localStorage.removeItem('twitter_api_secret');
            localStorage.removeItem('twitter_username');
            
            toast({
              title: "Autenticazione Twitter scaduta",
              description: "Riconnetti il tuo account Twitter per continuare",
              variant: "destructive"
            });
          }
        }
        
        if (storedHuggingFaceKey) {
          setHuggingFaceConnected(true);
          setHuggingFaceApiKey('••••••••••••••••••••••••');
        }
      } catch (error) {
        console.error('Error checking API keys:', error);
      }
    };
    
    checkApiKeys();
  }, [toast]);
  
  // Twitter connection steps
  const twitterConnectionSteps = [
    { title: "Enter API Keys", description: "Enter your X (Twitter) Developer API keys" },
    { title: "Authenticate", description: "Complete OAuth authentication process" },
    { title: "Verify Access", description: "Confirm access to your X account" },
    { title: "Complete", description: "Your X account is now connected" }
  ];
  
  // Funzione per validare le chiavi API di Twitter
  const validateTwitterKeys = async (apiKey: string, apiSecret: string) => {
    try {
      setIsValidatingApi(true);
      
      // In un'applicazione reale, dovresti fare una chiamata al tuo backend
      // che gestisce la validazione delle chiavi API per ragioni di sicurezza
      const response = await axios.post('/api/twitter/validate', {
        apiKey,
        apiSecret
      });
      
      return response.data.valid;
    } catch (error) {
      console.error('Error validating Twitter API keys:', error);
      
      // Gestisci gli errori 401 in modo specifico
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast({
            title: "Autenticazione fallita",
            description: "Le chiavi API di Twitter non sono valide o sono scadute",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Errore di connessione",
            description: `Errore: ${error.message || "Controlla la tua connessione internet"}`,
            variant: "destructive"
          });
        }
      }
      
      return false;
    } finally {
      setIsValidatingApi(false);
    }
  };
  
  // Handlers
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys({
      ...apiKeys,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAccountSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: value
    });
  };
  
  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiLimits({
      ...apiLimits,
      [e.target.name]: parseInt(e.target.value)
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };
  
  const startTwitterConnection = async () => {
    if (twitterConnected) {
      // Handle disconnect
      setTwitterConnected(false);
      setTwitterUsername('');
      localStorage.removeItem('twitter_username');
      
      toast({
        title: "Twitter Disconnesso",
        description: "Il tuo account X (Twitter) è stato disconnesso.",
      });
    } else {
      try {
      setTwitterConnecting(true);
        // Iniziamo l'autenticazione OAuth 2.0 con Twitter
        const userId = user?.id || 'anonymous';
        
        // Facciamo una chiamata al nostro endpoint di avvio autenticazione
        window.location.href = `/api/auth/twitter?userId=${userId}`;
      } catch (error) {
        console.error('Errore nella connessione a Twitter:', error);
        toast({
          title: "Errore di connessione",
          description: "Impossibile connettersi a Twitter. Riprova più tardi.",
          variant: "destructive"
        });
        setTwitterConnecting(false);
      }
    }
  };
  
  const startTwitterOAuth = async () => {
    try {
      if (!apiKeys.twitterApiKey || !apiKeys.twitterApiSecret) {
        toast({
          title: "Chiavi API mancanti",
          description: "Inserisci entrambe le chiavi API di Twitter",
          variant: "destructive"
        });
        return;
      }
      
      // Inizia il processo di autenticazione OAuth
      const response = await axios.post('/api/twitter/auth/start', {
        apiKey: apiKeys.twitterApiKey,
        apiSecret: apiKeys.twitterApiSecret
      });
      
      if (response.data.success && response.data.authUrl) {
        // Apri l'URL di autorizzazione in una nuova finestra/tab
        window.open(response.data.authUrl, '_blank');
        
        // Aggiorna lo stato per mostrare le istruzioni all'utente
        setTwitterConnectionStep(1);
        setTwitterAuthUrl(response.data.authUrl);
      } else {
        toast({
          title: "Errore di autenticazione",
          description: response.data.message || "Impossibile avviare l'autenticazione Twitter",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore nell\'avvio dell\'autenticazione Twitter:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast({
          title: "Autenticazione fallita",
          description: "Le chiavi API di Twitter non sono valide",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Errore di connessione",
          description: "Impossibile connettersi al server. Riprova più tardi.",
          variant: "destructive"
        });
      }
    }
  };
  
  const processTwitterConnection = async () => {
    try {
      setTwitterConnecting(true);
      
      if (twitterConnectionStep === 0) {
        // Validate API keys
        if (!apiKeys.twitterApiKey || !apiKeys.twitterApiSecret) {
          toast({
            title: "Missing API Keys",
            description: "Please enter both your API Key and API Secret.",
            variant: "destructive"
          });
          return;
        }
        
        // Inizia il processo di autenticazione OAuth di Twitter
        await startTwitterOAuth();
      } 
      else if (twitterConnectionStep === 1) {
        // L'utente ha già visitato la pagina di autorizzazione Twitter
        // Chiediamo di confermare che ha approvato l'accesso
        
        // Move to next step
        setTwitterConnectionStep(2);
      }
      else if (twitterConnectionStep === 2) {
        // Simulate verifying access tokens
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!twitterAccessToken || !twitterAccessTokenSecret) {
          toast({
            title: "Connection Failed",
            description: "Please enter your Access Token and Access Token Secret.",
            variant: "destructive"
          });
          return;
        }
        
        // In a real app, this would validate the tokens with Twitter API
        setTwitterConnectionStep(3);
        setTwitterUsername('@' + userInfo.name.toLowerCase().replace(/\s+/g, ''));
        
        // Store API keys securely (in a real app, store them server-side)
        localStorage.setItem('twitter_api_key', apiKeys.twitterApiKey);
        localStorage.setItem('twitter_api_secret', apiKeys.twitterApiSecret);
        localStorage.setItem('twitter_username', twitterUsername);
      }
      else if (twitterConnectionStep === 3) {
        // Completed
        setTwitterConnected(true);
        setTwitterConnecting(false);
        
        toast({
          title: "Twitter Connected",
          description: "Your X (Twitter) account has been successfully connected.",
        });
      }
    } catch (error) {
      console.error('Error connecting to Twitter:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast({
          title: "Authentication Failed",
          description: "Twitter API authentication failed. Please check your API keys.",
          variant: "destructive"
        });
      } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to X (Twitter). Please try again.",
        variant: "destructive"
      });
      }
    } finally {
      if (twitterConnectionStep === 3) {
        setTwitterConnecting(false);
      }
    }
  };
  
  const validateAndSaveHuggingFaceKey = async () => {
    if (!huggingFaceApiKey) {
      toast({
        title: "API Key mancante",
        description: "Inserisci la tua API Key di Hugging Face.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setHuggingFaceConnecting(true);
      
      // Valida l'API key di Hugging Face facendo una richiesta di prova
      const response = await axios.post('/api/huggingface/validate', {
        apiKey: huggingFaceApiKey
      }, {
        // Imposta un timeout per non bloccare l'interfaccia utente
        timeout: 10000
      });
      
      if (response.data.success) {
      // Store API key securely (in a real app, store it server-side)
      localStorage.setItem('huggingface_api_key', huggingFaceApiKey);
      
      setHuggingFaceConnected(true);
        setHuggingFaceApiKey('••••••••••••••••••••••••');
      
      toast({
          title: "API Key Salvata",
          description: "La tua API key di Hugging Face è stata validata e salvata con successo.",
        });
      } else {
        toast({
          title: "Validazione Fallita",
          description: response.data.message || "API key non valida. Controlla la chiave e riprova.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Errore durante la validazione della API key di Hugging Face:', error);
      
      toast({
        title: "Errore di Connessione",
        description: "Impossibile validare l'API key. Controlla la tua connessione e riprova.",
        variant: "destructive"
      });
    } finally {
      setHuggingFaceConnecting(false);
    }
  };
  
  const handleResetSettings = () => {
    toast({
      title: "Settings Reset",
      description: "Settings have been restored to default values.",
      variant: "destructive"
    });
  };

  // Aggiungo un useEffect per controllare se l'utente è tornato dall'autenticazione Twitter
  useEffect(() => {
    // Controlla se siamo tornati dall'autenticazione Twitter
    const params = new URLSearchParams(window.location.search);
    const twitterConnected = params.get('twitter_connected');
    
    if (twitterConnected === 'true') {
      // Rimuovi il parametro dall'URL senza ricaricare la pagina
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Aggiorna lo stato per mostrare Twitter come connesso
      setTwitterConnected(true);
      setTwitterUsername('@' + (user?.username || 'user'));
      
      toast({
        title: "Twitter Connesso!",
        description: "Il tuo account X (Twitter) è stato collegato con successo.",
      });
    }
    
    // Controlla anche se c'è stato un errore
    const twitterError = params.get('twitter_error');
    if (twitterError) {
      // Rimuovi il parametro dall'URL senza ricaricare la pagina
      window.history.replaceState({}, document.title, window.location.pathname);
      
      toast({
        title: "Errore Connessione Twitter",
        description: twitterError,
        variant: "destructive"
      });
    }
  }, [toast, user]);

  return (
    <Layout>
      <div className="p-6">
        <Header title="Impostazioni" subtitle="Configura la tua esperienza" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Sidebar con sezioni di impostazioni */}
          <div className="bg-[#1E2029] rounded-xl p-4 h-fit">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white mb-4">Sezioni</h3>
              <a href="#account" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#282A37] text-white">
                <i className="ri-user-line mr-2"></i>
                Account
              </a>
              <a href="#connections" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#282A37] text-white">
                <i className="ri-link mr-2"></i>
                Connessioni
              </a>
              <a href="#api-settings" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#282A37] text-white">
                <i className="ri-code-box-line mr-2"></i>
                Impostazioni API
              </a>
              <a href="#limits" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#282A37] text-white">
                <i className="ri-speed-line mr-2"></i>
                Limiti API
              </a>
                  </div>
                </div>
                
          {/* Contenuto principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sezione login solo per utenti non autenticati */}
            {!isAuthenticated && (
              <div id="login" className="bg-[#1E2029] rounded-xl overflow-hidden border border-gray-800">
                <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Accedi a funzionalità avanzate</h3>
                  <button className="text-sm text-gray-400 hover:text-white">
                    <i className="ri-information-line mr-1"></i>
                    Info
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="bg-[#14151D] rounded-lg p-6 border border-gray-800 mb-4">
                    <h4 className="text-lg text-[#0BEFF7] font-semibold mb-2">Login opzionale</h4>
                    <p className="text-gray-300 mb-4">
                      Per accedere alle funzionalità avanzate di TwitterBooster, puoi creare un account o accedere. 
                      Non è obbligatorio, ma ti permetterà di salvare le impostazioni e usare funzioni premium.
                    </p>
                    
                    {/* Form di login/registrazione */}
                    <div className="mt-4">
                      <LoginSection />
                </div>
              </div>
                </div>
                  </div>
                )}
            
            {/* Account settings - visibili solo agli utenti autenticati */}
            <div id="account" className="bg-[#1E2029] rounded-xl overflow-hidden border border-gray-800">
              <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Informazioni Account</h3>
                <button className="text-sm text-gray-400 hover:text-white">
                  <i className="ri-edit-line mr-1"></i>
                  Modifica
                </button>
              </div>
              
              <div className="p-6">
                {isAuthenticated ? (
                  <>
                    {/* Contenuto della sezione account per utenti autenticati */}
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-400 flex items-center justify-center mr-4 overflow-hidden">
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-2xl font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{user?.displayName || user?.username}</h4>
                        <p className="text-gray-400">@{user?.username}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-1 bg-[#8A2BE2] text-white rounded-full">
                            {user?.role || 'Free Account'}
                          </span>
                      </div>
                      </div>
                    </div>
                    
                    {/* Form per le impostazioni account */}
                          <div className="space-y-4">
                      {/* Username field */}
                            <div>
                        <label htmlFor="username" className="block text-sm text-gray-400 mb-1">Username</label>
                              <input 
                          type="text" 
                          id="username" 
                          className="w-full bg-[#282A37] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
                          value={accountSettings.username}
                          onChange={handleAccountSettingChange}
                          name="username"
                              />
                            </div>
                            
                      {/* Email field */}
                            <div>
                        <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
                              <input 
                          type="email" 
                          id="email" 
                          className="w-full bg-[#282A37] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
                          value={accountSettings.email}
                          onChange={handleAccountSettingChange}
                          name="email"
                              />
                            </div>
                        </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Accedi per gestire le informazioni del tuo account</p>
                    <a href="#login" className="px-6 py-2 bg-[#0BEFF7] hover:bg-[#0CDFEA] rounded-lg text-[#121217] font-bold inline-block">
                      Vai all'accesso
                    </a>
                      </div>
                )}
                              </div>
                        </div>
                        
            {/* Le altre sezioni rimangono invariate */}
            
            {/* Connessioni - modificata per mostrare informazioni anche senza login */}
            <div id="connections" className="bg-[#1E2029] rounded-xl overflow-hidden border border-gray-800">
              <div className="border-b border-gray-800 p-4">
                <h3 className="text-lg font-medium text-white">Connessioni</h3>
                          </div>
                          
              <div className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-[#282A37] rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="ri-twitter-x-fill text-white text-2xl mr-3"></i>
                          <div>
                          <h4 className="text-white font-medium">Twitter (X)</h4>
                          {twitterConnected ? (
                            <p className="text-green-400 text-sm flex items-center">
                              <i className="ri-checkbox-circle-fill mr-1"></i>
                              Connesso come @{twitterUsername}
                            </p>
                          ) : (
                            <p className="text-gray-400 text-sm">Non connesso</p>
                          )}
                          </div>
                        </div>
                      
                      {isAuthenticated ? (
                              <button 
                          onClick={startTwitterConnection}
                          className={`px-4 py-2 rounded-lg ${twitterConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-[#0BEFF7] hover:bg-[#0CDFEA]'} text-${twitterConnected ? 'white' : '[#121217]'} font-medium`}
                              >
                          {twitterConnected ? 'Disconnetti' : 'Connetti'}
                              </button>
                      ) : (
                        <button 
                          onClick={() => document.getElementById('login')?.scrollIntoView({behavior: 'smooth'})}
                          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium"
                        >
                          Accedi per connettere
                        </button>
                      )}
                          </div>
                          
                    {/* Descrizioni della funzionalità per tutti gli utenti */}
                    <div className="mt-4 text-gray-400 text-sm">
                      <p>
                        Collega il tuo account Twitter per automatizzare post, interazioni e monitorare le performance.
                      </p>
                      <p className="mt-2">
                        <a 
                          href="http://127.0.0.1:58363/help/help/oauth2.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#0BEFF7] hover:underline inline-flex items-center"
                        >
                              <i className="ri-information-line mr-1"></i>
                          Documentazione OAuth2
                        </a>
                            </p>
                          </div>
                        </div>
                  
                  {/* Aggiungo un form per Hugging Face dopo la sezione di connessione Twitter */}
                  <div className="p-4 bg-[#282A37] rounded-lg border border-gray-700 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src="/huggingface-logo.svg" alt="Hugging Face" className="w-8 h-8 mr-3" onError={(e) => e.currentTarget.src = 'https://huggingface.co/favicon.ico'} />
                          <div>
                          <h4 className="text-white font-medium">Hugging Face</h4>
                          {huggingFaceConnected ? (
                            <p className="text-green-400 text-sm flex items-center">
                              <i className="ri-checkbox-circle-fill mr-1"></i>
                              API Key configurata
                            </p>
                          ) : (
                            <p className="text-gray-400 text-sm">API Key non configurata</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-gray-400 text-sm">
                      <p>
                        Collega la tua API Key di Hugging Face per utilizzare modelli AI avanzati per la generazione di contenuti.
                      </p>
                      
                      {/* Form visibile solo se autenticati */}
                      {isAuthenticated && !huggingFaceConnected && (
                        <div className="mt-4">
                          <div className="flex flex-col md:flex-row gap-3">
                    <input 
                              type="text"
                              className="flex-1 bg-[#14151D] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
                              placeholder="Inserisci la tua API Key di Hugging Face"
                              value={huggingFaceApiKey}
                              onChange={(e) => setHuggingFaceApiKey(e.target.value)}
                            />
                            <button
                              onClick={validateAndSaveHuggingFaceKey}
                              disabled={huggingFaceConnecting}
                              className="px-4 py-2 bg-[#0BEFF7] hover:bg-[#0CDFEA] text-[#121217] font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {huggingFaceConnecting ? (
                                <span className="flex items-center">
                                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                                  Validazione...
                                </span>
                              ) : (
                                "Salva API Key"
                              )}
                            </button>
                </div>
                          <p className="mt-2 text-xs text-gray-500">
                            <a 
                              href="https://huggingface.co/settings/tokens" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#0BEFF7] hover:underline"
                            >
                              Ottieni una API Key da Hugging Face
                            </a>
                          </p>
                  </div>
                )}
              
                      {isAuthenticated && huggingFaceConnected && (
                        <div className="mt-4 flex justify-between items-center">
                    <div>
                            <p className="text-green-400 text-sm mb-1">API Key salvata correttamente</p>
                            <p className="text-xs">Puoi ora utilizzare i modelli di Hugging Face</p>
                    </div>
                          <button
                      onClick={() => {
                              localStorage.removeItem('huggingface_api_key');
                          setHuggingFaceConnected(false);
                          setHuggingFaceApiKey('');
                          toast({
                                title: "API Key Rimossa",
                                description: "La tua API key di Hugging Face è stata rimossa.",
                          });
                      }}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                    >
                            Rimuovi
                          </button>
                  </div>
                      )}
                      
                      {/* Se non autenticato mostra un messaggio */}
                      {!isAuthenticated && (
                        <div className="mt-4">
                          <p className="text-yellow-400 mb-2">
                            <i className="ri-login-box-line mr-1"></i>
                            Accedi per configurare la tua API Key di Hugging Face
                          </p>
                      <button 
                            onClick={() => document.getElementById('login')?.scrollIntoView({behavior: 'smooth'})}
                            className="text-sm text-[#0BEFF7] hover:underline"
                      >
                            Vai alla sezione login
                      </button>
                    </div>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
            {/* Salva modifiche - visibile solo se autenticati */}
            {isAuthenticated && (
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSaveSettings}
                  className="px-6 py-2 bg-[#0BEFF7] hover:bg-[#0CDFEA] rounded-lg text-[#121217] font-bold transition-colors"
                >
                  Salva Modifiche
                  </button>
                </div>
            )}
              </div>
          </div>
        </div>
    </Layout>
  );
};

export default Settings;
