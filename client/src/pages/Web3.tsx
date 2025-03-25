import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Web3Integration from '@/components/Web3Integration';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { WalletInfo, NFTCollection } from '@/types';
import { connectPhantomWallet, isPhantomInstalled } from '@/lib/web3';
import { useAuth } from '@/contexts/AuthContext';

const Web3 = () => {
  const { user } = useAuth();
  
  const { toast } = useToast();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [nftCollections, setNftCollections] = useState<NFTCollection[]>([]);
  const [activeTab, setActiveTab] = useState('nfts');
  
  useEffect(() => {
    const checkWalletAndLoadData = async () => {
      setLoading(true);
      
      // Check if wallet is already connected (would be done through proper wallet adapter in real app)
      const isInstalled = isPhantomInstalled();
      
      if (isInstalled) {
        try {
          const wallet = await connectPhantomWallet();
          if (wallet) {
            setWalletInfo(wallet);
            
            // Load mock NFT collections (would come from API in real app)
            setNftCollections([
              {
                id: 'collection-1',
                name: 'CryptoPunks X',
                description: 'Exclusive pixel art collection for Twitter growth hackers',
                items: 24
              },
              {
                id: 'collection-2',
                name: 'Growth Gurus',
                description: 'NFTs that unlock premium Twitter growth features',
                items: 12
              },
              {
                id: 'collection-3',
                name: 'Viral Tokens',
                description: 'Each token represents a viral Tweet template',
                items: 8
              }
            ]);
          }
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      }
      
      setLoading(false);
    };
    
    checkWalletAndLoadData();
  }, []);
  
  const handleWalletConnect = (info: WalletInfo | null) => {
    if (!info) return;
    
    setWalletInfo(info);
    
    // Show toast notification
    toast({
      title: "Wallet Connected",
      description: `Connected to ${info.address.slice(0, 6)}...${info.address.slice(-4)} with ${info.balance.toFixed(2)} SOL`,
    });
  };
  
  const handleCreateCollection = () => {
    if (!walletInfo) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to create a collection.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Create NFT Collection",
      description: "Opening collection creator...",
    });
  };
  
  const handleNFTAction = (action: string, collectionId?: string) => {
    if (!walletInfo) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: action,
      description: collectionId ? `Processing for collection ${collectionId}...` : "Processing...",
    });
  };

  return (
    <Layout>
      {/* Header */}
      <Header 
        title="Web3 Integration" 
        subtitle="Connect wallet and integrate crypto features"
        onWalletConnect={handleWalletConnect}
      />
      
      {/* Web3 Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'nfts' ? 'text-[#0BEFF7] border-b-2 border-[#0BEFF7]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('nfts')}
              >
                NFT Collections
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'token-gate' ? 'text-[#0BEFF7] border-b-2 border-[#0BEFF7]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('token-gate')}
              >
                Token-Gated Content
              </button>
              <button 
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'earnings' ? 'text-[#0BEFF7] border-b-2 border-[#0BEFF7]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('earnings')}
              >
                Earnings
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* NFT Collections Tab */}
              {activeTab === 'nfts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-['Orbitron'] font-bold text-white">Your NFT Collections</h2>
                    <motion.button 
                      className="px-4 py-2 bg-[#0BEFF7] text-[#121217] rounded-lg font-medium text-sm"
                      whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateCollection}
                    >
                      <i className="ri-add-line mr-1"></i>
                      Create Collection
                    </motion.button>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-[#1E2029] rounded-lg p-6 h-32"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {walletInfo ? (
                        <>
                          {nftCollections.length > 0 ? (
                            <div className="space-y-4">
                              {nftCollections.map(collection => (
                                <motion.div 
                                  key={collection.id}
                                  className="bg-[#1E2029] rounded-lg p-5 border border-gray-700 hover:border-[#0BEFF7] transition-colors"
                                  whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }}
                                >
                                  <div className="flex items-start">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#0BEFF7] to-[#8A2BE2] rounded-xl flex items-center justify-center text-[#121217] font-bold text-xl">
                                      {collection.name.charAt(0)}
                                    </div>
                                    
                                    <div className="ml-4 flex-1">
                                      <h3 className="text-white font-medium text-lg">{collection.name}</h3>
                                      <p className="text-gray-400 text-sm mb-2">{collection.description}</p>
                                      
                                      <div className="flex items-center text-xs text-gray-400">
                                        <span className="mr-4">{collection.items} items</span>
                                        <span>Floor: 0.2 SOL</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <motion.button 
                                        className="p-2 rounded-lg bg-[#2A2D3A] text-[#0BEFF7] hover:bg-[#0BEFF7] hover:text-[#121217]"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleNFTAction('View Collection', collection.id)}
                                      >
                                        <i className="ri-eye-line"></i>
                                      </motion.button>
                                      
                                      <motion.button 
                                        className="p-2 rounded-lg bg-[#2A2D3A] text-[#0BEFF7] hover:bg-[#0BEFF7] hover:text-[#121217]"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleNFTAction('Edit Collection', collection.id)}
                                      >
                                        <i className="ri-edit-line"></i>
                                      </motion.button>
                                      
                                      <motion.button 
                                        className="p-2 rounded-lg bg-[#2A2D3A] text-[#FF3864] hover:bg-[#FF3864] hover:text-white"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleNFTAction('Share Collection', collection.id)}
                                      >
                                        <i className="ri-share-line"></i>
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10">
                              <div className="w-20 h-20 bg-[#1E2029] rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ri-image-2-line text-4xl text-gray-500"></i>
                              </div>
                              <h3 className="text-white font-medium mb-2">No Collections Found</h3>
                              <p className="text-gray-400 text-sm mb-6">You haven't created any NFT collections yet.</p>
                              <motion.button 
                                className="px-5 py-3 bg-[#0BEFF7] text-[#121217] rounded-lg font-medium"
                                whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreateCollection}
                              >
                                Create Your First Collection
                              </motion.button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-20 h-20 bg-[#1E2029] rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-wallet-3-line text-4xl text-gray-500"></i>
                          </div>
                          <h3 className="text-white font-medium mb-2">Wallet Not Connected</h3>
                          <p className="text-gray-400 text-sm mb-6">Connect your Phantom wallet to view your NFT collections.</p>
                          <motion.button 
                            className="px-5 py-3 bg-[#0BEFF7] text-[#121217] rounded-lg font-medium"
                            whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => connectPhantomWallet().then(handleWalletConnect)}
                          >
                            Connect Wallet
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {/* Token-Gated Content Tab */}
              {activeTab === 'token-gate' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-['Orbitron'] font-bold text-white">Token-Gated Content</h2>
                    <motion.button 
                      className="px-4 py-2 bg-[#8A2BE2] text-white rounded-lg font-medium text-sm"
                      whileHover={{ boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNFTAction('Create Token-Gated Content')}
                    >
                      <i className="ri-lock-line mr-1"></i>
                      Create Gated Content
                    </motion.button>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="animate-pulse bg-[#1E2029] rounded-lg p-6 h-32"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {walletInfo ? (
                        <div className="space-y-4">
                          <div className="bg-[#1E2029] rounded-lg p-5 border border-gray-700">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-3">
                                <i className="ri-lock-line text-xl"></i>
                              </div>
                              <div>
                                <h3 className="text-white font-medium">Premium Crypto Thread Templates</h3>
                                <p className="text-gray-400 text-xs">Requires: Growth Gurus NFT</p>
                              </div>
                              <div className="ml-auto">
                                <span className="px-2 py-1 bg-[#2A2D3A] rounded text-xs text-[#0BEFF7]">Active</span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Exclusive Twitter thread templates for crypto influencers. Generate viral content with one-click.</p>
                            <div className="flex justify-end">
                              <motion.button 
                                className="px-3 py-1.5 bg-[#2A2D3A] text-white rounded text-sm hover:bg-[#8A2BE2]"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNFTAction('Access Content')}
                              >
                                <i className="ri-key-line mr-1"></i>
                                Access Content
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="bg-[#1E2029] rounded-lg p-5 border border-gray-700">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#FF3864] mr-3">
                                <i className="ri-lock-line text-xl"></i>
                              </div>
                              <div>
                                <h3 className="text-white font-medium">Crypto Whales Network</h3>
                                <p className="text-gray-400 text-xs">Requires: Minimum 1 SOL balance</p>
                              </div>
                              <div className="ml-auto">
                                <span className="px-2 py-1 bg-[#2A2D3A] rounded text-xs text-gray-400">Locked</span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Private Twitter group with crypto whales sharing alpha and investment strategies.</p>
                            <div className="flex justify-end">
                              <motion.button 
                                className="px-3 py-1.5 bg-[#2A2D3A] text-white rounded text-sm hover:bg-[#FF3864]"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNFTAction('Purchase Access')}
                              >
                                <i className="ri-coins-line mr-1"></i>
                                Purchase Access
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-20 h-20 bg-[#1E2029] rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-lock-line text-4xl text-gray-500"></i>
                          </div>
                          <h3 className="text-white font-medium mb-2">Wallet Not Connected</h3>
                          <p className="text-gray-400 text-sm mb-6">Connect your Phantom wallet to view and access token-gated content.</p>
                          <motion.button 
                            className="px-5 py-3 bg-[#0BEFF7] text-[#121217] rounded-lg font-medium"
                            whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => connectPhantomWallet().then(handleWalletConnect)}
                          >
                            Connect Wallet
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {/* Earnings Tab */}
              {activeTab === 'earnings' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-['Orbitron'] font-bold text-white">Web3 Earnings</h2>
                    <motion.button 
                      className="px-4 py-2 bg-[#FF3864] text-white rounded-lg font-medium text-sm"
                      whileHover={{ boxShadow: '0 0 15px rgba(255, 56, 100, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNFTAction('Withdraw Earnings')}
                    >
                      <i className="ri-money-dollar-circle-line mr-1"></i>
                      Withdraw
                    </motion.button>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse bg-[#1E2029] rounded-lg p-6 h-32"></div>
                      <div className="animate-pulse bg-[#1E2029] rounded-lg p-6 h-64"></div>
                    </div>
                  ) : (
                    <>
                      {walletInfo ? (
                        <>
                          <div className="bg-[#1E2029] rounded-xl p-4 mb-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 bg-[#2A2D3A] rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">Total Earned</p>
                                <p className="text-white text-2xl font-['Orbitron'] font-bold">0.42 SOL</p>
                              </div>
                              <div className="p-4 bg-[#2A2D3A] rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">Available</p>
                                <p className="text-white text-2xl font-['Orbitron'] font-bold">0.12 SOL</p>
                              </div>
                              <div className="p-4 bg-[#2A2D3A] rounded-lg">
                                <p className="text-gray-400 text-sm mb-1">Pending</p>
                                <p className="text-white text-2xl font-['Orbitron'] font-bold">0.08 SOL</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-[#1E2029] rounded-xl p-5">
                            <h3 className="font-medium text-white mb-4">Transaction History</h3>
                            
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              <div className="bg-[#2A2D3A] rounded-lg p-3 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-[#1E2029] flex items-center justify-center text-[#0BEFF7] mr-3">
                                  <i className="ri-coin-line"></i>
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">Token-gated content purchase</p>
                                  <p className="text-gray-400 text-xs">2 days ago</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[#0BEFF7] font-medium">+0.05 SOL</p>
                                  <p className="text-gray-400 text-xs">$4.25</p>
                                </div>
                              </div>
                              
                              <div className="bg-[#2A2D3A] rounded-lg p-3 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-[#1E2029] flex items-center justify-center text-[#8A2BE2] mr-3">
                                  <i className="ri-nft-line"></i>
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">NFT Collection royalties</p>
                                  <p className="text-gray-400 text-xs">5 days ago</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[#0BEFF7] font-medium">+0.12 SOL</p>
                                  <p className="text-gray-400 text-xs">$10.20</p>
                                </div>
                              </div>
                              
                              <div className="bg-[#2A2D3A] rounded-lg p-3 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-[#1E2029] flex items-center justify-center text-[#FF3864] mr-3">
                                  <i className="ri-money-dollar-circle-line"></i>
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">Withdrawal</p>
                                  <p className="text-gray-400 text-xs">1 week ago</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-red-400 font-medium">-0.25 SOL</p>
                                  <p className="text-gray-400 text-xs">$21.25</p>
                                </div>
                              </div>
                              
                              <div className="bg-[#2A2D3A] rounded-lg p-3 flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-[#1E2029] flex items-center justify-center text-[#0BEFF7] mr-3">
                                  <i className="ri-vip-crown-line"></i>
                                </div>
                                <div className="flex-1">
                                  <p className="text-white text-sm">Premium subscription</p>
                                  <p className="text-gray-400 text-xs">2 weeks ago</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[#0BEFF7] font-medium">+0.25 SOL</p>
                                  <p className="text-gray-400 text-xs">$21.25</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-20 h-20 bg-[#1E2029] rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-coin-line text-4xl text-gray-500"></i>
                          </div>
                          <h3 className="text-white font-medium mb-2">Wallet Not Connected</h3>
                          <p className="text-gray-400 text-sm mb-6">Connect your Phantom wallet to view your earnings.</p>
                          <motion.button 
                            className="px-5 py-3 bg-[#0BEFF7] text-[#121217] rounded-lg font-medium"
                            whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => connectPhantomWallet().then(handleWalletConnect)}
                          >
                            Connect Wallet
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* NFT Creator */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">
              AI NFT Creator <span className="text-xs text-[#FF3864] ml-2 font-normal">Beta</span>
            </h2>
            
            <p className="text-gray-400 mb-4">
              Generate unique NFT art using AI to monetize your Twitter growth strategies.
            </p>
            
            <div className="bg-[#1E2029] rounded-lg p-4 mb-4">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">NFT Description</label>
                <textarea 
                  className="w-full bg-[#2A2D3A] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7] h-20"
                  placeholder="Describe your NFT idea... (e.g. A futuristic crypto influencer avatar with neon elements and cyberpunk style)"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Style</label>
                  <select className="w-full bg-[#2A2D3A] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]">
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="abstract">Abstract</option>
                    <option value="pixel">Pixel Art</option>
                    <option value="3d">3D Render</option>
                    <option value="anime">Anime</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Utility</label>
                  <select className="w-full bg-[#2A2D3A] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]">
                    <option value="access">Access Token</option>
                    <option value="content">Content Unlock</option>
                    <option value="template">Tweet Template</option>
                    <option value="membership">Community Membership</option>
                  </select>
                </div>
              </div>
            </div>
            
            <motion.button 
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#0BEFF7] to-[#8A2BE2] text-[#121217] font-medium"
              whileHover={{ boxShadow: '0 0 20px rgba(11, 239, 247, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNFTAction('Generate NFT')}
              disabled={!walletInfo}
            >
              <i className="ri-magic-line mr-1"></i>
              Generate AI NFT
            </motion.button>
          </motion.div>
        </div>
        
        <div className="space-y-6">
          <Web3Integration onWalletConnect={handleWalletConnect} />
          
          {/* Quick Actions */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <motion.button 
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ x: 0 }}
                onClick={() => handleNFTAction('Create Token-Gated Tweet')}
                disabled={!walletInfo}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2">
                    <i className="ri-lock-line"></i>
                  </div>
                  <span className="text-white">Create Token-Gated Tweet</span>
                </div>
                <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
              </motion.button>
              
              <motion.button 
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ x: 0 }}
                onClick={() => handleNFTAction('Set Up Crypto Tips')}
                disabled={!walletInfo}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-2">
                    <i className="ri-hand-coin-line"></i>
                  </div>
                  <span className="text-white">Set Up Crypto Tips</span>
                </div>
                <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
              </motion.button>
              
              <motion.button 
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ x: 0 }}
                onClick={() => handleNFTAction('Launch Subscription Model')}
                disabled={!walletInfo}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#FF3864] mr-2">
                    <i className="ri-vip-crown-line"></i>
                  </div>
                  <span className="text-white">Launch Subscription Model</span>
                </div>
                <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
              </motion.button>
              
              <motion.button 
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ x: 0 }}
                onClick={() => handleNFTAction('Create Affiliate Program')}
                disabled={!walletInfo}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2">
                    <i className="ri-funds-line"></i>
                  </div>
                  <span className="text-white">Create Affiliate Program</span>
                </div>
                <i className="ri-arrow-right-line text-[#0BEFF7]"></i>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Web3 Resources */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Web3 Resources</h2>
            
            <div className="space-y-3">
              <a href="#" className="block p-3 bg-[#1E2029] rounded-lg hover:bg-[#2A2D3A] transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2">
                    <i className="ri-article-line"></i>
                  </div>
                  <div>
                    <p className="text-white text-sm">How to monetize your Twitter with NFTs</p>
                    <p className="text-gray-400 text-xs">5 min read</p>
                  </div>
                </div>
              </a>
              
              <a href="#" className="block p-3 bg-[#1E2029] rounded-lg hover:bg-[#2A2D3A] transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-2">
                    <i className="ri-video-line"></i>
                  </div>
                  <div>
                    <p className="text-white text-sm">Token-gated content tutorial</p>
                    <p className="text-gray-400 text-xs">Video - 8 min</p>
                  </div>
                </div>
              </a>
              
              <a href="#" className="block p-3 bg-[#1E2029] rounded-lg hover:bg-[#2A2D3A] transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#FF3864] mr-2">
                    <i className="ri-book-open-line"></i>
                  </div>
                  <div>
                    <p className="text-white text-sm">Phantom Wallet integration guide</p>
                    <p className="text-gray-400 text-xs">Documentation</p>
                  </div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Web3;
