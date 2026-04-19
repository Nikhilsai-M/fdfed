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

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Health: `http://localhost:3000/api/health`

## Notes

- Backend hot reload uses `nodemon`.
- Frontend hot reload uses Vite.
- Redis is included so cache behavior can be demonstrated locally.
- MongoDB and Redis have healthchecks before the API starts.

## Stop

```bash
docker compose down
```
