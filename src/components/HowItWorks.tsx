export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description:
        "Sign up easily and create a detailed profile with personal, professional, and family information to help us understand you better.",
    },
    {
      number: "2",
      title: "Smart Matchmaking",
      description:
        "Our intelligent system suggests matches based on preferences, values, lifestyle, and compatibility to ensure meaningful connections.",
    },
    {
      number: "3",
      title: "Connect with Confidence",
      description:
        "Chat securely, involve your family if you wish, and move forward with complete privacy and 24/7 support.",
    },
  ];

  return (
    <section className="px-4 mt-12">
      <div className="max-w-[1337px] mx-auto rounded-[32px] bg-[rgba(252,246,247,0.70)] px-10 py-20">
        <h2 className="font-jakarta font-semibold text-[52px] leading-[62px] text-[#0F0202] text-center mb-16">
          How does Swayamwar work
        </h2>

        <div className="max-w-[1282px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Icon with Number */}
              <div className="w-[61px] h-[61px] rounded-[7px] bg-black flex items-center justify-center mb-6">
                <span className="font-outfit font-bold text-[54px] leading-[54px] text-[#FBF7F1]">
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-jakarta font-semibold text-2xl leading-[34px] text-[#0F0202] text-center mb-3 max-w-[300px]">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-jakarta font-normal text-lg leading-[26px] text-[#2C2C2C] text-center max-w-[400px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
