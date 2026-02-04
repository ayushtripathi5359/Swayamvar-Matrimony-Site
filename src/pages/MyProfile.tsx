import { Pencil, Check, X, Clock, Plus, Camera, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/apiClient";

// Image Cropper Component
const ImageCropper = ({ 
  imageSrc, 
  onCropComplete, 
  onCancel, 
  isOpen 
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas || !crop.width || !crop.height) {
      return Promise.resolve('');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return Promise.resolve('');
    }

    // Make canvas square with the crop dimensions
    const size = Math.max(crop.width, crop.height);
    const pixelRatio = window.devicePixelRatio;
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // Fill with white background for square image
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Center the cropped image in the square canvas
    const offsetX = (size - crop.width) / 2;
    const offsetY = (size - crop.height) / 2;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      offsetX,
      offsetY,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve('');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedImageUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-700">Crop Your Photo</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center text-sm text-slate-600 mb-4">
            Drag to adjust the square crop area for your profile photo
          </div>
          
          <div className="flex justify-center bg-slate-50 p-4 rounded-xl">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1} // Force square aspect ratio
              minWidth={100}
              minHeight={100}
              keepSelection={true}
              ruleOfThirds={true}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-w-full max-h-96 object-contain"
                onLoad={() => {
                  // Set initial square crop to center
                  if (imgRef.current) {
                    const { width, height } = imgRef.current;
                    const size = Math.min(width, height) * 0.7; // 70% of the smaller dimension
                    const x = (width - size) / 2;
                    const y = (height - size) / 2;
                    
                    setCrop({
                      unit: 'px',
                      width: size,
                      height: size, // Ensure square
                      x: x,
                      y: y
                    });
                  }
                }}
              />
            </ReactCrop>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className="px-6 py-3 bg-[#ED9B59] text-white rounded-xl font-semibold hover:bg-orange-500 transition-all flex items-center gap-2"
            >
              Apply Crop
            </button>
          </div>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

// Social Media URL Validation Functions
const validateLinkedInURL = (url: string) => {
  if (!url.trim()) return true; // Allow empty
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|profile)\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
  return linkedinRegex.test(url);
};

const validateInstagramURL = (url: string) => {
  if (!url.trim()) return true; // Allow empty
  const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
  return instagramRegex.test(url);
};

const validateFacebookURL = (url: string) => {
  if (!url.trim()) return true; // Allow empty
  const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
  return facebookRegex.test(url);
};

// Country codes for phone validation
const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳', pattern: /^[6-9]\d{9}$/, length: 10 },
  { code: '+1', country: 'United States', flag: '🇺🇸', pattern: /^\d{10}$/, length: 10 },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', pattern: /^\d{10,11}$/, length: [10, 11] },
  { code: '+61', country: 'Australia', flag: '🇦🇺', pattern: /^[2-9]\d{8}$/, length: 9 },
  { code: '+81', country: 'Japan', flag: '🇯🇵', pattern: /^[7-9]\d{9}$/, length: 10 },
  { code: '+49', country: 'Germany', flag: '🇩🇪', pattern: /^\d{10,12}$/, length: [10, 12] },
  { code: '+33', country: 'France', flag: '🇫🇷', pattern: /^[1-9]\d{8}$/, length: 9 },
  { code: '+86', country: 'China', flag: '🇨🇳', pattern: /^1[3-9]\d{9}$/, length: 11 },
  { code: '+7', country: 'Russia', flag: '🇷🇺', pattern: /^9\d{9}$/, length: 10 },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', pattern: /^[1-9]\d{10}$/, length: 11 },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', pattern: /^[1-9]\d{8}$/, length: 9 },
  { code: '+971', country: 'UAE', flag: '🇦🇪', pattern: /^5[0-9]\d{7}$/, length: 9 },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', pattern: /^[89]\d{7}$/, length: 8 },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', pattern: /^1[0-9]\d{7,8}$/, length: [9, 10] },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', pattern: /^[689]\d{8}$/, length: 9 },
];

const validatePhoneByCountry = (phone: string, countryCode: string) => {
  const country = countryCodes.find(c => c.code === countryCode);
  if (!country) return false;
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check length
  if (Array.isArray(country.length)) {
    if (!country.length.includes(cleanPhone.length)) return false;
  } else {
    if (cleanPhone.length !== country.length) return false;
  }
  
  // Check pattern
  return country.pattern.test(cleanPhone);
};

interface ProfileData {
  _id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string; // Keep for backward compatibility
  gender?: string;
  dateOfBirth?: string;
  age?: string;
  aboutMe?: string;
  maritalStatus?: string;
  motherTongue?: string;
  height?: string;
  complexion?: string;
  bloodGroup?: string;
  // Address fields
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
  education?: string;
  collegeUniversity?: string;
  occupation?: string;
  organization?: string;
  designation?: string;
  currentEducation?: string;
  annualIncome?: string;
  jobLocation?: string;
  fathersFullName?: string;
  fathersOccupation?: string;
  fathersBusinessName?: string;
  fathersBusinessLocation?: string;
  fathersDesignation?: string;
  fathersCompanyName?: string;
  fathersWhatsappNumber?: string;
  fathersCountryCode?: string;
  mothersFullName?: string;
  mothersOccupation?: string;
  mothersBusinessName?: string;
  mothersBusinessLocation?: string;
  mothersDesignation?: string;
  mothersCompanyName?: string;
  mothersWhatsappNumber?: string;
  mothersCountryCode?: string;
  brothers?: Array<{
    name?: string;
    occupation?: string;
    companyName?: string;
    currentEducation?: string;
  }>;
  sisters?: Array<{
    name?: string;
    occupation?: string;
    companyName?: string;
    currentEducation?: string;
  }>;
  whatsappNumber?: string;
  countryCode?: string;
  emailId?: string;
  linkedinHandle?: string;
  instagramHandle?: string;
  facebookHandle?: string;
  // Dynamic social media links
  socialMediaLinks?: Array<{
    platform: 'LinkedIn' | 'Instagram' | 'Facebook';
    url: string;
  }>;
  birthName?: string;
  birthTime?: string;
  birthPlace?: string;
  firstGotra?: string;
  secondGotra?: string;
  partnerAgeFrom?: string;
  partnerAgeTo?: string;
  partnerQualification?: string[];
  preferredLocation?: string[];
  minAnnualIncome?: string;
  photos?: { 
    profilePhoto?: { url?: string };
    western?: { url?: string }; 
    traditional?: { url?: string }; 
  };
  profilePhotos?: { western?: string; traditional?: string };
}



const MyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  
  // Photo upload states
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Dropdown options matching StepwiseRegistration
  const dropdownOptions = {
    gender: ["Male", "Female"],
    maritalStatus: ["Unmarried", "Divorced", "Separated", "Widowed"],
    motherTongue: ["English", "Marathi", "Hindi", "Tamil", "Telugu"],
    height: (() => {
      const options = [];
      for (let feet = 4; feet < 7; feet++) {
        for (let inches = 0; inches < 12; inches++) {
          options.push(`${feet}' ${inches}"`);
        }
      }
      return options;
    })(),
    complexion: ["Very Fair", "Fair", "Wheatish", "Dark"],
    bloodGroup: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    education: [
        "Doctorate (PhD)",
        "Post Graduate",
      "Graduate",
      "Diploma",
      "12th Pass",
      "10th Pass",
      "Below 10th",
    ],
    occupation: [
      "Salaried (Private)",
      "Salaried (Government)",
      "Self-Employed",
      "Business Owner",
      "Freelancer",
      "Student",
      "Homemaker",
      "Not Working"
    ],
    annualIncome: ["₹0-5 LPA", "₹5-10 LPA", "₹10-15 LPA", "₹15-20 LPA", "₹20-25 LPA", "₹25-35 LPA", "₹35-50 LPA", "₹50 LPA +"],
    gotra: [
      "Aankul", "Abhimanchkul", "Abhimankul", "Abhimanyukul", "Akumanchal", "Anantkul", "Ankul", "Antakul", "Ayankul",
      "Balshishta/Balshatal", "Bhanukul", "Bibshatla", "Bomadshatla", "Budhankul", "Chandkul", "Chandrakul", "Chandrashil",
      "Chennakul (Channakul)", "Chidrupkul", "Chilkul", "Chilshil", "Chinnakul", "Chitrapil", "Deokul", "Deoshatla",
      "Deoshetti/Devshishta", "Deshatla", "Dhankul", "Dhanshil", "Dikshkul", "Ebhrashatla", "Ebishatla", "Ekshakul",
      "Enkol", "Enkul", "Ennakul", "Eshashishta"
    ]
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data...");
        
        // First check if user is authenticated
        const authResponse = await apiFetch("/api/auth/me");
        console.log("Auth check status:", authResponse.status);
        
        if (!authResponse.ok) {
          console.log("User not authenticated, redirecting to login");
          navigate("/login");
          return;
        }
        
        const authData = await authResponse.json();
        console.log("User data:", authData);
        
        const response = await apiFetch("/api/profiles");
        console.log("Profile response status:", response.status);
        
        if (response.status === 404) {
          console.log("Profile not found, redirecting to registration");
          navigate("/registration");
          return;
        }
        if (!response.ok) {
          const data = await response.json();
          console.log("Profile fetch error:", data);
          setError(data.message || "Unable to load profile.");
          return;
        }
        const data = await response.json();
        console.log("Profile data received:", data);
        // Backend returns { success: true, profile: {...} }
        setProfile(data.profile || data);
        
        // Set photo states from profile data
        if (data.profile?.photos?.western?.url || data.profile?.photos?.traditional?.url || data.profile?.photos?.profilePhoto?.url) {
          setProfilePhoto(
            data.profile?.photos?.profilePhoto?.url || 
            data.profile?.photos?.western?.url || 
            data.profile?.photos?.traditional?.url ||
            data.photos?.profilePhoto?.url ||
            data.photos?.western?.url || 
            data.photos?.traditional?.url
          );
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    try {
      // Handle DD-MM-YYYY format
      if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return `${day} ${date.toLocaleDateString('en-GB', { month: 'short' })} ${year} (${profile?.age || 0}y)`;
      }
      // Handle YYYY-MM-DD format
      const date = new Date(dateStr);
      return `${date.getDate()} ${date.toLocaleDateString('en-GB', { month: 'short' })} ${date.getFullYear()} (${profile?.age || 0})`;
    } catch {
      return dateStr;
    }
  };

  const startEditing = (section: string) => {
    setEditingSection(section);
    const editDataWithSocialLinks = { ...profile };
    
    // Initialize dynamic social media links from legacy fields if they don't exist
    if (!editDataWithSocialLinks.socialMediaLinks && section === 'contact') {
      const socialLinks = [];
      if (profile.linkedinHandle) {
        socialLinks.push({ platform: 'LinkedIn' as const, url: profile.linkedinHandle });
      }
      if (profile.instagramHandle) {
        socialLinks.push({ platform: 'Instagram' as const, url: profile.instagramHandle });
      }
      if (profile.facebookHandle) {
        socialLinks.push({ platform: 'Facebook' as const, url: profile.facebookHandle });
      }
      editDataWithSocialLinks.socialMediaLinks = socialLinks;
    }
    
    setEditData(editDataWithSocialLinks);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData({});
  };

  const saveSection = async (section: string) => {
    setSaving(true);
    try {
      // Validate social media URLs if contact section is being saved
      if (section === 'contact') {
        const errors = [];
        
        // WhatsApp number is required
        if (!editData.whatsappNumber?.trim()) {
          errors.push('WhatsApp number is required');
        } else if (!validatePhoneByCountry(editData.whatsappNumber, editData.countryCode || '+91')) {
          const country = countryCodes.find(c => c.code === (editData.countryCode || '+91'));
          const lengthText = Array.isArray(country?.length) 
            ? `${country.length[0]}-${country.length[country.length.length - 1]}` 
            : country?.length;
          errors.push(`Enter a valid ${country?.country || 'phone'} number (${lengthText} digits)`);
        }
        
        // Validate dynamic social media links (none required)
        (editData.socialMediaLinks || []).forEach((link, index) => {
          if (link.platform && !link.url?.trim()) {
            errors.push(`Social media profile ${index + 1} URL is required when platform is selected`);
          } else if (link.url?.trim()) {
            let isValid = false;
            switch (link.platform) {
              case 'LinkedIn':
                isValid = validateLinkedInURL(link.url);
                break;
              case 'Instagram':
                isValid = validateInstagramURL(link.url);
                break;
              case 'Facebook':
                isValid = validateFacebookURL(link.url);
                break;
            }
            if (!isValid) {
              errors.push(`Please enter a valid ${link.platform} profile URL for profile ${index + 1}`);
            }
          }
        });
        
        // Validate legacy fields if they exist
        if (editData.linkedinHandle && !validateLinkedInURL(editData.linkedinHandle)) {
          errors.push('Please enter a valid LinkedIn profile URL');
        }
        
        if (editData.instagramHandle && !validateInstagramURL(editData.instagramHandle)) {
          errors.push('Please enter a valid Instagram profile URL');
        }
        
        if (editData.facebookHandle && !validateFacebookURL(editData.facebookHandle)) {
          errors.push('Please enter a valid Facebook profile URL');
        }
        
        if (errors.length > 0) {
          alert('Please fix the following errors:\n\n' + errors.join('\n'));
          setSaving(false);
          return;
        }
      }

      // Validate gotras if personal section is being saved
      if (section === 'personal') {
        const errors = [];
        
        if (!editData.firstGotra?.trim()) {
          errors.push('First gotra is required');
        }
        
        if (!editData.secondGotra?.trim()) {
          errors.push('Second gotra is required');
        }
        
        if (errors.length > 0) {
          alert('Please fix the following errors:\n\n' + errors.join('\n'));
          setSaving(false);
          return;
        }
      }

      // Convert dynamic social media links back to legacy format for backend compatibility
      const dataToSave = { ...editData };
      if (section === 'contact' && editData.socialMediaLinks) {
        dataToSave.linkedinHandle = editData.socialMediaLinks.find(link => link.platform === 'LinkedIn')?.url || '';
        dataToSave.instagramHandle = editData.socialMediaLinks.find(link => link.platform === 'Instagram')?.url || '';
        dataToSave.facebookHandle = editData.socialMediaLinks.find(link => link.platform === 'Facebook')?.url || '';
      }

      const response = await apiFetch("/api/profiles", {
        method: "PUT",
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.profile || data);
      setEditingSection(null);
      setEditData({});
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Photo upload handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setProfilePhoto(croppedImageUrl);
    // Save with the new photo
    savePhotoUpdate(croppedImageUrl);
    setShowCropper(false);
    setOriginalImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage(null);
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    // Save with photo removed
    savePhotoUpdate(null);
  };

  const savePhotoUpdate = async (newPhoto?: string | null) => {
    try {
      setSaving(true);
      const photoData = {
        photos: {
          profilePhoto: newPhoto ? { url: newPhoto, publicId: '' } : undefined
        }
      };

      const response = await apiFetch("/api/profiles", {
        method: "PUT",
        body: JSON.stringify(photoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update photo");
      }

      const data = await response.json();
      setProfile(data.profile || data);
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Failed to save photo changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getFatherOccupationDetails = () => {
    if (!profile?.fathersOccupation) return "Occupation not specified";
    
    switch (profile.fathersOccupation) {
      case "Business":
        return `Business${profile.fathersBusinessName ? ` - ${profile.fathersBusinessName}` : ''}${profile.fathersBusinessLocation ? ` (${profile.fathersBusinessLocation})` : ''}`;
      case "Job/Salaried":
        return `${profile.fathersDesignation || 'Employee'}${profile.fathersCompanyName ? ` at ${profile.fathersCompanyName}` : ''}`;
      case "Other":
        return "Other occupation";
      default:
        return profile.fathersOccupation;
    }
  };

  const getMotherOccupationDetails = () => {
    if (!profile?.mothersOccupation) return "Occupation not specified";
    
    switch (profile.mothersOccupation) {
      case "Business":
        return `Business${profile.mothersBusinessName ? ` - ${profile.mothersBusinessName}` : ''}${profile.mothersBusinessLocation ? ` (${profile.mothersBusinessLocation})` : ''}`;
      case "Job/Salaried":
        return `${profile.mothersDesignation || 'Employee'}${profile.mothersCompanyName ? ` at ${profile.mothersCompanyName}` : ''}`;
      case "Other":
        return "Other occupation";
      default:
        return profile.mothersOccupation;
    }
  };

  if (loading) {
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
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ED9B59] rounded-lg flex items-center justify-center mb-4 animate-pulse mx-auto">
                  <span className="text-white text-2xl font-black">👤</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Loading your profile...</h3>
                <p className="text-slate-500">Please wait while we fetch your information</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
            <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-[16px] p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-red-500 text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Unable to load profile</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button 
                  onClick={() => navigate("/registration")}
                  className="bg-[#ED9B59] hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-full transition-all active:scale-95"
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    navigate("/registration");
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-jakarta selection:bg-pink-100 antialiased relative">
      {/* Background Pattern Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 238, 240, 0.1)" }} />
        <BackgroundPatterns />
      </div>

      <main className="relative z-10 max-w-[1512px] mx-auto px-2 md:px-9 pt-4">
        <div className="rounded-[32px] bg-white relative shadow-sm border border-slate-50 min-h-[calc(100vh-40px)]">
          <Navbar />
          
          {/* Header Section */}
          <div className="px-5 sm:px-8 md:px-12 lg:px-16 pt-20 pb-6">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="font-bold text-[28px] sm:text-[34px] lg:text-[42px] leading-tight tracking-tight text-slate-900 mb-2">
                My <span className="text-[#ED9B59]">Profile</span>
              </h1>
              <p className="text-slate-600 text-base lg:text-lg">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-5 sm:px-8 md:px-12 lg:px-16 pb-12">
            <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
              {/* LEFT PROFILE CARD - STICKY */}
              <div className="xl:w-[380px] xl:flex-shrink-0 xl:sticky xl:top-8 xl:self-start">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] shadow-xl border border-slate-100 p-8 text-center relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Decorative Elements */}
                  
                  {/* Edit Button */}
                  {editingSection === 'leftCard' ? (
                    <div className="flex gap-2 absolute top-6 right-6 z-10">
                      <button
                        onClick={() => saveSection('leftCard')}
                        disabled={saving}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors shadow-lg bg-white hover:shadow-green-200"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors shadow-lg bg-white hover:shadow-red-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing('leftCard')}
                      className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#ED9B59] hover:bg-white rounded-full transition-all shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-orange-200"
                    >
                      <Pencil size={18} />
                    </button>
                  )}

                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="w-36 h-36 mx-auto rounded-[24px] overflow-hidden shadow-2xl ring-4 ring-white relative group">
                      <img
                        src={profilePhoto || 
                             profile?.photos?.profilePhoto?.url ||
                             profile?.photos?.traditional?.url || 
                             profile?.photos?.western?.url || 
                             profile?.profilePhotos?.traditional || 
                             profile?.profilePhotos?.western || 
                             "https://images.unsplash.com/photo-1607746882042-944635dfe10e"}
                        alt={profile.fullName || "Profile"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Photo Upload Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <label className="cursor-pointer bg-white/90 hover:bg-white p-3 rounded-full transition-colors">
                          <Camera size={24} className="text-slate-700" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* Photo Management Button */}
                    <div className="flex justify-center mt-3">
                      {(profilePhoto || profile?.photos?.profilePhoto?.url || profile?.photos?.traditional?.url || profile?.photos?.western?.url || profile?.profilePhotos?.traditional || profile?.profilePhotos?.western) && (
                        <button
                          onClick={removePhoto}
                          className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>

                  {editingSection === 'leftCard' ? (
                    <div className="space-y-4 text-left">
                      <EditableField
                        label="First Name"
                        type="text"
                        value={editData.firstName || ''}
                        onChange={(value) => handleInputChange('firstName', value)}
                        placeholder="Enter your first name"
                      />
                      <EditableField
                        label="Middle Name"
                        type="text"
                        value={editData.middleName || ''}
                        onChange={(value) => handleInputChange('middleName', value)}
                        placeholder="Enter your middle name "
                      />
                      <EditableField
                        label="Last Name"
                        type="text"
                        value={editData.lastName || ''}
                        onChange={(value) => handleInputChange('lastName', value)}
                        placeholder="Enter your last name"
                      />
                      <EditableField
                        label="Date of Birth"
                        type="date"
                        value={editData.dateOfBirth ? (editData.dateOfBirth.includes('-') && editData.dateOfBirth.split('-')[0].length === 4 ? editData.dateOfBirth : '') : ''}
                        onChange={(value) => handleInputChange('dateOfBirth', value)}
                        placeholder="Select date of birth"
                      />
                      <EditableField
                        label="Job Location"
                        type="text"
                        value={editData.jobLocation || ''}
                        onChange={(value) => handleInputChange('jobLocation', value)}
                        placeholder="Enter job location"
                      />
                      <EditableField
                        label="Designation"
                        type="text"
                        value={editData.designation || ''}
                        onChange={(value) => handleInputChange('designation', value)}
                        placeholder="Enter designation"
                      />
                      <EditableField
                        label="Organization"
                        type="text"
                        value={editData.organization || ''}
                        onChange={(value) => handleInputChange('organization', value)}
                        placeholder="Enter organization"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || "Your Name"}
                      </h2>

                      <p className="text-sm text-slate-500 mb-6 font-medium bg-slate-50 inline-block px-3 py-1 rounded-full">
                        ID: {profile._id?.slice(-6) || "------"}
                      </p>

                      <div className="space-y-4 text-left">
                        <InfoCard 
                          icon="📍" 
                          iconColor="bg-blue-100 text-blue-600" 
                          label="Location" 
                          value={profile.jobLocation || "Not specified"} 
                        />
                        <InfoCard 
                          icon="🎂" 
                          iconColor="bg-rose-100 text-rose-600" 
                          label="Age" 
                          value={formatDate(profile.dateOfBirth || "")} 
                        />
                        <InfoCard 
                          icon="💼" 
                          iconColor="bg-purple-100 text-purple-600" 
                          label="Profession" 
                          value={profile.designation || profile.occupation || "Not specified"} 
                        />
                        <InfoCard 
                          icon="🏢" 
                          iconColor="bg-green-100 text-green-600" 
                          label="Organization" 
                          value={profile.organization || "Not specified"} 
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT CONTENT SECTIONS */}
              <div className="flex-1">
                <div className="space-y-8">
                  {/* ABOUT SECTION */}
                  <ProfileSection
                    title={`About You`}
                    sectionKey="about"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="💭"
                    iconColor="bg-blue-100 text-blue-600"
                  >
                    {editingSection === 'about' ? (
                      <div className="mt-4 relative">
                        <textarea
                          value={editData.aboutMe || ''}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 200);
                            handleInputChange('aboutMe', value);
                          }}
                          className="w-full p-4 pr-16 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:shadow transition-shadow"
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                        <div className="absolute bottom-3 right-4 text-xs text-slate-400 font-medium">
                          {(editData.aboutMe || '').length}/200
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 mt-4 leading-relaxed bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        {profile.aboutMe || "No description provided yet. Click the edit icon to add information about yourself."}
                      </p>
                    )}
                  </ProfileSection>

                  {/* PERSONAL INFORMATION */}
                  <ProfileSection
                    title="Personal Information"
                    sectionKey="personal"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="👤"
                    iconColor="bg-purple-100 text-purple-600"
                  >
                    {editingSection === 'personal' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <EditableField
                          label="Gender"
                          type="select"
                          value={editData.gender || ''}
                          onChange={(value) => handleInputChange('gender', value)}
                          options={dropdownOptions.gender}
                        />
                        <EditableField
                          label="Marital Status"
                          type="select"
                          value={editData.maritalStatus || ''}
                          onChange={(value) => handleInputChange('maritalStatus', value)}
                          options={dropdownOptions.maritalStatus}
                        />
                        <EditableField
                          label="Height"
                          type="select"
                          value={editData.height || ''}
                          onChange={(value) => handleInputChange('height', value)}
                          options={dropdownOptions.height}
                        />
                        <EditableField
                          label="Blood Group"
                          type="select"
                          value={editData.bloodGroup || ''}
                          onChange={(value) => handleInputChange('bloodGroup', value)}
                          options={dropdownOptions.bloodGroup}
                        />
                        <EditableField
                          label="Complexion"
                          type="select"
                          value={editData.complexion || ''}
                          onChange={(value) => handleInputChange('complexion', value)}
                          options={dropdownOptions.complexion}
                        />
                        <EditableField
                          label="Mother Tongue"
                          type="select"
                          value={editData.motherTongue || ''}
                          onChange={(value) => handleInputChange('motherTongue', value)}
                          options={dropdownOptions.motherTongue}
                        />
                        <EditableField
                          label="First Gotra"
                          type="select"
                          value={editData.firstGotra || ''}
                          onChange={(value) => handleInputChange('firstGotra', value)}
                          options={dropdownOptions.gotra}
                          required={true}
                        />
                        <EditableField
                          label="Second Gotra"
                          type="select"
                          value={editData.secondGotra || ''}
                          onChange={(value) => handleInputChange('secondGotra', value)}
                          options={dropdownOptions.gotra}
                          required={true}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <EnhancedInfoCard label="Gender" value={profile.gender || "Not specified"} icon="⚧️" />
                        <EnhancedInfoCard label="Marital Status" value={profile.maritalStatus || "Not specified"} icon="💍" />
                        <EnhancedInfoCard label="Height" value={profile.height || "Not specified"} icon="📏" />
                        <EnhancedInfoCard label="Blood Group" value={profile.bloodGroup || "Not specified"} icon="🩸" />
                        <EnhancedInfoCard label="Complexion" value={profile.complexion || "Not specified"} icon="✨" />
                        <EnhancedInfoCard label="Mother Tongue" value={profile.motherTongue || "Not specified"} icon="🗣️" />
                        <EnhancedInfoCard label="First Gotra" value={profile.firstGotra || "Not specified"} icon="🕉️" />
                        <EnhancedInfoCard label="Second Gotra" value={profile.secondGotra || "Not specified"} icon="🕉️" />
                      </div>
                    )}
                  </ProfileSection>

                  {/* CONTACT DETAILS - SINGLE CARD (No Duplicate) */}
                  <ProfileSection
                    title="Contact Details"
                    sectionKey="contact"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="📞"
                    iconColor="bg-green-100 text-green-600"
                  >
                    {editingSection === 'contact' ? (
                      <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* WhatsApp Number with Country Code */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                              WhatsApp Number
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="flex gap-2">
                              {/* Country Code Dropdown */}
                              <select
                                value={editData.countryCode || '+91'}
                                onChange={(e) => {
                                  handleInputChange('countryCode', e.target.value);
                                  // Clear phone number when country changes
                                  if (editData.whatsappNumber) {
                                    handleInputChange('whatsappNumber', '');
                                  }
                                }}
                                className="px-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm min-w-[120px]"
                              >
                                {countryCodes.map((country) => (
                                  <option key={country.code} value={country.code}>
                                    {country.flag} {country.code}
                                  </option>
                                ))}
                              </select>
                              
                              {/* Phone Number Input */}
                              <input
                                type="tel"
                                value={editData.whatsappNumber || ''}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  const country = countryCodes.find(c => c.code === (editData.countryCode || '+91'));
                                  const maxLength = Array.isArray(country?.length) 
                                    ? Math.max(...country.length) 
                                    : country?.length || 15;
                                  
                                  if (value.length <= maxLength) {
                                    handleInputChange('whatsappNumber', value);
                                  }
                                }}
                                placeholder={(() => {
                                  const country = countryCodes.find(c => c.code === (editData.countryCode || '+91'));
                                  if (country?.code === '+91') return "9876543210";
                                  if (country?.code === '+1') return "2345678901";
                                  if (country?.code === '+44') return "7700900123";
                                  return "Enter phone number";
                                })()}
                                className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm"
                              />
                            </div>
                            <div className="text-xs text-slate-500">
                              {(() => {
                                const country = countryCodes.find(c => c.code === (editData.countryCode || '+91'));
                                const lengthText = Array.isArray(country?.length) 
                                  ? `${country.length[0]}-${country.length[country.length.length - 1]}` 
                                  : country?.length;
                                return `Enter ${lengthText} digit ${country?.country} phone number`;
                              })()}
                            </div>
                          </div>
                          
                          <EditableField
                            label="Email Address"
                            type="text"
                            value={editData.emailId || ''}
                            onChange={(value) => handleInputChange('emailId', value)}
                            placeholder="Enter email address"
                          />
                        </div>
                        
                        {/* Social Media Section */}
                        <div className="space-y-4">
                          <div className="text-center">
                            <h4 className="text-md font-bold text-slate-900 mb-2">Social Media Profiles</h4>
                            <p className="text-sm text-slate-600">Add up to 3 social media profiles (optional)</p>
                          </div>
                          
                          {/* Dynamic Social Media Links */}
                          <div className="space-y-4">
                            {(editData.socialMediaLinks || []).map((link, index) => {
                              // Get available platforms (exclude already selected ones)
                              const selectedPlatforms = (editData.socialMediaLinks || []).map(l => l.platform).filter(p => p);
                              const availablePlatforms = ['LinkedIn', 'Instagram', 'Facebook'].filter(platform => 
                                !selectedPlatforms.includes(platform) || platform === link.platform
                              );
                              
                              return (
                                <div key={index} className="bg-slate-50 rounded-lg p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-bold text-slate-700">Profile {index + 1}</h5>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newLinks = (editData.socialMediaLinks || []).filter((_, i) => i !== index);
                                        handleInputChange('socialMediaLinks', newLinks);
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Platform Dropdown */}
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Platform</label>
                                      <select
                                        value={link.platform}
                                        onChange={(e) => {
                                          const newLinks = [...(editData.socialMediaLinks || [])];
                                          newLinks[index] = { ...link, platform: e.target.value as 'LinkedIn' | 'Instagram' | 'Facebook', url: '' };
                                          handleInputChange('socialMediaLinks', newLinks);
                                        }}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm"
                                      >
                                        <option value="">Select Platform</option>
                                        {availablePlatforms.map(platform => (
                                          <option key={platform} value={platform}>
                                            {platform === 'LinkedIn' && '🔗 LinkedIn'}
                                            {platform === 'Instagram' && '📷 Instagram'}
                                            {platform === 'Facebook' && '📘 Facebook'}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* URL Input */}
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Profile URL</label>
                                      <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => {
                                          const newLinks = [...(editData.socialMediaLinks || [])];
                                          newLinks[index] = { ...link, url: e.target.value };
                                          handleInputChange('socialMediaLinks', newLinks);
                                        }}
                                        placeholder={
                                          link.platform === 'LinkedIn' ? 'https://linkedin.com/in/yourname' :
                                          link.platform === 'Instagram' ? 'https://instagram.com/yourname' :
                                          link.platform === 'Facebook' ? 'https://facebook.com/yourname' :
                                          'Enter profile URL'
                                        }
                                        disabled={!link.platform}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm transition-colors ${
                                          link.url && (
                                            (link.platform === 'LinkedIn' && !validateLinkedInURL(link.url)) ||
                                            (link.platform === 'Instagram' && !validateInstagramURL(link.url)) ||
                                            (link.platform === 'Facebook' && !validateFacebookURL(link.url))
                                          ) ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                      />
                                      {link.url && (
                                        (link.platform === 'LinkedIn' && !validateLinkedInURL(link.url)) ||
                                        (link.platform === 'Instagram' && !validateInstagramURL(link.url)) ||
                                        (link.platform === 'Facebook' && !validateFacebookURL(link.url))
                                      ) && (
                                        <p className="text-xs text-red-500">Please enter a valid {link.platform} URL</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Add Social Media Button */}
                            {(editData.socialMediaLinks || []).length < 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  // Find the first available platform
                                  const selectedPlatforms = (editData.socialMediaLinks || []).map(l => l.platform).filter(p => p);
                                  const availablePlatforms = ['LinkedIn', 'Instagram', 'Facebook'].filter(platform => 
                                    !selectedPlatforms.includes(platform)
                                  );
                                  const defaultPlatform = availablePlatforms[0] || '';
                                  
                                  const newLinks = [...(editData.socialMediaLinks || []), { platform: defaultPlatform as 'LinkedIn' | 'Instagram' | 'Facebook', url: '' }];
                                  handleInputChange('socialMediaLinks', newLinks);
                                }}
                                className="w-full bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 text-slate-500 hover:text-[#ED9B59] hover:border-[#ED9B59] transition-all flex items-center justify-center gap-2 font-semibold"
                              >
                                <Plus size={18} />
                                Add Social Media Profile ({(editData.socialMediaLinks || []).length}/3)
                              </button>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs text-slate-500">
                              <span className="text-red-500">*</span> At least one social media profile is required • Maximum 3 profiles
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-4">
                        {/* Email */}
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                          
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</p>
                            <p className="font-semibold text-slate-900 truncate">{profile.emailId || "Not provided"}</p>
                          </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                          
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">WhatsApp Number</p>
                            <p className="font-semibold text-slate-900">
                              {profile.countryCode && profile.whatsappNumber 
                                ? `${profile.countryCode} ${profile.whatsappNumber}` 
                                : profile.whatsappNumber || "Not provided"}
                            </p>
                            {profile.countryCode && (
                              <p className="text-xs text-slate-500">
                                {countryCodes.find(c => c.code === profile.countryCode)?.country}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Social Media */}
                        {(profile.linkedinHandle || profile.instagramHandle || profile.facebookHandle) && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Social Media Profiles</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {profile.linkedinHandle && (
                                <SocialMediaCard 
                                  platform="LinkedIn" 
                                  handle={profile.linkedinHandle} 
                                  icon="🔗" 
                                  color="bg-blue-100 text-blue-600" 
                                />
                              )}
                              {profile.instagramHandle && (
                                <SocialMediaCard 
                                  platform="Instagram" 
                                  handle={profile.instagramHandle} 
                                  icon="📷" 
                                  color="bg-pink-100 text-pink-600" 
                                />
                              )}
                              {profile.facebookHandle && (
                                <SocialMediaCard 
                                  platform="Facebook" 
                                  handle={profile.facebookHandle} 
                                  icon="👥" 
                                  color="bg-blue-100 text-blue-600" 
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ProfileSection>

                  {/* CURRENT ADDRESS */}
                  <ProfileSection
                    title="Current Address"
                    sectionKey="currentAddress"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="🏠"
                    iconColor="bg-blue-100 text-blue-600"
                  >
                    {editingSection === 'currentAddress' ? (
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <EditableField
                            label="Address Line 1"
                            type="text"
                            value={editData.currentAddressLine1 || ''}
                            onChange={(value) => handleInputChange('currentAddressLine1', value)}
                            placeholder="Enter address line 1"
                          />
                          <EditableField
                            label="Address Line 2"
                            type="text"
                            value={editData.currentAddressLine2 || ''}
                            onChange={(value) => handleInputChange('currentAddressLine2', value)}
                            placeholder="Enter address line 2 (optional)"
                          />
                          <EditableField
                            label="City"
                            type="text"
                            value={editData.currentCity || ''}
                            onChange={(value) => handleInputChange('currentCity', value)}
                            placeholder="Enter city"
                          />
                          <EditableField
                            label="State"
                            type="text"
                            value={editData.currentState || ''}
                            onChange={(value) => handleInputChange('currentState', value)}
                            placeholder="Enter state"
                          />
                          <EditableField
                            label="Pincode"
                            type="text"
                            value={editData.currentPincode || ''}
                            onChange={(value) => {
                              const numericValue = value.replace(/\D/g, '');
                              if (numericValue.length <= 6) {
                                handleInputChange('currentPincode', numericValue);
                              }
                            }}
                            placeholder="Enter 6-digit pincode"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Address</p>
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">{profile.currentAddressLine1 || "Not provided"}</p>
                              {profile.currentAddressLine2 && (
                                <p className="text-slate-700">{profile.currentAddressLine2}</p>
                              )}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Location</p>
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">{profile.currentCity || "Not provided"}</p>
                              <p className="text-slate-700">{profile.currentState || "Not provided"}</p>
                              <p className="text-slate-600 text-sm">{profile.currentPincode || "Not provided"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ProfileSection>

                  {/* PERMANENT ADDRESS */}
                  <ProfileSection
                    title="Permanent Address"
                    sectionKey="permanentAddress"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="🏡"
                    iconColor="bg-green-100 text-green-600"
                  >
                    {editingSection === 'permanentAddress' ? (
                      <div className="space-y-4 mt-4">
                        <div className="mb-4">
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.sameAsPermanentAddress || false}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                handleInputChange('sameAsPermanentAddress', isChecked);
                                
                                if (isChecked) {
                                  // Copy current address to permanent address
                                  handleInputChange('permanentAddressLine1', editData.currentAddressLine1 || profile.currentAddressLine1 || '');
                                  handleInputChange('permanentAddressLine2', editData.currentAddressLine2 || profile.currentAddressLine2 || '');
                                  handleInputChange('permanentCity', editData.currentCity || profile.currentCity || '');
                                  handleInputChange('permanentState', editData.currentState || profile.currentState || '');
                                  handleInputChange('permanentPincode', editData.currentPincode || profile.currentPincode || '');
                                }
                              }}
                              className="w-4 h-4 text-[#ED9B59] bg-white border-2 border-slate-300 rounded focus:ring-[#ED9B59] focus:ring-2"
                            />
                            <span className="text-sm font-semibold text-slate-700">Same as current address</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <EditableField
                            label="Address Line 1"
                            type="text"
                            value={editData.permanentAddressLine1 || ''}
                            onChange={(value) => handleInputChange('permanentAddressLine1', value)}
                            placeholder="Enter address line 1"
                            disabled={editData.sameAsPermanentAddress}
                          />
                          <EditableField
                            label="Address Line 2"
                            type="text"
                            value={editData.permanentAddressLine2 || ''}
                            onChange={(value) => handleInputChange('permanentAddressLine2', value)}
                            placeholder="Enter address line 2 (optional)"
                            disabled={editData.sameAsPermanentAddress}
                          />
                          <EditableField
                            label="City"
                            type="text"
                            value={editData.permanentCity || ''}
                            onChange={(value) => handleInputChange('permanentCity', value)}
                            placeholder="Enter city"
                            disabled={editData.sameAsPermanentAddress}
                          />
                          <EditableField
                            label="State"
                            type="text"
                            value={editData.permanentState || ''}
                            onChange={(value) => handleInputChange('permanentState', value)}
                            placeholder="Enter state"
                            disabled={editData.sameAsPermanentAddress}
                          />
                          <EditableField
                            label="Pincode"
                            type="text"
                            value={editData.permanentPincode || ''}
                            onChange={(value) => {
                              const numericValue = value.replace(/\D/g, '');
                              if (numericValue.length <= 6) {
                                handleInputChange('permanentPincode', numericValue);
                              }
                            }}
                            placeholder="Enter 6-digit pincode"
                            disabled={editData.sameAsPermanentAddress}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-4">
                        {profile.sameAsPermanentAddress && (
                          <div className="  border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-blue-700 text-sm font-medium">✓ Same as current address</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Address</p>
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">{profile.permanentAddressLine1 || "Not provided"}</p>
                              {profile.permanentAddressLine2 && (
                                <p className="text-slate-700">{profile.permanentAddressLine2}</p>
                              )}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Location</p>
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">{profile.permanentCity || "Not provided"}</p>
                              <p className="text-slate-700">{profile.permanentState || "Not provided"}</p>
                              <p className="text-slate-600 text-sm">{profile.permanentPincode || "Not provided"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ProfileSection>

                  {/* EDUCATION & PROFESSION */}
                  <ProfileSection
                    title="Education & Profession"
                    sectionKey="education"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="🎓"
                    iconColor="bg-amber-100 text-amber-600"
                  >
                    {editingSection === 'education' ? (
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <EditableField
                            label="Education"
                            type="select"
                            value={editData.education || ''}
                            onChange={(value) => handleInputChange('education', value)}
                            options={dropdownOptions.education}
                          />
                          <EditableField
                            label="College/University"
                            type="text"
                            value={editData.collegeUniversity || ''}
                            onChange={(value) => handleInputChange('collegeUniversity', value)}
                            placeholder="Enter college/university name"
                          />
                          <EditableField
                            label="Occupation"
                            type="select"
                            value={editData.occupation || ''}
                            onChange={(value) => handleInputChange('occupation', value)}
                            options={dropdownOptions.occupation}
                          />
                          <EditableField
                            label="Organization"
                            type="text"
                            value={editData.organization || ''}
                            onChange={(value) => handleInputChange('organization', value)}
                            placeholder="Enter organization name"
                          />
                          <EditableField
                            label="Designation"
                            type="text"
                            value={editData.designation || ''}
                            onChange={(value) => handleInputChange('designation', value)}
                            placeholder="Enter designation"
                          />
                          <EditableField
                            label="Annual Income"
                            type="select"
                            value={editData.annualIncome || ''}
                            onChange={(value) => handleInputChange('annualIncome', value)}
                            options={dropdownOptions.annualIncome}
                          />
                          <EditableField
                            label="Job Location"
                            type="text"
                            value={editData.jobLocation || ''}
                            onChange={(value) => handleInputChange('jobLocation', value)}
                            placeholder="Enter job location"
                          />
                          <EditableField
                            label="Current Education"
                            type="text"
                            value={editData.currentEducation || ''}
                            onChange={(value) => handleInputChange('currentEducation', value)}
                            placeholder="For students"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-4">
                        {/* Education Card */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Education</p>
                              <p className="font-semibold text-slate-900">{profile.education || "Not specified"}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                            {profile.collegeUniversity || "Institution not specified"}
                          </p>
                          {profile.currentEducation && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                              <p className="text-xs font-medium text-amber-800">Currently Studying</p>
                              <p className="text-sm text-amber-900">{profile.currentEducation}</p>
                            </div>
                          )}
                        </div>

                        {/* Profession Card */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Profession</p>
                              <p className="font-semibold text-slate-900">{profile.designation || profile.occupation || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-medium text-slate-500">Organization</p>
                              <p className="text-sm text-slate-900">{profile.organization || "Not specified"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500">Job Location</p>
                              <p className="text-sm text-slate-900">{profile.jobLocation || "Not specified"}</p>
                            </div>
                            {profile.annualIncome && (
                              <div>
                                <p className="text-xs font-medium text-slate-500">Annual Income</p>
                                <p className="text-sm text-slate-900">{profile.annualIncome}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </ProfileSection>

                  {/* FAMILY DETAILS */}
                  <ProfileSection
                    title="Family Details"
                    sectionKey="family"
                    editingSection={editingSection}
                    onEdit={startEditing}
                    onSave={saveSection}
                    onCancel={cancelEditing}
                    saving={saving}
                    icon="👨‍👩‍👧‍👦"
                    iconColor="bg-rose-100 text-rose-600"
                  >
                    {editingSection === 'family' ? (
                      <div className="space-y-6 mt-4">
                        {/* Parents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800">Father's Details</h3>
                            <EditableField
                              label="Father's Full Name"
                              type="text"
                              value={editData.fathersFullName || ''}
                              onChange={(value) => handleInputChange('fathersFullName', value)}
                              placeholder="Enter father's name"
                            />
                            <EditableField
                              label="Father's Occupation"
                              type="select"
                              value={editData.fathersOccupation || ''}
                              onChange={(value) => handleInputChange('fathersOccupation', value)}
                              options={["Business", "Job/Salaried", "Retired", "Homemaker", "Not Working", "Other"]}
                              required
                            />
                            {editData.fathersOccupation === "Business" && (
                              <>
                                <EditableField
                                  label="Business Name"
                                  type="text"
                                  value={editData.fathersBusinessName || ''}
                                  onChange={(value) => handleInputChange('fathersBusinessName', value)}
                                  placeholder="Enter business name"
                                />
                                <EditableField
                                  label="Business Location"
                                  type="text"
                                  value={editData.fathersBusinessLocation || ''}
                                  onChange={(value) => handleInputChange('fathersBusinessLocation', value)}
                                  placeholder="Enter business location"
                                />
                              </>
                            )}
                            {editData.fathersOccupation === "Job/Salaried" && (
                              <>
                                <EditableField
                                  label="Designation"
                                  type="text"
                                  value={editData.fathersDesignation || ''}
                                  onChange={(value) => handleInputChange('fathersDesignation', value)}
                                  placeholder="Enter designation"
                                />
                                <EditableField
                                  label="Company Name"
                                  type="text"
                                  value={editData.fathersCompanyName || ''}
                                  onChange={(value) => handleInputChange('fathersCompanyName', value)}
                                  placeholder="Enter company name"
                                />
                              </>
                            )}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Father's WhatsApp Number</label>
                              <div className="flex gap-2">
                                <select
                                  value={editData.fathersCountryCode || '+91'}
                                  onChange={(e) => handleInputChange('fathersCountryCode', e.target.value)}
                                  className="w-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm"
                                >
                                  {countryCodes.map((country) => (
                                    <option key={country.code} value={country.code}>
                                      {country.flag} {country.code}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  value={editData.fathersWhatsappNumber || ''}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleInputChange('fathersWhatsappNumber', value);
                                  }}
                                  placeholder="Enter father's WhatsApp number"
                                  className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800">Mother's Details</h3>
                            <EditableField
                              label="Mother's Full Name"
                              type="text"
                              value={editData.mothersFullName || ''}
                              onChange={(value) => handleInputChange('mothersFullName', value)}
                              placeholder="Enter mother's name"
                            />
                            <EditableField
                              label="Mother's Occupation"
                              type="select"
                              value={editData.mothersOccupation || ''}
                              onChange={(value) => handleInputChange('mothersOccupation', value)}
                              options={["Business", "Job/Salaried", "Retired", "Homemaker", "Not Working", "Other"]}
                              required
                            />
                            {editData.mothersOccupation === "Business" && (
                              <>
                                <EditableField
                                  label="Business Name"
                                  type="text"
                                  value={editData.mothersBusinessName || ''}
                                  onChange={(value) => handleInputChange('mothersBusinessName', value)}
                                  placeholder="Enter business name"
                                />
                                <EditableField
                                  label="Business Location"
                                  type="text"
                                  value={editData.mothersBusinessLocation || ''}
                                  onChange={(value) => handleInputChange('mothersBusinessLocation', value)}
                                  placeholder="Enter business location"
                                />
                              </>
                            )}
                            {editData.mothersOccupation === "Job/Salaried" && (
                              <>
                                <EditableField
                                  label="Designation"
                                  type="text"
                                  value={editData.mothersDesignation || ''}
                                  onChange={(value) => handleInputChange('mothersDesignation', value)}
                                  placeholder="Enter designation"
                                />
                                <EditableField
                                  label="Company Name"
                                  type="text"
                                  value={editData.mothersCompanyName || ''}
                                  onChange={(value) => handleInputChange('mothersCompanyName', value)}
                                  placeholder="Enter company name"
                                />
                              </>
                            )}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mother's WhatsApp Number</label>
                              <div className="flex gap-2">
                                <select
                                  value={editData.mothersCountryCode || '+91'}
                                  onChange={(e) => handleInputChange('mothersCountryCode', e.target.value)}
                                  className="w-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm"
                                >
                                  {countryCodes.map((country) => (
                                    <option key={country.code} value={country.code}>
                                      {country.flag} {country.code}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  value={editData.mothersWhatsappNumber || ''}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleInputChange('mothersWhatsappNumber', value);
                                  }}
                                  placeholder="Enter mother's WhatsApp number"
                                  className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Siblings */}
                        <div className="border-t pt-6">
                          <h3 className="font-semibold text-gray-800 mb-4">Siblings</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">Brothers</label>
                                <button
                                  onClick={() => {
                                    const newBrother = { name: "", occupation: "", companyName: "", currentEducation: "" };
                                    setEditData(prev => ({
                                      ...prev,
                                      brothers: [...(prev.brothers || []), newBrother]
                                    }));
                                  }}
                                  className="text-xs  0 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                >
                                  Add Brother
                                </button>
                              </div>
                              {(editData.brothers || []).map((brother, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2 bg-white">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <EditableField
                                      label="Name"
                                      type="text"
                                      value={brother.name || ''}
                                      onChange={(value) => {
                                        const updatedBrothers = [...(editData.brothers || [])];
                                        updatedBrothers[index] = { ...brother, name: value };
                                        setEditData(prev => ({ ...prev, brothers: updatedBrothers }));
                                      }}
                                      placeholder="Brother's name"
                                    />
                                    <EditableField
                                      label="Occupation"
                                      type="text"
                                      value={brother.occupation || ''}
                                      onChange={(value) => {
                                        const updatedBrothers = [...(editData.brothers || [])];
                                        updatedBrothers[index] = { ...brother, occupation: value };
                                        setEditData(prev => ({ ...prev, brothers: updatedBrothers }));
                                      }}
                                      placeholder="Occupation"
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const updatedBrothers = (editData.brothers || []).filter((_, i) => i !== index);
                                      setEditData(prev => ({ ...prev, brothers: updatedBrothers }));
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 mt-2 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">Sisters</label>
                                <button
                                  onClick={() => {
                                    const newSister = { name: "", occupation: "", companyName: "", currentEducation: "" };
                                    setEditData(prev => ({
                                      ...prev,
                                      sisters: [...(prev.sisters || []), newSister]
                                    }));
                                  }}
                                  className="text-xs   0 text-white px-2 py-1 rounded hover:bg-pink-600 transition-colors"
                                >
                                  Add Sister
                                </button>
                              </div>
                              {(editData.sisters || []).map((sister, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2 bg-white">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <EditableField
                                      label="Name"
                                      type="text"
                                      value={sister.name || ''}
                                      onChange={(value) => {
                                        const updatedSisters = [...(editData.sisters || [])];
                                        updatedSisters[index] = { ...sister, name: value };
                                        setEditData(prev => ({ ...prev, sisters: updatedSisters }));
                                      }}
                                      placeholder="Sister's name"
                                    />
                                    <EditableField
                                      label="Occupation"
                                      type="text"
                                      value={sister.occupation || ''}
                                      onChange={(value) => {
                                        const updatedSisters = [...(editData.sisters || [])];
                                        updatedSisters[index] = { ...sister, occupation: value };
                                        setEditData(prev => ({ ...prev, sisters: updatedSisters }));
                                      }}
                                      placeholder="Occupation"
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const updatedSisters = (editData.sisters || []).filter((_, i) => i !== index);
                                      setEditData(prev => ({ ...prev, sisters: updatedSisters }));
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 mt-2 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-4">
                        {/* Parents Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Father */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                              
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Father</p>
                                <p className="font-semibold text-slate-900">{profile.fathersFullName || "Name not provided"}</p>
                              </div>
                            </div>
                            <div className="  p-3 rounded-md">
                              <p className="text-xs font-medium text-blue-800">Occupation</p>
                              <p className="text-sm text-blue-900">{getFatherOccupationDetails()}</p>
                            </div>
                            {profile.fathersWhatsappNumber && (
                              <div className="mt-2 p-3 bg-slate-50 rounded-md">
                                <p className="text-xs font-medium text-slate-600">Contact</p>
                                <p className="text-sm text-slate-800">📱 {profile.fathersCountryCode || '+91'} {profile.fathersWhatsappNumber}</p>
                              </div>
                            )}
                          </div>

                          {/* Mother */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                              
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mother</p>
                                <p className="font-semibold text-slate-900">{profile.mothersFullName || "Name not provided"}</p>
                              </div>
                            </div>
                            <div className="   p-3 rounded-md">
                              <p className="text-xs font-medium text-pink-800">Occupation</p>
                              <p className="text-sm text-pink-900">{getMotherOccupationDetails()}</p>
                            </div>
                            {profile.mothersWhatsappNumber && (
                              <div className="mt-2 p-3 bg-slate-50 rounded-md">
                                <p className="text-xs font-medium text-slate-600">Contact</p>
                                <p className="text-sm text-slate-800">📱 {profile.mothersCountryCode || '+91'} {profile.mothersWhatsappNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Siblings */}
                        {((profile.brothers && profile.brothers.length > 0) || (profile.sisters && profile.sisters.length > 0)) && (
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                              
                              <div>
                                <p className="font-semibold text-slate-900">Siblings</p>
                                <p className="text-xs text-slate-500">
                                  {(profile.brothers?.length || 0) + (profile.sisters?.length || 0)} siblings 
                                  ({profile.brothers?.length || 0} Brothers, {profile.sisters?.length || 0} Sisters)
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {profile.brothers && profile.brothers.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-slate-500 mb-2">Brothers</p>
                                  <div className="space-y-2">
                                    {profile.brothers.map((brother, index) => (
                                      <div key={index} className="  p-3 rounded-lg">
                                        <p className="text-sm font-medium text-blue-900">
                                          Brother {index + 1}: {brother.name || "Name not provided"}
                                        </p>
                                        <p className="text-xs text-blue-700">
                                          {brother.occupation || "Occupation not specified"}
                                          {brother.companyName && ` at ${brother.companyName}`}
                                          {brother.currentEducation && ` (${brother.currentEducation})`}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {profile.sisters && profile.sisters.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-slate-500 mb-2">Sisters</p>
                                  <div className="space-y-2">
                                    {profile.sisters.map((sister, index) => (
                                      <div key={index} className="   p-3 rounded-lg">
                                        <p className="text-sm font-medium text-pink-900">
                                          Sister {index + 1}: {sister.name || "Name not provided"}
                                        </p>
                                        <p className="text-xs text-pink-700">
                                          {sister.occupation || "Occupation not specified"}
                                          {sister.companyName && ` at ${sister.companyName}`}
                                          {sister.currentEducation && ` (${sister.currentEducation})`}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ProfileSection>

                  {/* KUNDALI DETAILS - Conditional Section */}
                  {(profile.birthName || profile.birthTime || profile.birthPlace || editingSection === 'kundali') && (
                    <ProfileSection
                      title="Kundali Details"
                      sectionKey="kundali"
                      editingSection={editingSection}
                      onEdit={startEditing}
                      onSave={saveSection}
                      onCancel={cancelEditing}
                      saving={saving}
                      icon="🪐"
                      iconColor="bg-indigo-100 text-indigo-600"
                    >
                      {editingSection === 'kundali' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <EditableField
                            label="Birth Name"
                            type="text"
                            value={editData.birthName || ''}
                            onChange={(value) => handleInputChange('birthName', value)}
                            placeholder="Enter birth name"
                          />
                          <EditableField
                            label="Birth Time"
                            type="time"
                            value={editData.birthTime || ''}
                            onChange={(value) => handleInputChange('birthTime', value)}
                            placeholder="Select birth time"
                          />
                          <EditableField
                            label="Birth Place"
                            type="text"
                            value={editData.birthPlace || ''}
                            onChange={(value) => handleInputChange('birthPlace', value)}
                            placeholder="Enter birth place"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          {profile.birthName && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="text-center">
                                
                                <p className="text-xs font-medium text-slate-500">Birth Name</p>
                                <p className="font-semibold text-slate-900 mt-1">{profile.birthName}</p>
                              </div>
                            </div>
                          )}

                          {profile.birthTime && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="text-center">
                                
                                <p className="text-xs font-medium text-slate-500">Birth Time</p>
                                <p className="font-semibold text-slate-900 mt-1">{profile.birthTime}</p>
                              </div>
                            </div>
                          )}

                          {profile.birthPlace && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="text-center">
                                
                                <p className="text-xs font-medium text-slate-500">Birth Place</p>
                                <p className="font-semibold text-slate-900 mt-1">{profile.birthPlace}</p>
                              </div>
                            </div>
                          )}

                          {!profile.birthName && !profile.birthTime && !profile.birthPlace && (
                            <div className="col-span-3">
                              <p className="text-slate-500 text-center py-4 italic">No kundali details provided yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </ProfileSection>
                  )}

                  {/* PARTNER PREFERENCES - Conditional Section */}
                  {(profile.partnerAgeFrom || profile.partnerAgeTo || profile.partnerQualification || 
                    profile.preferredLocation || profile.minAnnualIncome || editingSection === 'preferences') && (
                    <ProfileSection
                      title="Partner Preferences"
                      sectionKey="preferences"
                      editingSection={editingSection}
                      onEdit={startEditing}
                      onSave={saveSection}
                      onCancel={cancelEditing}
                      saving={saving}
                      icon="💝"
                      iconColor="bg-red-100 text-red-600"
                    >
                      {editingSection === 'preferences' ? (
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField
                              label="Partner Age From"
                              type="text"
                              value={editData.partnerAgeFrom || ''}
                              onChange={(value) => handleInputChange('partnerAgeFrom', value)}
                              placeholder="Minimum age"
                            />
                            <EditableField
                              label="Partner Age To"
                              type="text"
                              value={editData.partnerAgeTo || ''}
                              onChange={(value) => handleInputChange('partnerAgeTo', value)}
                              placeholder="Maximum age"
                            />
                            <EditableField
                              label="Minimum Annual Income"
                              type="text"
                              value={editData.minAnnualIncome || ''}
                              onChange={(value) => handleInputChange('minAnnualIncome', value)}
                              placeholder="e.g., ₹10 LPA +"
                            />
                          </div>
                          <EditableField
                            label="Partner Qualifications (max 4)"
                            type="textarea"
                            value={Array.isArray(editData.partnerQualification) ? editData.partnerQualification.slice(0, 4).join(", ") : editData.partnerQualification || ''}
                            onChange={(value) => {
                              const qualifications = value.split(", ").filter(v => v.trim()).slice(0, 4);
                              handleInputChange('partnerQualification', qualifications);
                            }}
                            placeholder="Enter preferred qualifications (comma separated, max 4)"
                          />
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Locations</label>
                            <div className="space-y-2">
                              {(editData.preferredLocation || ['']).map((location, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => {
                                      const newLocations = [...(editData.preferredLocation || [''])];
                                      newLocations[index] = e.target.value;
                                      handleInputChange('preferredLocation', newLocations);
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter preferred location"
                                  />
                                  {(editData.preferredLocation || ['']).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newLocations = (editData.preferredLocation || ['']).filter((_, i) => i !== index);
                                        handleInputChange('preferredLocation', newLocations);
                                      }}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <X size={16} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const newLocations = [...(editData.preferredLocation || ['']), ''];
                                  handleInputChange('preferredLocation', newLocations);
                                }}
                                className="flex items-center gap-2 text-blue-600 hover:  px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
                              >
                                <Plus size={16} />
                                Add Location
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(profile.partnerAgeFrom || profile.partnerAgeTo) && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="text-center">
                                  
                                  <p className="text-xs font-medium text-slate-500">Age Range</p>
                                  <p className="font-semibold text-slate-900 mt-1">
                                    {profile.partnerAgeFrom && profile.partnerAgeTo 
                                      ? `${profile.partnerAgeFrom} to ${profile.partnerAgeTo} `
                                      : profile.partnerAgeFrom 
                                        ? `From ${profile.partnerAgeFrom} years`
                                        : `Up to ${profile.partnerAgeTo} years`
                                    }
                                  </p>
                                </div>
                              </div>
                            )}

                            {profile.minAnnualIncome && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="text-center">
                                  
                                  <p className="text-xs font-medium text-slate-500">Minimum Income</p>
                                  <p className="font-semibold text-slate-900 mt-1">{profile.minAnnualIncome}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {profile.partnerQualification && profile.partnerQualification.length > 0 && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 mb-3">
                               
                                <div>
                                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Preferred Qualifications</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {profile.partnerQualification.map((qual, index) => (
                                  <span 
                                    key={index}
                                    className="  text-blue-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    {qual}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {profile.preferredLocation && profile.preferredLocation.length > 0 && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 mb-3">
                                
                                <div>
                                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Preferred Locations</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {profile.preferredLocation.map((location, index) => (
                                  <span 
                                    key={index}
                                    className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    {location}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {!profile.partnerAgeFrom && !profile.partnerAgeTo && !profile.partnerQualification && 
                           !profile.preferredLocation && !profile.minAnnualIncome && (
                            <div className="text-center py-4">
                              <p className="text-slate-500 italic">No partner preferences specified yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </ProfileSection>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Image Cropper Modal */}
      <ImageCropper
        imageSrc={originalImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        isOpen={showCropper}
      />
    </div>
  );
};

// Enhanced Helper Components
const ProfileSection = ({ 
  title, 
  sectionKey, 
  editingSection, 
  onEdit, 
  onSave, 
  onCancel, 
  saving, 
  children, 
  icon, 
  iconColor 
}: {
  title: string;
  sectionKey: string;
  editingSection: string | null;
  onEdit: (section: string) => void;
  onSave: (section: string) => void;
  onCancel: () => void;
  saving: boolean;
  children: React.ReactNode;
  icon: string;
  iconColor: string;
}) => (
  <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-[16px] shadow-lg border border-slate-100 p-6 md:p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300">
    {/* Decorative Elements */}
    
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      
      {editingSection === sectionKey ? (
        <div className="flex gap-2">
          <button
            onClick={() => onSave(sectionKey)}
            disabled={saving}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors shadow-lg bg-white hover:shadow-green-200"
          >
            <Check size={18} />
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors shadow-lg bg-white hover:shadow-red-200"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => onEdit(sectionKey)}
          className="p-2 text-slate-400 hover:text-[#ED9B59] hover:bg-white rounded-full transition-all shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-orange-200"
        >
          <Pencil size={18} />
        </button>
      )}
    </div>
    
    {children}
  </div>
);

const InfoCard = ({ icon, iconColor, label, value }: { 
  icon: string; 
  iconColor: string; 
  label: string; 
  value: string 
}) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
    
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const EnhancedInfoCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-2 mb-2">
      
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
    <p className="font-semibold text-slate-900 text-lg">{value}</p>
  </div>
);

const SocialMediaCard = ({ platform, handle, icon, color }: { 
  platform: string; 
  handle: string; 
  icon: string; 
  color: string;
}) => (
  <div className="bg-white rounded-md p-3 border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-1">
      
      <p className="text-sm font-medium text-slate-900">{platform}</p>
    </div>
    <p className="text-xs text-slate-600 truncate" title={handle}>{handle}</p>
  </div>
);

const BackgroundPatterns = () => (
  <svg className="absolute -left-[500px] -top-[50px] opacity-10" width="2384" height="1706" viewBox="0 0 2384 1706" fill="none">
    <path d="M623.501 1118.65C597.168 1041.98 458.801 883.151 116.001 861.151" stroke="#ED9B59" strokeWidth="2"/>
    <path d="M969.73 1086.65C964.137 1005.78 871.594 816.548 546.169 706.574" stroke="#ED9B59" strokeWidth="2"/>
  </svg>
);

const TimeSelector = ({ 
  value, 
  onChange, 
  placeholder = "Select time",
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: '', minute: '', period: 'AM' };
    
    const ampmMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (ampmMatch) {
      return {
        hour: ampmMatch[1],
        minute: ampmMatch[2],
        period: ampmMatch[3].toUpperCase()
      };
    }
    
    const twentyFourMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourMatch) {
      const h = parseInt(twentyFourMatch[1]);
      const m = twentyFourMatch[2];
      const isPM = h >= 12;
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return {
        hour: displayHour.toString(),
        minute: m,
        period: isPM ? 'PM' : 'AM'
      };
    }
    
    return { hour: '', minute: '', period: 'AM' };
  };

  const formatTime = (hour: string, minute: string, period: string) => {
    if (!hour || !minute) return '';
    return `${hour}:${minute} ${period}`;
  };

  const { hour, minute, period } = parseTime(value);

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: string) => {
    if (!disabled && newHour && newMinute) {
      onChange(formatTime(newHour, newMinute, newPeriod));
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="flex gap-2">
      <select
        value={hour}
        onChange={(e) => handleTimeChange(e.target.value, minute, period)}
        disabled={disabled}
        className={`flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      >
        <option value="">Hour</option>
        {hours.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <select
        value={minute}
        onChange={(e) => handleTimeChange(hour, e.target.value, period)}
        disabled={disabled}
        className={`flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      >
        <option value="">Min</option>
        {minutes.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        value={period}
        onChange={(e) => handleTimeChange(hour, minute, e.target.value)}
        disabled={disabled}
        className={`p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

const EditableField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  options = [],
  placeholder = "",
  disabled = false,
  required = false
}: {
  label: string;
  type: 'text' | 'select' | 'textarea' | 'time' | 'date';
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 resize-none bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
        rows={3}
      />
    ) : type === 'time' ? (
      <TimeSelector
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    ) : type === 'date' ? (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED9B59] focus:border-transparent text-slate-700 bg-white shadow-sm hover:border-slate-300 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
      />
    )}
  </div>
);

export default MyProfile;