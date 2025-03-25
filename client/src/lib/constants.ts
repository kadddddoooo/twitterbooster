// Twitter API constants
export const TWITTER_API_LIMITS = {
  tweetsPerDay: 100,
  likesPerDay: 1000,
  followsPerDay: 400,
  dmPerDay: 1000
};

// Hugging Face Constants
export const HUGGING_FACE_MODELS = {
  TEXT_GENERATION: 'gpt2',
  TWEET_GENERATOR: 'distilgpt2',
};

// App constants
export const CONTENT_TYPES = [
  { id: 'tweet', label: 'Tweet' },
  { id: 'thread', label: 'Thread' },
  { id: 'reply', label: 'Risposta' }
];

export const CONTENT_STYLES = [
  { id: 'viral', label: 'Virale' },
  { id: 'professional', label: 'Professionale' },
  { id: 'educational', label: 'Educativo' },
  { id: 'humorous', label: 'Umoristico' },
  { id: 'controversial', label: 'Controverso' },
  { id: 'analystic', label: 'Analitico' }
];

export const TRENDING_TOPICS = [
  { id: 1, name: 'Solana NFT Launch', posts: '65.2K', color: 'primary' },
  { id: 2, name: 'Web3 Gaming', posts: '42.8K', color: 'secondary' },
  { id: 3, name: 'DeFi Updates', posts: '31.5K', color: 'accent' },
  { id: 4, name: 'Crypto Market Rally', posts: '28.9K', color: 'primary' },
  { id: 5, name: 'AI x Blockchain', posts: '22.3K', color: 'secondary' },
];

// Colors
export const COLORS = {
  primary: '#0BEFF7',
  secondary: '#8A2BE2',
  accent: '#FF3864',
  dark: '#121217',
  surface: '#1E2029',
  surfaceLight: '#2A2D3A',
};

// Tipi di personalità AI
export const PERSONALITY_TYPES = [
  { id: 'educator', label: 'Educatore' },
  { id: 'analyst', label: 'Analista' },
  { id: 'visionary', label: 'Visionario' },
  { id: 'influencer', label: 'Influencer' },
  { id: 'humorist', label: 'Umorista' },
  { id: 'custom', label: 'Personalizzato' }
];

// Tipi di toni
export const TONE_SETTINGS = [
  { id: 'formal', label: 'Formale' },
  { id: 'casual', label: 'Casual' },
  { id: 'enthusiastic', label: 'Entusiasta' },
  { id: 'authoritative', label: 'Autorevole' },
  { id: 'friendly', label: 'Amichevole' }
];

// Tipi di risposta
export const RESPONSE_TYPES = [
  { id: 'informative', label: 'Informativo' },
  { id: 'engaging', label: 'Coinvolgente' },
  { id: 'questioning', label: 'Interrogativo' },
  { id: 'provocative', label: 'Provocatorio' },
  { id: 'supportive', label: 'Di supporto' }
];

// Aree di contenuto
export const CONTENT_FOCUS_AREAS = [
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'nft', label: 'NFT' },
  { id: 'defi', label: 'DeFi' },
  { id: 'trading', label: 'Trading' },
  { id: 'metaverse', label: 'Metaverso' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'dao', label: 'DAO' },
  { id: 'web3', label: 'Web3' }
];

// Livelli di uso degli hashtag
export const HASHTAG_USAGE_LEVELS = [
  { id: 1, label: 'Minimo (0-1)' },
  { id: 2, label: 'Moderato (2-3)' },
  { id: 3, label: 'Ottimale (3-5)' },
  { id: 4, label: 'Abbondante (5+)' }
];

// Livelli di uso delle emoji
export const EMOJI_USAGE_LEVELS = [
  { id: 1, label: 'Nessuna' },
  { id: 2, label: 'Occasionale' },
  { id: 3, label: 'Moderato' },
  { id: 4, label: 'Abbondante' }
];

// Frequenza dei contenuti
export const CONTENT_FREQUENCY_OPTIONS = [
  { id: 1, label: '1 post al giorno' },
  { id: 2, label: '2-3 post al giorno' },
  { id: 3, label: '4-5 post al giorno' },
  { id: 4, label: '6+ post al giorno' }
];
