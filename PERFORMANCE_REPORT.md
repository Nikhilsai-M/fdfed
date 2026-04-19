# Performance Report

## Completed work

- MongoDB search optimization using indexes and query planning
- Redis response caching for repeated search requests

## Local validation flow

```bash
docker compose up mongo redis
cd api
npm run benchmark:db
npm run benchmark:cache
```

## Expected evidence

- `npm run benchmark:db` shows indexed execution for MongoDB text search.
- `npm run benchmark:cache` shows improved warm-request latency from Redis.
- `/api/search?q=iphone` returns MongoDB-backed results.
- Repeated search requests can return cached responses.

## Search implementation notes

- Search logic lives in `api/controllers/search.controller.js`.
- MongoDB is the active search engine, with Redis used for response caching.
