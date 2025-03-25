import 'dotenv/config';
import { users, type User, type InsertUser, type AIPersonality, type InsertAIPersonality } from "@shared/schema";
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Twitter token structure
export interface TwitterTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Twitter user info structure
export interface TwitterUserInfo {
  twitterId: string;
  twitterUsername: string;
  twitterDisplayName: string;
  profileImageUrl: string;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // AI Personality CRUD operations
  getAIPersonalities(userId: number): Promise<AIPersonality[]>;
  getAIPersonality(id: number): Promise<AIPersonality | undefined>;
  createAIPersonality(personality: InsertAIPersonality): Promise<AIPersonality>;
  updateAIPersonality(id: number, personality: Partial<InsertAIPersonality>): Promise<AIPersonality | undefined>;
  deleteAIPersonality(id: number): Promise<boolean>;
  
  // Aggiungiamo i metodi per Twitter
  saveTwitterTokens(userId: number, tokens: TwitterTokens): Promise<void>;
  getTwitterTokens(userId: number): Promise<TwitterTokens | null>;
  updateUserTwitterInfo(userId: number, info: TwitterUserInfo): Promise<void>;
  getUserTwitterInfo(userId: number): Promise<TwitterUserInfo | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiPersonalities: Map<number, AIPersonality>;
  currentId: number;
  aiPersonalityCurrentId: number;
  private twitterTokens: { userId: number; accessToken: string; refreshToken: string; expiresAt: Date }[] = [];
  private db: any; // Simulate database for now
  private twitterTokensMap: Map<number, TwitterTokens> = new Map();
  private twitterUserInfo: Map<number, TwitterUserInfo> = new Map();

  constructor() {
    this.users = new Map();
    this.aiPersonalities = new Map();
    this.currentId = 1;
    this.aiPersonalityCurrentId = 1;
  }

  async init() {
    // In a real implementation, this would connect to a database
    console.log(`[Storage] DATABASE_URL=${process.env.DATABASE_URL ? '***PRESENTE***' : '***ASSENTE***'}`);
    
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
      try {
        console.log(`[Storage] Trying to connect to database: ${process.env.DATABASE_URL.substring(0, process.env.DATABASE_URL.indexOf('@'))}`);
        neonConfig.fetchConnectionCache = true;
        this.db = neon(process.env.DATABASE_URL);
        await this.db.execute('SELECT 1');
        console.log('[Storage] Connected to database');
      } catch (e) {
        console.error('[Storage] Failed to connect to database:', e);
        console.log('[Storage] Falling back to in-memory storage');
      }
    } else {
      console.log('[Storage] No DATABASE_URL provided, using in-memory storage');
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      displayName: insertUser.displayName || null,
      profileImage: insertUser.profileImage || null,
      role: insertUser.role || "free"
    };
    this.users.set(id, user);
    return user;
  }
  
  // AI Personality methods
  async getAIPersonalities(userId: number): Promise<AIPersonality[]> {
    return Array.from(this.aiPersonalities.values()).filter(
      (personality) => personality.userId === userId,
    );
  }
  
  async getAIPersonality(id: number): Promise<AIPersonality | undefined> {
    return this.aiPersonalities.get(id);
  }
  
  async createAIPersonality(personality: InsertAIPersonality): Promise<AIPersonality> {
    const id = this.aiPersonalityCurrentId++;
    const newPersonality: AIPersonality = {
      ...personality,
      id,
      bio: personality.bio || null,
      contentFocus: personality.contentFocus || null,
      contentFrequency: personality.contentFrequency || 3,
      hashtagUsage: personality.hashtagUsage || 3,
      emojiUsage: personality.emojiUsage || 2,
      isLearningEnabled: personality.isLearningEnabled ?? true,
      autoReplyEnabled: personality.autoReplyEnabled ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiPersonalities.set(id, newPersonality);
    return newPersonality;
  }
  
  async updateAIPersonality(id: number, updates: Partial<InsertAIPersonality>): Promise<AIPersonality | undefined> {
    const personality = this.aiPersonalities.get(id);
    
    if (!personality) {
      return undefined;
    }
    
    const updatedPersonality: AIPersonality = {
      ...personality,
      ...updates,
      updatedAt: new Date()
    };
    
    this.aiPersonalities.set(id, updatedPersonality);
    return updatedPersonality;
  }
  
  async deleteAIPersonality(id: number): Promise<boolean> {
    return this.aiPersonalities.delete(id);
  }

  async saveTwitterTokens(userId: number, tokens: TwitterTokens): Promise<void> {
    try {
      // In production, encrypt these tokens before storing
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error("User not found");
      }
      
      if (this.db) {
        await this.db.execute(
          "INSERT INTO twitter_tokens (user_id, access_token, refresh_token, expires_at) VALUES ($1, $2, $3, $4) " +
          "ON CONFLICT (user_id) DO UPDATE SET access_token = $2, refresh_token = $3, expires_at = $4",
          [
            userId, 
            tokens.accessToken, 
            tokens.refreshToken, 
            tokens.expiresAt.toISOString()
          ]
        );
      } else {
        // In-memory storage
        const existingTokenIndex = this.twitterTokens.findIndex(t => t.userId === userId);
        if (existingTokenIndex >= 0) {
          this.twitterTokens[existingTokenIndex] = { userId, ...tokens };
        } else {
          this.twitterTokens.push({ userId, ...tokens });
        }
      }
    } catch (error) {
      console.error("Error saving Twitter tokens:", error);
      throw error;
    }
  }

  async getTwitterTokens(userId: number): Promise<TwitterTokens | null> {
    try {
      if (this.db) {
        const result = await this.db.execute(
          "SELECT access_token, refresh_token, expires_at FROM twitter_tokens WHERE user_id = $1",
          [userId]
        );
        
        if (result.rows.length === 0) {
          return null;
        }
        
        const row = result.rows[0];
        return {
          accessToken: row.access_token,
          refreshToken: row.refresh_token,
          expiresAt: new Date(row.expires_at)
        };
      } else {
        // In-memory storage
        const tokenData = this.twitterTokens.find(t => t.userId === userId);
        if (!tokenData) return null;
        
        return {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiresAt: tokenData.expiresAt
        };
      }
    } catch (error) {
      console.error("Error getting Twitter tokens:", error);
      throw error;
    }
  }

  async updateUserTwitterInfo(userId: number, info: TwitterUserInfo): Promise<void> {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error("User not found");
      }
      
      if (this.db) {
        await this.db.execute(
          "UPDATE users SET twitter_id = $1, twitter_username = $2, twitter_display_name = $3, profile_image_url = $4 WHERE id = $5",
          [
            info.twitterId,
            info.twitterUsername,
            info.twitterDisplayName,
            info.profileImageUrl,
            userId
          ]
        );
      } else {
        // In-memory storage
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex >= 0) {
          this.users[userIndex] = {
            ...this.users[userIndex],
            twitterId: info.twitterId,
            twitterUsername: info.twitterUsername,
            twitterDisplayName: info.twitterDisplayName,
            profileImageUrl: info.profileImageUrl
          };
        }
      }
    } catch (error) {
      console.error("Error updating user Twitter info:", error);
      throw error;
    }
  }

  async getUserTwitterInfo(userId: number): Promise<TwitterUserInfo | null> {
    try {
      const user = await this.getUser(userId);
      if (!user || !user.twitterId) {
        return null;
      }
      
      return {
        twitterId: user.twitterId,
        twitterUsername: user.twitterUsername || "",
        twitterDisplayName: user.twitterName || "",
        profileImageUrl: user.profileImageUrl || ""
      };
    } catch (error) {
      console.error("Error getting user Twitter info:", error);
      throw error;
    }
  }

  // Test database connection method
  async testDatabaseConnection(): Promise<boolean> {
    try {
      if (this.db) {
        // Try to execute a simple query
        await this.db.execute('SELECT 1');
        console.log("Database connection test: SUCCESS");
        return true;
      } else {
        // We're using in-memory storage, so no real database
        console.log("Database connection test: USING IN-MEMORY STORAGE");
        return false;
      }
    } catch (error) {
      console.error("Database connection test: FAILED", error);
      return false;
    }
  }
}

export const storage = new MemStorage();
