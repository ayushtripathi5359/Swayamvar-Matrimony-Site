import { useEffect, useState } from "react";
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
  Flame,
  MapPin,
  Mail,
  ChevronRight,
  ShieldCheck,
  Languages,
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
  MessageCircle,
  Send,
  Check,
  Download
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/apiClient";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProfileData {
  _id?: string;
  userId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string; // Keep for backward compatibility
  age?: string;
  occupation?: string;
  jobLocation?: string;
  photos?: { 
    western?: { url?: string }; 
    traditional?: { url?: string }; 
  };
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
  education?: string;
  highestEducation?: string;
  collegeUniversity?: string;
  designation?: string;
  organization?: string;
  annualIncome?: string;
  currentEducation?: string;
  otherOccupation?: string;
  whatsappNumber?: string;
  emailId?: string;
  linkedinHandle?: string;
  instagramHandle?: string;
  facebookHandle?: string;
  fathersFullName?: string;
  fathersOccupation?: string;
  mothersFullName?: string;
  mothersOccupation?: string;
  brothers?: Array<{
    name?: string;
    occupation?: string;
    companyName?: string;
    currentEducation?: string;
    otherOccupation?: string;
  }>;
  sisters?: Array<{
    name?: string;
    occupation?: string;
    companyName?: string;
    currentEducation?: string;
    otherOccupation?: string;
  }>;
  birthName?: string;
  birthTime?: string;
  birthPlace?: string;
  currentAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  permanentAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  socialMedia?: Array<{
    platform?: string;
    url?: string;
  }>;
  partnerPreferences?: {
    ageRange?: { min?: number; max?: number };
    qualifications?: string[];
    locations?: string[];
    minIncome?: string;
    heightRange?: { min?: string; max?: string };
    maritalStatus?: string[];
    motherTongue?: string[];
    interests?: string[];
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get profile ID from URL
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Interest sending states
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [showInterestModal, setShowInterestModal] = useState(false);

  // PDF download state
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setLoadError("");
        setProfileNotFound(false);
        
        console.log("=== PROFILE FETCH DEBUG ===");
        console.log("Profile ID from URL:", id);
        
        let response;
        if (id) {
          // Fetch specific profile by ID
          console.log("Fetching profile by ID:", id);
          response = await apiFetch(`/api/profiles/${id}`);
          setIsOwnProfile(false);
        } else {
          // Fetch current user's profile
          console.log("Fetching current user's profile");
          response = await apiFetch("/api/profiles");
          setIsOwnProfile(true);
        }
        
        console.log("Response status:", response.status);
        
        if (response.status === 404) {
          console.log("Profile not found (404)");
          setProfileNotFound(true);
          return;
        }
        
        if (!response.ok) {
          const data = await response.json();
          console.log("Error response:", data);
          setLoadError(data.message || "Unable to load profile.");
          return;
        }
        
        const data = await response.json();
        console.log("Profile data received:", data);
        
        // Handle different response structures
        if (data.success && data.profile) {
          console.log("Using data.profile:", data.profile);
          setProfile(data.profile);
        } else if (data.profile) {
          console.log("Using data.profile (no success flag):", data.profile);
          setProfile(data.profile);
        } else {
          console.log("Using data directly:", data);
          setProfile(data);
        }
        console.log("=== PROFILE FETCH DEBUG END ===");
      } catch (error) {
        console.error("Profile fetch error:", error);
        setLoadError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Send Interest functionality
  const handleSendInterest = async () => {
    if (!profile?.userId) return;
    
    try {
      setSendingInterest(true);
      const response = await apiFetch("/api/interests/send", {
        method: "POST",
        body: JSON.stringify({
          receiverId: profile.userId, // Use userId from profile
          message: interestMessage.trim() || "I'm interested in getting to know you better!"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send interest");
      }

      const data = await response.json();
      setInterestSent(true);
      setShowInterestModal(false);
      setInterestMessage("");
      
      // Show success message
      alert(data.mutualInterest ? 
        "🎉 Mutual interest! You both are interested in each other!" : 
        "✅ Interest sent successfully!"
      );
    } catch (error) {
      console.error("Error sending interest:", error);
      alert(`Failed to send interest: ${error.message}`);
    } finally {
      setSendingInterest(false);
    }
  };

  const openInterestModal = () => {
    setShowInterestModal(true);
    setInterestMessage("");
  };

  // PDF Download functionality
  const downloadProfileAsPDF = async () => {
    try {
      setDownloadingPDF(true);
      
      // Create a temporary container for PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '210mm'; // A4 width
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.padding = '20px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Create PDF content
      pdfContainer.innerHTML = `
        <div style="max-width: 100%; margin: 0 auto;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #9181EE; padding-bottom: 20px;">
            <img src="${displayProfile.profilePhoto}" 
                 style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #f0f0f0;" 
                 onerror="this.style.display='none'" />
            <h1 style="margin: 0; font-size: 28px; color: #333; font-weight: bold;">${displayProfile.fullName}</h1>
            <p style="margin: 5px 0; color: #9181EE; font-size: 16px; font-weight: 600;">${displayProfile.occupation}</p>
            <p style="margin: 0; color: #666; font-size: 14px;">${displayProfile.jobLocation}</p>
            <p style="margin: 5px 0; color: #999; font-size: 12px;">Profile ID: ${displayProfile.profileId}</p>
          </div>

          <!-- Basic Information -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #9181EE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Personal Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div><strong>Age:</strong> ${displayProfile.age} years</div>
              <div><strong>Height:</strong> ${displayProfile.height}</div>
              <div><strong>Blood Group:</strong> ${displayProfile.bloodGroup}</div>
              <div><strong>Mother Tongue:</strong> ${displayProfile.motherTongue}</div>
              <div><strong>Marital Status:</strong> ${displayProfile.maritalStatus}</div>
              <div><strong>Complexion:</strong> ${displayProfile.complexion}</div>
            </div>
          </div>

          ${displayProfile.aboutMe && displayProfile.aboutMe !== "About me information not available." ? `
          <!-- About Me -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #9181EE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">About Me</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #555; font-style: italic;">${displayProfile.aboutMe}</p>
          </div>
          ` : ''}

          <!-- Education & Career -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #9181EE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Education & Career</h2>
            <div style="font-size: 14px; line-height: 1.8;">
              <div><strong>Education:</strong> ${displayProfile.education}</div>
              <div><strong>College/University:</strong> ${displayProfile.collegeUniversity}</div>
              <div><strong>Designation:</strong> ${displayProfile.designation}</div>
              <div><strong>Organization:</strong> ${displayProfile.organization}</div>
              <div><strong>Annual Income:</strong> ${displayProfile.annualIncome}</div>
            </div>
          </div>

          ${(profile?.fathersFullName || profile?.mothersFullName) ? `
          <!-- Family Details -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #9181EE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Family Details</h2>
            <div style="font-size: 14px; line-height: 1.8;">
              ${profile?.fathersFullName ? `<div><strong>Father:</strong> ${displayProfile.fathersFullName} - ${displayProfile.fathersOccupation}</div>` : ''}
              ${profile?.mothersFullName ? `<div><strong>Mother:</strong> ${displayProfile.mothersFullName} - ${displayProfile.mothersOccupation}</div>` : ''}
              ${profile?.brothers?.length ? `<div><strong>Brothers:</strong> ${profile.brothers.length}</div>` : ''}
              ${profile?.sisters?.length ? `<div><strong>Sisters:</strong> ${profile.sisters.length}</div>` : ''}
            </div>
          </div>
          ` : ''}

          ${(profile?.birthName || profile?.birthTime || profile?.birthPlace) ? `
          <!-- Kundali Details -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #9181EE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Kundali Details</h2>
            <div style="font-size: 14px; line-height: 1.8;">
              ${profile?.birthName ? `<div><strong>Birth Name:</strong> ${displayProfile.birthName}</div>` : ''}
              ${profile?.birthTime ? `<div><strong>Birth Time:</strong> ${displayProfile.birthTime}</div>` : ''}
              ${profile?.birthPlace ? `<div><strong>Birth Place:</strong> ${displayProfile.birthPlace}</div>` : ''}
              ${profile?.firstGotra ? `<div><strong>First Gotra:</strong> ${displayProfile.firstGotra}</div>` : ''}
              ${profile?.secondGotra ? `<div><strong>Second Gotra:</strong> ${displayProfile.secondGotra}</div>` : ''}
            </div>
          </div>
          ` : ''}

          <!-- Contact Information -->
          ${isOwnProfile ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #9181EE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Contact Information</h2>
            <div style="font-size: 14px; line-height: 1.8;">
              ${profile?.emailId ? `<div><strong>Email:</strong> ${displayProfile.emailId}</div>` : ''}
              ${profile?.whatsappNumber ? `<div><strong>WhatsApp:</strong> ${displayProfile.whatsappNumber}</div>` : ''}
              ${profile?.linkedinHandle ? `<div><strong>LinkedIn:</strong> ${displayProfile.linkedinHandle}</div>` : ''}
              ${profile?.instagramHandle ? `<div><strong>Instagram:</strong> ${displayProfile.instagramHandle}</div>` : ''}
              ${profile?.facebookHandle ? `<div><strong>Facebook:</strong> ${displayProfile.facebookHandle}</div>` : ''}
            </div>
          </div>
          ` : ''}

          <!-- Footer -->
          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
            <p>Generated from Swayamvar Profile</p>
            <p>Downloaded on ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(pdfContainer);
      
      // Wait for images to load
      const images = pdfContainer.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            // Fallback timeout
            setTimeout(() => resolve(true), 3000);
          }
        });
      }));
      
      // Generate PDF
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: pdfContainer.offsetWidth,
        height: pdfContainer.offsetHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Clean up
      document.body.removeChild(pdfContainer);
      
      // Download the PDF
      const fileName = `${displayProfile.fullName.replace(/\s+/g, '_')}_Profile.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8FB] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9181EE] mx-auto mb-4"></div>
          <p className="text-slate-600">
            {id ? "Loading profile..." : "Loading your profile..."}
          </p>
          {id && (
            <p className="text-slate-500 text-sm mt-2">
              Fetching member information
            </p>
          )}
        </div>
      </div>
    );
  }

  // If profile not found, show error message
  if (profileNotFound) {
    return (
      <div className="min-h-screen bg-[#FDF8FB] flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">
            {id 
              ? "The profile you're looking for doesn't exist or may have been removed. The user might have deactivated their account or the link may be incorrect." 
              : "You haven't created a profile yet. Complete your registration to start browsing other profiles."}
          </p>
          <button
            onClick={() => navigate(id ? "/home" : "/registration")}
            className="px-6 py-3 bg-[#9181EE] text-white rounded-full font-medium hover:bg-[#7b6fd6] transition-colors mr-3"
          >
            {id ? "Back to Browse" : "Create Profile"}
          </button>
          {id && (
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 border border-[#9181EE] text-[#9181EE] rounded-full font-medium hover:bg-[#9181EE] hover:text-white transition-colors"
            >
              Browse Other Profiles
            </button>
          )}
        </div>
      </div>
    );
  }

  // If no profile data is available, show a message
  if (!loading && !loadError && !profileNotFound && !profile) {
    return (
      <div className="min-h-screen bg-[#FDF8FB] flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Profile Data</h2>
          <p className="text-slate-600 mb-6">
            {id 
              ? "The profile data could not be loaded. This might be due to authentication issues or the profile may not exist." 
              : "Your profile data is not available. Please complete your registration."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(id ? "/home" : "/registration")}
              className="block w-full px-6 py-3 bg-[#9181EE] text-white rounded-full font-medium hover:bg-[#7b6fd6] transition-colors"
            >
              {id ? "Back to Browse" : "Complete Registration"}
            </button>
            {id && (
              <button
                onClick={() => window.location.reload()}
                className="block w-full px-6 py-3 border border-[#9181EE] text-[#9181EE] rounded-full font-medium hover:bg-[#9181EE] hover:text-white transition-colors"
              >
                Retry Loading
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const displayProfile = {
    fullName: profile?.fullName || 
              [profile?.firstName, profile?.middleName, profile?.lastName]
                .filter(Boolean).join(" ") || 
              "Profile Name Not Available",
    profileId: profile?._id || "Unknown ID",
    age: profile?.age || "Age not specified",
    occupation: profile?.occupation || "Occupation not specified",
    jobLocation: profile?.jobLocation || "Location not specified",
    profilePhoto:
      profile?.photos?.traditional?.url ||
      profile?.photos?.western?.url ||
      profile?.profilePhotos?.traditional ||
      profile?.profilePhotos?.western ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    aboutMe:
      profile?.aboutMe ||
      "About me information not available.",
    dateOfBirth: profile?.dateOfBirth || "Date of birth not specified",
    maritalStatus: profile?.maritalStatus || "Marital status not specified",
    gender: profile?.gender || "Gender not specified",
    motherTongue: profile?.motherTongue || "Mother tongue not specified",
    complexion: profile?.complexion || "Complexion not specified",
    height: profile?.height || "Height not specified",
    bloodGroup: profile?.bloodGroup || "Blood group not specified",
    firstGotra: profile?.firstGotra || "First gotra not specified",
    secondGotra: profile?.secondGotra || "Second gotra not specified",
    education: profile?.education || profile?.highestEducation || "Education not specified",
    collegeUniversity: profile?.collegeUniversity || "College/University not specified",
    designation: profile?.designation || "Designation not specified",
    organization: profile?.organization || "Organization not specified",
    annualIncome: profile?.annualIncome || "Annual income not specified",
    currentEducation: profile?.currentEducation || "Current education not specified",
    otherOccupation: profile?.otherOccupation || "Other occupation details not specified",
    whatsappNumber: profile?.whatsappNumber || "WhatsApp number not available",
    emailId: profile?.emailId || "Email not available",
    linkedinHandle: profile?.linkedinHandle || "LinkedIn not available",
    instagramHandle: profile?.instagramHandle || "Instagram not available",
    facebookHandle: profile?.facebookHandle || "Facebook not available",
    fathersFullName: profile?.fathersFullName || "Father's name not specified",
    fathersOccupation: profile?.fathersOccupation || "Father's occupation not specified",
    mothersFullName: profile?.mothersFullName || "Mother's name not specified",
    mothersOccupation: profile?.mothersOccupation || "Mother's occupation not specified",
    birthName: profile?.birthName || "Birth name not specified",
    birthTime: profile?.birthTime || "Birth time not specified",
    birthPlace: profile?.birthPlace || "Birth place not specified"
  };

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log("=== DISPLAY PROFILE DEBUG ===");
    console.log("Current profile state:", profile);
    console.log("Is own profile:", isOwnProfile);
    console.log("Profile ID from URL:", id);
    console.log("=== DISPLAY PROFILE DEBUG END ===");
  }

  // Custom soft glowing shadow effect
  const glowStyle = {
    boxShadow: "0 10px 40px -10px rgba(145, 129, 238, 0.15), 0 0 20px rgba(253, 248, 251, 0.5)"
  };

  return (
    <div className="min-h-screen bg-[#FDF8FB] md:px-4 mb-20 lg:mb-0 py-6 text-[14px] text-slate-700 font-['Plus_Jakarta_Sans',_sans-serif]">
      <Navbar />
      <div className="max-w-5xl mt-14 sm:mt-20 mx-auto space-y-6">
        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-semibold mb-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <div>
                <p className="font-semibold">Failed to load profile</p>
                <p className="text-sm">{loadError}</p>
                {id && (
                  <p className="text-xs mt-1">
                    Profile ID: {id} | Make sure you're logged in and the profile exists.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Debug Panel - Remove this in production */}
        
        
        

        {/* ================= HERO SECTION ================= */}
        <div
  className="bg-white rounded-3xl p-6 border border-pink-50 flex flex-col gap-6 relative overflow-hidden"
  style={glowStyle}
>
  {/* Back Button */}
  {!isOwnProfile && id && (
    <button
      onClick={() => navigate("/home")}
      className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-[#9181EE] hover:bg-purple-50 rounded-lg transition-all"
    >
      <ChevronRight size={16} className="rotate-180" />
      Back to Browse
    </button>
  )}

  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 pt-8">
    {/* Profile Image */}
    <img
      src={displayProfile?.profilePhoto}
      alt={displayProfile?.fullName}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-rose-50 shadow-md"
    />

    {/* Profile Info */}
    <div className="flex-1 text-center lg:text-left space-y-4">
      {/* Name + ID */}
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
          {displayProfile.occupation}
          <span className="text-slate-300 mx-1">|</span>
          {displayProfile.jobLocation}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
        {!isOwnProfile ? (
          <>
            <button 
              onClick={interestSent ? undefined : openInterestModal}
              disabled={interestSent || sendingInterest}
              className={`hidden lg:flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all shadow-lg active:scale-95 ${
                interestSent 
                  ? 'bg-green-500 text-white cursor-default' 
                  : sendingInterest
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#9181EE] hover:bg-[#7b6fd6] text-white'
              }`}
            >
              {interestSent ? (
                <>
                  <Check size={16} fill="white" /> Interest Sent
                </>
              ) : sendingInterest ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Heart size={16} fill="white" /> Send Interest
                </>
              )}
            </button>

            <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all">
              <Star size={16} /> Shortlist
            </button>

            <button
              onClick={downloadProfileAsPDF}
              disabled={downloadingPDF}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-green-100 bg-white text-slate-600 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={16} /> Download PDF
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/registration")}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all"
            >
              <Edit3 size={16} /> Edit Profile
            </button>

            <button
              onClick={downloadProfileAsPDF}
              disabled={downloadingPDF}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full bg-[#9181EE] hover:bg-[#7b6fd6] text-white font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={16} /> Download PDF
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-5 text-sm text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="text-rose-400" /> {displayProfile.age} yrs
        </span>
        <span className="flex items-center gap-1.5">
          <Ruler size={14} className="text-rose-400" /> {displayProfile.height}
        </span>
        <span className="flex items-center gap-1.5">
          <Droplet size={14} className="text-rose-400" /> {displayProfile.bloodGroup}
        </span>
        <span className="flex items-center gap-1.5">
          <Globe size={14} className="text-rose-400" /> {displayProfile.motherTongue}
        </span>
      </div>
    </div>
  </div>
</div>


        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">

            {displayProfile.aboutMe && displayProfile.aboutMe !== "About me information not available." && (
              <Section title="About Me" glow={glowStyle}>
                <p className="leading-relaxed text-slate-600 italic font-medium">
                  {displayProfile.aboutMe}
                </p>
              </Section>
            )}

            {(
              profile?.dateOfBirth || profile?.maritalStatus || profile?.gender || 
              profile?.motherTongue || profile?.complexion || profile?.height || 
              profile?.bloodGroup || profile?.firstGotra || profile?.secondGotra
            ) && (
              <Section title="Personal Information" glow={glowStyle}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {profile?.dateOfBirth && <Info label="Date of Birth" value={displayProfile.dateOfBirth} icon={<Calendar size={14}/>} />}
                  {profile?.age && <Info label="Age" value={`${displayProfile.age} years`} icon={<Calendar size={14}/>} />}
                  {profile?.maritalStatus && <Info label="Marital Status" value={displayProfile.maritalStatus} icon={<ShieldCheck size={14}/>} />}
                  {profile?.gender && <Info label="Gender" value={displayProfile.gender} icon={<User size={14}/>} />}
                  {profile?.motherTongue && <Info label="Mother Tongue" value={displayProfile.motherTongue} icon={<Languages size={14}/>} />}
                  {profile?.complexion && <Info label="Complexion" value={displayProfile.complexion} icon={<Droplet size={14}/>} />}
                  {profile?.height && <Info label="Height" value={displayProfile.height} icon={<Ruler size={14}/>} />}
                  {profile?.bloodGroup && <Info label="Blood Group" value={displayProfile.bloodGroup} icon={<Droplet size={14}/>} />}
                  {profile?.firstGotra && <Info label="First Gotra" value={displayProfile.firstGotra} icon={<Flame size={14} className="text-orange-400"/>} />}
                  {profile?.secondGotra && <Info label="Second Gotra" value={displayProfile.secondGotra} icon={<Flame size={14} className="text-orange-400"/>} />}
                </div>
              </Section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard
                icon={<GraduationCap size={20} className="text-white" />}
                iconBg="bg-indigo-400"
                title="Education"
                value={displayProfile.education}
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

            {(profile?.designation || profile?.organization || profile?.annualIncome || profile?.jobLocation || profile?.currentEducation || profile?.otherOccupation) && (
              <Section title="Job Details" glow={glowStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile?.designation && <Info label="Designation" value={displayProfile.designation} icon={<Award size={14}/>} />}
                  {profile?.organization && <Info label="Organization" value={displayProfile.organization} icon={<Building size={14}/>} />}
                  {profile?.annualIncome && <Info label="Annual Income" value={displayProfile.annualIncome} icon={<DollarSign size={14}/>} />}
                  {profile?.jobLocation && <Info label="Job Location" value={displayProfile.jobLocation} icon={<MapPin size={14}/>} />}
                  {profile?.currentEducation && <Info label="Current Education" value={displayProfile.currentEducation} icon={<BookOpen size={14}/>} />}
                  {profile?.otherOccupation && <Info label="Other Details" value={displayProfile.otherOccupation} icon={<MessageCircle size={14}/>} />}
                </div>
              </Section>
            )}

            {(profile?.fathersFullName || profile?.mothersFullName || profile?.brothers?.length || profile?.sisters?.length) && (
              <Section title="Family Details" glow={glowStyle}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(profile?.fathersFullName || profile?.fathersOccupation) && (
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-200 shadow-sm">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Father</p>
                        <p className="font-bold text-slate-800 text-base uppercase tracking-tight">
                          {displayProfile.fathersFullName}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          {displayProfile.fathersOccupation}
                        </p>
                        {profile?.fathersOccupation && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Info label="Occupation" value={displayProfile.fathersOccupation} icon={<Briefcase size={10}/>} />
                          </div>
                        )}
                      </div>
                    )}
                    {(profile?.mothersFullName || profile?.mothersOccupation) && (
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-rose-200 shadow-sm">
                        <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Mother</p>
                        <p className="font-bold text-slate-800 text-base uppercase tracking-tight">
                          {displayProfile.mothersFullName}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 font-medium italic tracking-tight">
                          {displayProfile.mothersOccupation}
                        </p>
                        {profile?.mothersOccupation && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Info label="Occupation" value={displayProfile.mothersOccupation} icon={<Briefcase size={10}/>} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {(profile?.brothers?.length || profile?.sisters?.length) && (
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">
                        <span>Brothers: <b className="text-slate-700">{profile?.brothers?.length || 0}</b></span>
                        <span>Sisters: <b className="text-slate-700">{profile?.sisters?.length || 0}</b></span>
                      </div>
                      
                      {profile?.brothers?.map((brother, index) => (
                        <div key={index} className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm mb-3">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Brother {index + 1} Details</p>
                          <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                            <b>{brother.name}:</b> {brother.occupation} {brother.companyName && `at ${brother.companyName}`}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Info label="Occupation" value={brother.occupation} icon={<Briefcase size={10}/>} />
                            {brother.companyName && <Info label="Company" value={brother.companyName} icon={<Building size={10}/>} />}
                          </div>
                        </div>
                      ))}

                      {profile?.sisters?.map((sister, index) => (
                        <div key={index} className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm mb-3">
                          <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Sister {index + 1} Details</p>
                          <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                            <b>{sister.name}:</b> {sister.occupation} {sister.companyName && `at ${sister.companyName}`}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Info label="Occupation" value={sister.occupation} icon={<Briefcase size={10}/>} />
                            {sister.companyName && <Info label="Company" value={sister.companyName} icon={<Building size={10}/>} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6">

            {(profile?.emailId || profile?.whatsappNumber || profile?.socialMedia?.length || profile?.linkedinHandle || profile?.instagramHandle || profile?.facebookHandle) && (
              <Section title="Contact Details" glow={glowStyle}>
                <div className="space-y-4">
                  {profile?.emailId && (
                    <div className="flex items-start gap-3">
                      <div className="bg-rose-50 p-2 rounded-lg text-rose-500 shadow-sm"><Mail size={16} /></div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Email ID</p>
                        <p className="text-xs font-semibold truncate tracking-tighter">
                          {isOwnProfile ? displayProfile.emailId : displayProfile.emailId.replace(/(.{3}).*(@.*)/, '$1••••$2')}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile?.whatsappNumber && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="bg-green-50 p-2 rounded-lg text-green-500 shadow-sm"><Phone size={16} /></div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">WhatsApp No</p>
                        <p className="text-xs font-semibold">
                          {isOwnProfile ? displayProfile.whatsappNumber : displayProfile.whatsappNumber.replace(/(.{6}).*/, '$1••••')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(profile?.socialMedia?.length || profile?.linkedinHandle || profile?.instagramHandle || profile?.facebookHandle) && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-2">Social Media</p>
                      <div className="space-y-2">
                        {profile?.socialMedia?.map((social, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {social.platform === 'LinkedIn' && <Linkedin size={14} className="text-blue-600" />}
                            {social.platform === 'Instagram' && <Instagram size={14} className="text-pink-600" />}
                            {social.platform === 'Facebook' && <Facebook size={14} className="text-blue-700" />}
                            <span className="text-xs text-slate-600">{social.url}</span>
                          </div>
                        )) || (
                          <>
                            {profile?.linkedinHandle && (
                              <div className="flex items-center gap-2">
                                <Linkedin size={14} className="text-blue-600" />
                                <span className="text-xs text-slate-600">{displayProfile.linkedinHandle}</span>
                              </div>
                            )}
                            {profile?.instagramHandle && (
                              <div className="flex items-center gap-2">
                                <Instagram size={14} className="text-pink-600" />
                                <span className="text-xs text-slate-600">{displayProfile.instagramHandle}</span>
                              </div>
                            )}
                            {profile?.facebookHandle && (
                              <div className="flex items-center gap-2">
                                <Facebook size={14} className="text-blue-700" />
                                <span className="text-xs text-slate-600">{displayProfile.facebookHandle}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!isOwnProfile && (
                    <button className="w-full bg-[#9181EE] text-white py-3 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all uppercase tracking-widest mt-2">
                      REQUEST CONTACT
                    </button>
                  )}
                </div>
              </Section>
            )}

            {(profile?.birthName || profile?.birthTime || profile?.birthPlace || profile?.firstGotra || profile?.secondGotra) && (
              <Section title="Kundali Details" glow={glowStyle}>
                <div className="space-y-3">
                  {profile?.birthName && <Info label="Birth Name" value={displayProfile.birthName} icon={<User size={14} className="text-indigo-400"/>} />}
                  {profile?.birthTime && <Info label="Birth Time" value={displayProfile.birthTime} icon={<Clock size={14} className="text-orange-400"/>} />}
                  {profile?.birthPlace && <Info label="Birth Place" value={displayProfile.birthPlace} icon={<MapPin size={14} className="text-rose-400"/>} />}
                  {profile?.firstGotra && <Info label="First Gotra" value={displayProfile.firstGotra} icon={<Flame size={14} className="text-orange-400"/>} />}
                  {profile?.secondGotra && <Info label="Second Gotra" value={displayProfile.secondGotra} icon={<Flame size={14} className="text-orange-400"/>} />}
                </div>
              </Section>
            )}

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
          {isOwnProfile ? (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform"
                onClick={() => navigate("/registration")}>
                <Edit3 size={16} /> Edit Profile
              </button>
              <button 
                onClick={downloadProfileAsPDF}
                disabled={downloadingPDF}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#9181EE] text-white font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                {downloadingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    PDF...
                  </>
                ) : (
                  <>
                    <Download size={16} /> PDF
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform">
                <Star size={16} /> Shortlist
              </button>
              <button 
                onClick={downloadProfileAsPDF}
                disabled={downloadingPDF}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-full border border-green-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                {downloadingPDF ? (
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
              </button>
              <button 
                onClick={interestSent ? undefined : openInterestModal}
                disabled={interestSent || sendingInterest}
                className={`flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform ${
                  interestSent 
                    ? 'bg-green-500 text-white cursor-default' 
                    : sendingInterest
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#9181EE] text-white'
                }`}
              >
                {interestSent ? (
                  <>
                    <Check size={18} fill="white" /> Interest Sent
                  </>
                ) : sendingInterest ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Heart size={18} fill="white" /> Send Interest
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Send Interest</h3>
              <button
                onClick={() => setShowInterestModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ChevronRight size={20} className="rotate-45 text-slate-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-3">
                Send a personalized message to {displayProfile.fullName}
              </p>
              <textarea
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value.slice(0, 500))}
                placeholder="Hi! I'm interested in getting to know you better. Would you like to connect?"
                className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9181EE] focus:border-transparent text-sm"
                rows={4}
              />
              <div className="text-xs text-slate-400 mt-1 text-right">
                {interestMessage.length}/500
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowInterestModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterest}
                disabled={sendingInterest}
                className="flex-1 px-4 py-3 bg-[#9181EE] text-white rounded-lg hover:bg-[#7b6fd6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingInterest ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Interest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
