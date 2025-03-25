import { useState } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import AIContentGenerator from '@/components/AIContentGenerator';
import TrendingTopics from '@/components/TrendingTopics';
import AutomationTools from '@/components/AutomationTools';
import Web3Integration from '@/components/Web3Integration';
import { WalletInfo } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Wallet connection state
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  
  const handleWalletConnect = (info: WalletInfo) => {
    setWalletInfo(info);
  };

  // Crea un oggetto user compatibile con le interfacce dei componenti
  const userForComponents = {
    id: user?.id,
    username: user?.username || 'guest',
    displayName: user?.displayName || user?.username || 'Guest',
    profileImage: user?.profileImage,
    role: user?.role || 'Free'
  };

  return (
    <Layout>
      {/* Header */}
      <Header 
        title="Dashboard" 
        subtitle="Boost your X account with AI"
        onWalletConnect={handleWalletConnect}
      />
      
      {/* Stats Overview */}
      <StatsOverview />
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* AI Content Generator */}
        <AIContentGenerator user={userForComponents} />
        
        {/* Trending Topics */}
        <TrendingTopics />
        
        {/* Automation Tools */}
        <AutomationTools />
        
        {/* Web3 Integration */}
        <Web3Integration onWalletConnect={handleWalletConnect} />
      </div>
    </Layout>
  );
};

export default Dashboard;
