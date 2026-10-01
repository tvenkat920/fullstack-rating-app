require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('Successfully connected to the PostgreSQL database via Prisma.');

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected. Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    console.log('Please ensure PostgreSQL is running and DATABASE_URL is properly configured in .env');
    process.exit(1);
  }
};

startServer();
