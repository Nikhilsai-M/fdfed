# Performance Optimization Report

## Scope

This report documents the optimization work completed for Smart Exchange:

- MongoDB search optimization using indexes and query planning
- Redis response caching for repeated search requests
- Optional Solr search integration for external search indexing

## Containerization Status

The project is containerized.

- Backend container: `api/Dockerfile`
- Frontend container: `client/Dockerfile`
- Multi-service orchestration: `docker-compose.yml`

Run the full stack with:

```bash
docker compose up --build
```

Run only infrastructure services with:

```bash
docker compose up mongo redis solr
```

## MongoDB Index Optimization

Commands:

```bash
cd api
npm run benchmark:db
npm run benchmark:db:compare
```

### Query plan evidence

`npm run benchmark:db` shows `IXSCAN` in the winning plan for search collections, which confirms indexed execution.

## Redis Cache Optimization

Command:

```bash
cd api
npm run benchmark:cache
```

Expected review evidence:

- First request returns `X-Cache: MISS`
- Repeated requests return `X-Cache: HIT`
- The benchmark prints cold vs warm latency improvement

## Solr Search Optimization

Commands:

```bash
cd api
npm run search:solr:sync
```

Review evidence:

- Solr admin is reachable at `http://localhost:8983/solr`
- `/api/search?q=iphone` returns `engine: solr` when `SEARCH_ENGINE=solr`
- If Solr is unavailable, the API still works using `engine: mongo-text:fallback`

## Testing Evidence

Command:

```bash
cd api
npm test
```

Current suite covers:

- health route
- search helpers and Solr query/document generation
- cache middleware
- payment helpers
- cart service serialization and pricing helpers

Coverage artifacts are generated in `api/coverage/`.
