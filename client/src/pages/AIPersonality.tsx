import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PERSONALITY_TYPES, 
  TONE_SETTINGS, 
  RESPONSE_TYPES, 
  CONTENT_FOCUS_AREAS,
  EMOJI_USAGE_LEVELS,
  HASHTAG_USAGE_LEVELS,
  CONTENT_FREQUENCY_OPTIONS
} from '@/lib/constants';

const AIPersonality = () => {
  const { user } = useAuth();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [selectedPersonalityId, setSelectedPersonalityId] = useState<number | null>(null);
  
  // AI Personality states
  const [selectedPersonality, setSelectedPersonality] = useState('educator');
  const [toneSetting, setToneSetting] = useState('authoritative');
  const [contentFocus, setContentFocus] = useState(['blockchain', 'defi']);
  const [contentFrequency, setContentFrequency] = useState(2);
  const [responseType, setResponseType] = useState('informative');
  const [hashtagUsage, setHashtagUsage] = useState(2);
  const [emojiUsage, setEmojiUsage] = useState(2);
  const [isLearningEnabled, setIsLearningEnabled] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [name, setName] = useState('CryptoTeacher');
  const [bio, setBio] = useState('AI-powered crypto educator sharing insights on Web3, NFTs, and blockchain technology.');
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [hasOwnAccount, setHasOwnAccount] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [twitterPassword, setTwitterPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Fetch AI personalities
  const { data: aiPersonalities = [], isLoading: loadingPersonalities } = useQuery({
    queryKey: ['/api/ai-personality', user.id],
    queryFn: () => apiRequest(`/api/ai-personality?userId=${user.id}`),
    refetchOnWindowFocus: false
  });
  
  const personalities = [
    { id: 'educator', name: 'The Educator', description: 'Shares informative content with clear explanations', icon: 'ri-book-open-line' },
    { id: 'visionary', name: 'The Visionary', description: 'Forward-thinking ideas about future tech', icon: 'ri-eye-line' },
    { id: 'analyst', name: 'The Analyst', description: 'Data-driven insights and technical analysis', icon: 'ri-line-chart-line' },
    { id: 'influencer', name: 'The Influencer', description: 'Trendy, engaging content that drives social engagement', icon: 'ri-group-line' },
    { id: 'humorist', name: 'The Humorist', description: 'Light-hearted, humorous takes on crypto trends', icon: 'ri-emotion-laugh-line' },
    { id: 'custom', name: 'Custom Personality', description: 'Configure your own AI personality type', icon: 'ri-settings-4-line' },
  ];
  
  const contentTopics = [
    { id: 'crypto', label: 'Cryptocurrency' },
    { id: 'web3', label: 'Web3' },
    { id: 'nft', label: 'NFTs' },
    { id: 'defi', label: 'DeFi' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'metaverse', label: 'Metaverse' },
    { id: 'trading', label: 'Trading' },
    { id: 'mining', label: 'Mining' },
  ];
  
  const toneOptions = [
    { id: 'professional', label: 'Professional' },
    { id: 'enthusiastic', label: 'Enthusiastic' },
    { id: 'casual', label: 'Casual' },
    { id: 'authoritative', label: 'Authoritative' },
    { id: 'controversial', label: 'Controversial' },
    { id: 'humorous', label: 'Humorous' },
  ];
  
  const responseTypes = [
    { id: 'quick', label: 'Quick & Direct' },
    { id: 'thoughtful', label: 'Thoughtful & Balanced' },
    { id: 'provocative', label: 'Provocative & Bold' },
    { id: 'questioning', label: 'Questioning & Curious' },
  ];
  
  const handleContentFocusToggle = (topic: string) => {
    if (contentFocus.includes(topic)) {
      setContentFocus(contentFocus.filter(t => t !== topic));
    } else {
      setContentFocus([...contentFocus, topic]);
    }
  };
  
  const handleSelectPersonality = (id: string) => {
    setSelectedPersonality(id);
    
    // Apply preset values based on personality type
    switch (id) {
      case 'educator':
        setToneSetting('authoritative');
        setContentFocus(['blockchain', 'defi']);
        setResponseType('informative');
        setHashtagUsage(2);
        setEmojiUsage(1);
        setName('CryptoTeacher');
        setBio('AI-powered crypto educator sharing insights on Web3, NFTs, and blockchain technology.');
        break;
      case 'visionary':
        setToneSetting('enthusiastic');
        setContentFocus(['web3', 'metaverse', 'blockchain']);
        setResponseType('provocative');
        setHashtagUsage(3);
        setEmojiUsage(2);
        setName('FutureVision');
        setBio('Looking into the crypto crystal ball. Shaping tomorrow\'s digital landscape today.');
        break;
      case 'analyst':
        setToneSetting('authoritative');
        setContentFocus(['crypto', 'trading', 'defi']);
        setResponseType('thoughtful');
        setHashtagUsage(1);
        setEmojiUsage(0);
        setName('CryptoAnalytics');
        setBio('Data-driven insights on crypto markets. Separating signal from noise.');
        break;
      case 'influencer':
        setToneSetting('enthusiastic');
        setContentFocus(['crypto', 'nft', 'web3']);
        setResponseType('quick');
        setHashtagUsage(5);
        setEmojiUsage(5);
        setName('CryptoTrend');
        setBio('Your guide to what\'s hot in crypto! Early on the best NFTs, tokens and trends');
        break;
      case 'humorist':
        setToneSetting('humorous');
        setContentFocus(['crypto', 'nft', 'defi']);
        setResponseType('provocative');
        setHashtagUsage(3);
        setEmojiUsage(4);
        setName('CryptoJester');
        setBio('Finding the funny in a volatile market. Memes, jokes and serious insights with a twist.');
        break;
      default:
        // Custom - keep current values
        break;
    }
  };
  
  // Create personality mutation
  const createPersonalityMutation = useMutation({
    mutationFn: (personality: any) => 
      apiRequest('/api/ai-personality', { method: 'POST', data: personality }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-personality', user.id] });
      toast({
        title: "AI Personality Created",
        description: "Your personalized AI settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create AI personality. Please try again.",
        variant: "destructive"
      });
      console.error("Error creating AI personality:", error);
    }
  });

  // Update personality mutation
  const updatePersonalityMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest(`/api/ai-personality/${id}`, { method: 'PUT', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-personality', user.id] });
      toast({
        title: "AI Personality Updated",
        description: "Your personalized AI settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update AI personality. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating AI personality:", error);
    }
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: (personalityId: number) => 
      apiRequest(`/api/ai-personality/${personalityId}/generate`, { method: 'POST' }),
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Content Generated",
        description: "Your AI has generated a sample post. Check the preview below.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
      console.error("Error generating content:", error);
    }
  });

  // Save personality handler
  const handleSavePersonality = () => {
    // Validation for email when creating own account
    if (hasOwnAccount && (!email || !emailPassword || !twitterUsername || !twitterPassword)) {
      toast({
        title: "Missing Information",
        description: "Please fill all the required fields for creating an autonomous account.",
        variant: "destructive"
      });
      return;
    }
    
    const personalityData = {
      userId: user.id,
      name,
      bio,
      personalityType: selectedPersonality,
      toneSetting,
      responseType,
      contentFocus,
      contentFrequency,
      hashtagUsage,
      emojiUsage,
      isLearningEnabled,
      autoReplyEnabled,
      language: selectedLanguage,
      hasOwnAccount,
      email: hasOwnAccount ? email : null,
      emailPassword: hasOwnAccount ? emailPassword : null,
      twitterUsername: hasOwnAccount ? twitterUsername : null,
      twitterPassword: hasOwnAccount ? twitterPassword : null
    };
    
    if (selectedPersonalityId) {
      // Update existing personality
      updatePersonalityMutation.mutate({ id: selectedPersonalityId, data: personalityData });
    } else {
      // Create new personality
      createPersonalityMutation.mutate(personalityData);
    }
    
    if (hasOwnAccount) {
      toast({
        title: "Account Setup",
        description: "Your AI will have its own autonomous Twitter account. Please check the Automation tab to monitor its activities.",
      });
    }
  };
  
  // Generate test post handler
  const handleTestPost = () => {
    if (selectedPersonalityId) {
      generateContentMutation.mutate(selectedPersonalityId);
    } else {
      // If no personality is selected/saved, we need to create one first
      const personalityData = {
        userId: user.id,
        name,
        bio,
        personalityType: selectedPersonality,
        toneSetting,
        responseType,
        contentFocus,
        contentFrequency,
        hashtagUsage,
        emojiUsage,
        isLearningEnabled,
        autoReplyEnabled
      };
      
      createPersonalityMutation.mutate(personalityData, {
        onSuccess: (data) => {
          if (data && data.id) {
            setSelectedPersonalityId(data.id);
            generateContentMutation.mutate(data.id);
          }
        }
      });
    }
  };

  // Set selected personality from saved data when available
  useEffect(() => {
    if (aiPersonalities && aiPersonalities.length > 0) {
      const firstPersonality = aiPersonalities[0];
      setSelectedPersonalityId(firstPersonality.id);
      setName(firstPersonality.name);
      setBio(firstPersonality.bio || '');
      setSelectedPersonality(firstPersonality.personalityType);
      setToneSetting(firstPersonality.toneSetting);
      setResponseType(firstPersonality.responseType);
      setContentFocus(firstPersonality.contentFocus || []);
      setContentFrequency(firstPersonality.contentFrequency);
      setHashtagUsage(firstPersonality.hashtagUsage);
      setEmojiUsage(firstPersonality.emojiUsage);
      setIsLearningEnabled(firstPersonality.isLearningEnabled);
      setAutoReplyEnabled(firstPersonality.autoReplyEnabled);
    }
  }, [aiPersonalities]);

  return (
    <Layout>
      {/* Header */}
      <Header 
        title="AI Personality Settings" 
        subtitle="Customize how your AI assistant generates content"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personality Type Selection */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Personality Type</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PERSONALITY_TYPES.map((type) => (
                <motion.div
                  key={type.id}
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedPersonality === type.id 
                      ? 'bg-[#0BEFF7] text-[#121217] font-medium' 
                      : 'bg-[#1E2029] text-white hover:bg-[#2A2D3A]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPersonality(type.id)}
                >
                  {type.label}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-[#1E2029] rounded-lg">
              <p className="text-white font-medium mb-1">Personality Description:</p>
              <p className="text-gray-400 text-sm">{bio}</p>
            </div>
          </motion.div>
          
          {/* Tone and Response Settings */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Tone & Response Style</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tone</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TONE_SETTINGS.map((tone) => (
                    <motion.div
                      key={tone.id}
                      className={`p-3 rounded-lg cursor-pointer text-center ${
                        toneSetting === tone.id 
                          ? 'bg-[#0BEFF7] text-[#121217] font-medium' 
                          : 'bg-[#1E2029] text-white hover:bg-[#2A2D3A]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setToneSetting(tone.id)}
                    >
                      {tone.label}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Response Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {RESPONSE_TYPES.map((type) => (
                    <motion.div
                      key={type.id}
                      className={`p-3 rounded-lg cursor-pointer text-center ${
                        responseType === type.id 
                          ? 'bg-[#0BEFF7] text-[#121217] font-medium' 
                          : 'bg-[#1E2029] text-white hover:bg-[#2A2D3A]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setResponseType(type.id)}
                    >
                      {type.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Content Focus Areas */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Content Focus Areas</h2>
            <p className="text-gray-400 text-sm mb-4">Select the topics your AI should focus on (select multiple if needed)</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONTENT_FOCUS_AREAS.map((area) => (
                <motion.div
                  key={area.id}
                  className={`p-3 rounded-lg cursor-pointer text-center ${
                    contentFocus.includes(area.id) 
                      ? 'bg-[#0BEFF7] text-[#121217] font-medium' 
                      : 'bg-[#1E2029] text-white hover:bg-[#2A2D3A]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContentFocusToggle(area.id)}
                >
                  {area.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Custom Instructions */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Custom Instructions</h2>
            <p className="text-gray-400 text-sm mb-4">Add specific instructions for your AI assistant</p>
            
            <textarea
              className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-[#0BEFF7] min-h-[150px]"
              placeholder="Example: Always include a call to action at the end of posts. Focus on educational content with occasional humor."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
            
            <div className="flex justify-end mt-4">
              <motion.button
                className="px-4 py-2 bg-[#1E2029] text-gray-400 rounded-lg hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBio('')}
              >
                Clear
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-6">
          {/* Content Style Sliders */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Content Style</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Hashtag Usage</label>
                  <span className="text-sm text-[#0BEFF7]">{HASHTAG_USAGE_LEVELS.find(l => l.id === hashtagUsage)?.label}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="4"
                  value={hashtagUsage}
                  onChange={(e) => setHashtagUsage(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1E2029] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0BEFF7]"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                  <span>None</span>
                  <span>Balanced</span>
                  <span>Heavy</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Emoji Usage</label>
                  <span className="text-sm text-[#0BEFF7]">{EMOJI_USAGE_LEVELS.find(l => l.id === emojiUsage)?.label}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="4"
                  value={emojiUsage}
                  onChange={(e) => setEmojiUsage(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1E2029] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0BEFF7]"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                  <span>None</span>
                  <span>Balanced</span>
                  <span>Heavy</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Content Frequency</label>
                  <span className="text-sm text-[#0BEFF7]">{CONTENT_FREQUENCY_OPTIONS.find(l => l.id === contentFrequency)?.label}</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="4"
                  value={contentFrequency}
                  onChange={(e) => setContentFrequency(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1E2029] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0BEFF7]"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Preview */}
          <motion.div 
            className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Preview</h2>
            
            <div className="bg-[#1E2029] rounded-lg p-4">
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-white">{user?.username || 'YourName'}</p>
                  <p className="text-gray-400 text-sm">@{user?.username?.toLowerCase().replace(/\s+/g, '') || 'yourhandle'} · 2h</p>
                </div>
              </div>
              
              <p className="text-white mb-3">
                {selectedPersonality === 'educator' && (
                  <>
                    A fascinating aspect of #DeFi is how it's revolutionizing traditional finance by removing intermediaries. 
                    This creates more efficient systems with lower fees and broader access. 
                    {hashtagUsage > 2 && ' #Blockchain #Crypto #Finance'}
                    {emojiUsage > 1 && ' 🚀💡'}
                  </>
                )}
                
                {selectedPersonality === 'analyst' && (
                  <>
                    Analyzing recent market data shows #DeFi TVL has grown by 24% this quarter despite broader market conditions.
                    This indicates growing institutional confidence in decentralized protocols.
                    {hashtagUsage > 2 && ' #MarketAnalysis #TradingInsights #Blockchain'}
                    {emojiUsage > 1 && ' 📊📈'}
                  </>
                )}
                
                {selectedPersonality === 'visionary' && (
                  <>
                    The future of #DeFi will transcend financial applications, creating entire economic systems without borders.
                    We're witnessing the early stages of a paradigm shift in how value moves globally.
                    {hashtagUsage > 2 && ' #FutureOfFinance #Innovation #Web3'}
                    {emojiUsage > 1 && ' 🔮✨'}
                  </>
                )}
                
                {selectedPersonality === 'influencer' && (
                  <>
                    OMG! Just found this amazing #DeFi protocol with insane yields! Who else is jumping on this opportunity?
                    The potential here is MASSIVE!
                    {hashtagUsage > 2 && ' #CryptoGains #ToTheMoon #MustSee'}
                    {emojiUsage > 1 && ' 🔥💰'}
                  </>
                )}
                
                {selectedPersonality === 'humorist' && (
                  <>
                    My relationship with #DeFi is complicated. It promised me financial freedom but delivered anxiety charts instead.
                    Still better than my ex though!
                    {hashtagUsage > 2 && ' #CryptoHumor #BlockchainJokes #FinanceLife'}
                    {emojiUsage > 1 && ' 😂💸'}
                  </>
                )}
                
                {selectedPersonality === 'custom' && (
                  <>
                    This is a custom preview based on your specific instructions. It would reflect the tone, style, and content focus areas you've selected.
                  </>
                )}
              </p>
              
              <div className="flex items-center text-gray-400 text-sm space-x-5">
                <span className="flex items-center">
                  <i className="ri-heart-line mr-1"></i>
                  <span>123</span>
                </span>
                <span className="flex items-center">
                  <i className="ri-repeat-line mr-1"></i>
                  <span>45</span>
                </span>
                <span className="flex items-center">
                  <i className="ri-chat-1-line mr-1"></i>
                  <span>22</span>
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className="w-full px-4 py-3 rounded-lg bg-[#0BEFF7] text-[#121217] font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePersonality}
            >
              Save Personality Settings
            </motion.button>
            
            <motion.button
              className="w-full px-4 py-3 rounded-lg bg-[#1E2029] border border-gray-700 text-gray-300 transition-colors"
              whileHover={{ scale: 1.02, borderColor: '#0BEFF7', color: '#0BEFF7' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedPersonality('educator');
                setToneSetting('authoritative');
                setResponseType('informative');
                setContentFocus(['blockchain', 'defi']);
                setEmojiUsage(2);
                setHashtagUsage(2);
                setContentFrequency(2);
                setBio('AI-powered crypto educator sharing insights on Web3, NFTs, and blockchain technology.');
                
                toast({
                  title: "Settings Reset",
                  description: "Your AI personality settings have been reset to default."
                });
              }}
            >
              Reset to Default
            </motion.button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AIPersonality;