import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { authenticate } from '../middleware/auth';
import passport from '../config/passport';

const router = express.Router();

// JWT Secret Key - in a real app, this would be in environment variables
const JWT_SECRET = 'your-jwt-secret-key';

// Twitter API configuration
const twitterConfig = {
  baseUrl: 'https://api.twitter.com/2'
};

// Hugging Face API configuration
const huggingFaceConfig = {
  baseUrl: 'https://api-inference.huggingface.co/models'
};

// Authentication routes
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In a real app, validate credentials against database and use proper password hashing
    if (username === 'user' && password === 'password') {
      // Generate JWT token
      const token = jwt.sign(
        { id: 1, username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Return token to client
      return res.json({
        success: true,
        token,
        user: {
          id: 1,
          username,
          role: 'user'
        }
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Validates Twitter API credentials
router.post('/twitter/validate', async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;

    if (!apiKey || !apiSecret) {
      return res.status(400).json({
        success: false,
        message: 'API key and secret are required',
        valid: false
      });
    }

    try {
      // Tentiamo di ottenere un bearer token usando le chiavi fornite
      const response = await axios.post('https://api.twitter.com/oauth2/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
          }
        }
      );

      if (response.data && response.data.access_token) {
        return res.json({
          success: true,
          message: 'API keys validated successfully',
          valid: true
        });
      } else {
        return res.json({
          success: false,
          message: 'Invalid response from Twitter API',
          valid: false
        });
      }
    } catch (error) {
      console.error('Twitter API validation error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          return res.status(401).json({
            success: false,
            message: 'Twitter authentication failed: Invalid credentials',
            valid: false
          });
        }
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to validate Twitter API keys',
        valid: false
      });
    }
  } catch (error) {
    console.error('Twitter validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      valid: false
    });
  }
});

// Protected routes
router.get('/user', authenticate, async (req, res) => {
  try {
    // In a real app, fetch user from database
    return res.json({
      success: true,
      user: {
        id: 1,
        username: 'user',
        role: 'user'
      }
    });
  } catch (error) {
    console.error('User fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Twitter API routes
router.post('/twitter/tweet', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    
    // In a real app, use Twitter API to post tweet
    
    return res.json({
      success: true,
      message: 'Tweet posted successfully',
      tweet: {
        id: Math.floor(Math.random() * 1000000),
        text,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Tweet post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to post tweet'
    });
  }
});

// Hugging Face API routes
router.post('/huggingface/generate', authenticate, async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    // In a real app, use Hugging Face API to generate content
    
    return res.json({
      success: true,
      generatedText: `This is simulated AI-generated content based on prompt: "${prompt}"`
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate content'
    });
  }
});

// Twitter OAuth callback
router.get('/auth/twitter/callback', async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    
    if (!oauth_token || !oauth_verifier) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token mancanti nella callback' 
      });
    }
    
    // In un'app reale, scambieresti il token temporaneo con un token di accesso permanente
    // e salveresti le credenziali dell'utente nel database
    
    // Per ora simuliamo un successo
    console.log("Twitter OAuth callback ricevuta:", oauth_token, oauth_verifier);
    
    // Reindirizza l'utente alla dashboard dopo l'autenticazione
    res.redirect('/dashboard?auth=success');
  } catch (error) {
    console.error('Errore nella callback Twitter:', error);
    res.redirect('/settings?auth=error');
  }
});

// Inizia il processo di autenticazione Twitter OAuth
router.post('/twitter/auth/start', async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;
    
    if (!apiKey || !apiSecret) {
      return res.status(400).json({
        success: false,
        message: 'API key e secret sono richiesti'
      });
    }
    
    // In un'app reale, questo genererebbe una richiesta di token a Twitter
    // e restituirebbe un URL per il processo di autorizzazione
    
    // Per ora simuliamo un URL di autorizzazione
    const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=simulated_token_${Date.now()}`;
    
    return res.json({
      success: true,
      authUrl,
      message: 'Processo di autenticazione Twitter avviato'
    });
  } catch (error) {
    console.error('Errore nell\'avvio dell\'autenticazione Twitter:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore nell\'avvio del processo di autenticazione Twitter'
    });
  }
});

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { session: false }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login?error=google-auth-failed' 
  }),
  (req, res) => {
    // A questo punto req.user contiene l'utente e il token
    const { user, token } = req.user as any;

    // In un'applicazione reale, potresti voler memorizzare il token in un cookie HTTP-only
    // Qui stiamo rendirizzando alla dashboard con un parametro di query per semplicità
    res.redirect(`/dashboard?auth=success&provider=google&token=${token}`);
  }
);

// GitHub OAuth routes
router.get('/auth/github', passport.authenticate('github', { session: false }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { 
    session: false,
    failureRedirect: '/login?error=github-auth-failed' 
  }),
  (req, res) => {
    // A questo punto req.user contiene l'utente e il token
    const { user, token } = req.user as any;

    // In un'applicazione reale, potresti voler memorizzare il token in un cookie HTTP-only
    // Qui stiamo rendirizzando alla dashboard con un parametro di query per semplicità
    res.redirect(`/dashboard?auth=success&provider=github&token=${token}`);
  }
);

export default router; 