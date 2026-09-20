import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Run Database Seeding
    await seedDatabase();

    // 3. Start Listening
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🚀 SIMPLDSC BACKEND SERVER RUNNING`);
      console.log(`  🌐 Port: ${PORT}`);
      console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  💼 Tagline: Digital Signatures, Made Simple.`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('[Server Startup Error]:', error);
    process.exit(1);
  }
};

startServer();
