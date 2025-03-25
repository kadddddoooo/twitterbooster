import { useState } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIContentGenerator from '@/components/AIContentGenerator';
import ContentRepurposer from '@/components/ContentRepurposer';
import TrendingTopics from '@/components/TrendingTopics';
import { FiCpu, FiRepeat } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const AIGenerator = () => {
  const { user } = useAuth();
  const [lastGeneratedTweet, setLastGeneratedTweet] = useState<string | null>(null);
  
  // Crea un oggetto user compatibile con le interfacce dei componenti
  const userForComponents = {
    id: user?.id,
    username: user?.username || 'guest',
    displayName: user?.displayName || user?.username || 'Guest',
    profileImage: user?.profileImage,
    role: user?.role || 'Free'
  };
  
  const handleTweetCreated = (tweet: string) => {
    setLastGeneratedTweet(tweet);
  };

  return (
    <Layout>
      <Header 
        title="AI Content Generator" 
        subtitle="Create engaging content with AI"
      />
      
      <div className="mt-6">
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FiCpu className="text-sm" />
              <span>AI Generator</span>
            </TabsTrigger>
            <TabsTrigger value="repurposer" className="flex items-center gap-2">
              <FiRepeat className="text-sm" />
              <span>Content Repurposer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <AIContentGenerator user={userForComponents} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <motion.div 
                  className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Generation History</h2>
                  {/* Lista contenuti generati */}
                </motion.div>
              </div>
              
              <div className="space-y-6">
                <TrendingTopics />
                
                <motion.div 
                  className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">AI Settings</h2>
                  {/* Impostazioni AI */}
                </motion.div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="repurposer">
            <ContentRepurposer onTweetCreated={handleTweetCreated} />
            
            {lastGeneratedTweet && (
              <div className="mt-6 p-4 bg-[#1E1E24] rounded-lg border border-gray-700">
                <h3 className="font-medium text-sm text-gray-400 mb-2">Recent Tweet</h3>
                <p className="text-white">{lastGeneratedTweet}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIGenerator;
