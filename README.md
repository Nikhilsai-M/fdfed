# Smart Exchange

Smart Exchange is a full-stack marketplace for buying, selling, and managing phones, laptops, and accessories. The stack is React + Vite on the client and Express + MongoDB on the backend, with role-based flows for customers, sellers, supervisors, and admins.

## Final Review Coverage

- MongoDB indexing and query-plan based DB optimization
- Redis caching for repeated search, analytics, and dashboard reads
- Optional Solr-backed search with Mongo text-search fallback
- REST web services with Swagger/OpenAPI documentation
- External API consumption through Razorpay and Cloudinary
- Unit/API tests with coverage output in `api/coverage/`
- Dockerized local stack with MongoDB, Redis, and Solr
- GitHub Actions CI
- Deployment-ready frontend and backend configuration

## Main URLs

- Frontend local: `http://localhost:5173`
- Backend local: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- Health endpoint: `http://localhost:3000/api/health`
- Solr admin: `http://localhost:8983/solr`

## Local Setup

1. Copy `.env.example` to `.env` and fill the required secrets.
2. Install dependencies:

```bash
cd api && npm install
cd ../client && npm install
```

3. Start locally with Docker:

```bash
docker compose up --build
```

This starts:

- `mongo`
- `redis`
- `solr`
- `api`
- `client`

4. If `SEARCH_ENGINE=solr`, sync MongoDB products into Solr after startup:

```bash
cd api
npm run search:solr:sync
```

## Review Commands

Run these from `api/`:

```bash
npm test
npm run benchmark:db
npm run benchmark:cache
npm run search:solr:sync
```

What each one gives you:

- `npm test`: unit/API test report plus coverage files in `api/coverage/`
- `npm run benchmark:db`: query-plan evidence for indexed search
- `npm run benchmark:cache`: cold vs warm cache timings and Redis improvement
- `npm run search:solr:sync`: populates the external Solr index for search demos

## Search Strategy

- Default fallback: MongoDB text indexes for resilient local search
- External search option: Solr via `SEARCH_ENGINE=solr`
- Search responses include an `engine` field so you can show whether the request was served by `solr` or `mongo-text`

## API Documentation

- Swagger/OpenAPI is generated from route annotations and served at `/api-docs`.
- Demo notes: `api/SWAGGER_DEMO.md`

## Deployment

- Frontend is prepared for Vercel with `vercel.json`.
- Set `VITE_API_BASE_URL` in Vercel to your deployed backend URL, for example `https://your-api.onrender.com`.
- Backend should be deployed as a Node service with MongoDB, Redis, and optionally Solr connectivity.
- Full deployment notes: `DEPLOYMENT.md`

## Performance Notes

- Optimization details and review steps: `PERFORMANCE.md`
- Performance reporting template: `PERFORMANCE_REPORT.md`
