import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
  role: text("role").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  profileImage: true,
  role: true,
});

// Twitter accounts linked to users
export const twitterAccounts = pgTable("twitter_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  twitterId: text("twitter_id").notNull().unique(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  profileImage: text("profile_image"),
  accessToken: text("access_token"),
  accessTokenSecret: text("access_token_secret"),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTwitterAccountSchema = createInsertSchema(twitterAccounts).pick({
  userId: true,
  twitterId: true,
  username: true,
  displayName: true,
  profileImage: true,
  accessToken: true,
  accessTokenSecret: true,
  followers: true,
  following: true,
});

// Generated content
export const generatedContents = pgTable("generated_contents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  contentType: text("content_type").notNull(), // tweet, thread, reply
  topic: text("topic"),
  styles: text("styles").array(),
  createdAt: timestamp("created_at").defaultNow(),
  isPosted: boolean("is_posted").default(false),
  postedAt: timestamp("posted_at"),
  tweetId: text("tweet_id"),
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContents).pick({
  userId: true,
  content: true,
  contentType: true,
  topic: true,
  styles: true,
  isPosted: true,
  postedAt: true,
  tweetId: true,
});

// Scheduled posts
export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  status: text("status").default("scheduled"), // scheduled, posted, failed
  type: text("type").notNull(), // tweet, thread, reply
  colorAccent: text("color_accent").notNull(), // primary, secondary, accent
  createdAt: timestamp("created_at").defaultNow(),
  postedAt: timestamp("posted_at"),
  tweetId: text("tweet_id"),
});

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).pick({
  userId: true,
  content: true,
  scheduledTime: true,
  status: true,
  type: true,
  colorAccent: true,
  postedAt: true,
  tweetId: true,
});

// Automation settings
export const automationSettings = pgTable("automation_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  autoReply: boolean("auto_reply").default(true),
  autoLike: boolean("auto_like").default(true),
  autoRepost: boolean("auto_repost").default(false),
  dmAutomation: boolean("dm_automation").default(false),
  tweetLimit: integer("tweet_limit").default(25),
  likeLimit: integer("like_limit").default(50),
  followLimit: integer("follow_limit").default(10),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAutomationSettingsSchema = createInsertSchema(automationSettings).pick({
  userId: true,
  autoReply: true,
  autoLike: true,
  autoRepost: true,
  dmAutomation: true,
  tweetLimit: true,
  likeLimit: true,
  followLimit: true,
});

// Web3 wallets linked to users
export const web3Wallets = pgTable("web3_wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  address: text("address").notNull(),
  walletType: text("wallet_type").default("phantom"),
  balance: text("balance").default("0"),
  currency: text("currency").default("SOL"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeb3WalletSchema = createInsertSchema(web3Wallets).pick({
  userId: true,
  address: true,
  walletType: true,
  balance: true,
  currency: true,
});

// NFT collections created by users
export const nftCollections = pgTable("nft_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  items: integer("items").default(0),
  contractAddress: text("contract_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNftCollectionSchema = createInsertSchema(nftCollections).pick({
  userId: true,
  name: true,
  description: true,
  items: true,
  contractAddress: true,
});

// Analytics data for user accounts
export const accountStats = pgTable("account_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  followers: integer("followers").default(0),
  engagement: integer("engagement").default(0),
  postsGenerated: integer("posts_generated").default(0),
  web3Earnings: text("web3_earnings").default("0"),
  data: jsonb("data"),
});

export const insertAccountStatsSchema = createInsertSchema(accountStats).pick({
  userId: true,
  date: true,
  followers: true,
  engagement: true,
  postsGenerated: true,
  web3Earnings: true,
  data: true,
});

// Export types for use in the app
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TwitterAccount = typeof twitterAccounts.$inferSelect;
export type InsertTwitterAccount = z.infer<typeof insertTwitterAccountSchema>;

export type GeneratedContent = typeof generatedContents.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;

export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;

export type AutomationSetting = typeof automationSettings.$inferSelect;
export type InsertAutomationSetting = z.infer<typeof insertAutomationSettingsSchema>;

export type Web3Wallet = typeof web3Wallets.$inferSelect;
export type InsertWeb3Wallet = z.infer<typeof insertWeb3WalletSchema>;

export type NftCollection = typeof nftCollections.$inferSelect;
export type InsertNftCollection = z.infer<typeof insertNftCollectionSchema>;

export type AccountStat = typeof accountStats.$inferSelect;
export type InsertAccountStat = z.infer<typeof insertAccountStatsSchema>;

// AI Personalities
export const aiPersonalities = pgTable("ai_personalities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  bio: text("bio"),
  personalityType: text("personality_type").notNull(),  // educator, visionary, analyst, influencer, humorist, custom
  toneSetting: text("tone_setting").notNull(),  // professional, enthusiastic, casual, authoritative, controversial, humorous
  responseType: text("response_type").notNull(), // quick, thoughtful, provocative, questioning
  contentFocus: text("content_focus").array(),  // crypto, web3, nft, defi, blockchain, metaverse, trading, mining
  contentFrequency: integer("content_frequency").default(3),
  hashtagUsage: integer("hashtag_usage").default(3),
  emojiUsage: integer("emoji_usage").default(2),
  isLearningEnabled: boolean("is_learning_enabled").default(true),
  autoReplyEnabled: boolean("auto_reply_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAIPersonalitySchema = createInsertSchema(aiPersonalities).pick({
  userId: true,
  name: true,
  bio: true,
  personalityType: true,
  toneSetting: true,
  responseType: true,
  contentFocus: true,
  contentFrequency: true,
  hashtagUsage: true,
  emojiUsage: true,
  isLearningEnabled: true,
  autoReplyEnabled: true,
});

export type AIPersonality = typeof aiPersonalities.$inferSelect;
export type InsertAIPersonality = z.infer<typeof insertAIPersonalitySchema>;
