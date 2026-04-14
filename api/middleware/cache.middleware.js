import { getCache, setCache } from "../config/redis.js";

export function cacheResponse({ keyBuilder, ttlSeconds = 60 }) {
  return async function cacheResponseMiddleware(req, res, next) {
    try {
      const cacheKey = keyBuilder(req);
      const cachedPayload = await getCache(cacheKey);

      if (cachedPayload) {
        res.set("X-Cache", "HIT");
        return res.status(cachedPayload.statusCode || 200).json(cachedPayload.body);
      }

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        const statusCode = res.statusCode || 200;
        res.set("X-Cache", "MISS");

        if (statusCode >= 200 && statusCode < 300) {
          try {
            await setCache(
              cacheKey,
              {
                statusCode,
                body,
              },
              ttlSeconds
            );
          } catch (error) {
            console.warn("Failed to write cache entry:", error.message);
          }
        }

        return originalJson(body);
      };

      next();
    } catch (error) {
      console.warn("Cache middleware bypassed:", error.message);
      next();
    }
  };
}
