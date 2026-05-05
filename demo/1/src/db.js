import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('✅ Connected to Redis'));
client.on('reconnecting', () => console.log('🔄 Reconnecting to Redis...'));

/**
 * Connect to Redis (idempotent — safe to call multiple times)
 */
export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export { client };
