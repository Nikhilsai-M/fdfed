# Deployment Guide

## Recommended split

- Frontend: Vercel
- Backend API: Render, Railway, or any Node host with MongoDB + Redis connectivity
- Database: MongoDB Atlas
- Cache: Redis Cloud or Upstash Redis
- Search: Solr Cloud or a managed Solr-compatible deployment if you want the external search path enabled in production

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
- `SOLR_URL`
- `SOLR_CORE`
- `JWT_SECRET`
- `SESSION_SECRET`
- `CLIENT_ORIGIN`
- `SWAGGER_SERVER_URL`
- `SOLR_TIMEOUT_MS` (optional but recommended)
- Cloudinary and Razorpay credentials if those features are enabled
4. Expose Swagger from `/api-docs`.
5. Confirm health at `/api/health`.
6. If using Solr, run `npm run search:solr:sync` after deployment or during a release job.

## Review checklist

- Frontend loads from the deployed URL.
- Backend `/api/health` returns `success: true`.
- Swagger opens from the deployed backend `/api-docs`.
- Search endpoint returns `X-Cache: HIT` on warm requests when Redis is enabled.
- Search endpoint returns `engine: solr` when external search is enabled.
- Demo is shown only from deployment URLs during review.
