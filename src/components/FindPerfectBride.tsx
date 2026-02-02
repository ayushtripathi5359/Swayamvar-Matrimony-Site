import { useEffect, useState } from "react";
import ProfileCard, { ProfileCardData } from "@/components/ProfileCard";
import { apiFetch } from "@/lib/apiClient";

export default function FindPerfectBride() {
  const [profiles, setProfiles] = useState<ProfileCardData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/profiles/browse?limit=8");
        
        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, show placeholder cards
            if (isMounted) {
              setProfiles(null);
              setLoading(false);
            }
            return;
          }
          throw new Error('Failed to fetch profiles');
        }
        
        const data = await response.json();
        const list = (data.profiles || []) as ProfileCardData[];
        
        if (isMounted) {
          setProfiles(list);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        if (isMounted) {
          setError('Failed to load profiles');
          setLoading(false);
        }
      }
    };

    fetchProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white pt-8 pb-12 sm:py-16">
      <div className="max-w-[1300px] mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1 text-xs font-medium bg-gray-100 rounded-full mb-4">
            Bride
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-7xl font-medium text-[#0B1C7A] mb-3">
            Find Your Perfect Bride
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
            Discover verified profiles with complete details to help you find your ideal life partner.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500">Loading profiles...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-4xl">⚠️</div>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Profiles Available */}
        {!loading && !error && profiles && profiles.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4 max-w-md">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="text-xl font-semibold text-gray-800">No Profiles Available</h3>
              <p className="text-gray-600">
                There are currently no other profiles to show. Check back later as new members join our community!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <button 
                  onClick={() => window.location.href = '/registration'} 
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Complete Your Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid - Show when we have profiles OR when showing placeholders (not authenticated) */}
        {!loading && !error && (profiles === null || (profiles && profiles.length > 0)) && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {(profiles && profiles.length > 0
                ? profiles
                : Array.from({ length: 8 })
              ).map((item, index) => (
                <ProfileCard
                  key={profiles && profiles.length > 0 ? (item as ProfileCardData)._id || index : index}
                  profile={profiles && profiles.length > 0 ? (item as ProfileCardData) : undefined}
                />
              ))}
            </div>

            {/* Mobile Pagination - Only show when we have actual profiles */}
            {profiles && profiles.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4F5BD5] text-white">
                  ‹
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4F5BD5]" />
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                </div>

                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4F5BD5] text-white">
                  ›
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
