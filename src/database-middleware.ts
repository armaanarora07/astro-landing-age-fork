import { defineMiddleware } from 'astro:middleware';
import initDatabase from './lib/initDb';

// Database initialization flag to prevent multiple initializations
let databaseInitialized = false;
let initializationInProgress = false;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Define the middleware
export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize database if not already initialized
  if (!databaseInitialized && !initializationInProgress && initializationAttempts < MAX_INIT_ATTEMPTS) {
    initializationInProgress = true;
    initializationAttempts++;
    
    try {
      console.log(`Database initialization attempt ${initializationAttempts}/${MAX_INIT_ATTEMPTS}...`);
      
      // Initialize the database (create tables if needed)
      const success = await initDatabase();
      
      if (success) {
        databaseInitialized = true;
        console.log('Database initialized successfully via middleware');
      } else {
        console.error(`Database initialization attempt ${initializationAttempts} failed`);
      }
    } catch (error) {
      console.error('Error during database initialization:', error);
    } finally {
      initializationInProgress = false;
    }
  }
  
  // Continue with the regular request
  return next();
}); 