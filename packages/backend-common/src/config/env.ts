import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load package-local .env explicitly (dotenv looks in process.cwd() by default)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GITHUB_APP_NAME: process.env.GITHUB_APP_NAME,
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
  PORT: process.env.PORT,
  WSPORT: process.env.WSPORT,
  REDIS_URL: process.env.REDIS_URL,
};
