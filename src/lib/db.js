import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function openDb() {
  // Use a consistent path in the data directory
  const dbPath = join(process.cwd(), 'data', 'db.sqlite');
  
  // Make sure the directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Open the database
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
} 