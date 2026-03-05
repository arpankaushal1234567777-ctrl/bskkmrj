<<<<<<< HEAD
## BSKKMRJ Rajasthan Project

Full-stack implementation of the BSKKMRJ website with:
- public frontend (static HTML/CSS/JS)
- admin panel for managing content
- Node/Express backend with MongoDB

### Structure
- `frontend/` – public site (home, about, events, gallery, news, contact, join, donate, team)
- `admin-panel/` – admin UI (login, dashboard, manage news/events/gallery/team)
- `backend/` – Express API + MongoDB models

### Requirements
- Node.js LTS (>= 18)
- npm
- MongoDB (local or Atlas)

### Setup
1. Install dependencies:
   - Run `npm install` in project root (where `package.json` is).

2. Configure environment:
   - Copy `.env` (already present) and adjust if needed:
     - `MONGODB_URI` – e.g. `mongodb://localhost:27017/bskkm`
     - `JWT_SECRET` – long random string
     - `ADMIN_EMAIL` – admin login email
     - `ADMIN_PASSWORD` – admin login password

3. Run backend:
   - `npm run start:backend`
   - Backend will listen on `http://localhost:5000`

### Using the Admin Panel
1. Open `admin-panel/index.html` in your browser (or serve `admin-panel/` via a simple local HTTP server).
2. Log in with the credentials from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
3. Features:
   - **Dashboard** – quick stats and latest news.
   - **Manage News** – CRUD for news items returned by `/api/news`.
   - **Manage Events** – CRUD for events (`/api/events`).
   - **Manage Gallery** – CRUD for gallery items (`/api/gallery`).
   - **Manage Team** – CRUD for national/state team members (`/api/team/*`).

### Backend API (overview)
- `POST /api/auth/login` – authenticate admin, returns JWT.
- `GET /api/health` – simple health check.
- `GET /api/news` – list news (public).
  - `POST /api/news` (auth) – create
  - `PUT /api/news/:id` (auth) – update
  - `DELETE /api/news/:id` (auth) – delete
- `GET /api/events` – list events (public).
  - `POST /api/events` (auth), `PUT /api/events/:id`, `DELETE /api/events/:id`
- `GET /api/gallery` – list gallery items (public).
  - `POST /api/gallery` (auth), `PUT /api/gallery/:id`, `DELETE /api/gallery/:id`
- `GET /api/team/national`, `GET /api/team/state` – public team lists.
  - `POST/PUT/DELETE /api/team/national/*` and `/api/team/state/*` – admin-only CRUD.
- `GET /api/about`, `GET /api/contact` – structured content for about + contact.

The public frontend pages are already wired with the official BSKKMRJ text; you can progressively switch sections to consume live data from the API (news/events/gallery/team) if desired.***
=======
this is my secoond commit 
>>>>>>> 97d3a0d12a3d0292ef3ff23aa577a30d101f15fa
