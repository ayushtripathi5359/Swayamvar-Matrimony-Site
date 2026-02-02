import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/apiClient';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        // Check if user is authenticated
        const authResponse = await apiFetch("/api/auth/me");
        if (!authResponse.ok) {
          navigate("/login");
          return;
        }

        // Check if profile exists and is complete
        const profileResponse = await apiFetch("/api/profiles");
        
        if (profileResponse.status === 404) {
          // Profile doesn't exist, redirect to registration
          navigate("/registration");
          return;
        }

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          const profile = data.profile || data;
          
          // Check if profile is complete
          if (profile.isComplete) {
            // Profile is complete, redirect to home
            navigate("/home");
          } else {
            // Profile exists but incomplete, redirect to registration
            navigate("/registration");
          }
        } else {
          // Error fetching profile, redirect to registration to be safe
          navigate("/registration");
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
        // On error, redirect to registration
        navigate("/registration");
      } finally {
        setIsChecking(false);
      }
    };

    checkProfileStatus();
  }, [navigate]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // This should rarely be shown since we redirect immediately
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;