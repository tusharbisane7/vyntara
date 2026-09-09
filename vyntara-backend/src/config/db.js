import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is missing. Please add your Neon connection string to .env'
  );
}

const sql = neon(process.env.DATABASE_URL);

export default sql;