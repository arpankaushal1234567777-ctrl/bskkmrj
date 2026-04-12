# BSKKMRJ Rajasthan Project

Full-stack site for BSKKMRJ with a MongoDB-backed API, static public frontend, and browser-based admin panel.

## Structure
- `backend/` – Express API, MongoDB (Mongoose), JWT auth
- `admin-panel/` – admin UI using the real API
- `frontend/` – public static pages

## Requirements
- Node.js LTS (>=18)
- MongoDB instance (local or Atlas)

## Quick start
1) `npm install`
2) Copy `.env.example` to `.env` and fill values
3) `npm start` (starts API on port 5000)
4) Serve `admin-panel/` or `frontend/` via any static host (or open the HTML files directly for local testing)

## API overview
- `POST /api/auth/login` – admin login (JWT)
- `GET /api/news` (+ auth CRUD)
- `GET /api/events` (+ auth CRUD)
- `GET /api/gallery` (+ auth CRUD)
- `GET /api/team/national` & `/api/team/state` (+ auth CRUD)
- `GET /api/about`, `GET /api/contact`, `GET /api/health`

Admin-only routes require `Authorization: Bearer <token>`.
