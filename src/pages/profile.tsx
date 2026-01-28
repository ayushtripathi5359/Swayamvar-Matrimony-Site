import React, { useEffect, useState } from "react";
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
  Music,
  Edit3,
  Instagram,
  Linkedin,
  Facebook,
  Home,
  DollarSign,
  Award,
  Building,
  Clock,
  BookOpen,
  Globe,
  MessageCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/apiClient";

interface ProfileData {
  _id?: string;
  fullName?: string;
  age?: string;
  occupation?: string;
  jobLocation?: string;
  profilePhotos?: { western?: string; traditional?: string };
  aboutMe?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  gender?: string;
  motherTongue?: string;
  complexion?: string;
  height?: string;
  bloodGroup?: string;
  firstGotra?: string;
  secondGotra?: string;
  highestEducation?: string;
  collegeUniversity?: string;
  designation?: string;
  organization?: string;
  annualIncome?: string;
  currentEducation?: string;
  otherOccupation?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch("/api/profile/me");
        if (!response.ok) {
          const data = await response.json();
          setLoadError(data.message || "Unable to load profile.");
          return;
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setLoadError("Unable to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const displayProfile = {
    fullName: profile?.fullName || "ANANYA KULKARNI",
    profileId: profile?._id || "55892",
    age: profile?.age || "26",
    occupation: profile?.occupation || "Data Scientist",
    jobLocation: profile?.jobLocation || "Bangalore",
    profilePhoto:
      profile?.profilePhotos?.traditional ||
      profile?.profilePhotos?.western ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    aboutMe:
      profile?.aboutMe ||
      "\"I am an inquisitive soul who finds joy in the intersection of data and human behavior. I enjoy classical music, exploring hidden hiking trails, and am a firm believer in conscious living. I am looking for someone who values growth, intellectual curiosity, and a kind heart.\"",
    dateOfBirth: profile?.dateOfBirth || "22 Oct 1999",
    maritalStatus: profile?.maritalStatus || "Never Married",
    gender: profile?.gender || "Female",
    motherTongue: profile?.motherTongue || "Marathi",
    complexion: profile?.complexion || "Fair",
    height: profile?.height || "5' 4''",
    bloodGroup: profile?.bloodGroup || "B Positive",
    firstGotra: profile?.firstGotra || "Shrishal",
    secondGotra: profile?.secondGotra || "Pabhal",
    highestEducation: profile?.highestEducation || "M.S. in Data Analytics",
    collegeUniversity: profile?.collegeUniversity || "Indian Institute of Science (IISc), Bangalore",
    designation: profile?.designation || "Senior Data Scientist",
    organization: profile?.organization || "Microsoft R&D Center",
    annualIncome: profile?.annualIncome || "₹25-35 LPA",
    currentEducation: profile?.currentEducation || "N/A",
    otherOccupation: profile?.otherOccupation || "Specialized in ML algorithms"
  };

  // Custom soft glowing shadow effect
  const glowStyle = {
    boxShadow: "0 10px 40px -10px rgba(145, 129, 238, 0.15), 0 0 20px rgba(253, 248, 251, 0.5)"
  };

  return (
    <div className="min-h-screen bg-[#FDF8FB] md:px-4 mb-20 lg:mb-0 py-6 text-[14px] text-slate-700 font-['Plus_Jakarta_Sans',_sans-serif]">
      <Navbar />
      <div className="max-w-5xl mt-14 sm:mt-20 mx-auto space-y-6">
        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-semibold">
            {loadError}
          </div>
        )}
        

        {/* ================= HERO SECTION ================= */}
        <div 
          className="bg-white rounded-3xl p-6 border border-pink-50 flex flex-col lg:flex-row gap-6 items-center lg:items-start relative overflow-hidden"
          style={glowStyle}
        >

          {/* Placeholder for Ananya's Image */}
          <img
            src={displayProfile.profilePhoto}
            alt={displayProfile.fullName}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-rose-50 shadow-md"
          />

          <div className="flex-1 text-center lg:text-left space-y-3 z-10">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">
                  {displayProfile.fullName}
                </h1>
                <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase w-fit mx-auto md:mx-0">
                  ID: {displayProfile.profileId}
                </span>
              </div>
              <p className="text-rose-600 font-semibold text-base mt-1">
                {displayProfile.occupation} <span className="text-slate-300 mx-1">|</span> {displayProfile.jobLocation}
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full bg-[#9181EE] hover:bg-[#7b6fd6] text-white font-medium transition-all shadow-lg active:scale-95">
                <Heart size={16} fill="white" /> Send Interest
              </button>
              <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all">
                <Star size={16} /> Shortlist
              </button>
              <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all">
                <Edit3 size={16} /> Edit Profile
              </button>
            </div>

            <div className="flex justify-center lg:justify-start gap-5 text-sm text-slate-500 font-medium tracking-tight">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-rose-400" /> {displayProfile.age} yrs</span>
              <span className="flex items-center gap-1.5"><Ruler size={14} className="text-rose-400" /> {displayProfile.height}</span>
              <span className="flex items-center gap-1.5"><Droplet size={14} className="text-rose-400" /> {displayProfile.bloodGroup}</span>
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-rose-400" /> {displayProfile.motherTongue}</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">

            <Section title="About Me" glow={glowStyle}>
              <p className="leading-relaxed text-slate-600 italic font-medium">
                {displayProfile.aboutMe}
              </p>
            </Section>

            <Section title="Personal Information" glow={glowStyle}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <Info label="Date of Birth" value={displayProfile.dateOfBirth} icon={<Calendar size={14}/>} />
                <Info label="Age" value={`${displayProfile.age} years`} icon={<Calendar size={14}/>} />
                <Info label="Marital Status" value={displayProfile.maritalStatus} icon={<ShieldCheck size={14}/>} />
                <Info label="Gender" value={displayProfile.gender} icon={<User size={14}/>} />
                <Info label="Mother Tongue" value={displayProfile.motherTongue} icon={<Languages size={14}/>} />
                <Info label="Complexion" value={displayProfile.complexion} icon={<Droplet size={14}/>} />
                <Info label="Height" value={displayProfile.height} icon={<Ruler size={14}/>} />
                <Info label="Blood Group" value={displayProfile.bloodGroup} icon={<Droplet size={14}/>} />
                <Info label="First Gotra" value={displayProfile.firstGotra} icon={<Flame size={14} className="text-orange-400"/>} />
                <Info label="Second Gotra" value={displayProfile.secondGotra} icon={<Flame size={14} className="text-orange-400"/>} />
              </div>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                icon={<GraduationCap size={20} className="text-white" />}
                iconBg="bg-indigo-400"
                title="Education"
                value={displayProfile.highestEducation}
                sub={displayProfile.collegeUniversity}
                glow={glowStyle}
              />
              <DetailCard
                icon={<Briefcase size={20} className="text-white" />}
                iconBg="bg-rose-400"
                title="Career"
                value={displayProfile.designation}
                sub={`${displayProfile.organization} | ${displayProfile.annualIncome}`}
                glow={glowStyle}
              />
            </div>

            {/* Job Details Section - MISSING FROM ORIGINAL */}
            <Section title="Job Details" glow={glowStyle}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Designation" value={displayProfile.designation} icon={<Award size={14}/>} />
                <Info label="Organization" value={displayProfile.organization} icon={<Building size={14}/>} />
                <Info label="Annual Income" value={displayProfile.annualIncome} icon={<DollarSign size={14}/>} />
                <Info label="Job Location" value={displayProfile.jobLocation} icon={<MapPin size={14}/>} />
                <Info label="Current Education" value={displayProfile.currentEducation} icon={<BookOpen size={14}/>} />
                <Info label="Other Details" value={displayProfile.otherOccupation} icon={<MessageCircle size={14}/>} />
              </div>
            </Section>

            <Section title="Family Details" glow={glowStyle}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-200 shadow-sm">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Father</p>
                    <p className="font-bold text-slate-800 text-base uppercase tracking-tight">DR. VINAYAK KULKARNI</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      Senior Consultant Cardiologist. Retired from Govt. Medical College. Currently running a private clinic in Nashik.
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Info label="Occupation" value="Doctor" icon={<Briefcase size={10}/>} />
                      <Info label="Business" value="Private Clinic" icon={<Home size={10}/>} />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-rose-200 shadow-sm">
                    <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Mother</p>
                    <p className="font-bold text-slate-800 text-base uppercase tracking-tight">MRS. SUNITA KULKARNI</p>
                    <p className="text-xs text-slate-600 mt-2 font-medium italic tracking-tight">M.A. Literature, Senior Professor (Retd).</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Info label="Occupation" value="Professor" icon={<Briefcase size={10}/>} />
                      <Info label="Status" value="Retired" icon={<User size={10}/>} />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">
                    <span>Brothers: <b className="text-slate-700">1 (Unmarried)</b></span>
                    <span>Sisters: <b className="text-slate-700">0</b></span>
                  </div>
                  
                  {/* Brother 1 Details */}
                  <div className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm mb-3">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Brother 1 Details</p>
                    <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                      <b>Rohan Kulkarni (MBA, Unmarried):</b> Product Manager at Google, Hyderabad. Pursued MBA from IIM Ahmedabad.
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Info label="Occupation" value="Product Manager" icon={<Briefcase size={10}/>} />
                      <Info label="Company" value="Google, Hyderabad" icon={<Building size={10}/>} />
                    </div>
                  </div>

                  {/* Brother 2 Details (Example) */}
                  <div className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Brother 2 Details</p>
                    <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                      <b>Rahul Kulkarni (Married):</b> Business Owner in Mumbai. Married to Priya (Software Engineer).
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Info label="Occupation" value="Business Owner" icon={<Briefcase size={10}/>} />
                      <Info label="Location" value="Mumbai" icon={<MapPin size={10}/>} />
                    </div>
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
                    <p className="text-xs font-semibold truncate tracking-tighter">ananya.kulk••••@outlook.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-slate-700">
                  <div className="bg-green-50 p-2 rounded-lg text-green-500 shadow-sm"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">WhatsApp No</p>
                    <p className="text-xs font-semibold">+91-98234••••</p>
                  </div>
                </div>
                
                {/* Social Media Links - MISSING FROM ORIGINAL */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-2">Social Media</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Linkedin size={14} className="text-blue-600" />
                      <span className="text-xs text-slate-600">linkedin.com/in/ananyakulkarni</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram size={14} className="text-pink-600" />
                      <span className="text-xs text-slate-600">@ananya_kulkarni</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook size={14} className="text-blue-700" />
                      <span className="text-xs text-slate-600">facebook.com/ananya.kulkarni</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-[#9181EE] text-white py-3 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all uppercase tracking-widest mt-2">
                  REQUEST CONTACT
                </button>
              </div>
            </Section>

            <Section title="Kundali Details" glow={glowStyle}>
              <div className="space-y-3">
                <Info label="Birth Name" value="Ananya" icon={<User size={14} className="text-indigo-400"/>} />
                <Info label="Birth Time" value="10:15 AM" icon={<Clock size={14} className="text-orange-400"/>} />
                <Info label="Birth Place" value="Nashik, Maharashtra" icon={<MapPin size={14} className="text-rose-400"/>} />
                <Info label="First Gotra" value="Shrishal" icon={<Flame size={14} className="text-orange-400"/>} />
                <Info label="Second Gotra" value="Pabhal" icon={<Flame size={14} className="text-orange-400"/>} />
              </div>
            </Section>

            <Section title="Ideal Partner Expectations" glow={glowStyle}>
              <div className="space-y-3">
                <ExpectItem label="Age Range" value="26 to 29 years" />
                <ExpectItem label="Education" value="IIM/IIT/IISc Postgraduates Preferred (CA/CS/MBA/Engineers)" />
                <ExpectItem label="Location" value="Bangalore / Hyderabad / Pune / Mumbai" />
                <ExpectItem label="Minimum Annual Income" value="₹25 LPA +" />
                <ExpectItem label="Height" value="Above 5' 8''" />
                <ExpectItem label="Marital Status" value="Never Married" />
                <ExpectItem label="Mother Tongue" value="Marathi Preferred" />
                <ExpectItem label="Interests" value="Travel, Fitness, Fine Arts, Technology" />
              </div>
            </Section>

            <Section title="Location & Lifestyle" glow={glowStyle}>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-rose-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Current Location</p>
                    <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                      Prestige Shantiniketan, ITPL Main Road, Whitefield, Bangalore, Karnataka - 560066
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Home size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Hometown</p>
                    <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                      Nashik, Maharashtra
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe size={16} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Willing to Relocate</p>
                    <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                      Yes, anywhere in India for the right partner
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 p-3 z-50">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform">
            <Edit3 size={16} /> Edit
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform">
            <Star size={16} /> Shortlist
          </button>
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
