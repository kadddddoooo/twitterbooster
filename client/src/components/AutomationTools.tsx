import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AutomationConfig, ScheduledPost } from '@/types';

interface AutomationToolsProps {
  scheduledPosts?: ScheduledPost[];
}

const AutomationTools = ({ scheduledPosts = [] }: AutomationToolsProps) => {
  const { toast } = useToast();
  
  // Default automation configs
  const [automationConfig, setAutomationConfig] = useState<AutomationConfig>({
    autoReply: true,
    autoLike: true,
    autoRepost: false,
    dmAutomation: false
  });
  
  // Default scheduled posts if none provided
  const [posts, setPosts] = useState<ScheduledPost[]>(
    scheduledPosts.length > 0 ? scheduledPosts : [
      {
        id: 1,
        content: "Excited to share my thoughts on the latest Solana ecosystem developments!",
        scheduledTime: new Date(Date.now() + 3600000).toISOString(),
        status: 'scheduled',
        type: 'tweet',
        colorAccent: 'primary'
      },
      {
        id: 2,
        content: "Why Web3 is the future of digital ownership and creator economies 🧵",
        scheduledTime: new Date(Date.now() + 86400000).toISOString(),
        status: 'scheduled',
        type: 'thread',
        colorAccent: 'secondary'
      },
      {
        id: 3,
        content: "Top 5 crypto projects to watch in 2023 - A thread on innovation",
        scheduledTime: new Date(Date.now() + 7 * 86400000).toISOString(),
        status: 'scheduled',
        type: 'tweet',
        colorAccent: 'accent'
      }
    ]
  );

  const handleToggleAutomation = (key: keyof AutomationConfig) => {
    setAutomationConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: `${key.charAt(0).toUpperCase() + key.slice(1)} Automation`,
      description: `${automationConfig[key] ? 'Disabled' : 'Enabled'} successfully.`
    });
  };
  
  const handleRemoveScheduledPost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    
    toast({
      title: "Post Removed",
      description: "Scheduled post has been removed."
    });
  };
  
  const handleEditScheduledPost = (id: number) => {
    toast({
      title: "Edit Scheduled Post",
      description: "Opening post editor..."
    });
    // Would open a modal/form to edit the post
  };
  
  const formatScheduledTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  return (
    <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6 lg:col-span-2">
      <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Automation Tools</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Auto Reply */}
        <motion.div 
          className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 hover:border-[#0BEFF7] transition-colors cursor-pointer rounded-xl p-4"
          whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7]">
              <i className="ri-reply-all-line text-xl"></i>
            </div>
            <h3 className="ml-3 font-['Orbitron'] font-medium text-white">Auto Reply</h3>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={automationConfig.autoReply}
                  onChange={() => handleToggleAutomation('autoReply')}
                />
                <div className="w-11 h-6 bg-[#2A2D3A] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Automatically engage with relevant conversations</p>
        </motion.div>
        
        {/* Auto Like */}
        <motion.div 
          className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 hover:border-[#0BEFF7] transition-colors cursor-pointer rounded-xl p-4"
          whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7]">
              <i className="ri-heart-line text-xl"></i>
            </div>
            <h3 className="ml-3 font-['Orbitron'] font-medium text-white">Auto Like</h3>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={automationConfig.autoLike}
                  onChange={() => handleToggleAutomation('autoLike')}
                />
                <div className="w-11 h-6 bg-[#2A2D3A] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Like posts from your target audience</p>
        </motion.div>
        
        {/* Auto Repost */}
        <motion.div 
          className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 hover:border-[#0BEFF7] transition-colors cursor-pointer rounded-xl p-4"
          whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7]">
              <i className="ri-repeat-line text-xl"></i>
            </div>
            <h3 className="ml-3 font-['Orbitron'] font-medium text-white">Auto Repost</h3>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={automationConfig.autoRepost}
                  onChange={() => handleToggleAutomation('autoRepost')}
                />
                <div className="w-11 h-6 bg-[#1E2029] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Repost trending content in your niche</p>
        </motion.div>
        
        {/* DM Automation */}
        <motion.div 
          className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 hover:border-[#0BEFF7] transition-colors cursor-pointer rounded-xl p-4"
          whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7]">
              <i className="ri-send-plane-line text-xl"></i>
            </div>
            <h3 className="ml-3 font-['Orbitron'] font-medium text-white">DM Automation</h3>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={automationConfig.dmAutomation}
                  onChange={() => handleToggleAutomation('dmAutomation')}
                />
                <div className="w-11 h-6 bg-[#1E2029] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Send personalized messages to new followers</p>
        </motion.div>
      </div>
      
      <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-gray-700 rounded-xl p-4 mb-4">
        <div className="flex items-center mb-3">
          <h3 className="font-['Orbitron'] font-medium text-white">Schedule Posts</h3>
          <button 
            className="ml-auto text-[#0BEFF7] text-sm hover:text-[#FF3864] transition-colors"
            onClick={() => toast({
              title: "Add Scheduled Post",
              description: "Opening scheduler..."
            })}
          >
            <i className="ri-add-line mr-1"></i>
            Add New
          </button>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="flex items-center p-2 rounded-lg bg-[#1E2029] hover:bg-[#2A2D3A] transition-colors"
            >
              <div className={`w-2 h-full ${
                post.colorAccent === 'primary' ? 'bg-[#0BEFF7]' : 
                post.colorAccent === 'secondary' ? 'bg-[#8A2BE2]' : 
                'bg-[#FF3864]'
              } rounded-full mr-3`}></div>
              <div className="flex-1">
                <p className="text-white text-sm line-clamp-1">{post.content}</p>
                <p className="text-xs text-gray-400">{formatScheduledTime(post.scheduledTime)}</p>
              </div>
              <motion.button 
                className="text-gray-400 hover:text-[#0BEFF7] ml-2"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEditScheduledPost(post.id)}
              >
                <i className="ri-edit-line"></i>
              </motion.button>
              <motion.button 
                className="text-gray-400 hover:text-[#FF3864] ml-2"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRemoveScheduledPost(post.id)}
              >
                <i className="ri-delete-bin-line"></i>
              </motion.button>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-3 text-gray-400">
              No scheduled posts. Click "Add New" to create one.
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-3">
        <motion.button 
          className="px-5 py-3 rounded-lg bg-[#1E2029] border border-gray-700 text-white hover:border-[#0BEFF7] hover:bg-[#2A2D3A] transition-all duration-200 flex-1"
          whileHover={{ y: -3 }}
          whileTap={{ y: 0 }}
        >
          <i className="ri-settings-3-line mr-1"></i>
          Automation Settings
        </motion.button>
        <motion.button 
          className="px-5 py-3 rounded-lg bg-[#8A2BE2] text-white flex-1"
          whileHover={{ 
            y: -3,
            boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)' 
          }}
          whileTap={{ y: 0 }}
        >
          <i className="ri-rocket-line mr-1"></i>
          Optimize Schedule
        </motion.button>
      </div>
    </div>
  );
};

export default AutomationTools;
