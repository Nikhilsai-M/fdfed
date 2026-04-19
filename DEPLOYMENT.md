# Deployment Guide

## Recommended split

- Frontend: Vercel
- Backend API: Render, Railway, or any Node host with MongoDB + Redis connectivity
- Database: MongoDB Atlas
- Cache: Redis Cloud or Upstash Redis
- Search: Meilisearch Cloud or a managed Meilisearch deployment if you want the external search path enabled in production

## Frontend on Vercel

1. Import the repository in Vercel.
2. Set the root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add frontend environment variables if needed for API base URL handling.
6. Set `VITE_API_BASE_URL` to your deployed backend base URL, for example `https://your-api.onrender.com`.
7. Keep `vercel.json` for SPA route rewrites.

## Backend deployment

1. Deploy the `api` folder as a Node.js service.
2. Start command: `npm start`
3. Required environment variables:
- `MONGO`
- `REDIS_URL`
- `SEARCH_ENGINE`
- `MEILI_HOST`
- `MEILI_ADMIN_KEY`
- `MEILI_SEARCH_KEY` (only if you expose Meilisearch directly to a frontend)
- `MEILI_INDEX`
- `JWT_SECRET`
- `SESSION_SECRET`
- `CLIENT_ORIGIN`
- `SWAGGER_SERVER_URL`
- `MEILI_TIMEOUT_MS` (optional)
- Cloudinary and Razorpay credentials if those features are enabled
4. Meilisearch API key:
- Frontend-only usage should use `MEILI_SEARCH_KEY`.
- Backend sync/index management should use `MEILI_ADMIN_KEY`.
- If you self-host Meilisearch, set `MEILI_MASTER_KEY` on the Meilisearch server and use an admin-capable key as `MEILI_ADMIN_KEY`.
5. Expose Swagger from `/api-docs`.
6. Confirm health at `/api/health`.
7. If using Meilisearch, run `npm run search:meili:sync` after deployment or during a release job.

## Review checklist

- Frontend loads from the deployed URL.
- Backend `/api/health` returns `success: true`.
- Swagger opens from the deployed backend `/api-docs`.
- Search endpoint returns `X-Cache: HIT` on warm requests when Redis is enabled.
- Search endpoint returns `engine: meilisearch` when external search is enabled.
- Demo is shown only from deployment URLs during review.
