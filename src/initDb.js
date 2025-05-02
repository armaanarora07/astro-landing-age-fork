import initDatabase from './lib/initDb.js';

// Directly run the database initialization
console.log('Running database initialization script...');
initDatabase()
  .then((success) => {
    if (success) {
      console.log('Database initialized successfully!');
      process.exit(0);
    } else {
      console.error('Database initialization failed.');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  }); 