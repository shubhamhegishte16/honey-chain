import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

// Ensure Node.js DNS resolver can properly resolve MongoDB Atlas SRV records on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('DNS server configuration note:', e.message);
}

let mongodInstance = null;
let isInMemoryFallback = false;

export function getIsInMemoryFallback() {
  return isInMemoryFallback;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // 1. Try real MongoDB Atlas URI first
  if (uri) {
    try {
      console.log('📡 Connecting to MongoDB Atlas Database...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 12000,
      });
      console.log('✅ Successfully connected to MongoDB Atlas Database (Live Cloud DB)');
      isInMemoryFallback = false;
      return true;
    } catch (err) {
      console.warn(`⚠️ MongoDB Atlas connection error: ${err.message}. Trying MongoMemoryServer...`);
    }
  }

  // 2. Try MongoMemoryServer with extended timeout
  try {
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'woolconnect',
      },
      binary: {
        timeout: 25000,
      }
    });
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to MongoMemoryServer: ${memoryUri}`);
    return true;
  } catch (memErr) {
    console.warn('MongoMemoryServer binary not available offline. Enabling high-speed In-Memory DB Mode:', memErr.message);
    isInMemoryFallback = true;
    return false;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch {}
}
