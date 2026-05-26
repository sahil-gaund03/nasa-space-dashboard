import { Redis } from "@upstash/redis";

// Fallback in-memory cache
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

let redisClient: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (e) {
    console.warn("Failed to initialize Upstash Redis. Falling back to memory cache.", e);
  }
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (redisClient) {
      try {
        const data = await redisClient.get(key);
        if (data) {
          return typeof data === "string" ? JSON.parse(data) : (data as T);
        }
        return null;
      } catch (e) {
        console.warn(`Redis get failed for key ${key}, using memory cache fallback.`, e);
      }
    }

    const cached = memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return JSON.parse(cached.value) as T;
  },

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const serialized = JSON.stringify(value);

    if (redisClient) {
      try {
        await redisClient.set(key, serialized, { ex: ttlSeconds });
        return;
      } catch (e) {
        console.warn(`Redis set failed for key ${key}, using memory cache fallback.`, e);
      }
    }

    memoryCache.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  async delete(key: string): Promise<void> {
    if (redisClient) {
      try {
        await redisClient.del(key);
        return;
      } catch (e) {
        console.warn(`Redis delete failed for key ${key}, using memory cache fallback.`, e);
      }
    }

    memoryCache.delete(key);
  }
};
