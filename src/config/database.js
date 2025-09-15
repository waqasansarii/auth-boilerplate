import 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const connection = neon(process.env.DATABASE_URL);
const db = drizzle(connection);

export { db, connection };
