// User types
export interface User {
  id: number;
  username: string;
  displayName: string;
  profileImage?: string;
  role: 'free' | 'pro' | 'admin';
}

// Twitter types
export interface Tweet {
  id: string;
  content: string;
  authorUsername: string;
  authorDisplayName: string;
  authorProfileImage?: string;
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
}

export interface ScheduledPost {
  id: number;
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
  type: 'tweet' | 'thread' | 'reply';
  colorAccent: 'primary' | 'secondary' | 'accent';
}

export interface AccountStats {
  followers: number;
  engagement: number;
  postsGenerated: number;
  web3Earnings: number;
  followersChange: number;
  engagementChange: number;
  postsGeneratedChange: number;
  web3EarningsChange: number;
}

// Content generation types
export interface ContentGenerationParams {
  topic: string;
  contentType: 'tweet' | 'thread' | 'reply';
  styles: string[];
}

export interface GeneratedContent {
  id: number;
  content: string;
  contentType: 'tweet' | 'thread' | 'reply';
  createdAt: string;
}

// Trending topic types
export interface TrendingTopic {
  id: number;
  name: string;
  posts: string;
  color: 'primary' | 'secondary' | 'accent';
}

// Automation types
export interface AutomationConfig {
  autoReply: boolean;
  autoLike: boolean;
  autoRepost: boolean;
  dmAutomation: boolean;
}

// Web3 types
export interface WalletInfo {
  address: string;
  balance: number;
  isConnected: boolean;
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  items: number;
}
