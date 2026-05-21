import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRouter from './routes/analytics.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all requests to ensure frontend can access backend seamlessly
app.use(cors());

// Parse incoming JSON payloads — 10mb limit to handle base64 scorecard images
app.use(express.json({ limit: '10mb' }));

// Register API routes
app.use('/api', analyticsRouter);

// Health check and root verification endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CricMind AI Tactical Control Room Backend is up and running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Boot up the server
app.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`🏏 CricMind AI Server running on: http://localhost:${PORT}`);
  console.log(`🚀 Mode: ES Modules`);
  console.log(`🎯 Health check: http://localhost:${PORT}/`);
  console.log(`⚡ Strategy endpoint: http://localhost:${PORT}/api/live-analysis`);
  console.log(`=============================================================`);
});
