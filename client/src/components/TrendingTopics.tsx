import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getTrendingTopics } from '@/lib/twitterAPI';
import { TrendingTopic } from '@/types';
import { TRENDING_TOPICS } from '@/lib/constants';

const TrendingTopics = () => {
  const { toast } = useToast();
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrends = async () => {
    try {
      setRefreshing(true);
      const result = await getTrendingTopics();
      
      if (result && result.length > 0) {
        setTrends(result);
      } else {
        // Fallback to constants if API returns no data
        setTrends(TRENDING_TOPICS);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      // Fallback to constants if API fails
      setTrends(TRENDING_TOPICS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleRefresh = () => {
    fetchTrends();
    toast({
      title: "Refreshing Trends",
      description: "Fetching the latest trending topics.",
    });
  };

  const handleAddToGenerator = (topic: string) => {
    toast({
      title: "Topic Added",
      description: `"${topic}" has been added to the generator.`,
    });
  };

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

  return (
    <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-['Orbitron'] font-bold text-white">Trending Now</h2>
        <motion.button 
          className="text-[#0BEFF7] hover:text-[#FF3864] transition-colors"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <i className={`ri-refresh-line text-lg ${refreshing ? 'animate-spin' : ''}`}></i>
        </motion.button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center p-2">
              <div className="w-2 h-10 bg-gray-700 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {trends.map((topic) => (
            <motion.div 
              key={topic.id}
              className="flex items-center p-2 rounded-lg hover:bg-[#2A2D3A] transition-colors cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <div className={`w-2 h-10 ${getColorClass(topic.color)} rounded-full mr-3`}></div>
              <div>
                <p className="text-white font-medium">{topic.name}</p>
                <p className="text-gray-400 text-xs">{topic.posts} posts</p>
              </div>
              <motion.button 
                className="ml-auto text-[#0BEFF7] hover:text-[#FF3864]"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAddToGenerator(topic.name)}
              >
                <i className="ri-add-line"></i>
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <motion.button 
          className="w-full px-4 py-3 rounded-lg border border-[#0BEFF7] text-[#0BEFF7] text-sm hover:bg-[#0BEFF7] hover:text-[#121217] transition-colors"
          whileHover={{ boxShadow: '0 0 10px rgba(11, 239, 247, 0.5)' }}
          whileTap={{ scale: 0.98 }}
        >
          View All Trends
        </motion.button>
      </div>
    </div>
  );
};

export default TrendingTopics;
