import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Estendo l'interfaccia Request per includere user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Twitter API Configuration
const TWITTER_API_URL = "https://api.twitter.com/2";
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || "3LIwJjVpaRB9dt58B9HdTnozf";
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || "jT3luOuKyIHfRWR2RGaE1XRtRKfaO988Krn5GYVhOqELwoBDaZ";
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "AAAAAAAAAAAAAAAAAAAAAGmc0AEAAAAAulvnQSR6VO0mZ2CnWMoB%2FTE35gM%3DWcsctmkLcVjkG0CfPd6jDW8orbuLIWaV92PvWMRCATGa8l9PpE";
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || "NzBDTXBwYzJTU2Rpd29HMzZCZGY6MTpjaQ";
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || "ftX81zh-Xh5xORKGwlJ7jj57RkSJhYzTbaKQS6oMJEAbRjvJP0";
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI || "http://localhost:5000/api/auth/twitter/callback";

// Hugging Face API Configuration
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || "";

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = '7d';

// Default headers for Twitter API
const twitterHeaders = {
  Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  "Content-Type": "application/json",
};

// Default headers for Hugging Face API
const huggingFaceHeaders = {
  Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
  "Content-Type": "application/json",
};

// Store PKCE challenge and verifier in memory (in production, use a more persistent store)
const pkceStore = new Map();

export async function registerRoutes(app: Express): Promise<Server> {
  // OAUTH 2.0 ROUTES
  app.get("/api/auth/twitter", (req, res) => {
    try {
      console.log("=== AVVIO TWITTER AUTH ===");
      console.log("Query params:", JSON.stringify(req.query));
      
      // Generate PKCE code verifier and challenge
      const codeVerifier = crypto.randomBytes(32).toString('base64url');
      const codeChallenge = codeVerifier; // Per semplicità usando plain method
      
      const userId = req.query.userId as string;
      console.log("UserId:", userId);
      
      if (!userId) {
        console.error("❌ ERRORE: UserId mancante nella richiesta");
        return res.status(400).json({ message: "UserId è richiesto" });
      }
      
      // Store code verifier for later use
      pkceStore.set(userId, codeVerifier);
      console.log("✅ codeVerifier salvato per userId:", userId);
      
      // Debug delle variabili di configurazione
      console.log("=== CONFIG TWITTER ===");
      console.log("CLIENT_ID:", TWITTER_CLIENT_ID);
      console.log("REDIRECT_URI:", TWITTER_REDIRECT_URI);
      
      // Build authorization URL
      const scopes = "tweet.read tweet.write users.read follows.read follows.write offline.access";
      const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${userId}&code_challenge=${codeChallenge}&code_challenge_method=plain`;
      
      console.log("=== AUTH URL GENERATO ===");
      console.log(authUrl.substring(0, 100) + "...");
      
      res.redirect(authUrl);
    } catch (error) {
      console.error("❌ ERRORE Twitter auth:", error);
      res.status(500).json({ message: "Impossibile avviare l'autenticazione Twitter", error: String(error) });
    }
  });

  app.get("/api/auth/twitter/callback", async (req, res) => {
    try {
      console.log("=== TWITTER CALLBACK RICEVUTO ===");
      console.log("Query params:", JSON.stringify(req.query));
      
      const { code, state } = req.query;
      
      if (!code || !state) {
        console.error("❌ ERRORE: Parametri mancanti:", { code: !!code, state: !!state });
        return res.status(400).json({ message: "Authorization code o state mancanti" });
      }
      
      const userId = state as string;
      console.log("UserId da state:", userId);
      
      const codeVerifier = pkceStore.get(userId);
      console.log("CodeVerifier trovato:", !!codeVerifier);
      
      if (!codeVerifier) {
        console.error("❌ ERRORE: Nessun code verifier trovato per lo state:", state);
        return res.status(400).json({ message: "Parametro state non valido" });
      }
      
      // Exchange authorization code for access token
      console.log("=== SCAMBIO CODE PER TOKEN ===");
      console.log("Auth Code:", code ? `${(code as string).substring(0, 5)}...` : 'mancante');
      console.log("Code Verifier (troncato):", codeVerifier ? `${codeVerifier.substring(0, 5)}...` : 'mancante');
      
      const tokenPayload = new URLSearchParams({
        'code': code as string,
        'grant_type': 'authorization_code',
        'client_id': TWITTER_CLIENT_ID,
        'redirect_uri': TWITTER_REDIRECT_URI,
        'code_verifier': codeVerifier
      });
      
      console.log("Token payload costruito correttamente");
      console.log("URL Token:", 'https://api.twitter.com/2/oauth2/token');
      
      console.log("=== INVIO RICHIESTA TOKEN ===");
      const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', 
        tokenPayload.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log("✅ Token response ricevuta, status:", tokenResponse.status);
      console.log("Token data keys:", Object.keys(tokenResponse.data).join(", "));
      
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      // Clear the PKCE store
      pkceStore.delete(userId);
      console.log("✅ PKCE store liberato per userId:", userId);
      
      // Store tokens in the database
      await storage.saveTwitterTokens(parseInt(userId), {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000)
      });
      console.log("✅ Token Twitter salvati per userId:", userId);
      
      // Get user info
      console.log("=== RECUPERO INFO UTENTE TWITTER ===");
      const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        },
        params: {
          'user.fields': 'id,name,username,profile_image_url'
        }
      });
      
      console.log("✅ Info utente Twitter ricevute");
      const twitterUserInfo = userResponse.data.data;
      console.log("Info utente:", {
        id: twitterUserInfo.id ? twitterUserInfo.id.substring(0, 5) + "..." : 'mancante',
        username: twitterUserInfo.username || 'mancante'
      });
      
      // Save Twitter user info
      await storage.updateUserTwitterInfo(parseInt(userId), {
        twitterId: twitterUserInfo.id,
        twitterUsername: twitterUserInfo.username,
        twitterDisplayName: twitterUserInfo.name,
        profileImageUrl: twitterUserInfo.profile_image_url
      });
      console.log("Updated user Twitter info in database");
      
      // Redirect to the frontend
      console.log("=== REDIRECT A FRONTEND ===");
      console.log("Redirect URL:", '/settings?twitter_connected=true');
      res.redirect('/settings?twitter_connected=true');
    } catch (error) {
      console.error("❌ ERRORE Twitter callback:", error);
      
      // Log dettagliato dell'errore
      if (error.response) {
        console.error("Dettagli errore:", {
          status: error.response.status,
          data: JSON.stringify(error.response.data)
        });
      }
      
      res.redirect('/settings?twitter_error=' + encodeURIComponent("Si è verificato un errore durante l'autenticazione con Twitter. Riprova più tardi."));
    }
  });

  app.post("/api/auth/twitter/refresh", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
      }
      
      // Get stored refresh token
      const tokenData = await storage.getTwitterTokens(userId);
      
      if (!tokenData || !tokenData.refreshToken) {
        return res.status(404).json({ message: "No refresh token found" });
      }
      
      // Exchange refresh token for new access token
      const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', 
        new URLSearchParams({
          'refresh_token': tokenData.refreshToken,
          'grant_type': 'refresh_token',
          'client_id': TWITTER_CLIENT_ID
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      // Store new tokens
      await storage.saveTwitterTokens(userId, {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000)
      });
      
      res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });

  // USER ROUTES
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "An error occurred during login" });
    }
  });
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user with hashed password
      const newUser = await storage.createUser({ 
        username, 
        password: hashedPassword,
        email 
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: newUser.id,
          username: newUser.username,
          role: newUser.role
        }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        token
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "An error occurred during registration" });
    }
  });
  
  // Middleware to verify JWT
  const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  };

  // TWITTER API ROUTES
  app.get("/api/twitter/account", async (req, res) => {
    try {
      // In a real implementation, we would make an actual call to Twitter API
      // using the authenticated user's credentials
      // For now, return mock data
      return res.status(200).json({
        id: "12345",
        username: "cryptopunk",
        displayName: "CryptoPunk",
        profileImage: "",
        followers: 1254,
        following: 450,
        engagement: 32.7
      });
    } catch (error) {
      console.error("Error fetching Twitter account:", error);
      return res.status(500).json({ message: "Failed to fetch Twitter account data" });
    }
  });
  
  app.get("/api/twitter/stats", async (req, res) => {
    try {
      // In a real implementation, we would calculate these stats from real Twitter data
      return res.status(200).json({
        followers: 1254,
        engagement: 32.7,
        postsGenerated: 56,
        web3Earnings: 0.42,
        followersChange: 12.5,
        engagementChange: 8.3,
        postsGeneratedChange: 27,
        web3EarningsChange: 5.2
      });
    } catch (error) {
      console.error("Error fetching Twitter stats:", error);
      return res.status(500).json({ message: "Failed to fetch Twitter stats" });
    }
  });
  
  app.post("/api/twitter/tweet", async (req, res) => {
    try {
      const { text, mediaIds, replyToId } = req.body;
      
      // In a real implementation, we would post to Twitter API
      // For now, return a simulated response
      return res.status(201).json({
        id: `tweet-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        username: "cryptopunk",
        likes: 0,
        retweets: 0,
        replies: 0
      });
    } catch (error) {
      console.error("Error posting tweet:", error);
      return res.status(500).json({ message: "Failed to post tweet" });
    }
  });
  
  app.post("/api/twitter/schedule", async (req, res) => {
    try {
      const { text, scheduledTime } = req.body;
      
      // In a real implementation, we would store the scheduled tweet in a database
      // and use a background job to post it at the scheduled time
      return res.status(201).json({
        id: `scheduled-${Date.now()}`,
        text,
        scheduledTime,
        status: "scheduled"
      });
    } catch (error) {
      console.error("Error scheduling tweet:", error);
      return res.status(500).json({ message: "Failed to schedule tweet" });
    }
  });
  
  app.get("/api/twitter/trends", async (req, res) => {
    try {
      // In a real implementation, we would fetch trends from Twitter API
      // For now, return simulated trending topics
      return res.status(200).json([
        { id: 1, name: "Solana NFT Launch", posts: "65.2K", color: "primary" },
        { id: 2, name: "Web3 Gaming", posts: "42.8K", color: "secondary" },
        { id: 3, name: "DeFi Updates", posts: "31.5K", color: "accent" },
        { id: 4, name: "Crypto Market Rally", posts: "28.9K", color: "primary" },
        { id: 5, name: "AI x Blockchain", posts: "22.3K", color: "secondary" },
      ]);
    } catch (error) {
      console.error("Error fetching Twitter trends:", error);
      return res.status(500).json({ message: "Failed to fetch Twitter trends" });
    }
  });
  
  app.post("/api/twitter/engage", async (req, res) => {
    try {
      const { tweetId, action, content } = req.body;
      
      // In a real implementation, we would make the appropriate Twitter API call
      // based on the action (like, retweet, reply)
      return res.status(200).json({
        success: true,
        action,
        tweetId
      });
    } catch (error) {
      console.error(`Error performing ${req.body.action} action:`, error);
      return res.status(500).json({ message: `Failed to perform ${req.body.action}` });
    }
  });
  
  // AI CONTENT GENERATION ROUTES
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { model, prompt, maxLength = 280, temperature = 0.7, numResults = 1, stopSequences = [] } = req.body;
      
      // Utilizziamo l'API di Hugging Face per generare il contenuto
      if (HUGGING_FACE_API_KEY) {
        try {
          const apiUrl = `${HUGGING_FACE_API_URL}/${model}`;
          
          const response = await axios.post(apiUrl, {
            inputs: prompt,
            parameters: {
              max_new_tokens: maxLength,
              temperature: temperature,
              num_return_sequences: numResults,
              stop_sequences: stopSequences,
              do_sample: true
            }
          }, {
            headers: huggingFaceHeaders
          });
          
          let generatedText = "";
          
          if (Array.isArray(response.data)) {
            // In some models, the response is an array of objects with a "generated_text" field
            generatedText = response.data[0].generated_text;
          } else if (response.data.generated_text) {
            // For some models, the response is a single object with a "generated_text" field
            generatedText = response.data.generated_text;
          } else {
            // Fallback
            generatedText = JSON.stringify(response.data);
          }
          
          // Clean up the generated text
          generatedText = generatedText.replace(prompt, "").trim();
          
          return res.status(200).json({
            text: generatedText,
            model,
            finishReason: "success"
          });
        } catch (apiError) {
          console.error("Hugging Face API error:", apiError);
          
          // Fallback to sample generation if API fails
          let generatedText;
          if (model.includes("tweet")) {
            generatedText = generateSampleTweet(prompt);
          } else {
            generatedText = generateSampleText(prompt, maxLength);
          }
          
          return res.status(200).json({
            text: generatedText,
            model,
            finishReason: "fallback"
          });
        }
      } else {
        // Senza API key, usiamo il generatore di esempio
        let generatedText;
        if (model.includes("tweet")) {
          generatedText = generateSampleTweet(prompt);
        } else {
          generatedText = generateSampleText(prompt, maxLength);
        }
        
        return res.status(200).json({
          text: generatedText,
          model,
          finishReason: "sample"
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      return res.status(500).json({ message: "Failed to generate content" });
    }
  });
  
  // AI PERSONALITY ROUTES
  app.get("/api/ai-personality", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid userId is required" });
      }
      
      const personalities = await storage.getAIPersonalities(userId);
      return res.status(200).json(personalities);
    } catch (error) {
      console.error("Error fetching AI personalities:", error);
      return res.status(500).json({ message: "Failed to fetch AI personalities" });
    }
  });
  
  app.get("/api/ai-personality/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Valid personality ID is required" });
      }
      
      const personality = await storage.getAIPersonality(id);
      
      if (!personality) {
        return res.status(404).json({ message: "AI personality not found" });
      }
      
      return res.status(200).json(personality);
    } catch (error) {
      console.error("Error fetching AI personality:", error);
      return res.status(500).json({ message: "Failed to fetch AI personality" });
    }
  });
  
  app.post("/api/ai-personality", async (req, res) => {
    try {
      const {
        userId,
        name,
        bio,
        personalityType,
        toneSetting,
        responseType,
        contentFocus,
        contentFrequency,
        hashtagUsage,
        emojiUsage,
        isLearningEnabled,
        autoReplyEnabled
      } = req.body;
      
      // Basic validation
      if (!userId || !name || !personalityType || !toneSetting || !responseType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const newPersonality = await storage.createAIPersonality({
        userId,
        name,
        bio,
        personalityType,
        toneSetting,
        responseType,
        contentFocus: contentFocus || [],
        contentFrequency: contentFrequency || 3,
        hashtagUsage: hashtagUsage || 3,
        emojiUsage: emojiUsage || 2,
        isLearningEnabled: isLearningEnabled ?? true,
        autoReplyEnabled: autoReplyEnabled ?? true
      });
      
      return res.status(201).json(newPersonality);
    } catch (error) {
      console.error("Error creating AI personality:", error);
      return res.status(500).json({ message: "Failed to create AI personality" });
    }
  });
  
  app.put("/api/ai-personality/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Valid personality ID is required" });
      }
      
      const updates = req.body;
      const updatedPersonality = await storage.updateAIPersonality(id, updates);
      
      if (!updatedPersonality) {
        return res.status(404).json({ message: "AI personality not found" });
      }
      
      return res.status(200).json(updatedPersonality);
    } catch (error) {
      console.error("Error updating AI personality:", error);
      return res.status(500).json({ message: "Failed to update AI personality" });
    }
  });
  
  app.delete("/api/ai-personality/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Valid personality ID is required" });
      }
      
      const success = await storage.deleteAIPersonality(id);
      
      if (!success) {
        return res.status(404).json({ message: "AI personality not found" });
      }
      
      return res.status(200).json({ message: "AI personality deleted successfully" });
    } catch (error) {
      console.error("Error deleting AI personality:", error);
      return res.status(500).json({ message: "Failed to delete AI personality" });
    }
  });
  
  app.post("/api/ai-personality/:id/generate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Valid personality ID is required" });
      }
      
      const personality = await storage.getAIPersonality(id);
      
      if (!personality) {
        return res.status(404).json({ message: "AI personality not found" });
      }
      
      // In a real implementation, we would use the personality settings to generate content
      // For now, return a sample post based on the personality type
      let generatedContent = "";
      
      switch(personality.personalityType) {
        case "educator":
          generatedContent = "Just published a new article on how zk-SNARKs are revolutionizing privacy in blockchain. Zero-knowledge proofs allow verification without revealing sensitive data - essential for DeFi future. #Blockchain #Privacy #Web3";
          break;
        case "visionary":
          generatedContent = "The metaverse is not just a virtual world—it is the next evolution of the internet. We are moving from 2D browsing to 3D immersive experiences where digital ownership via NFTs will fundamentally reshape how we interact! #Metaverse #Web3 #Future";
          break;
        case "analyst":
          generatedContent = "BTC forming a classic cup and handle pattern on the 4H chart. Key resistance at $63K needs to break with volume. ETH showing stronger relative strength. Watch the BTC dominance ratio for altcoin opportunities. #TechnicalAnalysis";
          break;
        case "influencer":
          generatedContent = "OMG this new NFT collection is INSANE!!! The art is next level and the roadmap looks super promising! Definitely worth checking out before mint sells out! Who is getting in with me?? #NFTs #MustBuy #Web3 #ToTheMoon";
          break;
        case "humorist":
          generatedContent = "Bought the dip but it kept dipping. Now I am hodling so hard my fingers hurt. At least my ramen diet is helping me stay in shape! #CryptoProblems #HodlLife #BuyHighSellLow";
          break;
        default:
          generatedContent = "This is a custom AI personality generated post. It would normally reflect your settings for tone, focus areas, and style preferences.";
      }
      
      return res.status(200).json({
        personalityId: id,
        personalityName: personality.name,
        content: generatedContent,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error generating content with AI personality:", error);
      return res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // WEB3 INTEGRATION ROUTES
  app.get("/api/web3/balance", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }
      
      // In a real implementation, we would query a blockchain API to get the balance
      // For now, return a simulated balance
      return res.status(200).json({
        address,
        balance: 0.42,
        currency: "SOL"
      });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return res.status(500).json({ message: "Failed to fetch wallet balance" });
    }
  });
  
  app.post("/api/web3/create-nft-collection", async (req, res) => {
    try {
      const { name, description } = req.body;
      
      // In a real implementation, we would interact with a blockchain to create an NFT collection
      return res.status(201).json({
        id: `collection-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error creating NFT collection:", error);
      return res.status(500).json({ message: "Failed to create NFT collection" });
    }
  });
  
  app.post("/api/web3/token-gate", async (req, res) => {
    try {
      const { contentId, requiredToken } = req.body;
      
      // In a real implementation, we would set up token-gating for specific content
      return res.status(201).json({
        contentId,
        requiredToken,
        status: "active",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error setting up token-gated content:", error);
      return res.status(500).json({ message: "Failed to set up token-gated content" });
    }
  });

  // Aggiungiamo l'endpoint per la conversione dei contenuti
  app.post("/api/repurpose-content", async (req, res) => {
    try {
      const { sourceType, sourceContent, outputFormat = 'thread' } = req.body;
      
      if (!sourceType || !sourceContent) {
        return res.status(400).json({ message: "Source type and content are required" });
      }
      
      let content = sourceContent;
      
      // In a production app, we would:
      // 1. For URLs: scrape the web page to extract the content
      // 2. For files: parse the file based on its format (PDF, DOCX, etc.)
      
      // Then, we would call an AI model to generate tweets from the content
      // For now, we'll return mock data
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let tweets = [];
      
      if (outputFormat === 'thread') {
        tweets = [
          "🔥 Just published new content on how AI is transforming social media marketing! #AIMarketing",
          "AI-based tools can now analyze your audience's behavior and predict what content will resonate most with them. This means higher engagement rates and better ROI.",
          "Our analysis shows that accounts using AI for content creation see a 42% increase in engagement compared to those that don't! #SocialMediaTips",
          "Want to learn more? Check out our latest guide on implementing AI in your social media strategy: [YOUR LINK] #TwitterBooster"
        ];
      } else {
        tweets = [
          "🚀 Just launched our comprehensive guide on leveraging AI for social media success! See how companies are achieving 40%+ higher engagement rates: [YOUR LINK] #AIMarketing #TwitterBooster"
        ];
      }
      
      return res.status(200).json({
        success: true,
        tweets
      });
    } catch (error) {
      console.error("Error repurposing content:", error);
      return res.status(500).json({ message: "Failed to repurpose content" });
    }
  });

  // Add a new endpoint to test database connection
  app.get("/api/db-test", async (req, res) => {
    try {
      // Attempt to connect to the database and run a test query
      console.log("Testing database connection...");
      const isConnected = await storage.testDatabaseConnection();
      
      if (isConnected) {
        console.log("✅ Database connection successful!");
        return res.status(200).json({ 
          success: true, 
          message: "Database connection successful!" 
        });
      } else {
        console.log("❌ Database connection failed!");
        return res.status(500).json({ 
          success: false, 
          message: "Database connection failed" 
        });
      }
    } catch (error: any) {
      console.error("Error testing database connection:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error testing database connection", 
        error: error.message 
      });
    }
  });

  // User profile endpoint (protected)
  app.get("/api/users/:id", authenticateJWT, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Verifica che l'utente richieda i propri dati o sia un admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: You can only access your own profile" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Non inviare la password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ message: "An error occurred while fetching user profile" });
    }
  });

  // Funzione di debug per verificare la connessione Twitter
  app.get("/api/twitter/debug", (req, res) => {
    res.json({
      config: {
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: TWITTER_REDIRECT_URI
      },
      status: "Twitter API debug endpoint attivo",
      env: process.env.NODE_ENV || 'development'
    });
  });

  // Miglioro l'endpoint di validazione di Hugging Face con debug più approfondito
  app.post("/api/huggingface/validate", async (req, res) => {
    try {
      console.log("=== VALIDAZIONE API KEY HUGGING FACE ===");
      const { apiKey } = req.body;
      
      console.log("API Key ricevuta:", apiKey ? "***" + apiKey.substring(apiKey.length - 5) : "mancante");
      
      if (!apiKey) {
        console.log("❌ API key mancante nella richiesta");
        return res.status(400).json({ 
          success: false, 
          message: "API key mancante" 
        });
      }
      
      console.log("=== INVIO RICHIESTA TEST A HUGGING FACE ===");
      console.log("URL:", 'https://api-inference.huggingface.co/models');
      console.log("Headers:", {
        'Authorization': 'Bearer ***'
      });
      
      // Prova a fare una richiesta di test all'API di Hugging Face
      const response = await axios.get('https://api-inference.huggingface.co/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 15000 // Aggiungo un timeout più lungo per evitare errori di rete
      });
      
      console.log("=== RISPOSTA HUGGING FACE ===");
      console.log("Status:", response.status);
      console.log("Response data type:", typeof response.data);
      console.log("Response data length:", Array.isArray(response.data) ? response.data.length : 'non disponibile');
      
      // Se la richiesta ha successo, la API key è valida
      if (response.status === 200) {
        console.log("✅ API key validata con successo");
        return res.json({ 
          success: true, 
          message: "API key valida" 
        });
      } else {
        console.log("❌ API key non validata - risposta non 200");
        return res.json({ 
          success: false, 
          message: "API key non valida" 
        });
      }
    } catch (error) {
      console.error("❌ ERRORE durante la validazione dell'API key di Hugging Face:", error);
      
      let errorMessage = "Errore durante la validazione dell'API key";
      let errorStatus = 500;
      
      // Log più dettagliato degli errori Axios
      if (axios.isAxiosError(error)) {
        console.error({
          isAxiosError: true,
          status: error.response?.status,
          statusText: error.response?.statusText,
          errorMessage: error.message,
          errorData: error.response?.data ? JSON.stringify(error.response.data).substring(0, 200) : 'nessun dato'
        });
        
        // Gestisci specificamente gli errori di autorizzazione
        if (error.response?.status === 401) {
          errorMessage = "API key non valida o non autorizzata";
          errorStatus = 401;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = "Timeout durante la connessione a Hugging Face";
        } else if (error.code === 'ENOTFOUND') {
          errorMessage = "Impossibile raggiungere il server Hugging Face. Controlla la tua connessione.";
        }
      }
      
      return res.status(errorStatus).json({ 
        success: false, 
        message: errorMessage,
        error: axios.isAxiosError(error) ? error.message : 'Errore sconosciuto'
      });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}

// Helper functions for content generation
function generateSampleTweet(prompt: string): string {
  const cryptoTopics = [
    "Just discovered how #Solana NFTs are changing the game for creators. 10x faster and 100x cheaper than Ethereum. The future is multi-chain and it's happening now. 🚀 #Web3 #Crypto",
    "Web3 gaming is about to explode. Play-to-earn models, true ownership of in-game assets, and interoperability between games. This is a massive paradigm shift in how we think about gaming. #GameFi #Blockchain",
    "DeFi protocols are seeing massive adoption despite the market conditions. Total value locked is growing week over week. This is what building in a bear market looks like. #DeFi #Crypto #Build",
    "The intersection of AI and blockchain is where the next trillion-dollar companies will be built. Decentralized AI networks will change how we think about data ownership and machine learning. #AI #Blockchain",
    "Zero-knowledge proofs are the most undervalued technology in crypto right now. They'll enable privacy while maintaining transparency, scalability without sacrificing security. Sleeping giant. #ZK #Privacy #Web3"
  ];
  
  // Choose a random tweet from the list
  return cryptoTopics[Math.floor(Math.random() * cryptoTopics.length)];
}

function generateSampleText(prompt: string, maxLength: number = 500): string {
  const baseText = "Cryptocurrency and blockchain technology are revolutionizing the financial landscape. Web3 represents the next evolution of the internet, where users have true ownership of their digital assets and data. NFTs, or non-fungible tokens, have opened new possibilities for creators to monetize their work directly without intermediaries. Decentralized finance (DeFi) protocols are reimagining traditional financial services like lending, borrowing, and trading without the need for centralized authorities. Smart contracts enable trustless agreements that execute automatically when conditions are met. The future of finance is being built on open, permissionless networks that anyone can access regardless of geography or socioeconomic status. As this technology matures, we're seeing increased institutional adoption alongside grassroots community growth.";
  
  // Return a substring of the base text based on the maxLength
  return baseText.substring(0, Math.min(maxLength, baseText.length));
}

