# E-commerce Fashion (React + Go)

This is a professional fashion e-commerce built with React (Vite + TS) and Go (Gin + GORM), following Clean Architecture.

## Quick Start (Docker)

1. Copy environment examples and update values:
   - backend/.env.example -> backend/.env
   - frontend/.env.example -> frontend/.env

2. Start services:

```powershell
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api
- Postgres: localhost:5432
- Redis: localhost:6379
- MinIO Console: http://localhost:9001

## Structure

- backend: Clean Architecture (domain, repository, service, handler)
- frontend: Vite + React + TS, Tailwind, shadcn/ui

## Notes
- Use `docker compose` if your Docker is v2.
- For production, use `frontend/Dockerfile` (Nginx) and proper environment.
