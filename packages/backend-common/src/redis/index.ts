import { Redis } from 'ioredis';
import { env } from '../config/env.js';
export const redis = new Redis(env.REDIS_URL!);

export const redisPub = new Redis(env.REDIS_URL!);

export const redisSub = new Redis(env.REDIS_URL!);
