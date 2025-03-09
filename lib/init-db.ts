import fs from 'fs';
import path from 'path';
import { query } from './db';

/**
 * Initializes the database with the schema from schema.sql
 */
async function initializeDatabase() {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await query(`${statement};`);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// uncomment to run this function when needed
// initializeDatabase();

export default initializeDatabase;