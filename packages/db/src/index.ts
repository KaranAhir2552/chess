import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@repo/backend-common/config';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required to initialize Prisma adapter');
}

const poolConfig = { connectionString: env.DATABASE_URL };
const prismaClient = new PrismaClient({ adapter: new PrismaPg(poolConfig) });
export default prismaClient;
