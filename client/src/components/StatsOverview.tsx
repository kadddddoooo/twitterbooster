import { motion } from 'framer-motion';
import { AccountStats } from '@/types';
import { useEffect, useState } from 'react';
import { getAccountStats } from '@/lib/twitterAPI';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: string;
  delay?: number;
}

const StatCard = ({ title, value, change, delay = 0 }: StatCardProps) => {
  const isPositive = change > 0;
  
  return (
    <motion.div 
      className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        boxShadow: '0 0 15px rgba(11, 239, 247, 0.3)',
        borderColor: '#0BEFF7',
        y: -5
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-gray-400 text-sm">{title}</span>
        <span className="text-[#FF3864] text-xs font-mono">{isPositive ? '+' : ''}{change}%</span>
      </div>
      <div className="flex items-end">
        <span className="text-white text-2xl font-['Orbitron'] font-bold">{value}</span>
      </div>
    </motion.div>
  );
};

const StatsOverview = () => {
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getAccountStats();
        if (result) {
          setStats(result);
        } else {
          // Set default stats if API call fails
          setStats({
            followers: 1254,
            engagement: 32.7,
            postsGenerated: 56,
            web3Earnings: 0.42,
            followersChange: 12.5,
            engagementChange: 8.3,
            postsGeneratedChange: 27,
            web3EarningsChange: 5.2
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats if API call fails
        setStats({
          followers: 1254,
          engagement: 32.7,
          postsGenerated: 56,
          web3Earnings: 0.42,
          followersChange: 12.5,
          engagementChange: 8.3,
          postsGeneratedChange: 27,
          web3EarningsChange: 5.2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1E2029] rounded-xl p-4 animate-pulse h-24">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          </div>
        ))}
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Followers" 
        value={stats.followers.toLocaleString()} 
        change={stats.followersChange} 
        delay={0.1}
      />
      
      <StatCard 
        title="Engagement" 
        value={`${stats.engagement}%`} 
        change={stats.engagementChange} 
        delay={0.2}
      />
      
      <StatCard 
        title="Posts Generated" 
        value={stats.postsGenerated} 
        change={stats.postsGeneratedChange} 
        delay={0.3}
      />
      
      <StatCard 
        title="Web3 Earnings" 
        value={`${stats.web3Earnings} SOL`} 
        change={stats.web3EarningsChange} 
        delay={0.4}
      />
    </section>
  );
};

export default StatsOverview;
