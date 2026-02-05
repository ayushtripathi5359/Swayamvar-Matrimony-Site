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
  Download,
  Share2,
  Copy,
  Twitter,
  MessageSquare,
  X
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
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  motherTongue?: string;
  height?: string;
  complexion?: string;
  bloodGroup?: string;
  aboutMe?: string;
  occupation?: string;
  organization?: string;
  designation?: string;
  jobLocation?: string;
  education?: string;
  collegeUniversity?: string;
  currentEducation?: string;
  annualIncome?: string;
  photos?: { 
    profilePhoto?: { url?: string };
    western?: { url?: string }; 
    traditional?: { url?: string }; 
  };
  profilePhotos?: { western?: string; traditional?: string };
  whatsappNumber?: string;
  countryCode?: string;
  emailId?: string;
  linkedinHandle?: string;
  instagramHandle?: string;
  facebookHandle?: string;
  fathersFullName?: string;
  fathersOccupation?: string;
  fathersDesignation?: string;
  fathersCompanyName?: string;
  fathersBusinessLocation?: string;
  fathersWhatsappNumber?: string;
  fathersCountryCode?: string;
  mothersFullName?: string;
  mothersOccupation?: string;
  mothersDesignation?: string;
  mothersCompanyName?: string;
  mothersBusinessLocation?: string;
  mothersWhatsappNumber?: string;
  mothersCountryCode?: string;
  brothers?: Array<{
    name?: string;
    maritalStatus?: string;
    occupation?: string;
    spouseName?: string;
    businessName?: string;
    businessLocation?: string;
    designation?: string;
    companyName?: string;
    currentEducation?: string;
  }>;
  sisters?: Array<{
    name?: string;
    maritalStatus?: string;
    occupation?: string;
    spouseName?: string;
    businessName?: string;
    businessLocation?: string;
    designation?: string;
    companyName?: string;
    currentEducation?: string;
  }>;
  birthName?: string;
  birthTime?: string;
  birthPlace?: string;
  firstGotra?: string;
  secondGotra?: string;
  currentAddressLine1?: string;
  currentAddressLine2?: string;
  currentCity?: string;
  currentState?: string;
  currentPincode?: string;
  permanentAddressLine1?: string;
  permanentAddressLine2?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  sameAsPermanentAddress?: boolean;
  partnerAgeFrom?: string;
  partnerAgeTo?: string;
  partnerQualification?: string[];
  preferredLocation?: string[];
  minAnnualIncome?: string;
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

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);

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
      
      // Find the main profile content container
      const profileContainer = document.querySelector('[data-profile-content]') || 
                              document.querySelector('.profile-content') ||
                              document.querySelector('main') ||
                              document.body;
      
      if (!profileContainer) {
        throw new Error('Profile content not found');
      }

      // Hide elements that shouldn't appear in PDF
      const elementsToHide = [
        'nav', 'navbar', '.navbar', '[data-navbar]',
        'footer', '.footer', '[data-footer]',
        '.share-button', '[data-share]',
        '.download-button', '[data-download]',
        '.edit-button', '[data-edit]',
        '.interest-button', '[data-interest]',
        '.back-button', '[data-back]',
        'button[onclick*="downloadProfileAsPDF"]',
        'button[onclick*="share"]',
        '.fixed', '.sticky'
      ];

      const hiddenElements = [];
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el && el.style.display !== 'none') {
            hiddenElements.push({ element: el, originalDisplay: el.style.display });
            el.style.display = 'none';
          }
        });
      });

      // Wait for any images to load
      const images = profileContainer.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            setTimeout(() => resolve(true), 3000);
          }
        });
      }));

      // Create canvas from the actual profile content
      const canvas = await html2canvas(profileContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: profileContainer.scrollWidth,
        height: profileContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        ignoreElements: (element) => {
          // Additional check to ignore navigation and action elements
          return element.tagName === 'NAV' || 
                 element.classList.contains('navbar') ||
                 element.classList.contains('share-button') ||
                 element.classList.contains('download-button') ||
                 element.classList.contains('interest-button') ||
                 element.classList.contains('edit-button') ||
                 element.classList.contains('back-button') ||
                 element.hasAttribute('data-navbar') ||
                 element.hasAttribute('data-share') ||
                 element.hasAttribute('data-download') ||
                 element.hasAttribute('data-interest') ||
                 element.hasAttribute('data-edit') ||
                 element.hasAttribute('data-back');
        }
      });

      // Restore hidden elements
      hiddenElements.forEach(({ element, originalDisplay }) => {
        element.style.display = originalDisplay;
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit the page while maintaining aspect ratio
      const ratio = Math.min(pdfWidth / (imgWidth / 2), pdfHeight / (imgHeight / 2));
      const scaledWidth = (imgWidth / 2) * ratio;
      const scaledHeight = (imgHeight / 2) * ratio;
      
      // Center the image on the page
      const imgX = (pdfWidth - scaledWidth) / 2;
      const imgY = (pdfHeight - scaledHeight) / 2;
      
      // If content is too tall, we might need multiple pages
      if (scaledHeight > pdfHeight) {
        // Calculate how many pages we need
        const pagesNeeded = Math.ceil(scaledHeight / pdfHeight);
        const pageHeight = pdfHeight;
        
        for (let i = 0; i < pagesNeeded; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          // Calculate the portion of the image for this page
          const sourceY = (imgHeight / pagesNeeded) * i;
          const sourceHeight = imgHeight / pagesNeeded;
          
          // Create a temporary canvas for this page portion
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = imgWidth;
          tempCanvas.height = sourceHeight;
          
          // Draw the portion of the original canvas
          tempCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          
          const pageImgData = tempCanvas.toDataURL('image/png', 1.0);
          pdf.addImage(pageImgData, 'PNG', imgX, 0, scaledWidth, pageHeight);
        }
      } else {
        pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);
      }
      
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

  // Share functionality
  const getProfileUrl = () => {
    return `${window.location.origin}/profile/${profile?._id || profile?.userId}`;
  };

  const handleShare = (platform: string) => {
    const profileUrl = getProfileUrl();
    const shareText = `Check out ${displayProfile.fullName}'s profile on Swayamvar`;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(profileUrl).then(() => {
          alert('Profile link copied to clipboard!');
          setShowShareModal(false);
        }).catch(() => {
          alert('Failed to copy link. Please try again.');
        });
        break;
        
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${profileUrl}`)}`;
        window.open(whatsappUrl, '_blank');
        setShowShareModal(false);
        break;
        
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        window.open(facebookUrl, '_blank');
        setShowShareModal(false);
        break;
        
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`;
        window.open(twitterUrl, '_blank');
        setShowShareModal(false);
        break;
        
      case 'email':
        const emailUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${profileUrl}`)}`;
        window.location.href = emailUrl;
        setShowShareModal(false);
        break;
        
      default:
        break;
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
              "Name not available",
    profileId: profile?._id || "Unknown ID",
    age: profile?.age || "",
    occupation: profile?.occupation || "",
    jobLocation: profile?.jobLocation || "",
    profilePhoto:
      profile?.photos?.profilePhoto?.url ||
      profile?.photos?.traditional?.url ||
      profile?.photos?.western?.url ||
      profile?.profilePhotos?.traditional ||
      profile?.profilePhotos?.western ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    aboutMe: profile?.aboutMe || "",
    dateOfBirth: profile?.dateOfBirth || "",
    maritalStatus: profile?.maritalStatus || "",
    gender: profile?.gender || "",
    motherTongue: profile?.motherTongue || "",
    complexion: profile?.complexion || "",
    height: profile?.height || "",
    bloodGroup: profile?.bloodGroup || "",
    firstGotra: profile?.firstGotra || "",
    secondGotra: profile?.secondGotra || "",
    education: profile?.education || "",
    collegeUniversity: profile?.collegeUniversity || "",
    designation: profile?.designation || "",
    organization: profile?.organization || "",
    annualIncome: profile?.annualIncome || "",
    currentEducation: profile?.currentEducation || "",
    whatsappNumber: profile?.whatsappNumber || "",
    countryCode: profile?.countryCode || "+91",
    emailId: profile?.emailId || "",
    linkedinHandle: profile?.linkedinHandle || "",
    instagramHandle: profile?.instagramHandle || "",
    facebookHandle: profile?.facebookHandle || "",
    fathersFullName: profile?.fathersFullName || "",
    fathersOccupation: profile?.fathersOccupation || "",
    fathersDesignation: profile?.fathersDesignation || "",
    fathersCompanyName: profile?.fathersCompanyName || "",
    fathersBusinessLocation: profile?.fathersBusinessLocation || "",
    fathersWhatsappNumber: profile?.fathersWhatsappNumber || "",
    fathersCountryCode: profile?.fathersCountryCode || "+91",
    mothersFullName: profile?.mothersFullName || "",
    mothersOccupation: profile?.mothersOccupation || "",
    mothersDesignation: profile?.mothersDesignation || "",
    mothersCompanyName: profile?.mothersCompanyName || "",
    mothersBusinessLocation: profile?.mothersBusinessLocation || "",
    mothersWhatsappNumber: profile?.mothersWhatsappNumber || "",
    mothersCountryCode: profile?.mothersCountryCode || "+91",
    birthName: profile?.birthName || "",
    birthTime: profile?.birthTime || "",
    birthPlace: profile?.birthPlace || "",
    currentAddressLine1: profile?.currentAddressLine1 || "",
    currentAddressLine2: profile?.currentAddressLine2 || "",
    currentCity: profile?.currentCity || "",
    currentState: profile?.currentState || "",
    currentPincode: profile?.currentPincode || "",
    permanentAddressLine1: profile?.permanentAddressLine1 || "",
    permanentAddressLine2: profile?.permanentAddressLine2 || "",
    permanentCity: profile?.permanentCity || "",
    permanentState: profile?.permanentState || "",
    permanentPincode: profile?.permanentPincode || "",
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
      <Navbar data-navbar />
      <div className="max-w-5xl mt-14 sm:mt-20 mx-auto space-y-6" data-profile-content>
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
      data-back
    >
      <ChevronRight size={16} className="rotate-180" />
      Back to Browse
    </button>
  )}

  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 pt-8 relative">
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
          {[
            displayProfile.designation || displayProfile.occupation,
            displayProfile.organization,
            displayProfile.jobLocation
          ].filter(Boolean).join(' | ')}
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
              data-interest
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

            <button className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all" data-shortlist>
              <Star size={16} /> Shortlist
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-blue-100 bg-white text-slate-600 hover:bg-blue-50 transition-all"
              data-share
            >
              <Share2 size={16} /> Share
            </button>

            <button
              onClick={downloadProfileAsPDF}
              disabled={downloadingPDF}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-green-100 bg-white text-slate-600 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-download
            >
              {downloadingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={16} /> Download
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/registration")}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-purple-100 bg-white text-slate-600 hover:bg-purple-50 transition-all"
              data-edit
            >
              <Edit3 size={16} /> Edit Profile
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full border border-blue-100 bg-white text-slate-600 hover:bg-blue-50 transition-all"
              data-share
            >
              <Share2 size={16} /> Share
            </button>

            <button
              onClick={downloadProfileAsPDF}
              disabled={downloadingPDF}
              className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full bg-[#9181EE] hover:bg-[#7b6fd6] text-white font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              data-download
            >
              {downloadingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={16} /> Download
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

    {/* Social Media Icons - Vertical on Right */}
    {(profile?.socialMedia?.length || profile?.linkedinHandle || profile?.instagramHandle || profile?.facebookHandle) && (
      <div className="hidden lg:flex flex-col gap-3 absolute right-0 top-8">
        {profile?.socialMedia?.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all hover:scale-110"
          >
            {social.platform === 'LinkedIn' && <Linkedin size={18} className="text-blue-600" />}
            {social.platform === 'Instagram' && <Instagram size={18} className="text-pink-600" />}
            {social.platform === 'Facebook' && <Facebook size={18} className="text-blue-700" />}
          </a>
        )) || (
          <>
            {profile?.linkedinHandle && (
              <a
                href={profile.linkedinHandle.startsWith('http') ? profile.linkedinHandle : `https://linkedin.com/in/${profile.linkedinHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all hover:scale-110"
              >
                <Linkedin size={18} className="text-blue-600" />
              </a>
            )}
            {profile?.instagramHandle && (
              <a
                href={profile.instagramHandle.startsWith('http') ? profile.instagramHandle : `https://instagram.com/${profile.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all hover:scale-110"
              >
                <Instagram size={18} className="text-pink-600" />
              </a>
            )}
            {profile?.facebookHandle && (
              <a
                href={profile.facebookHandle.startsWith('http') ? profile.facebookHandle : `https://facebook.com/${profile.facebookHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all hover:scale-110"
              >
                <Facebook size={18} className="text-blue-700" />
              </a>
            )}
          </>
        )}
      </div>
    )}
  </div>
</div>


        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">

            {displayProfile.aboutMe && (
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

            {(profile?.designation || profile?.organization || profile?.annualIncome || profile?.jobLocation || profile?.currentEducation) && (
              <Section title="Job Details" glow={glowStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile?.designation && <Info label="Designation" value={displayProfile.designation} icon={<Award size={14}/>} />}
                  {profile?.organization && <Info label="Organization" value={displayProfile.organization} icon={<Building size={14}/>} />}
                  {profile?.annualIncome && <Info label="Annual Income" value={displayProfile.annualIncome} icon={<DollarSign size={14}/>} />}
                  {profile?.jobLocation && <Info label="Job Location" value={displayProfile.jobLocation} icon={<MapPin size={14}/>} />}
                  {profile?.currentEducation && <Info label="Current Education" value={displayProfile.currentEducation} icon={<BookOpen size={14}/>} />}
                </div>
              </Section>
            )}

            {(profile?.fathersFullName || profile?.mothersFullName || profile?.fathersWhatsappNumber || profile?.mothersWhatsappNumber || profile?.brothers?.length || profile?.sisters?.length) && (
              <Section title="Family Details" glow={glowStyle}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(profile?.fathersFullName || profile?.fathersOccupation || profile?.fathersWhatsappNumber) && (
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-200 shadow-sm">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Father</p>
                        <p className="font-bold text-slate-800 text-base uppercase tracking-tight">
                          {displayProfile.fathersFullName}
                        </p>
                        {/* Father's professional info in pattern: occupation | company | location */}
                        {(profile?.fathersOccupation || profile?.fathersDesignation || profile?.fathersCompanyName || profile?.fathersBusinessLocation) && (
                          <p className="text-xs text-slate-600 leading-relaxed mt-2">
                            {[
                              profile?.fathersDesignation || profile?.fathersOccupation,
                              profile?.fathersCompanyName,
                              profile?.fathersBusinessLocation
                            ].filter(Boolean).join(' | ')}
                          </p>
                        )}
                        {profile?.fathersWhatsappNumber && (
                          <p className="text-xs text-slate-600 mt-1">
                            📱 {displayProfile.fathersCountryCode} {displayProfile.fathersWhatsappNumber}
                          </p>
                        )}
                      </div>
                    )}
                    {(profile?.mothersFullName || profile?.mothersOccupation || profile?.mothersWhatsappNumber) && (
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-rose-200 shadow-sm">
                        <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Mother</p>
                        <p className="font-bold text-slate-800 text-base uppercase tracking-tight">
                          {displayProfile.mothersFullName}
                        </p>
                        {/* Mother's professional info in pattern: occupation | company | location */}
                        {(profile?.mothersOccupation || profile?.mothersDesignation || profile?.mothersCompanyName || profile?.mothersBusinessLocation) && (
                          <p className="text-xs text-slate-600 mt-2 font-medium italic tracking-tight">
                            {[
                              profile?.mothersDesignation || profile?.mothersOccupation,
                              profile?.mothersCompanyName,
                              profile?.mothersBusinessLocation
                            ].filter(Boolean).join(' | ')}
                          </p>
                        )}
                        {profile?.mothersWhatsappNumber && (
                          <p className="text-xs text-slate-600 mt-1">
                            📱 {displayProfile.mothersCountryCode} {displayProfile.mothersWhatsappNumber}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {(profile?.brothers?.length || profile?.sisters?.length) && (
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">
                        {profile?.brothers?.length > 0 && (
                          <span>Brothers: <b className="text-slate-700">{profile.brothers.length}</b></span>
                        )}
                        {profile?.sisters?.length > 0 && (
                          <span>Sisters: <b className="text-slate-700">{profile.sisters.length}</b></span>
                        )}
                      </div>
                      
                      {profile?.brothers?.map((brother, index) => (
                        <div key={index} className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm mb-3">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Brother {index + 1} Details</p>
                          <p className="font-bold text-slate-800 text-sm uppercase tracking-tight mb-1">
                            {brother.name}
                          </p>
                          {brother.maritalStatus && (
                            <p className="text-xs text-slate-500 mb-1">
                              <strong>Status:</strong> {brother.maritalStatus}
                              {brother.spouseName && ` (Spouse: ${brother.spouseName})`}
                            </p>
                          )}
                          <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                            {[
                              brother.designation || brother.occupation,
                              brother.companyName || brother.businessName,
                              brother.businessLocation
                            ].filter(Boolean).join(' | ')}
                          </p>
                          {brother.currentEducation && (
                            <p className="text-xs text-slate-500 mt-1">
                              <strong>Education:</strong> {brother.currentEducation}
                            </p>
                          )}
                        </div>
                      ))}

                      {profile?.sisters?.map((sister, index) => (
                        <div key={index} className="bg-[#F8F7FF] p-4 rounded-xl border border-rose-50 shadow-sm mb-3">
                          <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Sister {index + 1} Details</p>
                          <p className="font-bold text-slate-800 text-sm uppercase tracking-tight mb-1">
                            {sister.name}
                          </p>
                          {sister.maritalStatus && (
                            <p className="text-xs text-slate-500 mb-1">
                              <strong>Status:</strong> {sister.maritalStatus}
                              {sister.spouseName && ` (Spouse: ${sister.spouseName})`}
                            </p>
                          )}
                          <p className="text-xs text-slate-600 leading-relaxed tracking-tight">
                            {[
                              sister.designation || sister.occupation,
                              sister.companyName || sister.businessName,
                              sister.businessLocation
                            ].filter(Boolean).join(' | ')}
                          </p>
                          {sister.currentEducation && (
                            <p className="text-xs text-slate-500 mt-1">
                              <strong>Education:</strong> {sister.currentEducation}
                            </p>
                          )}
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
                          {isOwnProfile ? `${displayProfile.countryCode} ${displayProfile.whatsappNumber}` : displayProfile.whatsappNumber.replace(/(.{6}).*/, '$1••••')}
                        </p>
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

            {(profile?.partnerAgeFrom || profile?.partnerAgeTo || profile?.partnerQualification?.length || profile?.preferredLocation?.length || profile?.minAnnualIncome) && (
              <Section title="Partner Preferences" glow={glowStyle}>
                <div className="space-y-3">
                  {(profile?.partnerAgeFrom || profile?.partnerAgeTo) && (
                    <ExpectItem 
                      label="Age Range" 
                      value={`${profile?.partnerAgeFrom || 'Any'} to ${profile?.partnerAgeTo || 'Any'} years`} 
                    />
                  )}
                  {profile?.partnerQualification?.length > 0 && (
                    <ExpectItem 
                      label="Education" 
                      value={profile.partnerQualification.join(', ')} 
                    />
                  )}
                  {profile?.preferredLocation?.length > 0 && (
                    <ExpectItem 
                      label="Preferred Locations" 
                      value={profile.preferredLocation.join(', ')} 
                    />
                  )}
                  {profile?.minAnnualIncome && (
                    <ExpectItem 
                      label="Minimum Annual Income" 
                      value={profile.minAnnualIncome} 
                    />
                  )}
                </div>
              </Section>
            )}

            <Section title="Location & Lifestyle" glow={glowStyle}>
              <div className="space-y-3">
                {/* Current Address */}
                {(profile?.currentAddressLine1 || profile?.currentCity || profile?.currentState) && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-rose-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Current Address</p>
                      <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                        {[
                          displayProfile.currentAddressLine1,
                          displayProfile.currentAddressLine2,
                          displayProfile.currentCity,
                          displayProfile.currentState,
                          displayProfile.currentPincode
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Permanent Address */}
                {(profile?.permanentAddressLine1 || profile?.permanentCity || profile?.permanentState) && (
                  <div className="flex items-start gap-2">
                    <Home size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Permanent Address</p>
                      <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                        {[
                          displayProfile.permanentAddressLine1,
                          displayProfile.permanentAddressLine2,
                          displayProfile.permanentCity,
                          displayProfile.permanentState,
                          displayProfile.permanentPincode
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Job Location if different from current address */}
                {profile?.jobLocation && (
                  <div className="flex items-start gap-2">
                    <Building size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Work Location</p>
                      <p className="text-xs leading-relaxed text-slate-500 font-semibold tracking-tight">
                        {displayProfile.jobLocation}
                      </p>
                    </div>
                  </div>
                )}
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
                onClick={() => setShowShareModal(true)}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-full border border-blue-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform"
              >
                <Share2 size={16} />
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
                onClick={() => setShowShareModal(true)}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-full border border-blue-100 bg-white text-slate-600 shadow-sm active:scale-95 transition-transform"
              >
                <Share2 size={16} />
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Share Profile</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-4">
                Share {displayProfile.fullName}'s profile with others
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <Copy size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Copy Link</p>
                    <p className="text-xs text-slate-500">Copy profile link to clipboard</p>
                  </div>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MessageSquare size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">WhatsApp</p>
                    <p className="text-xs text-slate-500">Share via WhatsApp</p>
                  </div>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Facebook size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Facebook</p>
                    <p className="text-xs text-slate-500">Share on Facebook</p>
                  </div>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="bg-sky-100 p-2 rounded-lg">
                    <Twitter size={16} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Twitter</p>
                    <p className="text-xs text-slate-500">Share on Twitter</p>
                  </div>
                </button>

                <button
                  onClick={() => handleShare('email')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Mail size={16} className="text-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <p className="text-xs text-slate-500">Share via email</p>
                  </div>
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
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
         {label}
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
