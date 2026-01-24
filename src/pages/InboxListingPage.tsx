import Navbar from "../components/Navbar";

export default function InboxListingPage() {
  const profiles = Array.from({ length: 9 });

  return (
    <>
      <Navbar />
      <section className="bg-white min-h-screen py-16 pt-24">
        <div className="max-w-[1200px] mx-auto px-4">

        {/* PAGE TITLE */}
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
              "Received (12)",
              "Accepted (0)",
              "Sent (0)",
              "Declined (20)",
            ].map((tab, i) => ( 
              <button
                key={i}
                className={`px-4 py-2 text-sm rounded-full transition ${
                  i === 0
                    ? "bg-white text-[#5B6CFF] shadow font-medium"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white shadow-sm rounded-full px-4 py-3 flex flex-wrap gap-3 items-center justify-center mb-12">
          <input
            type="text"
            placeholder="Search by Name or ID"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {profiles.map((_, i) => (
            <div
              key={i}
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
                    Saiteja G
                  </h3>
                  <p className="text-xs text-gray-500">
                    (27), Aurangabad
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Mechanical Engineering GEV DOC Life Cycle Operati…
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Last Active: 1 hour ago
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between mt-4 text-sm">
                <button className="text-[#5B6CFF] font-medium">
                  Accept
                </button>
                <button className="text-gray-500">
                  Decline
                </button>
                <button className="text-gray-500">
                  View Profile
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
    </>
  );
}
