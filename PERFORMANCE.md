# Performance And Optimization

## Database optimization already applied

- Text indexes are present on searchable product collections used by `/api/search`.
- Compound indexes are present on high-frequency workflow collections such as notifications, orders, applications, carts, device requests, and supervisor activity.
- Search queries use MongoDB `$text` with score-based sorting when Solr is not enabled.
- Query-planning evidence can be generated with `npm run benchmark:db` inside `api/`.

## Redis caching added

- Search responses are cached with Redis using the `search:*` namespace.
- Admin statistics responses are cached with the `analytics:*` namespace.
- Seller dashboard responses are cached with the `seller-dashboard:*` namespace.
- Cache invalidation runs automatically after seller inventory changes and supervisor approval/inventory mutations.
- Cached responses include the `X-Cache` response header with `MISS` or `HIT`.

## Solr search support added

- Set `SEARCH_ENGINE=solr` to route `/api/search` through Solr.
- Solr documents are generated from all searchable phone, laptop, and accessory collections.
- `npm run search:solr:sync` syncs MongoDB products into Solr for demo or deployment bootstrap.
- If Solr is unavailable, the API falls back to MongoDB text search and reports `engine: mongo-text:fallback`.

## Commands to produce review evidence

From `api/`:

```bash
npm run benchmark:db
npm run benchmark:cache
npm run search:solr:sync
npm test
```

## What to show in the review

- `npm run benchmark:db`
- This proves MongoDB is using indexed query plans instead of scanning everything.
- `npm run benchmark:cache`
- This prints cold vs warm average response time and the percentage improvement from Redis.
- `npm run search:solr:sync`
- This shows the external search index can be populated from application data.
- `npm test`
- This generates coverage and report artifacts in `api/coverage/`.
