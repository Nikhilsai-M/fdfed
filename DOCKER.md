# Docker Setup

## Services

`docker-compose.yml` brings up:

- `mongo`
- `redis`
- `api`
- `client`

## Start

```bash
docker compose up --build
```

## Search bootstrap

If `SEARCH_ENGINE=meilisearch`, populate the hosted Meilisearch index after the stack is up:

```bash
cd api
npm run search:meili:sync
```

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Health: `http://localhost:3000/api/health`
- Meilisearch host: from `MEILI_HOST`

## Notes

- Backend hot reload uses `nodemon`.
- Frontend hot reload uses Vite.
- Redis is included so cache behavior can be demonstrated locally.
- Hosted Meilisearch is used directly through `MEILI_HOST`.
- MongoDB and Redis have healthchecks before the API starts.

## Stop

```bash
docker compose down
```
