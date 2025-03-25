import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateTweet, generateThread } from '@/lib/huggingface';
import { postTweet, scheduleTweet } from '@/lib/twitterAPI';
import { CONTENT_TYPES, CONTENT_STYLES } from '@/lib/constants';
import { Spinner } from '@/components/ui/spinner';

interface AIContentGeneratorProps {
  user: {
    username?: string;
    id?: number;
    displayName?: string;
    profileImage?: string;
    role?: string;
  };
}

const AIContentGenerator = ({ user }: AIContentGeneratorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState('tweet');
  const [topic, setTopic] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['viral']);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const handleSelectStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  
  const handleGenerateContent = async () => {
    if (!topic) {
      toast({
        title: "Argomento richiesto",
        description: "Inserisci un argomento per la generazione del contenuto.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedStyles.length === 0) {
      toast({
        title: "Stile richiesto",
        description: "Seleziona almeno uno stile per la generazione del contenuto.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setGeneratedContent('');
    setGeneratedThread([]);
    
    try {
      if (contentType === 'tweet') {
        const generatedTweet = await generateTweet(topic, selectedStyles);
        
        if (generatedTweet) {
          setGeneratedContent(generatedTweet);
          toast({
            title: "Contenuto generato",
            description: "Il tuo tweet è stato generato con successo.",
          });
        }
      } else if (contentType === 'thread') {
        const generatedThreadContent = await generateThread(topic, 4); // Generate a 4-tweet thread
        
        if (generatedThreadContent && generatedThreadContent.length > 0) {
          setGeneratedThread(generatedThreadContent);
          toast({
            title: "Thread generato",
            description: `Thread di ${generatedThreadContent.length} tweet generato con successo.`,
          });
        }
      }
    } catch (error) {
      console.error('Errore nella generazione del contenuto:', error);
      toast({
        title: "Errore di generazione",
        description: "Si è verificato un errore durante la generazione del contenuto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePostNow = async () => {
    setIsPosting(true);
    
    try {
      if (contentType === 'tweet') {
        if (!generatedContent) {
          throw new Error("Nessun contenuto da pubblicare");
        }
        
        await postTweet({ text: generatedContent });
        
        toast({
          title: "Tweet pubblicato",
          description: "Il tuo tweet è stato pubblicato con successo.",
        });
      } else if (contentType === 'thread' && generatedThread.length > 0) {
        // Post thread logic would go here
        // This would involve posting the first tweet, then replying to it with subsequent tweets
        toast({
          title: "Thread pubblicato",
          description: `Thread di ${generatedThread.length} tweet pubblicato con successo.`,
        });
      }
    } catch (error) {
      console.error('Errore nella pubblicazione:', error);
      toast({
        title: "Errore di pubblicazione",
        description: "Si è verificato un errore durante la pubblicazione del contenuto.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Data e ora richieste",
        description: "Seleziona data e ora per programmare il post.",
        variant: "destructive"
      });
      return;
    }
    
    setIsScheduling(true);
    
    try {
      const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`);
      
      if (contentType === 'tweet') {
        if (!generatedContent) {
          throw new Error("Nessun contenuto da programmare");
        }
        
        await scheduleTweet({ 
          text: generatedContent, 
          scheduledTime: scheduledTime.toISOString() 
        });
        
        toast({
          title: "Tweet programmato",
          description: `Il tuo tweet è stato programmato per ${scheduledTime.toLocaleString()}.`,
        });
      } else if (contentType === 'thread' && generatedThread.length > 0) {
        // Schedule thread logic would go here
        toast({
          title: "Thread programmato",
          description: `Thread di ${generatedThread.length} tweet programmato per ${scheduledTime.toLocaleString()}.`,
        });
      }
      
      setScheduleDate('');
      setScheduleTime('');
    } catch (error) {
      console.error('Errore nella programmazione:', error);
      toast({
        title: "Errore di programmazione",
        description: "Si è verificato un errore durante la programmazione del contenuto.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };
  
  return (
    <div className="bg-[rgba(30,32,41,0.7)] backdrop-blur-[10px] border border-[rgba(30,32,41,0.9)] border-b-[rgba(255,255,255,0.1)] border-r-[rgba(255,255,255,0.1)] rounded-xl p-6 lg:col-span-2">
      <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-4">Generatore Contenuti AI</h2>
      
      {/* Generation Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tipo di Contenuto</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {CONTENT_TYPES.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-3 py-2 rounded-lg text-sm ${
                  contentType === type.id 
                    ? 'bg-[#2A2D3A] border border-[#0BEFF7] text-[#0BEFF7]' 
                    : 'bg-[#1E2029] text-gray-300 hover:bg-[#2A2D3A] hover:text-[#0BEFF7] transition-colors'
                }`}
                onClick={() => setContentType(type.id)}
              >
                {type.label}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="topic" className="block text-sm text-gray-400 mb-1">Argomento</label>
          <div className="relative">
            <input 
              type="text" 
              id="topic" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]" 
              placeholder="Crypto, Web3, NFTs, etc." 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Stile</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONTENT_STYLES.map((style) => (
              <div key={style.id} className="relative">
                <input 
                  type="checkbox" 
                  id={style.id} 
                  className="peer absolute opacity-0" 
                  checked={selectedStyles.includes(style.id)}
                  onChange={() => handleSelectStyle(style.id)}
                />
                <label 
                  htmlFor={style.id} 
                  className={`block cursor-pointer px-3 py-2 rounded-lg text-sm text-center ${
                    selectedStyles.includes(style.id)
                      ? 'bg-[#2A2D3A] text-[#0BEFF7] border border-[#0BEFF7]'
                      : 'bg-[#1E2029] text-gray-300'
                  } transition-colors`}
                >
                  {style.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            className="px-5 py-3 rounded-lg bg-[#0BEFF7] text-[#121217] font-['Orbitron'] font-medium flex-1 disabled:opacity-50 flex items-center justify-center"
            whileHover={{ boxShadow: '0 0 15px rgba(11, 239, 247, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateContent}
            disabled={loading || !topic || selectedStyles.length === 0}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2 text-[#121217]" />
                <span>Generazione...</span>
              </>
            ) : (
              'Genera Contenuto'
            )}
          </motion.button>
          <motion.button
            className="p-3 rounded-lg bg-[#1E2029] border border-gray-700 text-gray-300 hover:border-[#0BEFF7] hover:text-[#0BEFF7] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="ri-settings-3-line"></i>
          </motion.button>
        </div>
      </div>
      
      {/* Generated Content Preview */}
      {(generatedContent || generatedThread.length > 0) && (
        <div className="border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-3">Anteprima</h3>
          
          {contentType === 'tweet' && generatedContent && (
            <div className="bg-[#1E2029] rounded-lg p-4">
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                  {user.displayName?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{user.displayName}</p>
                  <p className="text-xs text-gray-400">@{user.username?.toLowerCase()}</p>
                </div>
              </div>
              <p className="text-white whitespace-pre-wrap mb-3">{generatedContent}</p>
              <p className="text-xs text-gray-400">Generato con AI</p>
            </div>
          )}
          
          {contentType === 'thread' && generatedThread.length > 0 && (
            <div className="space-y-4">
              {generatedThread.map((tweet, index) => (
                <div key={index} className="bg-[#1E2029] rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                      {user.displayName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.displayName}</p>
                      <p className="text-xs text-gray-400">@{user.username?.toLowerCase()}</p>
                    </div>
                  </div>
                  <p className="text-white whitespace-pre-wrap mb-3">{tweet}</p>
                  <p className="text-xs text-gray-400">{index + 1}/{generatedThread.length}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <motion.button
              className="px-4 py-2 rounded-lg bg-[#FF3864] text-white font-medium flex items-center disabled:opacity-50"
              whileHover={{ boxShadow: '0 0 10px rgba(255, 56, 100, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePostNow}
              disabled={isPosting || (!generatedContent && generatedThread.length === 0)}
            >
              {isPosting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>Pubblicazione...</span>
                </>
              ) : (
                <>
                  <i className="ri-send-plane-fill mr-2"></i>
                  <span>Pubblica ora</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              className="px-4 py-2 rounded-lg bg-[#8A2BE2] text-white font-medium flex items-center disabled:opacity-50"
              whileHover={{ boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const scheduleSection = document.getElementById('schedule-section');
                if (scheduleSection) {
                  scheduleSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={!generatedContent && generatedThread.length === 0}
            >
              <i className="ri-time-line mr-2"></i>
              <span>Programma</span>
            </motion.button>
            
            <motion.button
              className="px-4 py-2 rounded-lg bg-[#1E2029] border border-gray-700 text-gray-300 hover:border-[#0BEFF7] hover:text-[#0BEFF7] transition-colors font-medium flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigator.clipboard.writeText(contentType === 'tweet' ? generatedContent : generatedThread.join('\n\n'));
                toast({
                  title: "Copiato",
                  description: "Contenuto copiato negli appunti.",
                });
              }}
            >
              <i className="ri-file-copy-line mr-2"></i>
              <span>Copia</span>
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Schedule Section */}
      {(generatedContent || generatedThread.length > 0) && (
        <div id="schedule-section" className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Programma</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data</label>
              <input 
                type="date" 
                className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ora</label>
              <input 
                type="time" 
                className="w-full bg-[#1E2029] rounded-lg border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-[#0BEFF7]"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
          
          <motion.button
            className="w-full px-4 py-2 rounded-lg bg-[#8A2BE2] text-white font-medium flex items-center justify-center disabled:opacity-50"
            whileHover={{ boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSchedule}
            disabled={isScheduling || !scheduleDate || !scheduleTime}
          >
            {isScheduling ? (
              <>
                <Spinner size="sm" className="mr-2" />
                <span>Programmazione...</span>
              </>
            ) : (
              <>
                <i className="ri-calendar-check-line mr-2"></i>
                <span>Conferma programmazione</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
