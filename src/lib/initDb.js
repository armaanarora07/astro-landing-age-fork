import { openDb } from './db.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { join } from 'path';

// Load environment variables
dotenv.config();

async function initDatabase() {
  let db;
  try {
    // Make sure the data directory exists
    const dbDir = join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Attempt to open the database connection
    db = await openDb();
    
    // Create waitlist table with proper indexes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        interest TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, interest)
      );
      
      -- Create index on email for faster lookups
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
      
      -- Create index on creation date for potential cleanup operations
      CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
      
      -- Add a view that masks PII for analytics purposes
      CREATE VIEW IF NOT EXISTS waitlist_analytics AS
      SELECT 
        id,
        substr(email, 1, 2) || '***' || substr(email, instr(email, '@')) as masked_email,
        interest,
        date(created_at) as signup_date
      FROM waitlist;
      
      -- Add a view for interest statistics
      CREATE VIEW IF NOT EXISTS interest_stats AS
      SELECT 
        interest,
        COUNT(*) as total_subscribers,
        MIN(created_at) as first_signup,
        MAX(created_at) as latest_signup
      FROM waitlist
      GROUP BY interest;
      
      -- Create contacts table to store contact form submissions
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        source TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create index on email for faster lookups
      CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
      
      -- Create index on creation date for potential cleanup operations
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
      
      -- Create index on source for analytics
      CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
      
      -- Add a view that masks PII for analytics purposes
      CREATE VIEW IF NOT EXISTS contacts_analytics AS
      SELECT 
        id,
        substr(name, 1, 1) || '***' as masked_name,
        substr(email, 1, 2) || '***' || substr(email, instr(email, '@')) as masked_email,
        source,
        date(created_at) as contact_date
      FROM contacts;
    `);
    
    return true;
  } catch (error) {
    return false;
  } finally {
    if (db) await db.close();
  }
}

// Only execute initialization directly if this is not being imported
// In production, we'll initialize from server startup
if (process.env.NODE_ENV !== 'production') {
  initDatabase()
    .then(() => {})
    .catch(() => {
      process.exit(1);
    });
}

// Export the initialization function so it can be called from the server
export default initDatabase; 