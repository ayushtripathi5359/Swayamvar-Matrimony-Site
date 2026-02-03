import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "@/lib/apiClient";

interface InterestProfile {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const endpoint = activeTab === "received" || activeTab === "accepted" || activeTab === "declined"
          ? "/api/interests/received"
          : "/api/interests/sent";
        
        const status = activeTab === "received" ? "sent" : activeTab;
        const response = await apiFetch(`${endpoint}?status=${status}&limit=50`);
        
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
    sent: stats?.sent.pending || 0,
    declined: stats?.received.declined || 0,
  };

  /* ---------------- FILTERED LIST ---------------- */
  const filteredInterests = interests.filter(interest => {
    const profile = activeTab === "sent" ? interest.receiverProfileId : interest.senderProfileId;
    const name = profile?.fullName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || '';
    
    return name.toLowerCase().includes(search.toLowerCase()) ||
           interest._id.includes(search);
  });

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
    <>
      <Navbar />

      <section className="bg-white min-h-screen py-16 pt-24">
        <div className="max-w-[1300px] mx-auto px-4">

          {/* TITLE */}
           <div className="text-center mb-10">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="font-bold text-[28px] sm:text-[34px] lg:text-[42px] leading-tight tracking-tight text-slate-900 mb-2">
                My <span className="text-[#ED9B59]">Matches</span>
              </h1>
              <p className="text-slate-600 text-base lg:text-lg">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-[#F4F5FF] rounded-full p-1 gap-1">
              {[
                ["received", `Received (${counts.received})`],
                ["accepted", `Accepted (${counts.accepted})`],
                ["sent", `Sent (${counts.sent})`],
                ["declined", `Declined (${counts.declined})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 text-sm rounded-full transition ${
                    activeTab === key
                      ? "bg-white text-[#5B6CFF] shadow font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="bg-white shadow-sm rounded-full px-4 py-3 flex flex-wrap gap-3 items-center justify-center mb-12">
            <input
              type="text"
              placeholder="Search by Name or ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-full border text-sm outline-none"
            />

            {["Location", "Education", "Profession", "Last Active"].map(
              (item, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-full border text-sm text-gray-600 hover:bg-gray-50"
                >
                  {item}
                </button>
              )
            )}

            <button className="px-6 py-2 rounded-full bg-[#5B6CFF] text-white text-sm font-medium">
              Search
            </button>
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
          ) : filteredInterests.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <div className="text-6xl mb-4">💌</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeTab === "received" ? "No interests received yet" :
                 activeTab === "sent" ? "No interests sent yet" :
                 `No ${activeTab} interests`}
              </h3>
              <p className="text-gray-500">
                {activeTab === "sent" 
                  ? "Start browsing profiles and send interests to connect with potential matches!"
                  : "Interests will appear here when other members show interest in your profile."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInterests.map(interest => {
                const profile = activeTab === "sent" ? interest.receiverProfileId : interest.senderProfileId;
                const displayName = profile?.fullName || 
                                  `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 
                                  'Unknown User';
                const photoUrl = profile?.photos?.traditional?.url || 
                               profile?.photos?.western?.url || 
                               "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200";

                return (
                  <div
                    key={interest._id}
                    className="bg-white rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4">
                      <img
                        src={photoUrl}
                        alt="profile"
                        className="w-14 h-14 rounded-xl object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-[#111827] text-sm">
                          {displayName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {profile?.age && `(${profile.age})`} {profile?.jobLocation && `, ${profile.jobLocation}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {profile?.occupation || 'Occupation not specified'}
                        </p>
                        <p className="text-xs text-blue-500 mt-1">
                          {formatTimeAgo(interest.sentAt)}
                        </p>
                      </div>
                    </div>

                    {/* Message Preview */}
                    {interest.message && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 italic">
                          "{interest.message.length > 100 ? 
                            `${interest.message.substring(0, 100)}...` : 
                            interest.message}"
                        </p>
                      </div>
                    )}

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

                    {/* ACTIONS */}
                    <div className="flex justify-between mt-4 text-sm">
                      {activeTab === "received" && interest.status === 'sent' && (
                        <>
                          <button
                            onClick={() => handleInterestResponse(interest._id, 'accepted')}
                            className="text-[#5B6CFF] font-medium hover:underline"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleInterestResponse(interest._id, 'declined')}
                            className="text-gray-500 hover:underline"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {activeTab === "sent" && interest.status === 'sent' && (
                        <button
                          onClick={() => handleWithdrawInterest(interest._id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Withdraw
                        </button>
                      )}

                      <button 
                        onClick={() => navigate(`/profile/${profile?._id}`)}
                        className="text-gray-500 hover:underline ml-auto"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
