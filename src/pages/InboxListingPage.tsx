import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiFetch } from "@/lib/apiClient";

const MOCK_PROFILES = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: "Saiteja G",
  age: 27,
  location: "Aurangabad",
  education: "Mechanical Engineering",
  profession: "Engineer",
  lastActive: "1 hour ago",
  status: "received", // received | accepted | sent | declined
}));

export default function InboxListingPage() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [activeTab, setActiveTab] = useState("received");
  const [search, setSearch] = useState("");

  /* ---------------- TAB COUNTS ---------------- */
  const counts = {
    received: profiles.filter(p => p.status === "received").length,
    accepted: profiles.filter(p => p.status === "accepted").length,
    sent: profiles.filter(p => p.status === "sent").length,
    declined: profiles.filter(p => p.status === "declined").length,
  };

  /* ---------------- ACTION HANDLERS ---------------- */
  const updateStatus = (id, status) => {
    setProfiles(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
  };

  /* ---------------- FILTERED LIST ---------------- */
  const filteredProfiles = profiles.filter(p =>
    p.status === activeTab &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search))
  );

  return (
    <>
      <Navbar />

      <section className="bg-white min-h-screen py-16 pt-24">
        <div className="max-w-[1300px] mx-auto px-4">

          {/* TITLE */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#111827]">
              My Matches
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Discover profiles that are interested in you
            </p>
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
          {filteredProfiles.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No profiles found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProfiles.map(profile => (
                <div
                  key={profile.id}
                  className="bg-white rounded-3xl p-5 shadow-md"
                >
                  <div className="flex gap-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="profile"
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-medium text-[#111827] text-sm">
                        {profile.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ({profile.age}), {profile.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {profile.education}
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        Last Active: {profile.lastActive}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between mt-4 text-sm">
                    {activeTab === "received" && (
                      <>
                        <button
                          onClick={() => updateStatus(profile.id, "accepted")}
                          className="text-[#5B6CFF] font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(profile.id, "declined")}
                          className="text-gray-500"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {activeTab !== "received" && (
                      <span className="text-gray-400 capitalize">
                        {profile.status}
                      </span>
                    )}

                    <button className="text-gray-500">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
