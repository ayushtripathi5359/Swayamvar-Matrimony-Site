import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAccessToken } from '../lib/auth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refresh');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Redirect to login with error message
      navigate('/login', { 
        state: { 
          error: error === 'oauth_error' ? 'Google authentication failed. Please try again.' : 'Authentication failed.' 
        } 
      });
      return;
    }

    if (token && refreshToken) {
      // Store tokens
      setAccessToken(token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Redirect to dashboard or profile completion
      navigate('/dashboard');
    } else {
      navigate('/login', { 
        state: { 
          error: 'Authentication failed. Please try again.' 
        } 
      });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;