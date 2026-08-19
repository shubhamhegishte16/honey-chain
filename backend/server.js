import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import traceabilityRoutes from './routes/traceabilityRoutes.js';
import qualityRoutes from './routes/qualityRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import processingRoutes from './routes/processingRoutes.js';
import marketPriceRoutes from './routes/marketPriceRoutes.js';
import producerRoutes from './routes/producerRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', (req, res) => {
  const isDbReady = mongoose.connection.readyState === 1;
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'WoolConnect Backend REST API',
    version: '1.0.0',
    db: isDbReady ? 'connected' : 'memory-mode'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/traceability', traceabilityRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/processing', processingRoutes);
app.use('/api/market-prices', marketPriceRoutes);
app.use('/api/producers', producerRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    const isConnected = await connectDB();
    if (isConnected) {
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🐑 WoolConnect REST API Server running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error('Server startup notice:', error.message);
    // Still start Express server so API health and endpoints are served
    app.listen(PORT, () => {
      console.log(`🐑 WoolConnect Server running on port ${PORT}`);
    });
  }
}

startServer();

export default app;
