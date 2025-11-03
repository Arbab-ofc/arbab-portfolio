import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load env vars
dotenv.config();

// Import configurations
import connectDB from './config/database.js';

// Import routes
import projectRoutes from './routes/projectRoutes.js';
import {
  authRouter,
  blogRouter,
  skillRouter,
  experienceRouter,
  contactRouter,
  newsletterRouter,
  guestbookRouter,
  testimonialRouter,
  analyticsRouter,
} from './routes/allRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Connect to database
connectDB();

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Handle chat messages
  socket.on('chat:message', (data) => {
    console.log('Chat message received:', data);
    // Broadcast to admin or handle as needed
    io.emit('chat:message', {
      ...data,
      timestamp: new Date(),
    });
  });

  // Handle typing indicator
  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(mongoSanitize());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRouter);
app.use('/api/skills', skillRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/guestbook', guestbookRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/analytics', analyticsRouter);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Arbab Arshad Portfolio API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      blogs: '/api/blogs',
      skills: '/api/skills',
      experience: '/api/experience',
      contact: '/api/contact',
      newsletter: '/api/newsletter',
      guestbook: '/api/guestbook',
      testimonials: '/api/testimonials',
      analytics: '/api/analytics',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Server running in ${process.env.NODE_ENV} mode                  ║
║   📡 Port: ${PORT}                                           ║
║   🌐 URL: http://localhost:${PORT}                          ║
║   💾 Database: Connected                                  ║
║   ⚡ Socket.io: Active                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  httpServer.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
