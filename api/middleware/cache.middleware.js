import { getCache, setCache } from "../config/redis.js";

export function cacheResponse({ keyBuilder, ttlSeconds = 60 }) {
  return async function cacheResponseMiddleware(req, res, next) {
    const startTime = Date.now();

    try {
      const cacheKey = keyBuilder(req);

      console.log(`🔍 Checking cache for key: ${cacheKey}`);

      const cachedPayload = await getCache(cacheKey);

      //  CACHE HIT
      if (cachedPayload) {
        const timeTaken = Date.now() - startTime;

        console.log(` CACHE HIT (${cacheKey})`);
        console.log(` Response time: ${timeTaken} ms`);

        res.set("X-Cache", "HIT");
        return res.status(cachedPayload.statusCode || 200).json(cachedPayload.body);
      }

      console.log(`🐢 CACHE MISS (${cacheKey}) - Fetching from DB`);

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        const statusCode = res.statusCode || 200;
        res.set("X-Cache", "MISS");

        const timeTaken = Date.now() - startTime;
        console.log(` DB Response time: ${timeTaken} ms`);

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

            console.log(` Cached response (${cacheKey})`);
          } catch (error) {
            console.warn("⚠️ Failed to write cache:", error.message);
          }
        }

        return originalJson(body);
      };

      next();

    } catch (error) {
      console.warn(" Cache middleware bypassed:", error.message);
      next();
    }
  };
}