import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Configure your MongoDB Atlas connection string in server/.env.');
  }

  if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://.');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[MongoDB] Connected to Atlas database: ${mongoose.connection.name}`);
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
