import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import requestRoutes from './routes/request.routes.js';
import userRoutes from './routes/user.routes.js';
import vendorRoutes from './routes/vendor.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try multiple connection options - first the Atlas connection, then local
    const connectionString = process.env.CONNECTION_STRING || process.env.MONGODB_URI || 'mongodb://localhost:27017/store_management';
    
    await mongoose.connect(connectionString);
    console.log(`MongoDB connected successfully: ${mongoose.connection.host}`);
    
    // Start server after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Please ensure MongoDB is running or your connection string is correct');
    process.exit(1);
  }
};

// Start the application
connectDB();