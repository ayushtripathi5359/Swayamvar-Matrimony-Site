# Google OAuth Setup Instructions

To enable Google OAuth authentication, you need to set up Google OAuth credentials:

## 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Create OAuth 2.0 Client ID for "Web application"

## 2. Configure Redirect URIs

Add these authorized redirect URIs:
- `http://3.109.4.243/api/auth/google/callback` (for development)
- `https://yourdomain.com/api/auth/google/callback` (for production)

## 3. Update Environment Variables

Update your `backend/.env` file with the credentials:

```env
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_CALLBACK_URL=http://3.109.4.243/api/auth/google/callback
```

## 4. Test the Integration

1. Start the backend server: `npm run dev` (in backend folder)
2. Start the frontend server: `npm run dev` (in root folder)
3. Go to login/signup page and click "Sign in with Google"

## Current Status

- ✅ Backend Google OAuth routes configured
- ✅ Frontend Google OAuth buttons added
- ✅ Auth callback page created
- ⚠️ Google OAuth credentials need to be configured (placeholder values currently)
- ✅ Email verification works for regular email registrations
- ✅ Google users are automatically email-verified

## Features

- **Google OAuth Login/Registration**: Users can sign in or sign up using their Google account
- **Email Verification**: Regular email registrations require email verification
- **Automatic Email Verification**: Google OAuth users are automatically verified
- **Account Linking**: If a user registers with email and later uses Google OAuth with the same email, accounts are linked
- **Graceful Fallback**: Email sending failures in development mode don't break registration