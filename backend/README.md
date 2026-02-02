# Swayamvar Backend

A matrimonial platform backend built with Node.js, Express, and MongoDB.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env` and update values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/swayamvar
   JWT_ACCESS_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   CORS_ORIGINS=http://localhost:5173
   ```

3. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

- **Auth**: `/api/auth/*` - Authentication endpoints
- **Profiles**: `/api/profiles/*` - Profile management
- **Interests**: `/api/interests/*` - Interest management
- **Matches**: `/api/matches/*` - Match system
- **Users**: `/api/users/*` - User management
- **Subscriptions**: `/api/subscriptions/*` - Subscription plans

## Health Check

```bash
curl http://localhost:5000/health
```