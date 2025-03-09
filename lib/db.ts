import { Pool } from 'pg';
import { neon } from '@neon-io/serverless';

// Environment variables defined in .env.local file
const connectionString = process.env.DATABASE_URL;

// Check if in production or development
const isDev = process.env.NODE_ENV !== 'production';

// Initialize connection pool - if in development, use direct connection
// If in production, use neon serverless connection
let db: Pool;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

if (isDev) {
  // For development, use regular Pool
  db = new Pool({ connectionString });
} else {
  // For production, use neon serverless
  const sql = neon(connectionString);
  
  // Create a Pool-like interface that uses neon serverless under the hood
  db = {
    query: async (text: string, params?: any[]) => {
      return await sql(text, params);
    },
    // Add minimal Pool implementation for TypeScript
    end: async () => {},
    on: () => {},
    connect: async () => {
      return {
        query: async (text: string, params?: any[]) => {
          return await sql(text, params);
        },
        release: () => {},
      };
    },
  } as unknown as Pool;
}

/**
 * Helper function to execute SQL queries
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result
 */
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const result = await db.query(text, params);
    const duration = Date.now() - start;
    
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}

export default db;