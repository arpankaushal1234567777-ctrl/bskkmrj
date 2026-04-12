## ✅ Fixes Implemented
- Removed SQLite server and root entry; single Express backend now lives in `backend/server.js`.
- Ensured MongoDB connection happens before server start with fail-fast behavior.
- Mounted real auth routes; login now validates credentials, hashes passwords, and signs JWTs with required env secret.
- Enforced env-only secrets (no fallbacks); admin seed requires `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Added basic request logging, input validation for all CRUD controllers, and stricter JWT middleware.
- Rewired frontend/admin API helpers to target `http://localhost:5000/api` and strip duplicate prefixes.
- Replaced fake admin login with real API-based flow storing JWT in `localStorage`.
- Cleaned merge conflicts in docs and package metadata; removed unused SQLite dependencies.
- Added `.env.example` with required variables and refreshed primary README.

## 🧱 Final Architecture
- `backend/` – Express app (`app.js`), entry at `backend/server.js`; routes → controllers → Mongoose models; middleware for auth/error/logging; config for DB connection.
- `frontend/` – static pages using `frontend/JS/api.js` to call API endpoints.
- `admin-panel/` – static admin UI calling `admin-panel/js/admin-api.js` for authenticated CRUD; login uses `/api/auth/login`.
- Request flow: Browser → `http://localhost:5000/api/*` → Express routes → controllers (validation/auth) → MongoDB via Mongoose.

## 🚀 How to Run
1) Install deps: `npm install`
2) Create `.env` from `.env.example` and fill values (Mongo URI, JWT secret, admin creds).
3) Start backend: `npm start` (listens on `PORT`, default 5000).
4) Open `frontend/public/index.html` (public site) and `admin-panel/index.html` (admin) in a static server or directly in the browser; admin actions use the API at port 5000.

## 🔐 Auth Flow
- Admin submits email/password to `POST /api/auth/login`.
- Server seeds admin account from env (if absent), verifies password with bcrypt, signs JWT using `JWT_SECRET` for 12h.
- Frontend stores token in `localStorage` (`bskkm_admin_token`) and sends it on every request as `Authorization: Bearer <token>`.
- Protected routes check the JWT via `requireAuth`; invalid or missing tokens get 401.

## ⚠️ Remaining Tasks
- Provide a production-ready MongoDB URI and strong `JWT_SECRET` in `.env`.
- Set up HTTPS and reverse proxy for deployment (optional but recommended).
