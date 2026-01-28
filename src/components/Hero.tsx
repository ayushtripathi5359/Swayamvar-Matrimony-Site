export default function Hero() {
  return (
    <section className="px-4 mt-6 md:mt-12">
      <div
        className="max-w-[1337px] mx-auto rounded-[32px] border-2 border-[#F2F2F2] bg-[rgba(252,246,247,0.70)] px-6 md:px-10 py-10 md:py-20 relative overflow-hidden"
        style={{ boxShadow: "0 4px 20px 0 rgba(238, 15, 50, 0.25)" }}
      >
        <div className="max-w-[1260px] mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h1 className="font-jakarta font-bold text-4xl md:text-5xl lg:text-[62px] leading-tight md:leading-[72px] text-[#0F0202]">
                Building Meaningful Connections
              </h1>
              <p className="font-jakarta font-medium text-lg md:text-xl leading-relaxed md:leading-[30px] text-[#2C2C2C]">
                We are a modern matrimonial platform that helps individuals and
                families find compatible life partners with trust, tradition,
                and smart matchmaking.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2.5 px-10 md:px-[60px] py-2.5 rounded-[30px] bg-black text-white font-jakarta font-medium text-lg leading-[26px] h-[46px] w-full md:w-auto md:min-w-[360px] hover:bg-gray-900 transition-colors">
              Explore Matches
            </button>
          </div>

          {/* Right Content - Image Grid */}
          <div className="flex gap-4 md:gap-[30px] justify-center lg:justify-end mt-8 lg:mt-0">
            {/* Left Column - Two stacked images */}
            <div className="flex flex-col gap-3 md:gap-[20px]">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/89d1ab6ef305852a9d8d41eebad318f1efe04c95?width=586"
                alt="Couple"
                className="w-full md:w-[293px] h-auto md:h-[198px] aspect-[3/2] rounded-[20px] md:rounded-[30px] object-cover"
              />
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/78059a0fcafad8d7a0342b9b51ad982284170357?width=586"
                alt="Ring"
                className="w-full md:w-[293px] h-auto md:h-[198px] aspect-[3/2] rounded-[20px] md:rounded-[30px] object-cover"
              />
            </div>

            {/* Right Column - Single tall image */}
            <div>
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/ed4cbdbcff3b35f05eb7b36160b0088ed9a3835a?width=584"
                alt="Portrait"
                className="w-full md:w-[292px] h-full md:h-[416px] rounded-[20px] md:rounded-[30px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
