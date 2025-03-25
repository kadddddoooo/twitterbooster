import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { WalletInfo } from '@/types';
import { connectPhantomWallet, isPhantomInstalled } from '@/lib/web3';

interface Web3IntegrationProps {
  onWalletConnect?: (walletInfo: WalletInfo) => void;
}

const Web3Integration = ({ onWalletConnect }: Web3IntegrationProps) => {
  const { toast } = useToast();
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const checkWallet = () => {
      const installed = isPhantomInstalled();
      setWalletInstalled(installed);
    };
    
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      
      if (!walletInstalled) {
        toast({
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom Wallet extension first.",
          variant: "destructive"
        });
        return;
      }
      
      const info = await connectPhantomWallet();
      
      if (info) {
        setWalletInfo(info);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${info.address.slice(0, 6)}...${info.address.slice(-4)}`,
        });
        
        if (onWalletConnect) {
          onWalletConnect(info);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom wallet.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleNFTAction = (action: string) => {
    if (!walletInfo) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Phantom wallet first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: `${action}`,
      description: "Opening NFT tools...",
    });
  };

  return (
    <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6">
      <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Web3 Integration</h2>
      
      <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7]">
            <i className="ri-wallet-3-line text-xl"></i>
          </div>
          <h3 className="ml-3 font-['Orbitron'] font-medium text-white">Wallet Status</h3>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#1E2029]">
          <div>
            {walletInfo ? (
              <>
                <p className="text-gray-400 text-sm">Connected</p>
                <p className="text-white font-mono">{walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}</p>
                <p className="text-[#0BEFF7] text-sm font-mono">{walletInfo.balance.toFixed(2)} SOL</p>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm">Not Connected</p>
                <p className="text-white font-mono">Connect Phantom Wallet</p>
              </>
            )}
          </div>
          <motion.button 
            className="px-3 py-1 rounded-lg bg-[#0BEFF7] text-[#121217] text-sm font-medium disabled:opacity-50"
            whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnectWallet}
            disabled={connecting || !!walletInfo}
          >
            {connecting ? 'Connecting...' : walletInfo ? 'Connected' : 'Connect'}
          </motion.button>
        </div>
      </div>
      
      <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7]">
            <i className="ri-nft-line text-xl"></i>
          </div>
          <h3 className="ml-3 font-['Orbitron'] font-medium text-white">NFT Tools</h3>
        </div>
        
        <div className="space-y-2">
          <motion.button 
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ x: 0 }}
            onClick={() => handleNFTAction("Create NFT Collection")}
          >
            <span className="text-white">Create NFT Collection</span>
            <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
          </motion.button>
          
          <motion.button 
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ x: 0 }}
            onClick={() => handleNFTAction("Token-Gated Content")}
          >
            <span className="text-white">Token-Gated Content</span>
            <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
          </motion.button>
          
          <motion.button 
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ x: 0 }}
            onClick={() => handleNFTAction("NFT Analytics")}
          >
            <span className="text-white">NFT Analytics</span>
            <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
          </motion.button>
        </div>
      </div>
      
      <motion.button 
        className="w-full px-4 py-3 rounded-lg bg-[#FF3864] text-white font-['Orbitron']"
        whileHover={{ 
          boxShadow: '0 0 15px rgba(255, 56, 100, 0.5)',
          y: -3
        }}
        whileTap={{ y: 0 }}
        onClick={() => toast({
          title: "Web3 Dashboard",
          description: "Launching full Web3 Dashboard...",
        })}
      >
        <i className="ri-rocket-line mr-1"></i>
        Launch Web3 Dashboard
      </motion.button>
    </div>
  );
};

export default Web3Integration;
