# Docker Setup

## Development

Run all services:

```powershell
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- MongoDB: `mongodb://localhost:27017`

## Auto reload on code changes

Yes, in this setup code changes are reflected automatically because:

- the project folder is mounted into the containers using volumes
- the backend runs with `nodemon`
- the frontend runs with Vite dev server

If you change code, the containers do not need to be rebuilt unless you change:

- `package.json`
- `Dockerfile`
- dependency installation

In those cases, rebuild with:

```powershell
docker compose up --build
```

## Stop containers

```powershell
docker compose down
```
