import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  GraduationCap,
  Briefcase,
  Users,
  Flame,
  Heart,
  Mail,
  MapPin,
  Calendar,
  Ruler,
  Droplet,
  ShieldCheck,
  Languages,
  BadgeIndianRupee,
  ChevronRight,
  ChevronLeft,
  Camera,
  Check,
  Edit3,
  ChevronDown,
  Clock,
  X,
  Plus
} from "lucide-react";

// Custom Dropdown Component with smart positioning
const CustomSelect = ({ 
  label, 
  value, 
  icon, 
  options = [], 
  onChange, 
  placeholder = "Select option",
  disabled = false,
  className = "",
  showIcon = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom");
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const dropdownHeight = Math.min(options.length * 44, 240);
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen, options.length]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`group relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center gap-2 ml-1">
        <span className="text-[#9181EE] group-focus-within:scale-110 transition-transform">{icon}</span>
        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">{label}</label>
      </div>
      
      <div 
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`bg-white mt-4 border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm flex items-center justify-between cursor-pointer transition-all duration-200 ${
          isOpen 
            ? "border-[#9181EE] shadow-[0_0_0_3px_rgba(145,129,238,0.1)]" 
            : "border-slate-100 hover:border-[#9181EE]/30"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-bold ${value ? "text-black" : "text-slate-400"} text-sm md:text-base truncate`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#9181EE]" : "text-slate-300"}`} 
        />
      </div>

      {isOpen && options.length > 0 && (
        <div 
          className={`fixed md:absolute z-50 left-2 right-2 md:left-0 md:right-0 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 ${
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '240px' }}>
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 lg:px-5 py-3 font-bold text-black hover:bg-[#F8F7FF] hover:text-[#9181EE] transition-colors cursor-pointer border-b border-slate-50 last:border-0 text-sm md:text-base ${
                  value === option ? "bg-[#F8F7FF] text-[#9181EE]" : ""
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sibling Component
const SiblingField = ({ 
  type, 
  index, 
  data, 
  onChange, 
  onRemove,
  isLast,
  onAdd 
}) => {
  const [siblingData, setSiblingData] = useState(data || {
    name: "",
    maritalStatus: "",
    occupation: "",
    spouseName: ""
  });

  // Custom dropdown states
  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);
  const [occupationOpen, setOccupationOpen] = useState(false);
  const maritalStatusRef = useRef(null);
  const occupationRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (maritalStatusRef.current && !maritalStatusRef.current.contains(event.target)) {
        setMaritalStatusOpen(false);
      }
      if (occupationRef.current && !occupationRef.current.contains(event.target)) {
        setOccupationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    onChange(index, siblingData);
  }, [siblingData]);

  const handleChange = (field, value) => {
    setSiblingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const maritalStatusOptions = ["Unmarried", "Married"];
  const occupationOptions = ["Job", "Business", "Student", "Professional"];

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#9181EE]" />
          <h4 className="text-sm font-bold text-slate-700">
            {type === 'brother' ? 'Brother' : 'Sister'} {index + 1}
          </h4>
        </div>
        <div className="flex gap-2">
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {isLast && onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="p-2 text-[#9181EE] hover:bg-[#F8F7FF] rounded-full transition-colors"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
            <input
              type="text"
              value={siblingData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
              placeholder="Enter name"
            />
          </div>
        </div>

        {/* Marital Status - Custom Dropdown */}
        <div className="space-y-2 relative" ref={maritalStatusRef}>
          <label className="text-xs font-semibold text-slate-500 uppercase">Marital Status</label>
          <div 
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#9181EE]/30 transition-all"
            onClick={() => setMaritalStatusOpen(!maritalStatusOpen)}
          >
            <span className={`font-semibold ${siblingData.maritalStatus ? "text-slate-700" : "text-slate-400"} text-sm`}>
              {siblingData.maritalStatus || "Select status"}
            </span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-300 ${maritalStatusOpen ? "rotate-180 text-[#9181EE]" : "text-slate-300"}`} 
            />
          </div>
          
          {maritalStatusOpen && (
            <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
              {maritalStatusOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    handleChange('maritalStatus', option);
                    setMaritalStatusOpen(false);
                  }}
                  className={`px-4 py-3 font-semibold text-slate-600 hover:bg-[#F8F7FF] hover:text-[#9181EE] transition-colors cursor-pointer border-b border-slate-50 last:border-0 text-sm ${
                    siblingData.maritalStatus === option ? "bg-[#F8F7FF] text-[#9181EE]" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Occupation - Custom Dropdown */}
        <div className="space-y-2 relative" ref={occupationRef}>
          <label className="text-xs font-semibold text-slate-500 uppercase">Occupation</label>
          <div 
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#9181EE]/30 transition-all"
            onClick={() => setOccupationOpen(!occupationOpen)}
          >
            <span className={`font-semibold ${siblingData.occupation ? "text-slate-700" : "text-slate-400"} text-sm`}>
              {siblingData.occupation || "Select occupation"}
            </span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-300 ${occupationOpen ? "rotate-180 text-[#9181EE]" : "text-slate-300"}`} 
            />
          </div>
          
          {occupationOpen && (
            <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
              {occupationOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    handleChange('occupation', option);
                    setOccupationOpen(false);
                  }}
                  className={`px-4 py-3 font-semibold text-slate-600 hover:bg-[#F8F7FF] hover:text-[#9181EE] transition-colors cursor-pointer border-b border-slate-50 last:border-0 text-sm ${
                    siblingData.occupation === option ? "bg-[#F8F7FF] text-[#9181EE]" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spouse Name (only if married) */}
        {siblingData.maritalStatus === 'Married' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Married to (Spouse Name)</label>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <input
                type="text"
                value={siblingData.spouseName}
                onChange={(e) => handleChange('spouseName', e.target.value)}
                className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                placeholder="Enter spouse name"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function UnifiedMatrimonialForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    // Basic Profile
    fullName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    maritalStatus: "",
    motherTongue: "",
    height: "",
    complexion: "",
    bloodGroup: "",
    
    // Career & Education
    highestEducation: "",
    collegeUniversity: "",
    occupation: "",
    organization: "",
    annualIncome: "",
    jobLocation: "",
    
    // Family Details
    fathersFullName: "",
    mothersFullName: "",
    brothers: [],
    sisters: [],
    
    // Contact Details
    whatsappNumber: "",
    emailId: "",
    
    // Kundali Details
    birthName: "",
    birthTime: "",
    birthPlace: "",
    
    // Partner Preference
    partnerAgeFrom: "",
    partnerAgeTo: "",
    partnerEducation: "",
    preferredLocation: "",
    minAnnualIncome: ""
  });

  const steps = [
    { id: 1, title: "Basic Profile", icon: <User size={18} /> },
    { id: 2, title: "Career & Education", icon: <GraduationCap size={18} /> },
    { id: 3, title: "Family Details", icon: <Users size={18} /> },
    { id: 4, title: "Kundali & Partner", icon: <Flame size={18} /> },
  ];

  // Generate height options from 4ft to 7ft
  const generateHeightOptions = () => {
    const options = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        options.push(`${feet}' ${inches}"`);
      }
    }
    return options;
  };

  const dropdownOptions = {
    gender: ["Male", "Female"],
    maritalStatus: ["Unmarried", "Divorced", "Separated", "Widowed"],
    motherTongue: ["English", "Marathi", "Hindi", "Tamil"],
    height: generateHeightOptions(),
    complexion: ["Very Fair", "Fair", "Wheatish", "Dark"],
    bloodGroup: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    highestEducation: [
      "Below 10th",
      "10th Pass",
      "12th Pass",
      "Diploma",
      "Graduate",
      "Post Graduate",
      "Doctorate (PhD)",
      "Professional Degree (CA / CS / ICWA)"
    ],
    occupation: [
      "Salaried (Private)",
      "Salaried (Government)",
      "Self-Employed",
      "Business Owner",
      "Professional (Doctor / Lawyer / CA / Engineer)",
      "Freelancer",
      "Student",
      "Homemaker",
      "Not Working"
    ],
    annualIncome: ["₹0-5 LPA", "₹5-10 LPA", "₹10-15 LPA", "₹15-20 LPA", "₹20-25 LPA", "₹25-35 LPA", "₹35-50 LPA", "₹50 LPA +"],
    partnerEducation: ["Graduate", "Post Graduate", "IIT/IIM", "Doctorate", "Any Graduate"],
    preferredLocation: ["Bangalore", "Pune", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Any Metro City"],
    minAnnualIncome: ["₹10 LPA +", "₹15 LPA +", "₹20 LPA +", "₹25 LPA +", "₹30 LPA +", "₹40 LPA +", "₹50 LPA +"]
  };

  const ageOptions = Array.from({ length: 50 }, (_, i) => i + 18);

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "";
    
    // Parse date in DD-MM-YYYY format
    const parts = dob.split("-");
    if (parts.length !== 3) return "";
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
    const year = parseInt(parts[2], 10);
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    if (isNaN(birthDate.getTime())) return "";
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };

  // Handle date selection
  const handleDateSelect = (e) => {
    const dateStr = e.target.value;
    if (!dateStr) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: "",
        age: ""
      }));
      setShowDatePicker(false);
      return;
    }
    
    // Convert from YYYY-MM-DD to DD-MM-YYYY
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
    
    const age = calculateAge(formattedDate);
    setFormData(prev => ({
      ...prev,
      dateOfBirth: formattedDate,
      age: age
    }));
    setShowDatePicker(false);
  };

  // Close date picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format date for input[type="date"]
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sibling management functions
  const addBrother = () => {
    setFormData(prev => ({
      ...prev,
      brothers: [...prev.brothers, { name: "", maritalStatus: "", occupation: "", spouseName: "" }]
    }));
  };

  const removeBrother = (index) => {
    setFormData(prev => ({
      ...prev,
      brothers: prev.brothers.filter((_, i) => i !== index)
    }));
  };

  const updateBrother = (index, data) => {
    setFormData(prev => ({
      ...prev,
      brothers: prev.brothers.map((brother, i) => i === index ? data : brother)
    }));
  };

  const addSister = () => {
    setFormData(prev => ({
      ...prev,
      sisters: [...prev.sisters, { name: "", maritalStatus: "", occupation: "", spouseName: "" }]
    }));
  };

  const removeSister = (index) => {
    setFormData(prev => ({
      ...prev,
      sisters: prev.sisters.filter((_, i) => i !== index)
    }));
  };

  const updateSister = (index, data) => {
    setFormData(prev => ({
      ...prev,
      sisters: prev.sisters.map((sister, i) => i === index ? data : sister)
    }));
  };

  const handleSubmit = () => {
    // Navigate to profile page after submission
    navigate("/profile");
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col lg:flex-row p-2 md:p-4 font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Progress Bar at Top (Mobile) */}
      {/* <div className="lg:hidden mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500">Step {currentStep} of {steps.length}</span>
            <span className="text-sm font-black text-[#9181EE]">
              {Math.round((currentStep / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#9181EE] to-[#7b6fd6] rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div> */}

      {/* Left Sidebar Dashboard - Hidden on mobile */}
      <div className="hidden lg:flex flex-col w-64 mr-4 lg:mr-8">
        <div className="bg-white rounded-[30px] p-4 lg:p-6 shadow-[0_20px_60px_-15px_rgba(145,129,238,0.15)] border border-purple-50 flex-1">
          {/* Title */}
          <div className="mb-6 lg:mb-10">
            <h2 className="text-xl lg:text-2xl font-black text-black uppercase tracking-wider text-center">
              Swayamwar
            </h2>
          </div>

          {/* Vertical Stepper */}
          <div className="flex flex-col items-start">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className="flex items-center gap-3 lg:gap-4 cursor-pointer group transition-all duration-300"
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 ${
                    currentStep === step.id 
                      ? "bg-[#9181EE] text-white scale-110" 
                      : currentStep > step.id 
                        ? "bg-[#9181EE] text-white opacity-70" 
                        : "bg-[#F0F0F5] text-slate-400"
                  }`}>
                    {currentStep > step.id ? <Check size={18} strokeWidth={3} /> : step.icon}
                  </div>
                  <div>
                    <p className={`text-xs lg:text-sm font-bold uppercase tracking-tight transition-all ${
                      currentStep === step.id 
                        ? "text-[#2D2D2D] scale-105" 
                        : currentStep > step.id 
                          ? "text-[#9181EE]" 
                          : "text-slate-400"
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs transition-all ${
                      currentStep === step.id 
                        ? "text-[#9181EE] font-semibold" 
                        : "text-slate-400"
                    }`}>
                      Step {step.id} of {steps.length}
                    </p>
                  </div>
                </div>
                {idx !== steps.length - 1 && (
                  <div className="h-10 lg:h-12 w-[2px] bg-gradient-to-b from-[#E8E8F0] to-transparent ml-5 lg:ml-6"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 lg:mt-12 pt-4 lg:pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500">Progress</span>
              <span className="text-sm font-black text-[#9181EE]">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9181EE] to-[#7b6fd6] rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full">
        <div className="bg-white rounded-2xl lg:rounded-[40px] p-4 md:p-6 lg:p-8 border border-purple-50 w-full overflow-hidden">

            <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center min-w-[50px]">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 md:border-4 border-white shadow-md ${
                      currentStep === step.id ? "bg-[#9181EE] text-white" : 
                      currentStep > step.id ? "bg-[#9181EE] text-white opacity-60" : "bg-[#F0F0F5] text-slate-400"
                    }`}>
                      {currentStep > step.id ? <Check size={14} strokeWidth={3} /> : step.icon}
                    </div>
                    <p className={`text-[8px] md:text-[9px] mt-1 md:mt-2 font-bold  uppercase tracking-tighter text-center ${
                      currentStep === step.id ? "text-[#2D2D2D]" : "text-slate-400"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="w-4 md:w-8 h-[2px] bg-[#E8E8F0] mb-4 md:mb-5 mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          
          {/* Profile Photo Section - Centered below progress */}
          <div className="flex flex-col items-center mb-6 lg:mb-10">
            <div className="relative mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-4 lg:border-[5px] border-white shadow-lg lg:shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                {photo ? (
                  <img src={photo} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={48} className="text-slate-300" />
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-[#9181EE] p-2 lg:p-3 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                <Camera size={16} className="lg:size-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
            
            <div className="text-center space-y-1">
              <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold text-[#2D2D2D] uppercase tracking-tight">
                {formData.fullName || "Your Profile"}
              </h1>
              <p className="text-[10px] lg:text-[11px] font-bold text-[#9181EE] uppercase tracking-[1px]">
                Step {currentStep} of {steps.length} : <span className="text-[#9181EE]">{steps[currentStep-1].title}</span>
              </p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="min-h-[400px] lg:min-h-[420px]">
            
            {/* STEP 1: BASIC PROFILE */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <User size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Full Name</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Gender */}
                <CustomSelect
                  label="Gender"
                  icon={<ShieldCheck size={16} />}
                  value={formData.gender}
                  options={dropdownOptions.gender}
                  onChange={(val) => handleInputChange('gender', val)}
                  placeholder="Select gender"
                />
                
                {/* Date of Birth with Custom Calendar */}
                {/* Date of Birth – One Click Calendar */}
<div className="space-y-2 relative">
  <div className="flex items-center gap-2 ml-1">
    <Calendar size={16} className="text-[#9181EE]" />
    <label className="text-[12px] font-bold text-slate-500 uppercase">
      Date of Birth
    </label>
  </div>

  {/* Visible UI */}
  <div
    onClick={() => document.getElementById("dob-input").showPicker()}
    className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#9181EE]/30 transition-all"
  >
    <span className={`font-bold ${formData.dateOfBirth ? "text-black" : "text-slate-400"} text-sm lg:text-base`}>
      {formData.dateOfBirth || "DD-MM-YYYY"}
    </span>
    <Calendar size={16} className="text-[#9181EE] opacity-60" />
  </div>

  {/* Hidden Native Input */}
  <input
    id="dob-input"
    type="date"
    className="absolute inset-0 opacity-0 pointer-events-none"
    max={new Date().toISOString().split("T")[0]}
    onChange={(e) => {
      const [year, month, day] = e.target.value.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      handleInputChange("dateOfBirth", formattedDate);
      handleInputChange("age", calculateAge(formattedDate));
    }}
  />
</div>


                {/* Age (Auto-calculated) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <Heart size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Age</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm opacity-70">
                    <span className="font-bold text-black text-sm lg:text-base">
                      {formData.age || "Enter DOB to calculate age"}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <Phone size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">WhatsApp Number</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <Mail size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Email Address</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <input
                      type="email"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <CustomSelect
                  label="Marital Status"
                  icon={<Heart size={16} />}
                  value={formData.maritalStatus}
                  options={dropdownOptions.maritalStatus}
                  onChange={(val) => handleInputChange('maritalStatus', val)}
                  placeholder="Select status"
                />

                {/* Mother Tongue */}
                <CustomSelect
                  label="Mother Tongue"
                  icon={<Languages size={16} />}
                  value={formData.motherTongue}
                  options={dropdownOptions.motherTongue}
                  onChange={(val) => handleInputChange('motherTongue', val)}
                  placeholder="Select language"
                />

                {/* Height */}
                <CustomSelect
                  label="Height"
                  icon={<Ruler size={16} />}
                  value={formData.height}
                  options={dropdownOptions.height}
                  onChange={(val) => handleInputChange('height', val)}
                  placeholder="Select height"
                />

                {/* Complexion */}
                <CustomSelect
                  label="Complexion"
                  icon={<User size={16} />}
                  value={formData.complexion}
                  options={dropdownOptions.complexion}
                  onChange={(val) => handleInputChange('complexion', val)}
                  placeholder="Select complexion"
                />

                {/* Blood Group */}
                <CustomSelect
                  label="Blood Group"
                  icon={<Droplet size={16} />}
                  value={formData.bloodGroup}
                  options={dropdownOptions.bloodGroup}
                  onChange={(val) => handleInputChange('bloodGroup', val)}
                  placeholder="Select blood group"
                />
              </div>
            )}

            {/* STEP 2: CAREER & EDUCATION */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Highest Education */}
                <CustomSelect
                  label="Highest Education"
                  icon={<GraduationCap size={16} />}
                  value={formData.highestEducation}
                  options={dropdownOptions.highestEducation}
                  onChange={(val) => handleInputChange('highestEducation', val)}
                  placeholder="Select highest education"
                />

                {/* College/University */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <GraduationCap size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">College/University</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <input
                      type="text"
                      value={formData.collegeUniversity}
                      onChange={(e) => handleInputChange('collegeUniversity', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter college/university"
                    />
                  </div>
                </div>

                {/* Occupation */}
                <CustomSelect
                  label="Occupation"
                  icon={<Briefcase size={16} />}
                  value={formData.occupation}
                  options={dropdownOptions.occupation}
                  onChange={(val) => handleInputChange('occupation', val)}
                  placeholder="Select occupation"
                />

                {/* Organization */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <Briefcase size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Organization</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter organization"
                    />
                  </div>
                </div>

                {/* Annual Income */}
                <CustomSelect
                  label="Annual Income"
                  icon={<BadgeIndianRupee size={16} />}
                  value={formData.annualIncome}
                  options={dropdownOptions.annualIncome}
                  onChange={(val) => handleInputChange('annualIncome', val)}
                  placeholder="Select income range"
                />

                {/* Job Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <MapPin size={16} className="text-[#9181EE]" />
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Job Location</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <input
                      type="text"
                      value={formData.jobLocation}
                      onChange={(e) => handleInputChange('jobLocation', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter job location"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: FAMILY DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Father's Full Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Users size={16} className="text-[#9181EE]" />
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Father's Full Name</label>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                      <input
                        type="text"
                        value={formData.fathersFullName}
                        onChange={(e) => handleInputChange('fathersFullName', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter father's full name"
                      />
                    </div>
                  </div>

                  {/* Mother's Full Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Users size={16} className="text-[#9181EE]" />
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Mother's Full Name</label>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                      <input
                        type="text"
                        value={formData.mothersFullName}
                        onChange={(e) => handleInputChange('mothersFullName', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter mother's full name"
                      />
                    </div>
                  </div>
                </div>

                {/* Brothers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-[#9181EE]" />
                      <h3 className="text-sm font-black text-slate-700 uppercase">Brother Details</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addBrother}
                      className="flex items-center gap-2 text-[#9181EE] text-sm font-semibold hover:text-[#7b6fd6] transition-colors"
                    >
                      <Plus size={16} /> Add Brother
                    </button>
                  </div>
                  
                  {formData.brothers.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p>No brothers added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.brothers.map((brother, index) => (
                        <SiblingField
                          key={`brother-${index}`}
                          type="brother"
                          index={index}
                          data={brother}
                          onChange={updateBrother}
                          onRemove={removeBrother}
                          isLast={index === formData.brothers.length - 1}
                          onAdd={addBrother}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Sisters Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-[#9181EE]" />
                      <h3 className="text-sm font-black text-slate-700 uppercase">Sister Details</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addSister}
                      className="flex items-center gap-2 text-[#9181EE] text-sm font-semibold hover:text-[#7b6fd6] transition-colors"
                    >
                      <Plus size={16} /> Add Sister
                    </button>
                  </div>
                  
                  {formData.sisters.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p>No sisters added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.sisters.map((sister, index) => (
                        <SiblingField
                          key={`sister-${index}`}
                          type="sister"
                          index={index}
                          data={sister}
                          onChange={updateSister}
                          onRemove={removeSister}
                          isLast={index === formData.sisters.length - 1}
                          onAdd={addSister}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: KUNDALI & PARTNER */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Kundali Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Birth Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <User size={16} className="text-[#9181EE]" />
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Birth Name</label>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                      <input
                        type="text"
                        value={formData.birthName}
                        onChange={(e) => handleInputChange('birthName', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter birth name"
                      />
                    </div>
                  </div>

                  {/* Birth Place */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <MapPin size={16} className="text-[#9181EE]" />
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Birth Place</label>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                      <input
                        type="text"
                        value={formData.birthPlace}
                        onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter birth place"
                      />
                    </div>
                  </div>

                  {/* Birth Time */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <Clock size={16} className="text-[#9181EE]" />
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Birth Time</label>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                      <input
                        type="time"
                        value={formData.birthTime}
                        onChange={(e) => handleInputChange('birthTime', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Partner Preferences */}
                <div className="p-4 lg:p-6 bg-[#F8F7FF] rounded-2xl lg:rounded-[32px] border border-purple-50 space-y-4 lg:space-y-6 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-purple-100 pb-3 lg:pb-4">
                    <Heart size={20} className="text-rose-400" fill="#FDA4AF" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Ideal Partner Expectations</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Partner Age Range */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 ml-1">
                        <Heart size={16} className="text-[#9181EE]" />
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Partner's Age Range</label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <CustomSelect
                          label=""
                          value={formData.partnerAgeFrom}
                          options={ageOptions.map(age => `${age} years`)}
                          onChange={(val) => handleInputChange('partnerAgeFrom', val)}
                          placeholder="From"
                          showIcon={false}
                          className="-mt-5"
                        />
                        <CustomSelect
                          label=""
                          value={formData.partnerAgeTo}
                          options={ageOptions.map(age => `${age} years`)}
                          onChange={(val) => handleInputChange('partnerAgeTo', val)}
                          placeholder="To"
                          showIcon={false}
                          className="-mt-5"
                        />
                      </div>
                    </div>

                    {/* Partner Education */}
                    <CustomSelect
                      label="Partner's Education"
                      icon={<GraduationCap size={16} />}
                      value={formData.partnerEducation}
                      options={dropdownOptions.partnerEducation}
                      onChange={(val) => handleInputChange('partnerEducation', val)}
                      placeholder="Select education"
                    />

                    {/* Preferred Location */}
                    <CustomSelect
                      label="Preferred Location"
                      icon={<MapPin size={16} />}
                      value={formData.preferredLocation}
                      options={dropdownOptions.preferredLocation}
                      onChange={(val) => handleInputChange('preferredLocation', val)}
                      placeholder="Select location"
                    />

                    {/* Minimum Annual Income */}
                    <CustomSelect
                      label="Minimum Annual Income"
                      icon={<BadgeIndianRupee size={16} />}
                      value={formData.minAnnualIncome}
                      options={dropdownOptions.minAnnualIncome}
                      onChange={(val) => handleInputChange('minAnnualIncome', val)}
                      placeholder="Select income"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-50">
            <button 
              onClick={back}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft size={20} /> Previous
            </button>

            <button 
              onClick={currentStep === steps.length ? handleSubmit : next}
              className="flex items-center gap-3 bg-[#9181EE] text-white px-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_-5px_rgba(145,129,238,0.5)] hover:bg-[#7b6fd6] active:scale-95 transition-all"
            >
              {currentStep === steps.length ? "Submit" : "Next Step"} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}