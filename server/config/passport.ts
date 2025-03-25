import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import crypto from 'crypto';

// JWT Secret Key - in a real app, this would be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Configurazione per l'ambiente di sviluppo - in produzione usa variabili d'ambiente
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your-github-client-id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret';
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:5000';

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUserById(parseInt(id));
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Configura la strategia Google OAuth
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${CALLBACK_URL}/api/auth/google/callback`,
    scope: ['profile', 'email']
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Verifica se l'utente esiste già
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value);
      
      if (!user) {
        // Crea un nuovo utente
        user = await storage.createUser({
          username: profile.displayName || profile.emails?.[0]?.value.split('@')[0],
          email: profile.emails?.[0]?.value,
          password: crypto.randomBytes(32).toString('hex'), // Password casuale sicura
          role: 'user',
          provider: 'google',
          providerId: profile.id,
          profileImage: profile.photos?.[0]?.value
        });
      }
      
      // Genera un token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return done(null, { user, token });
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Configura la strategia GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${CALLBACK_URL}/api/auth/github/callback`,
    scope: ['user:email']
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Verifica se l'utente esiste già
      let user = await storage.getUserByEmail(profile.emails?.[0]?.value);
      
      if (!user) {
        // Crea un nuovo utente
        user = await storage.createUser({
          username: profile.username || profile.displayName,
          email: profile.emails?.[0]?.value,
          password: crypto.randomBytes(32).toString('hex'), // Password casuale sicura
          role: 'user',
          provider: 'github',
          providerId: profile.id,
          profileImage: profile.photos?.[0]?.value
        });
      }
      
      // Genera un token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return done(null, { user, token });
    } catch (error) {
      return done(error as Error);
    }
  }
));

export default passport; 