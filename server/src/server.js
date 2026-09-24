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
    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🚀 SIMPLDSC BACKEND SERVER RUNNING`);
      console.log(`  🌐 Port: ${PORT}`);
      console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  💼 Tagline: Digital Signatures, Made Simple.`);
      console.log(`======================================================\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️  [Port Conflict]: Port ${PORT} is currently in use by another instance.`);
        console.error(`   Run the following PowerShell command to terminate the existing process:\n`);
        console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
      } else {
        console.error('[Server Error]:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('[Server Startup Error]:', error);
    process.exit(1);
  }
};

startServer();
