# Docker Setup

## Services

`docker-compose.yml` brings up:

- `mongo`
- `redis`
- `solr`
- `api`
- `client`

## Start

```bash
docker compose up --build
```

## Search bootstrap

If `SEARCH_ENGINE=solr`, populate the Solr core after the stack is up:

```bash
cd api
npm run search:solr:sync
```

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Health: `http://localhost:3000/api/health`
- Solr admin: `http://localhost:8983/solr`

## Notes

- Backend hot reload uses `nodemon`.
- Frontend hot reload uses Vite.
- Redis is included so cache behavior can be demonstrated locally.
- Solr is included so external search can be demonstrated locally.
- MongoDB, Redis, and Solr all have healthchecks before the API starts.

## Stop

```bash
docker compose down
```
