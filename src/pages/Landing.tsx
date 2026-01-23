import { Mail, Menu, Bell, Heart, Star, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import couple1 from "@/assets/couple1.png"
import FindPerfectBride from "@/components/FindPerfectBride"
import Navbar from "@/components/Navbar"
import { Link } from "react-router-dom";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white font-jakarta selection:bg-pink-100 antialiased relative">
      {/* <SplashScreen isVisible={isLoading} /> */}

      {/* Background Pattern Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 238, 240, 0.1)" }} />
        <BackgroundPatterns />
      </div>

      <main className="relative z-10 max-w-[1512px] mx-auto px-2 md:px-9 py-4">
        <div className="rounded-[32px] bg-white overflow-hidden relative shadow-sm border border-slate-50 min-h-[calc(100vh-40px)]">
          
          <Navbar />

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen lg:min-h-[900px] overflow-hidden">

  {/* Left Content Column */}
  <div className="px-5 sm:px-8 md:px-12 lg:px-[71px] pt-16 sm:pt-20 lg:pt-[100px] pb-12 sm:pb-16 flex flex-col justify-start">
  <div className="max-w-[583px] mx-auto lg:mx-0 text-center lg:text-left">

    {/* Tagline */}
    <p className="text-[#ED9B59] font-bold text-xs sm:text-sm my-3 sm:mb-4 tracking-wide">
      Because you deserve better!
    </p>

    {/* Heading */}
    <h1 className="font-bold text-[26px] sm:text-[34px] md:text-[42px] lg:text-[58px] leading-[1.1] lg:leading-[1.15] tracking-tight mb-3 sm:mb-6 text-brand-black">
      Get noticed for <span className="text-[#ED9B59]">who</span> you are,{" "}
      <span className="text-[#ED9B59]">not what</span> you look like.
    </h1>

    {/* Description */}
    <p className="text-brand-black-soft/70 text-sm sm:text-base lg:text-xl leading-[1.6] mb-6 sm:mb-10">
      You're more than just a photo. You have stories to tell, and passions to share.
      Because you deserve what dating deserves: better.
    </p>

    {/* Email Form */}
    <form
      onSubmit={handleSubmit}
      className="relative mb-10 sm:mb-12 group max-w-md mx-auto lg:mx-0"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-[40px] opacity-20 bg-brand-black-soft blur-lg group-focus-within:opacity-40 transition-opacity" />

      <div className="relative bg-white rounded-[28px] sm:rounded-[40px] flex flex-row items-center px-2 sm:px-3 py-2 sm:py-0 gap-3 border border-slate-100 shadow-sm">
        {/* Input */}
        <div className="flex items-center w-full px-2">
          <Mail className="w-5 h-5 text-brand-black-soft/30 mr-3 shrink-0" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-none outline-none text-brand-black-soft placeholder:text-brand-black-soft/30 text-sm sm:text-base"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-[60%] sm:w-auto bg-[#ED9B59] hover:bg-orange-500 active:scale-95 transition-all text-white font-bold text-sm sm:text-base px-6 sm:px-11 h-[44px] sm:h-[50px] rounded-full whitespace-nowrap"
        >
          Get Started
        </button>
      </div>

      {submitted && (
        <div className="absolute -bottom-7 left-1/2 lg:left-6 -translate-x-1/2 lg:translate-x-0 text-[#ED9B59] font-medium text-xs sm:text-sm animate-fade-in">
          ✓ Thanks! Check your email to get started.
        </div>
      )}
    </form>

    {/* Mobile Illustration */}
    <img
      src={couple1}
      alt="Couple"
      className="w-[90%]  mx-auto block lg:hidden h-auto -mt-20 "
    />

    {/* Statistics */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-12 text-center -mt-10 lg:mt-10">
      <StatItem
        label="Dates and matches made everyday"
        value="15k+"
      />

      <StatItem
        label="New members signup every day"
        value="1,456"
        orange
      />

      {/* Full width on mobile */}
      <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1 ">
        <StatItem
          label="Members from around the world"
          value="1M+"
        />
      </div>
    </div>

  </div>
</div>


  {/* Right Illustration Column */}
  <div className="hidden lg:block relative flex items-center justify-center bg-[#FDF8FB] lg:bg-white py-10 sm:py-12 lg:py-0">
    <div className="relative w-full max-w-[520px] sm:max-w-[600px] aspect-square lg:h-full flex items-center justify-center">

      <DecorativeItems />

      <div className="relative  w-full px-6 sm:px-8 lg:px-0">
        <img
          src={couple1}
          alt="Couple"
          className="w-full h-auto object-contain drop-shadow-2xl scale-105 sm:scale-110 lg:scale-110 mb-40"
        />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[50px] sm:h-[60px] bg-slate-200/30 blur-3xl -z-10" />
      </div>
    </div>
  </div>

</div>

        </div>
        <FindPerfectBride></FindPerfectBride>
      </main>
      
    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */

function StatItem({
  label,
  value,
  orange = false,
}: {
  label: string;
  value: string;
  orange?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl px-4 py-5 sm:px-6 sm:py-6 shadow-sm h-full flex flex-col justify-center">
      <div
        className={`font-bold text-[28px] sm:text-[32px] md:text-[56px] leading-none tracking-tight mb-2 ${
          orange ? "text-[#ED9B59]" : "text-brand-black-soft"
        }`}
      >
        {value}
      </div>

      <p className="text-brand-black-soft text-[11px] sm:text-xs md:text-sm font-medium opacity-70 leading-snug">
        {label}
      </p>
    </div>
  );
}


function SplashScreen({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
         <span className="text-white text-3xl font-black">+</span>
      </div>
      <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-8">Swayamvar</h2>
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-orange animate-loading-bar w-full" />
      </div>
    </div>
  );
}

function DecorativeItems() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className="absolute top-[10%] left-[10%] bg-white p-3 rounded-2xl shadow-xl"><Heart size={24} className="text-rose-500" fill="currentColor" /></div>
      <div className="absolute bottom-[20%] right-[10%] bg-white p-3 rounded-2xl shadow-xl"><Star size={24} className="text-amber-500" fill="currentColor" /></div>
    </div>
  );
}

function BackgroundPatterns() {
  return (
    <svg className="absolute -left-[500px] -top-[50px] opacity-10" width="2384" height="1706" viewBox="0 0 2384 1706" fill="none">
      <path d="M623.501 1118.65C597.168 1041.98 458.801 883.151 116.001 861.151" stroke="#ED9B59" strokeWidth="2"/>
      <path d="M969.73 1086.65C964.137 1005.78 871.594 816.548 546.169 706.574" stroke="#ED9B59" strokeWidth="2"/>
    </svg>
  );
}