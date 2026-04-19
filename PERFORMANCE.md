# Performance Notes

- Text indexes are present on searchable product collections used by `/api/search`.
- Search responses are cached with Redis using the `search:*` namespace.
- Search queries use MongoDB `$text` with score-based sorting whenever Meilisearch is disabled or unavailable.

## Meilisearch search support

- Set `SEARCH_ENGINE=meilisearch` to route `/api/search` through Meilisearch.
- Product documents are generated from all searchable phone, laptop, and accessory collections.
- `npm run search:meili:sync` syncs MongoDB products into Meilisearch for local bootstrap or deployment release jobs.
- If Meilisearch is unavailable, the API falls back to MongoDB text search and reports `engine: mongo-text:fallback`.

## Verification

```bash
cd api
npm run benchmark:db
npm run benchmark:cache
npm run search:meili:sync
```

- `npm run benchmark:db`
- `npm run benchmark:cache`
- `npm run search:meili:sync`
