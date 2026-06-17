# Monorepo CI/CD Demo

Monorepo backend (Node/Express) + frontend (Vue 3/Vite) avec Docker multi-stage, docker-compose et pipeline GitHub Actions (build + push + tag sur Docker Hub).

## Structure

```
.
├── backend/              # API Express
│   ├── src/index.js
│   ├── package.json
│   └── Dockerfile        # multi-stage: deps -> runtime
├── frontend/             # SPA Vue 3 + Vite
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile        # multi-stage: builder -> nginx
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Dev local

```bash
# tout build + run
docker compose up --build

# front : http://localhost:8080
# back  : http://localhost:3000/api/health
```

Dev sans Docker:

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Pipeline CI/CD

Déclencheurs:
- `push` sur `main` → build + push tags `latest` + `sha-<short>`
- `push` tag `v*.*.*` → build + push tags `1.2.3`, `1.2`
- `pull_request` → build + test seulement

### Secrets GitHub requis

| Secret | Valeur |
|--------|--------|
| `DOCKERHUB_USERNAME` | Ton user Docker Hub |
| `DOCKERHUB_TOKEN` | Access token Docker Hub (Account Settings → Security) |

### Créer un release tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

→ images publiées:
- `<user>/cicd-backend:1.0.0`, `:1.0`
- `<user>/cicd-frontend:1.0.0`, `:1.0`

## Multi-stage Docker

**Backend**: stage `deps` installe deps prod, stage `runtime` copie node_modules + src → image finale ~150 MB.

**Frontend**: stage `builder` (Node) compile Vite, stage `runtime` (nginx) sert `dist/` → image finale ~50 MB. Nginx proxy `/api/` vers backend.
