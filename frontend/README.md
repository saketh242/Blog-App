# Blogapp Frontend (React)

React UI for the Spring Boot backend in this repo.

## Run

Start the backend on `http://localhost:8080`, then:

```bash
cd frontend
npm install
npm run dev
```

Vite dev server proxies API calls to the backend:
- `/auth/*` → `http://localhost:8080/auth/*`
- `/api/*` → `http://localhost:8080/api/*`

## Pages
- **Search**: Elasticsearch-backed search UI (`/api/search/blogs`)
- **Editor**: create/update blog posts (`/api/blogs`)
- **Tags**: autocomplete comes from SQL (`/api/tags/suggest`)
- **Auth**: login/register (`/auth/login`, `/auth/register`)

