import { useState } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import AutomationTools from '@/components/AutomationTools';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Automation = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Header */}
      <Header 
        title="Automation" 
        subtitle="Automate your X engagement and growth"
      />
      
      {/* Advanced Automation Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AutomationTools />
          
          {/* Automation Rules */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-['Orbitron'] font-bold text-white">Automation Rules</h2>
              <button className="text-[#0BEFF7] hover:text-[#FF3864] transition-colors">
                <i className="ri-add-circle-line text-lg"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#1E2029] rounded-lg p-4 border border-gray-700 hover:border-[#0BEFF7] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2">
                      <i className="ri-magic-line"></i>
                    </div>
                    <h3 className="font-medium text-white">Like tweets with #Solana</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-[#1E2029] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <p className="text-gray-400 text-sm">Automatically like tweets containing #Solana hashtag from accounts with {'>'}500 followers.</p>
                <div className="flex mt-2 text-xs">
                  <span className="px-2 py-1 rounded bg-[#2A2D3A] text-[#0BEFF7] mr-2">Max 30/day</span>
                  <span className="px-2 py-1 rounded bg-[#2A2D3A] text-gray-300">Frequency: High</span>
                </div>
              </div>
              
              <div className="bg-[#1E2029] rounded-lg p-4 border border-gray-700 hover:border-[#0BEFF7] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-2">
                      <i className="ri-user-follow-line"></i>
                    </div>
                    <h3 className="font-medium text-white">Follow crypto influencers</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-[#1E2029] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <p className="text-gray-400 text-sm">Automatically follow crypto influencers who mention NFTs, Web3, or blockchain.</p>
                <div className="flex mt-2 text-xs">
                  <span className="px-2 py-1 rounded bg-[#2A2D3A] text-[#0BEFF7] mr-2">Max 10/day</span>
                  <span className="px-2 py-1 rounded bg-[#2A2D3A] text-gray-300">Frequency: Medium</span>
                </div>
              </div>
              
              <div className="bg-[#1E2029] rounded-lg p-4 border border-gray-700 hover:border-[#0BEFF7] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-[#2A2D3A] flex items-center justify-center text-[#FF3864] mr-2">
                      <i className="ri-reply-line"></i>
                    </div>
                    <h3 className="font-medium text-white">Auto-reply to mentions</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#1E2029] peer-checked:bg-[#0BEFF7] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121217] after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <p className="text-gray-400 text-sm">Respond to mentions with AI-generated replies that are contextually relevant.</p>
                <div className="flex mt-2 text-xs">
                  <span className="px-2 py-1 rounded bg-[#2A2D3A] text-[#0BEFF7] mr-2">Max 15/day</span>
                  <span className="px-2 py-1 rounded bg-[#2A2D3A] text-gray-300">Frequency: Low</span>
                </div>
              </div>
            </div>
            
            <button className="w-full px-4 py-3 mt-4 rounded-lg border border-[#0BEFF7] text-[#0BEFF7] hover:bg-[#0BEFF7] hover:text-[#121217] transition-colors">
              Create New Rule
            </button>
          </motion.div>
        </div>
        
        <div className="space-y-6">
          {/* Daily Limits */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Daily Limits</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Likes</span>
                  <span className="text-white text-sm">12/50</span>
                </div>
                <div className="w-full h-2 bg-[#1E2029] rounded-full overflow-hidden">
                  <div className="bg-[#0BEFF7] h-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Follows</span>
                  <span className="text-white text-sm">5/20</span>
                </div>
                <div className="w-full h-2 bg-[#1E2029] rounded-full overflow-hidden">
                  <div className="bg-[#0BEFF7] h-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Replies</span>
                  <span className="text-white text-sm">8/30</span>
                </div>
                <div className="w-full h-2 bg-[#1E2029] rounded-full overflow-hidden">
                  <div className="bg-[#0BEFF7] h-full" style={{ width: '27%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Direct Messages</span>
                  <span className="text-white text-sm">3/25</span>
                </div>
                <div className="w-full h-2 bg-[#1E2029] rounded-full overflow-hidden">
                  <div className="bg-[#0BEFF7] h-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-[#1E2029] text-sm">
              <p className="text-gray-300">These limits are set by Twitter's API and help keep your account safe from restrictions.</p>
            </div>
          </motion.div>
          
          {/* Activity Log */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Activity Log</h2>
            
            <div className="max-h-64 overflow-y-auto space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2 mt-1">
                  <i className="ri-heart-line text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Liked tweet from @cryptoleader</p>
                  <p className="text-gray-400 text-xs">10 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-2 mt-1">
                  <i className="ri-user-follow-line text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Followed @web3developer</p>
                  <p className="text-gray-400 text-xs">25 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#2A2D3A] flex items-center justify-center text-[#FF3864] mr-2 mt-1">
                  <i className="ri-send-plane-line text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Posted scheduled tweet</p>
                  <p className="text-gray-400 text-xs">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#2A2D3A] flex items-center justify-center text-[#0BEFF7] mr-2 mt-1">
                  <i className="ri-heart-line text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Liked tweet from @nftartist</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#2A2D3A] flex items-center justify-center text-[#8A2BE2] mr-2 mt-1">
                  <i className="ri-user-follow-line text-sm"></i>
                </div>
                <div>
                  <p className="text-white text-sm">Followed @cryptoanalyst</p>
                  <p className="text-gray-400 text-xs">3 hours ago</p>
                </div>
              </div>
            </div>
            
            <button className="w-full px-4 py-3 mt-4 rounded-lg bg-[#1E2029] text-gray-300 hover:text-[#0BEFF7] transition-colors text-sm">
              View Full Activity Log
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Automation;
