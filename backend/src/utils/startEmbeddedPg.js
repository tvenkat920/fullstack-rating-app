const ep = require('embedded-postgres');
const EmbeddedPostgres = ep.default || ep;
const fs = require('fs');
const path = require('path');
const net = require('net');

// Check if a port is in use
const isPortOpen = (port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true); // Port is occupied/open
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
};

async function run() {
  const port = 5432;
  const isRunning = await isPortOpen(port);

  if (isRunning) {
    console.log(`Port ${port} is already active. A PostgreSQL or database server appears to be running.`);
    console.log('Skipping embedded database startup.');
    return;
  }

  console.log('Starting local embedded PostgreSQL server on port 5432...');
  const dataDir = path.resolve(__dirname, '../../.pgdata');

  // Clean up stale postmaster.pid if process is not actually running
  const pidFile = path.join(dataDir, 'postmaster.pid');
  if (fs.existsSync(pidFile)) {
    try {
      fs.unlinkSync(pidFile);
      console.log('Removed stale postmaster.pid lock file.');
    } catch (e) {
      console.warn('Could not remove postmaster.pid:', e.message);
    }
  }

  const pg = new EmbeddedPostgres({
    port: 5432,
    databaseDir: dataDir,
    user: 'postgres',
    password: 'password',
    initialDatabase: 'rating_db',
    persistent: true,
  });

  try {
    if (!fs.existsSync(dataDir)) {
      console.log('Initialising embedded database directory...');
      await pg.initialise();
    }
    await pg.start();
    console.log('Embedded PostgreSQL started successfully on port 5432!');
    console.log('DATABASE_URL="postgresql://postgres:password@localhost:5432/rating_db?schema=public"');

    // Create database if not exists
    try {
      await pg.createDatabase('rating_db');
      console.log('Created database rating_db.');
    } catch (e) {
      // Ignore if already exists
    }

    console.log('Embedded PostgreSQL is ready and running.');

    // Keep process alive if called standalone
    process.stdin.resume();
  } catch (err) {
    console.error('Error starting embedded PostgreSQL:', err.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
