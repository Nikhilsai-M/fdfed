# Performance And Optimization

## Database optimization already applied

- Text indexes are present on searchable product collections used by `/api/search`.
- Compound indexes are present on high-frequency workflow collections such as notifications, orders, applications, carts, device requests, and supervisor activity.
- Search queries use MongoDB `$text` with score-based sorting instead of full collection scans.
- Query-planning evidence can be generated with `npm run benchmark:db` inside `api/`.

## Redis caching added

- Search responses are cached with Redis using the `search:*` namespace.
- Admin statistics responses are cached with the `analytics:*` namespace.
- Seller dashboard responses are cached with the `seller-dashboard:*` namespace.
- Cache invalidation runs automatically after seller inventory changes and supervisor approval/inventory mutations.
- Cached responses include the `X-Cache` response header with `MISS` or `HIT`.

## Commands to produce review evidence

From `api/`:

```bash
npm run benchmark:db
npm run benchmark:cache
npm test
```

## What to show in the review

- `npm run benchmark:db`
- This proves MongoDB is using indexed query plans instead of scanning everything.
- `npm run benchmark:cache`
- This prints cold vs warm average response time and the percentage improvement from Redis.
- `npm test`
- This generates coverage and report artifacts in `api/coverage/`.

## Search optimization note

- The current project uses MongoDB text indexing for search.
- If your professor explicitly wants an external search platform, Solr or Elasticsearch can be added later, but the current codebase now has measurable indexed search plus Redis acceleration.
