import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiZap, FiBarChart2, FiSettings, FiUser, FiCpu, FiMonitor } from 'react-icons/fi';
import { FaTwitter } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import { HiOutlineSparkles } from 'react-icons/hi';
import { SiEthereum } from 'react-icons/si';
import { useToast } from '@/components/ui/use-toast';

interface SidebarProps {
  user: {
    name: string;
    role: string;
    profileImage?: string;
    id?: number;
  };
}

const Sidebar = ({ user }: SidebarProps) => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);
  
  // Check if current route is active
  const isActiveRoute = (route: string) => {
    if (route === '/' && location === '/') {
      return true;
    }
    if (route !== '/' && location.startsWith(route)) {
      return true;
    }
    return false;
  };

  const connectTwitter = async () => {
    try {
      setIsConnectingTwitter(true);
      
      // Verifica che l'utente abbia un ID
      if (!user.id) {
        console.error('User ID is missing:', user);
        toast({
          variant: "destructive",
          title: "Errore",
          description: "ID utente mancante. Effettua nuovamente il login."
        });
        setIsConnectingTwitter(false);
        return;
      }
      
      console.log('Connecting Twitter for user:', user);
      
      // URL alla quale verrà reindirizzato l'utente
      const twitterAuthUrl = `/api/auth/twitter?userId=${user.id}`;
      console.log('Redirecting to:', twitterAuthUrl);
      
      // Reindirizza l'utente all'endpoint di autenticazione Twitter
      window.location.href = twitterAuthUrl;
    } catch (error) {
      console.error('Failed to connect Twitter:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile connettersi all'account Twitter."
      });
      setIsConnectingTwitter(false);
    }
  };

  return (
    <div className="w-64 bg-[#1E1E24] h-screen overflow-y-auto fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <HiOutlineSparkles className="text-blue-500 text-2xl" />
          <h1 className="text-xl font-bold text-white">TwitterBooster</h1>
        </div>
      </div>
       
      {/* User Info */}
      <div className="mt-2 px-6 pb-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
        </div>
         
        {/* Twitter Connect Button */}
        <button
          onClick={connectTwitter}
          disabled={isConnectingTwitter}
          className="w-full mt-4 py-2 px-4 bg-[#1DA1F2] hover:bg-[#1a94e0] text-white rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <FaTwitter className="text-lg" />
          {isConnectingTwitter ? 'Connecting...' : 'Connect Twitter'}
        </button>
      </div>
        
      {/* Navigation */}
      <div className="mt-4 px-4">
        <nav>
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <FiHome className="text-lg" />
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/ai-generator">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/ai-generator') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <FiCpu className="text-lg" />
                  <span>AI Generator</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/automation">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/automation') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <FiZap className="text-lg" />
                  <span>Automation</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/analytics">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/analytics') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <FiBarChart2 className="text-lg" />
                  <span>Analytics</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/trending">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/trending') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <FiTrendingUp className="text-lg" />
                  <span>Trending</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/web3">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/web3') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <SiEthereum className="text-lg" />
                  <span>Web3</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/ai-personality">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/ai-personality') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <RiRobot2Fill className="text-lg" />
                  <span>AI Personality</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <a 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActiveRoute('/settings') 
                      ? 'bg-[#292933] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#292933] hover:text-white'
                  }`}
                >
                  <FiSettings className="text-lg" />
                  <span>Settings</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-[#1E1E24]">
        <div className="flex items-center justify-between">
          <Link href="/login">
            <a className="text-xs text-gray-400 hover:text-white transition-colors">
              Logout
            </a>
          </Link>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
