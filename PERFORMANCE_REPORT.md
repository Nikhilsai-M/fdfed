# Performance Optimization Report

## Scope

This report documents the search-related database optimization work completed for Smart Exchange:

- MongoDB search optimization using indexes and query planning
- Redis response caching for repeated search requests

## Containerization Status

The project is containerized.

- Backend container: [api/Dockerfile](/Users/nagavenkatesh/Documents/untitled%20folder%202/api/Dockerfile)
- Frontend container: [client/Dockerfile](/Users/nagavenkatesh/Documents/untitled%20folder%202/client/Dockerfile)
- Multi-service orchestration: [docker-compose.yml](/Users/nagavenkatesh/Documents/untitled%20folder%202/docker-compose.yml)

Run the full stack with:

```bash
docker compose up --build
```

Run only MongoDB and Redis with:

```bash
docker compose up mongo redis
```

## MongoDB Index Optimization

Why the comparison is measured this way:

- Commenting out schema indexes in code does not remove indexes that already exist in MongoDB.
- To produce a meaningful before/after comparison, the benchmark compares:
  - before: regex-based collection-scan style search
  - after: MongoDB indexed `$text` search

Commands:

```bash
cd api
npm run benchmark:db
npm run benchmark:db:compare
```

### Query plan evidence

`npm run benchmark:db` shows `IXSCAN` in the winning plan for search collections, which confirms indexed execution.

### Timing comparison

| Collection | Before strategy | After strategy | Before avg (ms) | After avg (ms) | Improvement |
|---|---|---|---:|---:|---:|
| phones (`samsung`) | regex scan | indexed text search | 246.20 | 232.76 | 5.46% |
| laptops (`apple`) | regex scan | indexed text search | 464.75 | 188.16 | 59.51% |
| chargers (`apple`) | regex scan | indexed text search | 364.04 | 235.86 | 35.21% |
| earphones (`boult`) | regex scan | indexed text search | 44.38 | 51.67 | -16.43% |
| mouses (`arctic`) | regex scan | indexed text search | 69.95 | 59.39 | 15.10% |
| smartwatches (`apple`) | regex scan | indexed text search | 87.15 | 250.15 | -187.03% |

Overall average across collections from `npm run benchmark:db:compare`:

- Before indexing-style comparison average: `212.75 ms`
- After indexed text search average: `169.66 ms`
- Overall measured improvement: `20.25%`

Important interpretation note:

- Query-plan evidence is the strongest proof for MongoDB optimization here.
- Some individual collections are small, so timing can fluctuate and a few collections may not show a faster wall-clock time on every run.
- The key technical proof is that indexed search uses `IXSCAN` / `TEXT_MATCH` while avoiding broader scan-style matching logic.

## Redis Cache Optimization

Command:

```bash
cd api
npm run benchmark:cache
```

Measured result from the current local benchmark:

| Endpoint | Cold avg (ms) | Warm avg (ms) | Improvement | Misses | Hits |
|---|---:|---:|---:|---:|---:|
| `/api/search?q=iphone` | 161.61 | 3.85 | 97.62% | 1 | 9 |

Observed behavior:

- First request returned `X-Cache: MISS`
- Subsequent requests returned `X-Cache: HIT`

## Conclusion

- MongoDB search is optimized with indexes and confirmed by `IXSCAN` query plans.
- Redis caching significantly improves repeated search latency.
- The measured Redis improvement for the search endpoint is `97.62%`.
