# API boilerplate (no database wired yet)

A layered Express skeleton implementing the `api-architecture` skill's
conventions: thin routes, fat controllers, isolated models, one middleware
pipeline, one error-handling seam. No database is connected — the "models"
are in-memory stand-ins so the whole thing runs immediately.

## Run it

```bash
cp .env.example .env
npm install
npm run dev        # nodemon, restarts on file changes
# or: npm start
```

Server starts on `http://localhost:5000` (or `PORT` from `.env`).

## Try it

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Sign up
curl -X POST http://localhost:5000/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"password123"}'

# Copy the "token" from the response, then:
curl -X POST http://localhost:5000/api/v1/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"First item"}'

# Public read, no token needed
curl http://localhost:5000/api/v1/items
```

## Structure

```
src/
├── app.js                  entry point — wiring only, no logic
├── config/env.js           all environment variables, loaded once
├── database/connect.js     DB connection stub — see comments for how to wire one in
├── middlewares/
│   ├── security.middleware.js   helmet + rate limiting (runs first)
│   ├── auth.middleware.js       JWT verification, applied per-route
│   ├── validate.middleware.js   dependency-free request validation
│   ├── notFound.middleware.js   404 -> error
│   └── error.middleware.js      single error-handling seam (mounted last)
├── routes/                 thin: path -> controller mapping only
├── controllers/            business logic + orchestration
├── models/                 in-memory stand-ins — swap for real schemas
└── utils/
    ├── ApiError.js          throw new ApiError(statusCode, message)
    └── asyncHandler.js      wraps async controllers so errors reach next()
```

## Adding your database

`src/models/*.model.js` are the only files that should change. Each exports
plain async functions (`createUser`, `findUserByEmail`, ...); replace the
in-memory array inside with real queries (Mongoose, Prisma, Sequelize, a
raw driver — whatever you pick) and keep the function names the same.
Nothing in `controllers/` or `routes/` has to change.

Then fill in `src/database/connect.js` (examples for Mongoose and Prisma are
commented in that file) and set `DB_URI` in `.env`.

## What's already handled

- JWT auth, route-level (see `routes/items.routes.js` for public vs.
  protected routes side by side)
- Password hashing (bcryptjs)
- Rate limiting + security headers (helmet), mounted before routing
- CORS, configured from `CORS_ORIGIN` in `.env`
- Request logging (morgan)
- Centralized, environment-aware error handling (no leaking internals in
  production)
- A dedicated `/health` and `/health/ready` endpoint, separate from the
  root route
- Graceful shutdown on `SIGTERM`/`SIGINT`
- Pagination on the example list endpoint (`GET /api/v1/items?limit=&offset=`)

## What's intentionally left for you

- A real database and real models
- A real validation library if you want more than the built-in checker
  (Zod, Joi, express-validator all drop in cleanly — see
  `middlewares/validate.middleware.js`)
- Tests
- A refresh-token / revocation strategy if you need one
