import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/simpldsc';

  try {
    // Attempt standard connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database: ${mongoose.connection.host}`);
  } catch (primaryErr) {
    console.warn(`[MongoDB] Primary connection failed: ${primaryErr.message}`);

    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Initializing embedded in-memory MongoDB for local development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memUri = mongoMemoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`[MongoDB] Connected to in-memory MongoDB at: ${memUri}`);
      } catch (memErr) {
        console.error('[MongoDB] Failed to start in-memory MongoDB:', memErr);
        throw memErr;
      }
    } else {
      throw primaryErr;
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
