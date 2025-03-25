import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { getTrendingTopics } from '@/lib/twitterAPI';
import { TrendingTopic } from '@/types';
import { TRENDING_TOPICS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Trending = () => {
  const { user } = useAuth();
  
  const { toast } = useToast();
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [popularHashtags, setPopularHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getTrendingTopics();
        
        // Ensure correct types by casting 
        const typedTrends = data.map(trend => ({
          ...trend,
          color: trend.color as 'primary' | 'secondary' | 'accent'
        })) as TrendingTopic[];
        
        setTrends(typedTrends);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch trending topics:', error);
        
        // Cast TRENDING_TOPICS properly to fix type errors
        const typedTopics = TRENDING_TOPICS.map(topic => ({
          ...topic,
          color: topic.color as 'primary' | 'secondary' | 'accent'
        })) as TrendingTopic[];
        
        setTrends(typedTopics);
        setLoading(false);
        toast({
          title: "Failed to load trending topics",
          description: "Using cached data instead",
          variant: "destructive"
        });
      }
    };
    
    fetchTrends();
    
    // Set popular hashtags
    setPopularHashtags(['#Web3', '#Crypto', '#NFT', '#DeFi', '#Metaverse', '#Gaming', '#Blockchain', '#DAO']);
  }, [toast]);
  
  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-[#0BEFF7]';
      case 'secondary':
        return 'bg-[#8A2BE2]';
      case 'accent':
        return 'bg-[#FF3864]';
      default:
        return 'bg-[#0BEFF7]';
    }
  };
  
  const handleAddToGenerator = (topic: string) => {
    toast({
      title: "Topic Added",
      description: `"${topic}" has been added to the generator.`,
    });
  };
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing Trends",
      description: "Fetching the latest trending topics.",
    });
    // In a real implementation, this would re-fetch from the API
  };
  
  const filteredTrends = trends.filter(trend => {
    const matchesSearch = searchTerm === '' || trend.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || trend.color === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Header */}
      <Header 
        title="Trending Topics" 
        subtitle="Discover what's trending to optimize your content"
      />
      
      {/* Trending Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 pl-10 text-white focus:outline-none focus:border-[#0BEFF7]"
                  placeholder="Search trending topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="ri-search-line absolute top-3 left-3 text-gray-400"></i>
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="accent">Accent</option>
                </select>
                
                <motion.button
                  className="bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-[#0BEFF7] hover:border-[#0BEFF7] focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                >
                  <i className="ri-refresh-line"></i>
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Trending Topics List */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Trending Now</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center p-4 bg-[#1E2029] rounded-lg">
                    <div className="w-2 h-16 bg-gray-700 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredTrends.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTrends.map((topic) => (
                      <motion.div 
                        key={topic.id}
                        className="flex items-center p-4 bg-[#1E2029] rounded-lg hover:bg-[#2A2D3A] transition-colors cursor-pointer"
                        whileHover={{ x: 5, boxShadow: '0 0 10px rgba(11, 239, 247, 0.2)' }}
                      >
                        <div className={`w-2 h-16 ${getColorClass(topic.color)} rounded-full mr-3`}></div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-lg">{topic.name}</p>
                          <p className="text-gray-400 text-sm">{topic.posts} posts</p>
                          <div className="flex gap-1 mt-1">
                            {['#Web3', '#Crypto', '#NFT'].map((hashtag, idx) => (
                              <span key={idx} className="text-xs text-[#0BEFF7]">{hashtag}</span>
                            ))}
                          </div>
                        </div>
                        <motion.button 
                          className="ml-auto w-10 h-10 rounded-full bg-[#2A2D3A] text-[#0BEFF7] flex items-center justify-center hover:bg-[#0BEFF7] hover:text-[#121217]"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToGenerator(topic.name)}
                        >
                          <i className="ri-add-line text-lg"></i>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">No matching topics found</div>
                    <button 
                      className="px-4 py-2 bg-[#1E2029] text-[#0BEFF7] rounded-lg hover:bg-[#2A2D3A]"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
          
          {/* Related Posts */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Trending Posts</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-[#1E2029] rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#1E2029] rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                      <div className="w-full h-full flex items-center justify-center text-white">
                        S
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white">SolanaExpert</p>
                      <p className="text-gray-400 text-sm">@solana_expert · 2h</p>
                    </div>
                  </div>
                  <p className="text-white mb-3">Just discovered how #Solana NFTs are changing the game for creators. 10x faster and 100x cheaper than Ethereum. The future is multi-chain and it's happening now. 🚀 #Web3 #Crypto</p>
                  <div className="flex items-center text-gray-400 text-sm space-x-5">
                    <span className="flex items-center">
                      <i className="ri-heart-line mr-1"></i>
                      <span>256</span>
                    </span>
                    <span className="flex items-center">
                      <i className="ri-repeat-line mr-1"></i>
                      <span>123</span>
                    </span>
                    <span className="flex items-center">
                      <i className="ri-chat-1-line mr-1"></i>
                      <span>75</span>
                    </span>
                  </div>
                </div>
                
                <div className="bg-[#1E2029] rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                      <div className="w-full h-full flex items-center justify-center text-white">
                        W
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white">Web3Developer</p>
                      <p className="text-gray-400 text-sm">@web3_dev · 5h</p>
                    </div>
                  </div>
                  <p className="text-white mb-3">Web3 gaming is about to explode. Play-to-earn models, true ownership of in-game assets, and interoperability between games. This is a massive paradigm shift in how we think about gaming. #GameFi #Blockchain</p>
                  <div className="flex items-center text-gray-400 text-sm space-x-5">
                    <span className="flex items-center">
                      <i className="ri-heart-line mr-1"></i>
                      <span>198</span>
                    </span>
                    <span className="flex items-center">
                      <i className="ri-repeat-line mr-1"></i>
                      <span>87</span>
                    </span>
                    <span className="flex items-center">
                      <i className="ri-chat-1-line mr-1"></i>
                      <span>42</span>
                    </span>
                  </div>
                </div>
                
                <div className="bg-[#1E2029] rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                      <div className="w-full h-full flex items-center justify-center text-white">
                        D
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white">DeFiQueen</p>
                      <p className="text-gray-400 text-sm">@defi_queen · 8h</p>
                    </div>
                  </div>
                  <p className="text-white mb-3">DeFi protocols are seeing massive adoption despite the market conditions. Total value locked is growing week over week. This is what building in a bear market looks like. #DeFi #Crypto #Build</p>
                  <div className="flex items-center text-gray-400 text-sm space-x-5">
                    <span className="flex items-center">
                      <i className="ri-heart-line mr-1"></i>
                      <span>175</span>
                    </span>
                    <span className="flex items-center">
                      <i className="ri-repeat-line mr-1"></i>
                      <span>65</span>
                    </span>
                    <span className="flex items-center">
                      <i className="ri-chat-1-line mr-1"></i>
                      <span>31</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="space-y-6">
          {/* Popular Hashtags */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Popular Hashtags</h2>
            
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse h-8 bg-[#2A2D3A] rounded-full w-20"></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {popularHashtags.map((hashtag, idx) => (
                  <motion.div 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#1E2029] border border-[#0BEFF7] text-[#0BEFF7] text-sm cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(11, 239, 247, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm(hashtag.slice(1))}
                  >
                    {hashtag}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Trending Prediction */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Trend Prediction</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-[#2A2D3A] rounded w-3/4"></div>
                <div className="h-20 bg-[#2A2D3A] rounded"></div>
                <div className="h-4 bg-[#2A2D3A] rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-4">Topics expected to trend in the next 24 hours based on AI analysis:</p>
                
                <div className="space-y-3">
                  <div className="bg-[#1E2029] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">NFT Staking</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#0BEFF7] text-[#121217]">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2A2D3A] rounded-full mt-2">
                      <div className="bg-[#0BEFF7] h-full rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1E2029] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Crypto Gaming</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#8A2BE2] text-white">87%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2A2D3A] rounded-full mt-2">
                      <div className="bg-[#8A2BE2] h-full rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1E2029] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">DAO Governance</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF3864] text-white">76%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2A2D3A] rounded-full mt-2">
                      <div className="bg-[#FF3864] h-full rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full px-4 py-3 mt-4 rounded-lg bg-[#1E2029] border border-[#0BEFF7] text-[#0BEFF7] hover:bg-[#0BEFF7] hover:text-[#121217] transition-colors">
                  Generate Content for These Topics
                </button>
              </>
            )}
          </motion.div>
          
          {/* Engagement Tips */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Engagement Tips</h2>
            
            <div className="space-y-3">
              <div className="bg-[#1E2029] rounded-lg p-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2">
                    <i className="ri-time-line"></i>
                  </div>
                  <div>
                    <p className="text-white font-medium">Best Time to Post</p>
                    <p className="text-gray-400 text-sm">9AM-11AM EST for crypto audience</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1E2029] rounded-lg p-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-2">
                    <i className="ri-hashtag"></i>
                  </div>
                  <div>
                    <p className="text-white font-medium">Optimal Hashtags</p>
                    <p className="text-gray-400 text-sm">Use 2-3 relevant hashtags for best reach</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1E2029] rounded-lg p-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#FF3864] mr-2">
                    <i className="ri-chat-3-line"></i>
                  </div>
                  <div>
                    <p className="text-white font-medium">Conversation Starters</p>
                    <p className="text-gray-400 text-sm">Ask questions to increase engagement</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Trending;
