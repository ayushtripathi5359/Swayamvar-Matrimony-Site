# Swayamvar Backend

## Overview
Node.js + Express backend providing authentication, profile management, matches, and newsletter subscription APIs for the Swayamvar Matrimony frontend.

## Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
See `.env.example` for required values.

## Auth Flow
- **Register** → Creates user + profile, returns access token, sets refresh token cookie.
- **Login** → Returns access token, sets refresh token cookie.
- **Refresh** → Rotates refresh token, returns new access token.
- **Logout** → Clears refresh token cookie.

Access tokens are sent as `Authorization: Bearer <token>` from the frontend. Refresh token is stored as an HTTP-only cookie.

## API Endpoints
### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Profile
- `GET /api/profile/me` (protected)
- `PUT /api/profile/me` (protected)

### Matches
- `GET /api/matches` (protected)

### Newsletter
- `POST /api/newsletter`

## Frontend Integration Notes
- Set `VITE_API_URL` in the frontend `.env` to the backend base URL (e.g. `http://localhost:5000`).
- The frontend stores the access token locally and automatically refreshes when it expires.
