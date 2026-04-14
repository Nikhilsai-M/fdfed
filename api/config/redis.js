import { createClient } from "redis";

let redisClient;
let redisReady = false;

const DEFAULT_URL = "redis://127.0.0.1:6379";
const CACHE_PREFIX = process.env.REDIS_KEY_PREFIX || "smart-exchange";

function getRedisUrl() {
  return process.env.REDIS_URL || DEFAULT_URL;
}

export function isRedisEnabled() {
  return process.env.REDIS_DISABLED !== "true";
}

export function isRedisReady() {
  return redisReady && Boolean(redisClient?.isOpen);
}

export function withCachePrefix(key) {
  return `${CACHE_PREFIX}:${key}`;
}

export async function connectRedis() {
  if (!isRedisEnabled()) {
    console.warn("Redis disabled via REDIS_DISABLED=true");
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  redisClient = createClient({
    url: getRedisUrl(),
    socket: {
      reconnectStrategy(retries) {
        if (retries > 5) {
          return false;
        }

        return Math.min(retries * 200, 2000);
      },
    },
  });

  redisClient.on("error", (error) => {
    redisReady = false;
    console.warn("Redis error:", error.message);
  });

  redisClient.on("ready", () => {
    redisReady = true;
    console.log("Connected to Redis successfully");
  });

  redisClient.on("end", () => {
    redisReady = false;
  });

  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    redisReady = false;
    console.warn("Redis connection skipped:", error.message);
    return null;
  }
}

export async function disconnectRedis() {
  if (redisClient?.isOpen) {
    await redisClient.quit();
  }
}

export async function getCache(key) {
  if (!isRedisReady()) {
    return null;
  }

  const value = await redisClient.get(withCachePrefix(key));
  return value ? JSON.parse(value) : null;
}

export async function setCache(key, value, ttlSeconds = 60) {
  if (!isRedisReady()) {
    return false;
  }

  await redisClient.set(withCachePrefix(key), JSON.stringify(value), {
    EX: ttlSeconds,
  });

  return true;
}

export async function deleteCacheByPattern(pattern) {
  if (!isRedisReady()) {
    return 0;
  }

  const namespacedPattern = withCachePrefix(pattern);
  let cursor = "0";
  let deletedKeys = 0;

  do {
    const result = await redisClient.scan(cursor, {
      MATCH: namespacedPattern,
      COUNT: 100,
    });

    cursor = result.cursor;
    if (result.keys.length > 0) {
      deletedKeys += result.keys.length;
      await redisClient.del(result.keys);
    }
  } while (cursor !== "0");

  return deletedKeys;
}

export async function invalidateCatalogCaches() {
  const patterns = ["search:*", "analytics:*", "seller-dashboard:*", "inventory:*"];
  const results = await Promise.all(patterns.map((pattern) => deleteCacheByPattern(pattern)));
  return results.reduce((sum, count) => sum + count, 0);
}

export async function getRedisHealth() {
  return {
    enabled: isRedisEnabled(),
    ready: isRedisReady(),
    url: getRedisUrl(),
  };
}
