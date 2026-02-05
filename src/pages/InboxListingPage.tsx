import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "@/lib/apiClient";

interface InterestProfile {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  age?: string;
  occupation?: string;
  jobLocation?: string;
  photos?: {
    western?: { url?: string };
    traditional?: { url?: string };
  };
}

interface Interest {
  _id: string;
  status: 'sent' | 'accepted' | 'declined' | 'withdrawn';
  message?: string;
  responseMessage?: string;
  sentAt: string;
  respondedAt?: string;
  isRead: boolean;
  senderProfileId?: InterestProfile;
  receiverProfileId?: InterestProfile;
}

interface InterestStats {
  sent: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
    withdrawn: number;
  };
  received: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
  };
}

export default function InboxListingPage() {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [stats, setStats] = useState<InterestStats | null>(null);
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get display name
  const getDisplayName = (profile?: InterestProfile): string => {
    if (!profile) return 'Unknown User';
    
    // Try fullName first
    if (profile.fullName && profile.fullName.trim()) {
      return profile.fullName.trim();
    }
    
    // Fallback to firstName + middleName + lastName
    const nameParts = [
      profile.firstName?.trim(),
      profile.middleName?.trim(), 
      profile.lastName?.trim()
    ].filter(Boolean);
    
    if (nameParts.length > 0) {
      return nameParts.join(' ');
    }
    
    return 'Unknown User';
  };

  // Fetch interests and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch stats
        const statsResponse = await apiFetch("/api/interests/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        // Fetch interests based on active tab
        let endpoint: string;
        let status: string = "";
        
        if (activeTab === "received") {
          endpoint = "/api/interests/received";
          status = "sent"; // Show pending received interests
        } else if (activeTab === "accepted") {
          endpoint = "/api/interests/received";
          status = "accepted"; // Show accepted received interests
        } else if (activeTab === "declined") {
          endpoint = "/api/interests/received";
          status = "declined"; // Show declined received interests
        } else if (activeTab === "my-accepted") {
          endpoint = "/api/interests/sent";
          status = "accepted"; // Show sent interests that were accepted
        } else {
          endpoint = "/api/interests/sent";
          status = ""; // Show all sent interests
        }
        
        const queryParams = status ? `?status=${status}&limit=50` : "?limit=50";
        const response = await apiFetch(`${endpoint}${queryParams}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch interests");
        }

        const data = await response.json();
        setInterests(data.interests || []);
      } catch (err) {
        console.error("Error fetching interests:", err);
        setError("Failed to load interests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle interest response (accept/decline)
  const handleInterestResponse = async (interestId: string, status: 'accepted' | 'declined') => {
    try {
      const response = await apiFetch(`/api/interests/${interestId}/respond`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error("Failed to respond to interest");
      }

      // Update the interest in the list
      setInterests(prev => prev.map(interest => 
        interest._id === interestId 
          ? { ...interest, status, respondedAt: new Date().toISOString() }
          : interest
      ));

      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          received: {
            ...prev.received,
            pending: Math.max(0, prev.received.pending - 1),
            [status]: prev.received[status] + 1
          }
        } : null);
      }
    } catch (err) {
      console.error("Error responding to interest:", err);
      alert("Failed to respond to interest");
    }
  };

  // Handle withdraw interest
  const handleWithdrawInterest = async (interestId: string) => {
    try {
      const response = await apiFetch(`/api/interests/${interestId}/withdraw`, {
        method: "PUT"
      });

      if (!response.ok) {
        throw new Error("Failed to withdraw interest");
      }

      // Update the interest in the list
      setInterests(prev => prev.map(interest => 
        interest._id === interestId 
          ? { ...interest, status: 'withdrawn' as const }
          : interest
      ));
    } catch (err) {
      console.error("Error withdrawing interest:", err);
      alert("Failed to withdraw interest");
    }
  };

  /* ---------------- TAB COUNTS ---------------- */
  const counts = {
    received: stats?.received.pending || 0,
    accepted: stats?.received.accepted || 0,
    sent: stats?.sent.total || 0,
    declined: stats?.received.declined || 0,
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white font-jakarta selection:bg-pink-100 antialiased relative">
      {/* Background Pattern Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 238, 240, 0.1)" }} />
        <BackgroundPatterns />
      </div>

      <main className="relative z-10 max-w-[1512px] mx-auto px-2 md:px-9 pt-4">
        <div className="rounded-[32px] bg-white overflow-hidden relative shadow-sm border border-slate-50 min-h-[calc(100vh-40px)]">
          <Navbar />

          {/* Main Content */}
          <div className="px-5 sm:px-8 md:px-12 lg:px-16 pt-32 pb-16">
            {/* TITLE */}
            <div className="mb-8">
              <h1 className="font-bold text-[28px] sm:text-[34px] lg:text-[42px] leading-tight tracking-tight text-slate-900 mb-2">
                My <span className="text-[#ED9B59]">Inbox</span>
              </h1>
              <p className="text-slate-600 text-base lg:text-lg">
                Manage your interests and connections
              </p>
            </div>

            {/* TABS */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-[#F4F5FF] rounded-full p-1 gap-1 flex-wrap">
                {[
                  ["received", `📥 Received (${counts.received})`],
                  ["sent", `📤 Sent (${counts.sent})`],
                  ["my-accepted", `💚 My Accepted (${stats?.sent?.accepted || 0})`],
                  ["accepted", `✅ I Accepted (${counts.accepted})`],
                  ["declined", `❌ Declined (${counts.declined})`],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 py-2 text-sm rounded-full transition whitespace-nowrap ${
                      activeTab === key
                        ? "bg-white text-[#5B6CFF] shadow font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* PROFILE GRID */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading interests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : interests.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <div className="text-6xl mb-4">💌</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {activeTab === "received" ? "No interests received yet" :
                   activeTab === "sent" ? "No interests sent yet" :
                   activeTab === "my-accepted" ? "No one has accepted your requests yet" :
                   activeTab === "accepted" ? "You haven't accepted any interests yet" :
                   `No ${activeTab} interests`}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "sent" 
                    ? "Start browsing profiles and send interests to connect with potential matches!"
                    : activeTab === "my-accepted"
                    ? "When someone accepts your interest request, they will appear here."
                    : activeTab === "received"
                    ? "Interests will appear here when other members show interest in your profile."
                    : "Interests will appear here based on your activity."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {interests.map(interest => {
                  const profile = (activeTab === "sent" || activeTab === "my-accepted") ? interest.receiverProfileId : interest.senderProfileId;
                  const displayName = getDisplayName(profile);
                  const photoUrl = profile?.photos?.profilePhoto?.url ||
                                 profile?.photos?.traditional?.url || 
                                 profile?.photos?.western?.url || 
                                 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200";

                  return (
                    <div
                      key={interest._id}
                      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex gap-3">
                        <img
                          src={photoUrl}
                          alt="profile"
                          className="w-12 h-12 rounded-xl object-cover"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#111827] text-sm truncate">
                            {displayName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {profile?.age && `${profile.age} years`} {profile?.jobLocation && `, ${profile.jobLocation}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {profile?.occupation || 'Occupation not specified'}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            {formatTimeAgo(interest.sentAt)}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          interest.status === 'sent' ? 'bg-blue-100 text-blue-600' :
                          interest.status === 'accepted' ? 'bg-green-100 text-green-600' :
                          interest.status === 'declined' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {interest.status === 'sent' ? 'Pending' : 
                           interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                        </span>
                      </div>

                      {/* Message Preview */}
                      {interest.message && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 italic line-clamp-2">
                            "{interest.message.length > 80 ? 
                              `${interest.message.substring(0, 80)}...` : 
                              interest.message}"
                          </p>
                        </div>
                      )}

                      {/* Special message for my-accepted tab */}
                      {activeTab === "my-accepted" && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg border-l-2 border-green-300">
                          <p className="text-xs text-green-700 font-medium">
                            🎉 {displayName} accepted your interest!
                          </p>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="flex gap-2 mt-4">
                        {activeTab === "received" && interest.status === 'sent' && (
                          <>
                            <button
                              onClick={() => handleInterestResponse(interest._id, 'accepted')}
                              className="flex-1 bg-[#5B6CFF] text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-[#4A5AE8] transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleInterestResponse(interest._id, 'declined')}
                              className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {activeTab === "sent" && interest.status === 'sent' && (
                          <button
                            onClick={() => handleWithdrawInterest(interest._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                          >
                            Withdraw
                          </button>
                        )}

                        {activeTab === "my-accepted" && (
                          <>
                            <button 
                              onClick={() => navigate(`/profile/${profile?._id}`)}
                              className="flex-1 bg-[#5B6CFF] text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-[#4A5AE8] transition-colors"
                            >
                              View Profile
                            </button>
                            <button 
                              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                            >
                              Chat
                            </button>
                          </>
                        )}

                        {(activeTab === "accepted" || activeTab === "declined") && (
                          <button 
                            onClick={() => navigate(`/profile/${profile?._id}`)}
                            className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            View Profile
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Background Patterns Component (matching other pages)
function BackgroundPatterns() {
  return (
    <svg className="absolute -left-[500px] -top-[50px] opacity-10" width="2384" height="1706" viewBox="0 0 2384 1706" fill="none">
      <path d="M623.501 1118.65C597.168 1041.98 458.801 883.151 116.001 861.151" stroke="#ED9B59" strokeWidth="2"/>
      <path d="M969.73 1086.65C964.137 1005.78 871.594 816.548 546.169 706.574" stroke="#ED9B59" strokeWidth="2"/>
    </svg>
  );
}
