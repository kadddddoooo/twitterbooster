import { motion } from 'framer-motion';
import { connectPhantomWallet, isPhantomInstalled } from '@/lib/web3';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WalletInfo } from '@/types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onWalletConnect?: (walletInfo: WalletInfo | null) => void;
}

const Header = ({ title, subtitle = 'Boost your X account with AI', onWalletConnect }: HeaderProps) => {
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      
      if (!isPhantomInstalled()) {
        toast({
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom Wallet extension first.",
          variant: "destructive"
        });
        return;
      }
      
      const walletInfo = await connectPhantomWallet();
      
      if (walletInfo) {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)}`,
        });
        
        if (onWalletConnect) {
          onWalletConnect(walletInfo);
        }
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom wallet.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-['Orbitron'] font-bold text-white"
            style={{textShadow: '0 0 5px rgba(11, 239, 247, 0.7), 0 0 10px rgba(11, 239, 247, 0.5)'}}>
          {title}
        </h1>
        <p className="text-gray-400 mt-1">{subtitle}</p>
      </div>
      
      {/* Connect Wallet Button */}
      <motion.button 
        className="mt-4 sm:mt-0 px-5 py-2 rounded-lg bg-[#1E2029] border border-[#0BEFF7] text-[#0BEFF7] font-['Orbitron'] flex items-center"
        whileHover={{ boxShadow: '0 0 10px rgba(11, 239, 247, 0.5), 0 0 20px rgba(11, 239, 247, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={handleConnectWallet}
        disabled={connecting}
      >
        <i className="ri-wallet-3-line mr-2"></i>
        {connecting ? 'Connecting...' : 'Connect Phantom'}
      </motion.button>
    </header>
  );
};

export default Header;
