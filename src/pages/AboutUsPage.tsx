import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function AboutUsPage() {
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
          <Hero />
          <HowItWorks />
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