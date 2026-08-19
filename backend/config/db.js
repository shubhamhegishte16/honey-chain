import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;
let isInMemoryFallback = false;

export function getIsInMemoryFallback() {
  return isInMemoryFallback;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // 1. Try real MongoDB URI first
  if (uri) {
    try {
      console.log(`Connecting to MongoDB URI: ${uri}...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log('Connected to MongoDB via URI');
      return true;
    } catch (err) {
      console.log(`MongoDB URI connection unavailable (${err.message}). Trying MongoMemoryServer...`);
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
