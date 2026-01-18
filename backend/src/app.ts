import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import sessionRoutes from './routes/sessionRoutes';
import resumeRoutes from './routes/resumeRoutes';
import learningRoutes from './routes/learningRoutes';
import outreachRoutes from './routes/outreachRoutes';

dotenv.config();

const app = express();

// Middleware
// CORS configuration - allow frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Serve document files
app.use('/uploads/documents', express.static(path.join(__dirname, '../uploads/documents')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/outreach', outreachRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running', status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
