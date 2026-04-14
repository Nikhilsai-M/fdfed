# Smart Exchange

Smart Exchange is a full-stack marketplace for buying, selling, and managing phones, laptops, and accessories. The stack is React + Vite on the client and Express + MongoDB on the backend, with role-based flows for customers, sellers, supervisors, and admins.

## What is covered for the final review

- DB optimization with MongoDB indexes and query-plan reporting
- Redis caching for expensive read endpoints with measurable warm-cache improvement support
- REST web services with Swagger/OpenAPI documentation
- Exposed APIs for the marketplace frontend and admin/seller/supervisor flows
- Consumed external APIs such as Razorpay and Cloudinary
- Unit and API tests with coverage reporting
- Dockerized local stack with MongoDB and Redis
- GitHub Actions CI
- Deployment-ready frontend and backend configuration

## Main URLs

- Frontend local: `http://localhost:5173`
- Backend local: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- Health endpoint: `http://localhost:3000/api/health`

## Local setup

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
- `api`
- `client`

## Review commands

Run these from `api/`:

```bash
npm test
npm run benchmark:db
npm run benchmark:cache
```

What each one gives you:

- `npm test`: unit/API test report plus coverage files in `api/coverage/`
- `npm run benchmark:db`: query-plan evidence for indexed search
- `npm run benchmark:cache`: cold vs warm cache timings and Redis improvement

## API documentation

- Swagger/OpenAPI is generated from route annotations and served at `/api-docs`.
- Demo notes: [api/SWAGGER_DEMO.md](/Users/nagavenkatesh/Documents/untitled%20folder%202/api/SWAGGER_DEMO.md)

## Deployment

- Frontend is prepared for Vercel with [vercel.json](/Users/nagavenkatesh/Documents/untitled%20folder%202/vercel.json).
- Backend should be deployed as a Node service with MongoDB and Redis connectivity.
- Full deployment notes: [DEPLOYMENT.md](/Users/nagavenkatesh/Documents/untitled%20folder%202/DEPLOYMENT.md)

## Performance notes

- Optimization details and review steps: [PERFORMANCE.md](/Users/nagavenkatesh/Documents/untitled%20folder%202/PERFORMANCE.md)
