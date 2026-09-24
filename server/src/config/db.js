import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  // 1. If Atlas URI is configured, try connecting
  if (uri && /^mongodb(?:\+srv)?:\/\//.test(uri)) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[MongoDB] Connected to Atlas database: ${mongoose.connection.name}`);
      return;
    } catch (error) {
      console.warn(`[MongoDB] Atlas connection failed (${error.message}). Initiating fallback...`);
    }
  }

  // 2. Fallback to in-memory database for seamless local development & offline reliability
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to local in-memory database: ${memoryUri}`);
  } catch (memError) {
    console.error('[MongoDB] Failed to start local MongoDB:', memError.message);
    throw memError;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

