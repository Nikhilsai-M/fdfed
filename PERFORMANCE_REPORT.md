# Performance Report

## Completed work

- MongoDB search optimization using indexes and query planning
- Redis response caching for repeated search requests
- Meilisearch integration for external product search indexing

## Local validation flow

```bash
docker compose up mongo redis
cd api
npm run benchmark:db
npm run benchmark:cache
npm run search:meili:sync
```

## Expected evidence

- `npm run benchmark:db` shows indexed execution for MongoDB text search.
- `npm run benchmark:cache` shows improved warm-request latency from Redis.
- `npm run search:meili:sync` loads all searchable products into the `products` index.
- `/api/search?q=iphone` returns `engine: meilisearch` when Meilisearch is up.
- If Meilisearch is unavailable, `/api/search?q=iphone` still works with `engine: mongo-text:fallback`.

## Search implementation notes

- Search helpers and Meilisearch document/query generation live in `api/services/search.service.js`.
- MongoDB remains the fallback engine for resilience.
