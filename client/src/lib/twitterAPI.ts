import { TWITTER_API_LIMITS } from './constants';

const API_BASE_URL = '/api/twitter';

// Define Twitter API interfaces
export interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  username: string;
  likes: number;
  retweets: number;
  replies: number;
}

export interface TwitterAccount {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  following: number;
  engagement: number;
}

export interface PostTweetParams {
  text: string;
  mediaIds?: string[];
  replyToId?: string;
}

export interface ApiLimits {
  tweets: number;
  likes: number;
  follows: number;
  dms: number;
  remaining: {
    tweets: number;
    likes: number;
    follows: number;
    dms: number;
  };
}

// Twitter API Functions
export async function getTwitterAccount(): Promise<TwitterAccount | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/account`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching Twitter account:', error);
    return null;
  }
}

export async function getAccountStats(): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching account stats:', error);
    return null;
  }
}

export async function postTweet(params: PostTweetParams): Promise<Tweet | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/tweet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to post tweet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error posting tweet:', error);
    return null;
  }
}

export async function scheduleTweet(params: PostTweetParams & { scheduledTime: string }): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to schedule tweet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scheduling tweet:', error);
    throw error;
  }
}

export async function getTrendingTopics(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/trends`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

export async function engageWithTweet(tweetId: string, action: 'like' | 'retweet' | 'reply', content?: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/engage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tweetId,
        action,
        content,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error performing ${action} action:`, error);
    return false;
  }
}

export function getApiLimits(): ApiLimits {
  return {
    tweets: TWITTER_API_LIMITS.tweetsPerDay,
    likes: TWITTER_API_LIMITS.likesPerDay,
    follows: TWITTER_API_LIMITS.followsPerDay,
    dms: TWITTER_API_LIMITS.dmPerDay,
    remaining: {
      tweets: Math.floor(TWITTER_API_LIMITS.tweetsPerDay * 0.8), // Simulated remaining
      likes: Math.floor(TWITTER_API_LIMITS.likesPerDay * 0.9),
      follows: Math.floor(TWITTER_API_LIMITS.followsPerDay * 0.7),
      dms: Math.floor(TWITTER_API_LIMITS.dmPerDay * 0.95)
    }
  };
}
