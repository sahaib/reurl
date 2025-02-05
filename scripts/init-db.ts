import { createTables } from '../src/lib/db';
import dotenv from 'dotenv';

dotenv.config();

async function init() {
  try {
    console.log('Creating database tables...');
    await createTables();
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating database tables:', error);
    process.exit(1);
  }
}

init(); 