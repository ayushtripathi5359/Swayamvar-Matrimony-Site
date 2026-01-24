export default function WebsiteFeatures() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="inline-block mb-5 px-5 py-1.5 text-sm font-medium text-[#5B6CFF] bg-[#EEF0FF] rounded-full">
              Website Features
            </span>

            <h2 className="text-[44px] leading-[1.12] font-bold text-[#111827] mb-5">
              Find Love Smarter. <br />
              Faster. Safer.
            </h2>

            <p className="text-gray-500 max-w-md text-base leading-relaxed">
              Discover smart tools designed to help you find your perfect
              life partner faster, safer, and smarter.
            </p>
          </div>

          {/* RIGHT FEATURE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* CARD */}
            <div className="flex items-center gap-5 bg-[#F7F7F7] rounded-[28px] px-3 py-3">
              <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-[#6B73C6] text-white text-2xl shrink-0">
                ⌘
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#111827] mb-1">
                  Instant Chat
                </h4>
                <p className="text-gray-500 text-base leading-snug">
                  Connect instantly <br /> with matches.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#F7F7F7] rounded-[28px] px-3 py-3">
              <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-[#6B73C6] text-white text-2xl shrink-0">
                ☰
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#111827] mb-1">
                  Advanced Search
                </h4>
                <p className="text-gray-500 text-base leading-snug">
                  Filter by age, city, <br /> profession.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#F7F7F7] rounded-[28px] px-3 py-3">
              <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-[#6B73C6] text-white text-2xl shrink-0">
                ☆
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#111827] mb-1">
                  Interest & Shortlist
                </h4>
                <p className="text-gray-500 text-base leading-snug">
                  Send interests, <br /> shortlist profiles.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#F7F7F7] rounded-[28px] px-3 py-3">
              <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-[#6B73C6] text-white text-2xl shrink-0">
                ⦿
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#111827] mb-1">
                  Privacy Controls
                </h4>
                <p className="text-gray-500 text-base leading-snug">
                  Hide profile, <br /> control visibility.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#F7F7F7] rounded-[28px] px-3 py-3">
              <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-[#6B73C6] text-white text-2xl shrink-0">
                ✓
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#111827] mb-1">
                  Verified Profiles
                </h4>
                <p className="text-gray-500 text-base leading-snug">
                  All profiles are <br /> manually verified.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#F7F7F7] rounded-[28px] px-3 py-3">
              <div className="w-[64px] h-[64px] flex items-center justify-center rounded-2xl bg-[#6B73C6] text-white text-2xl shrink-0">
                ★
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#111827] mb-1">
                  Premium Membership
                </h4>
                <p className="text-gray-500 text-base leading-snug">
                  Unlock contact details, <br /> priority listing.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
