import 'dotenv/config';
import express from "express";
import session from "express-session";
import { storage } from "./storage";
import { registerRoutes } from "./routes";
import { registerViteDevServer } from "./vite";
import { createServer as createHttpServer } from "http";
import bcrypt from "bcrypt";
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import apiRoutes from './routes/api';
import passport from './config/passport';

const app = express();
const PORT = process.env.PORT || 5000;

const SESSION_SECRET = process.env.SESSION_SECRET || "your-session-secret";
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5000';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes
app.use('/api', apiRoutes);

// Register Vite dev server in development
if (process.env.NODE_ENV === 'development') {
  registerViteDevServer(app);
}

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const adminUser = await storage.getUserByUsername('admin');
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await storage.createUser({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin'
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Create HTTP server
const server = createHttpServer(app);

// Register routes and start server
registerRoutes(app).then(() => {
  createDefaultAdmin().then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 CORS enabled for origin: ${CORS_ORIGIN}`);
      console.log(`🔒 Session secret configured`);
    });
  });
});
