import React from "react";
import {
  Heart,
  Star,
  Phone,
  Calendar,
  Ruler,
  Droplet,
  User,
  Briefcase,
  GraduationCap,
  Users,
  Flame,
  MapPin,
  Mail,
  ChevronRight,
  ShieldCheck,
  Languages,
  BadgeIndianRupee,
  Music
} from "lucide-react";

export default function ProfilePage() {
  // Custom soft glowing shadow effect
  const glowStyle = {
    boxShadow: "0 10px 40px -10px rgba(145, 129, 238, 0.15), 0 0 20px rgba(253, 248, 251, 0.5)"
  };

  return (
    <div className="min-h-screen bg-[#FDF8FB]  md:px-4 mb-20 lg:mb-0 py-6 text-[14px] text-slate-700 font-['Plus_Jakarta_Sans',_sans-serif]">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ================= HERO SECTION ================= */}
        <div 
          className="bg-white rounded-3xl p-6 border border-pink-50 flex flex-col lg:flex-row gap-6 items-center lg:items-start relative overflow-hidden"
          style={glowStyle}
        >

          {/* Placeholder for Ananya's Image */}
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Ananya"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-rose-50 shadow-md"
          />

          <div className="flex-1 text-center lg:text-left space-y-3 z-10">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">
                  ANANYA KULKARNI
                </h1>
                <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase w-fit mx-auto md:mx-0">
                  ID: 55892
                </span>
              </div>
              <p className="text-rose-600 font-semibold text-base mt-1">
                Data Scientist <span className="text-slate-300 mx-1">|</span> Bangalore
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full bg-[#9181EE] hover:bg-[#7b6fd6] text-white font-medium transition-all shadow-lg active:scale-95">
                <Heart size={16} fill="white" /> Send Interest
              </button>
              <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all">
                <Star size={16} /> Shortlist
              </button>
              {/* <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all">
                <Phone size={16} /> Contact
              </button> */}
            </div>

            <div className="flex justify-center lg:justify-start gap-5 text-sm text-slate-500 font-medium tracking-tight">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-rose-400" /> 26 yrs</span>
              <span className="flex items-center gap-1.5"><Ruler size={14} className="text-rose-400" /> 5'4"</span>
              <span className="flex items-center gap-1.5"><Droplet size={14} className="text-rose-400" /> B+</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">

            <Section title="About Me" glow={glowStyle}>
              <p className="leading-relaxed text-slate-600 italic font-medium">
                "I am an inquisitive soul who finds joy in the intersection of data and human behavior. 
                I enjoy classical music, exploring hidden hiking trails, and am a firm believer in conscious living. 
                I am looking for someone who values growth, intellectual curiosity, and a kind heart."
              </p>
            </Section>

            <Section title="Personal Information" glow={glowStyle}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <Info label="Date of Birth" value="22 Oct 1999 (26y 3m)" icon={<Calendar size={14}/>} />
                <Info label="Marital Status" value="Never Married" icon={<ShieldCheck size={14}/>} />
                <Info label="Mother Tongue" value="Marathi" icon={<Languages size={14}/>} />
                <Info label="Height" value="5' 4''" icon={<Ruler size={14}/>} />
                <Info label="Blood Group" value="B Positive" icon={<Droplet size={14}/>} />
                <Info label="Annual Income" value="₹25–35 LPA" icon={<BadgeIndianRupee size={14}/>} />
              </div>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                icon={<GraduationCap size={20} className="text-white" />}
                iconBg="bg-indigo-400"
                title="Education"
                value="M.S. in Data Analytics"
                sub="Indian Institute of Science (IISc), Bangalore"
                glow={glowStyle}
              />
              <DetailCard
                icon={<Briefcase size={20} className="text-white" />}
                iconBg="bg-rose-400"
                title="Career"
                value="Senior Data Scientist"
                sub="Microsoft R&D Center, Bangalore"
                glow={glowStyle}
              />
            </div>

            <Section title="Family Details" glow={glowStyle}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-200  shadow-sm">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Father</p>
                    <p className="font-bold text-slate-800 text-base uppercase tracking-tight">DR. VINAYAK</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      Senior Consultant Cardiologist. Retired from Govt. Medical College. Currently running a private clinic in Nashik.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-rose-200 shadow-sm">
                    <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Mother</p>
                    <p className="font-bold text-slate-800 text-base uppercase tracking-tight">MRS. SUNITA</p>
                    <p className="text-xs text-slate-600 mt-2 font-medium italic tracking-tight">M.A. Literature, Senior Professor (Retd).</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">
                    <span>Brothers: <b className="text-slate-700">1 (Unmarried)</b></span>
                    <span>Sisters: <b className="text-slate-700">0</b></span>
                  </div>
                  <div className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1 text-[9px]">Brother Details</p>
                    <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                      <b>Rohan (MBA):</b> Product Manager at Google, Hyderabad. Pursued MBA from IIM Ahmedabad.
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6">

            <Section title="Contact Details" glow={glowStyle}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-rose-50 p-2 rounded-lg text-rose-500 shadow-sm"><Mail size={16} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Email ID</p>
                    <p className="text-xs font-semibold truncate w-40 tracking-tighter">ananya.kulk••••@outlook.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-700">
                  <div className="bg-green-50 p-2 rounded-lg text-green-500 shadow-sm"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">WhatsApp No</p>
                    <p className="text-xs font-semibold">+91-98234••••</p>
                  </div>
                </div>
                <button className="w-full bg-[#9181EE] text-white py-3 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                  REQUEST CONTACT
                </button>
              </div>
            </Section>

            <Section title="Kundali" glow={glowStyle}>
              <div className="grid grid-cols-2 gap-4">
                <Info label="Birth Time" value="10:15 AM" icon={<Flame size={14} className="text-orange-400"/>} />
                <Info label="Birth Place" value="Nashik" icon={<MapPin size={14} className="text-rose-400"/>} />
              </div>
            </Section>

            <Section title="Ideal Partner" glow={glowStyle}>
              <div className="space-y-3">
                <ExpectItem label="Age Range" value="26 to 29 years" />
                <ExpectItem label="Education" value="IIM/IIT/IISc Postgraduates Preferred" />
                <ExpectItem label="Location" value="Bangalore / Hyderabad / Pune" />
                <ExpectItem label="Interests" value="Travel, Fitness, Fine Arts" />
                <ExpectItem label="Height" value="Above 5' 8''" />
              </div>
            </Section>

            <Section title="Location" glow={glowStyle}>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-rose-400 mt-1" />
                <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                  Prestige Shantiniketan, ITPL Main Road, Whitefield, Bangalore, Karnataka.
                </p>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 p-3 z-50">
  <div className="flex gap-3">
    
    {/* Shortlist */}
    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform">
      <Star size={16} /> Shortlist
    </button>

    {/* Send Interest */}
    <button className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#9181EE] text-white font-bold shadow-lg active:scale-95 transition-transform">
      <Heart size={18} fill="white" /> Send Interest
    </button>

  </div>
</div>

    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */

function Section({ title, children, glow }) {
  return (
    <div 
      className="bg-white rounded-2xl p-5 border border-pink-50"
      style={glow}
    >
      <h2 className="text-sm font-black uppercase tracking-wider mb-4 text-slate-800 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex flex-col group">
      <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1 group-hover:text-rose-400 transition-colors tracking-tight">
        {icon} {label}
      </p>
      <p className="font-bold text-slate-700 text-sm leading-tight tracking-tight">
        {value}
      </p>
    </div>
  );
}

function DetailCard({ icon, iconBg, title, value, sub, glow }) {
  return (
    <div 
      className="bg-white rounded-2xl p-5 border border-slate-50 flex gap-4 items-start hover:border-rose-100 transition-colors duration-300"
      style={glow}
    >
      <div className={`${iconBg} p-3 rounded-2xl shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5 tracking-widest">{title}</p>
        <p className="font-bold text-slate-800 text-sm leading-tight tracking-tight">{value}</p>
        <p className="text-[11px] text-slate-500 mt-1 leading-tight tracking-tight">{sub}</p>
      </div>
    </div>
  );
}

function ExpectItem({ label, value }) {
  return (
    <div className="border-b border-slate-50 pb-2 last:border-0 hover:bg-slate-50/50 transition-all px-1 duration-200">
      <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mb-0.5">{label}</p>
      <div className="flex justify-between items-center gap-2">
        <p className="text-xs font-bold text-slate-700 leading-tight tracking-tight">{value}</p>
        <ChevronRight size={12} className="text-slate-200 shrink-0" />
      </div>
    </div>
  );
}