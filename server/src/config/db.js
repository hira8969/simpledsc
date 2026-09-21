import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Configure your MongoDB Atlas connection string in server/.env.');
  }

  if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://.');
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`[MongoDB] Connected to Atlas database: ${mongoose.connection.name}`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        console.warn(`[MongoDB] Connection attempt ${attempt}/3 failed. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  if (lastError?.code === 'ECONNREFUSED' && lastError?.syscall === 'querySrv') {
    throw new Error(
      'MongoDB Atlas DNS lookup was refused. Check Windows DNS/VPN/firewall settings, or set DNS to 8.8.8.8 or 1.1.1.1, then restart the server.'
    );
  }

  throw lastError;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
