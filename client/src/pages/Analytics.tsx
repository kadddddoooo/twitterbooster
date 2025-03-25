import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import { motion } from 'framer-motion';
import { getAccountStats } from '@/lib/twitterAPI';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  
  const [timeframe, setTimeframe] = useState('week');
  const [dataLoading, setDataLoading] = useState(true);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [followersData, setFollowersData] = useState<any[]>([]);
  const [contentData, setContentData] = useState<any[]>([]);
  
  // Sample data for charts (in real implementation, this would come from API)
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // In a real implementation, we'd use the actual API data
        await getAccountStats();
        
        // Engagement data
        setEngagementData([
          { date: 'Mon', likes: 42, replies: 15, retweets: 8 },
          { date: 'Tue', likes: 28, replies: 12, retweets: 10 },
          { date: 'Wed', likes: 57, replies: 23, retweets: 14 },
          { date: 'Thu', likes: 65, replies: 18, retweets: 21 },
          { date: 'Fri', likes: 73, replies: 25, retweets: 18 },
          { date: 'Sat', likes: 61, replies: 17, retweets: 13 },
          { date: 'Sun', likes: 48, replies: 14, retweets: 9 },
        ]);
        
        // Followers data
        setFollowersData([
          { date: 'Mon', followers: 1200 },
          { date: 'Tue', followers: 1215 },
          { date: 'Wed', followers: 1231 },
          { date: 'Thu', followers: 1242 },
          { date: 'Fri', followers: 1254 },
          { date: 'Sat', followers: 1268 },
          { date: 'Sun', followers: 1275 },
        ]);
        
        // Content performance data
        setContentData([
          { name: 'Crypto', value: 35 },
          { name: 'NFT', value: 25 },
          { name: 'Web3', value: 20 },
          { name: 'DeFi', value: 15 },
          { name: 'Others', value: 5 },
        ]);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, [timeframe]);
  
  const COLORS = ['#0BEFF7', '#8A2BE2', '#FF3864', '#6EE7B7', '#94A3B8'];
  
  return (
    <Layout>
      {/* Header */}
      <Header 
        title="Analytics" 
        subtitle="Track your X account performance"
      />
      
      {/* Stats Overview */}
      <StatsOverview />
      
      {/* Time Range Selector */}
      <div className="flex justify-end mb-6">
        <div className="bg-[#1E2029] rounded-lg flex p-1">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm ${timeframe === 'week' ? 'bg-[#2A2D3A] text-[#0BEFF7]' : 'text-gray-400'}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm ${timeframe === 'month' ? 'bg-[#2A2D3A] text-[#0BEFF7]' : 'text-gray-400'}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm ${timeframe === 'year' ? 'bg-[#2A2D3A] text-[#0BEFF7]' : 'text-gray-400'}`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <motion.div 
          className="lg:col-span-2 bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Engagement Overview</h2>
          
          {dataLoading ? (
            <div className="animate-pulse h-64 bg-[#2A2D3A] rounded-lg"></div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1E2029', 
                    borderColor: '#0BEFF7',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="likes" name="Likes" fill="#0BEFF7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="replies" name="Replies" fill="#8A2BE2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retweets" name="Retweets" fill="#FF3864" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        
        {/* Content Performance */}
        <motion.div 
          className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Content Performance</h2>
          
          {dataLoading ? (
            <div className="animate-pulse h-64 bg-[#2A2D3A] rounded-lg"></div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1E2029', 
                    borderColor: '#0BEFF7',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: any) => [`${value} engagements`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {contentData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-xs text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Followers Growth */}
        <motion.div 
          className="lg:col-span-2 bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Followers Growth</h2>
          
          {dataLoading ? (
            <div className="animate-pulse h-64 bg-[#2A2D3A] rounded-lg"></div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={followersData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1E2029', 
                    borderColor: '#0BEFF7',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="followers" 
                  name="Followers" 
                  stroke="#0BEFF7" 
                  strokeWidth={2}
                  dot={{ r: 5, fill: '#0BEFF7', stroke: '#0BEFF7' }}
                  activeDot={{ r: 7, fill: '#FF3864', stroke: '#FF3864' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        
        {/* Top Performing Content */}
        <motion.div 
          className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Top Performing Content</h2>
          
          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-20 bg-[#2A2D3A] rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-[#1E2029] rounded-lg p-3 border-l-4 border-[#0BEFF7]">
                <div className="flex justify-between mb-1">
                  <p className="text-white font-medium text-sm">Just discovered how #Solana NFTs are changing the game for creators...</p>
                  <span className="text-[#0BEFF7] text-xs">256 ♥</span>
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <span>2 days ago</span>
                  <span className="mx-2">•</span>
                  <span>75 replies</span>
                  <span className="mx-2">•</span>
                  <span>123 reposts</span>
                </div>
              </div>
              
              <div className="bg-[#1E2029] rounded-lg p-3 border-l-4 border-[#8A2BE2]">
                <div className="flex justify-between mb-1">
                  <p className="text-white font-medium text-sm">Why Web3 is the future of digital ownership and creator economies 🧵</p>
                  <span className="text-[#0BEFF7] text-xs">204 ♥</span>
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <span>5 days ago</span>
                  <span className="mx-2">•</span>
                  <span>48 replies</span>
                  <span className="mx-2">•</span>
                  <span>92 reposts</span>
                </div>
              </div>
              
              <div className="bg-[#1E2029] rounded-lg p-3 border-l-4 border-[#FF3864]">
                <div className="flex justify-between mb-1">
                  <p className="text-white font-medium text-sm">Top 5 crypto projects to watch in 2023 - A thread on innovation</p>
                  <span className="text-[#0BEFF7] text-xs">187 ♥</span>
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <span>1 week ago</span>
                  <span className="mx-2">•</span>
                  <span>39 replies</span>
                  <span className="mx-2">•</span>
                  <span>84 reposts</span>
                </div>
              </div>
            </div>
          )}
          
          <button className="w-full px-4 py-2 mt-4 rounded-lg border border-gray-700 text-gray-300 hover:border-[#0BEFF7] hover:text-[#0BEFF7] transition-colors text-sm">
            View All Posts
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Analytics;
