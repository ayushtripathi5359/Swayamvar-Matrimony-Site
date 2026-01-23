import ProfileCard from "@/components/ProfileCard";

export default function FindPerfectBride() {
  const profiles = Array.from({ length: 8 });

  return (
    <section className="bg-white pb-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4">

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

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {profiles.map((_, index) => (
            <ProfileCard key={index} />
          ))}
        </div>

        {/* Mobile Pagination */}
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

      </div>
    </section>
  );
}
