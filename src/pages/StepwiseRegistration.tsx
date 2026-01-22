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
  Info,
  Edit3,
  ChevronDown,
  Clock
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
  className = ""
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
        className={`bg-white border rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between cursor-pointer transition-all duration-200 ${
          isOpen 
            ? "border-[#9181EE] shadow-[0_0_0_3px_rgba(145,129,238,0.1)]" 
            : "border-slate-100 hover:border-[#9181EE]/30"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-bold ${value ? "text-slate-700" : "text-slate-400"} text-sm md:text-base`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-[#9181EE]" : "text-slate-300"}`} 
        />
      </div>

      {isOpen && options.length > 0 && (
        <div 
          className={`absolute z-50 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 ${
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '240px' }}>
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-5 py-3 font-bold text-slate-600 hover:bg-[#F8F7FF] hover:text-[#9181EE] transition-colors cursor-pointer border-b border-slate-50 last:border-0 ${
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

export default function UnifiedMatrimonialForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    age: "26 years & 3 months",
    maritalStatus: "",
    motherTongue: "",
    height: "",
    complexion: "",
    bloodGroup: "",
    highestEducation: "",
    collegeUniversity: "",
    occupation: "",
    organization: "",
    annualIncome: "",
    currentCity: "",
    fatherDetails: "",
    motherDetails: "",
    whatsappNumber: "",
    emailId: "",
    siblingsDetails: "",
    birthTime: "",
    birthPlace: "",
    partnerAge: "",
    partnerEducation: "",
    preferredLocation: "",
    minAnnualIncome: ""
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const glowStyle = {
    boxShadow: "0 20px 60px -15px rgba(145, 129, 238, 0.15), 0 0 20px rgba(253, 248, 251, 0.3)"
  };

  const steps = [
    { id: 1, title: "Basic Profile", icon: <User size={18} /> },
    { id: 2, title: "Career & Edu", icon: <GraduationCap size={18} /> },
    { id: 3, title: "Family & Contact", icon: <Users size={18} /> },
    { id: 4, title: "Kundali & Partner", icon: <Flame size={18} /> },
  ];

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const dropdownOptions = {
    gender: ["Male", "Female", "Other"],
    maritalStatus: ["Never Married", "Divorced", "Widowed", "Separated"],
    motherTongue: ["Marathi", "Hindi", "English", "Gujarati", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Punjabi"],
    height: ["5' 0''", "5' 1''", "5' 2''", "5' 3''", "5' 4''", "5' 5''", "5' 6''", "5' 7''", "5' 8''", "5' 9''", "5' 10''", "5' 11''", "6' 0''", "6' 1''", "6' 2''", "6' 3''", "6' 4''", "6' 5''"],
    complexion: ["Very Fair", "Fair", "Wheatish", "Dark"],
    bloodGroup: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    annualIncome: ["₹0-5 LPA", "₹5-10 LPA", "₹10-15 LPA", "₹15-20 LPA", "₹20-25 LPA", "₹25-35 LPA", "₹35-50 LPA", "₹50 LPA +"],
    partnerAge: ["24 to 26 years", "26 to 29 years", "29 to 32 years", "32 to 35 years", "35+ years"],
    partnerEducation: ["Graduate", "Post Graduate", "IIT/IIM", "Doctorate", "Any Graduate"],
    preferredLocation: ["Bangalore", "Pune", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Any Metro City"],
    minAnnualIncome: ["₹10 LPA +", "₹15 LPA +", "₹20 LPA +", "₹25 LPA +", "₹30 LPA +", "₹40 LPA +", "₹50 LPA +"]
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(formData[field]);
  };

  const handleSave = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleSubmit = () => {
   
    // Navigate to profile page after submission
    navigate("/profile");
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex p-4 font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Left Sidebar Dashboard */}
      <div className="hidden lg:flex flex-col w-64 mr-8">
        <div className="bg-white rounded-[30px] p-6 shadow-[0_20px_60px_-15px_rgba(145,129,238,0.15)] border border-purple-50 flex-1">
          {/* Title */}
          <div className="mb-10">
            <h2 className="text-2xl font-black text-black uppercase tracking-wider text-center">
              Swayamwar
            </h2>
            {/* <div className="h-1 w-20 bg-gradient-to-r from-black to-transparent mx-auto mt-2 rounded-full"></div> */}
          </div>

          {/* Vertical Stepper */}
          <div className="flex flex-col items-start">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className="flex items-center gap-4 cursor-pointer group transition-all duration-300"
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 ${
                    currentStep === step.id 
                      ? "bg-[#9181EE] text-white scale-110" 
                      : currentStep > step.id 
                        ? "bg-[#9181EE] text-white opacity-70" 
                        : "bg-[#F0F0F5] text-slate-400"
                  }`}>
                    {currentStep > step.id ? <Check size={20} strokeWidth={3} /> : step.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-tight transition-all ${
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
                  <div className="h-12 w-[2px] bg-gradient-to-b from-[#E8E8F0] to-transparent ml-6"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 pt-6 border-t border-slate-100">
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
      <div className="flex-1 max-w-7xl">
        <div className="bg-white rounded-[40px] p-6 md:p-8 border border-purple-50" style={glowStyle}>
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            
            {/* User Profile Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {photo ? (
                    <img src={photo} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <User size={32} className="text-slate-300" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#9181EE] p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={14} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#9181EE] uppercase tracking-[1px]">
                  Step {currentStep} of {steps.length} : <span className="text-[#9181EE]">{steps[currentStep-1].title}</span>
                </p>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#2D2D2D] uppercase tracking-tight">
                  {formData.fullName || "Your Profile"}
                </h1>
              </div>
            </div>

            {/* Mobile Stepper */}
            <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md ${
                      currentStep === step.id ? "bg-[#9181EE] text-white" : 
                      currentStep > step.id ? "bg-[#9181EE] text-white opacity-60" : "bg-[#F0F0F5] text-slate-400"
                    }`}>
                      {currentStep > step.id ? <Check size={18} strokeWidth={3} /> : step.icon}
                    </div>
                    <p className={`text-[9px] mt-2 font-bold whitespace-nowrap uppercase tracking-tighter ${currentStep === step.id ? "text-[#2D2D2D]" : "text-slate-400"}`}>
                      {step.title}
                    </p>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="w-8 md:w-16 h-[2px] bg-[#E8E8F0] mb-5 mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Grid */}
          <div className="min-h-[420px]">
            
            {/* STEP 1: BASIC PROFILE */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Full Name */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 ml-1">
                    <User size={16} className="text-[#9181EE] group-focus-within:scale-110 transition-transform"/>
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Full Name</label>
                  </div>
                  {editingField === 'fullName' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 bg-white border border-[#9181EE] rounded-2xl px-5 py-4 shadow-sm font-bold text-slate-700 text-sm md:text-base outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleSave('fullName')} className="bg-[#9181EE] text-white px-4 rounded-2xl">
                        <Check size={16} />
                      </button>
                      <button onClick={handleCancel} className="bg-slate-200 text-slate-600 px-4 rounded-2xl">
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between group-hover:border-[#9181EE]/30 transition-all cursor-pointer" onClick={() => handleEdit('fullName')}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700 text-sm md:text-base">{formData.fullName || "Enter full name"}</span>
                      </div>
                      <Edit3 size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  )}
                </div>

                {/* Gender - Custom Dropdown */}
                <CustomSelect
                  label="Gender"
                  icon={<ShieldCheck size={16} />}
                  value={formData.gender}
                  options={dropdownOptions.gender}
                  onChange={(val) => handleInputChange('gender', val)}
                  placeholder="Select gender"
                />
                
                {/* DOB with Age Box */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#9181EE]"/>
                    <label className="text-[12px] font-bold text-slate-500">Date of Birth</label>
                    <Info size={14} className="text-slate-300 cursor-pointer"/>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between group hover:border-[#9181EE]/30 transition-all">
                      <input
                        type="text"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="font-bold text-slate-700 w-full outline-none bg-transparent"
                        placeholder="DD-MMM-YYYY"
                      />
                      <Calendar size={16} className="text-[#9181EE] opacity-50"/>
                    </div>
                    <div className="bg-[#F8F7FF] rounded-2xl px-4 py-3 flex flex-col items-center justify-center border border-purple-50 min-w-[110px]">
                      <span className="text-[10px] text-[#9181EE] font-black uppercase">26 years &</span>
                      <span className="text-[10px] text-[#9181EE] font-black uppercase tracking-tighter">3 months</span>
                    </div>
                  </div>
                </div>

                {/* Age (Read Only) */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 ml-1">
                    <Heart size={16} className="text-[#9181EE]"/>
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Age (Read Only)</label>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-3">
                      <Heart size={14} fill="#FFB3C6" className="text-[#FFB3C6]"/>
                      <span className="font-bold text-slate-700 text-sm md:text-base">{formData.age}</span>
                    </div>
                  </div>
                </div>

                {/* Marital Status - Custom Dropdown */}
                <CustomSelect
                  label="Marital Status"
                  icon={<Heart size={16} />}
                  value={formData.maritalStatus}
                  options={dropdownOptions.maritalStatus}
                  onChange={(val) => handleInputChange('maritalStatus', val)}
                  placeholder="Select status"
                />

                {/* Mother Tongue - Custom Dropdown */}
                <CustomSelect
                  label="Mother Tongue"
                  icon={<Languages size={16} />}
                  value={formData.motherTongue}
                  options={dropdownOptions.motherTongue}
                  onChange={(val) => handleInputChange('motherTongue', val)}
                  placeholder="Select language"
                />

                {/* Height & Complexion */}
                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    label="Height"
                    icon={<Ruler size={16} />}
                    value={formData.height}
                    options={dropdownOptions.height}
                    onChange={(val) => handleInputChange('height', val)}
                    placeholder="Select height"
                  />

                  <CustomSelect
                    label="Complexion"
                    icon={<User size={16} />}
                    value={formData.complexion}
                    options={dropdownOptions.complexion}
                    onChange={(val) => handleInputChange('complexion', val)}
                    placeholder="Select complexion"
                  />
                </div>

                {/* Blood Group - Custom Dropdown */}
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

            {/* STEP 2: CAREER & EDU */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {['highestEducation', 'collegeUniversity', 'occupation', 'organization'].map((field) => (
                  <div key={field} className="space-y-2 group">
                    <div className="flex items-center gap-2 ml-1">
                      {field.includes('Education') || field.includes('college') ? (
                        <GraduationCap size={16} className="text-[#9181EE]"/>
                      ) : (
                        <Briefcase size={16} className="text-[#9181EE]"/>
                      )}
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        {field === 'highestEducation' ? 'Highest Education' :
                         field === 'collegeUniversity' ? 'College/University' :
                         field === 'occupation' ? 'Occupation' : 'Organization'}
                      </label>
                    </div>
                    {editingField === field ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="flex-1 bg-white border border-[#9181EE] rounded-2xl px-5 py-4 shadow-sm font-bold text-slate-700 text-sm md:text-base outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleSave(field)} className="bg-[#9181EE] text-white px-4 rounded-2xl">
                          <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="bg-slate-200 text-slate-600 px-4 rounded-2xl">
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between group-hover:border-[#9181EE]/30 transition-all cursor-pointer" onClick={() => handleEdit(field)}>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700 text-sm md:text-base">
                            {formData[field] || (
                              field === 'highestEducation' ? 'Enter highest education' :
                              field === 'collegeUniversity' ? 'Enter college/university' :
                              field === 'occupation' ? 'Enter occupation' : 'Enter organization'
                            )}
                          </span>
                        </div>
                        <Edit3 size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Annual Income - Custom Dropdown */}
                <CustomSelect
                  label="Annual Income"
                  icon={<BadgeIndianRupee size={16} />}
                  value={formData.annualIncome}
                  options={dropdownOptions.annualIncome}
                  onChange={(val) => handleInputChange('annualIncome', val)}
                  placeholder="Select income range"
                />

                {/* Current City */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 ml-1">
                    <MapPin size={16} className="text-[#9181EE]"/>
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Current City</label>
                  </div>
                  {editingField === 'currentCity' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 bg-white border border-[#9181EE] rounded-2xl px-5 py-4 shadow-sm font-bold text-slate-700 text-sm md:text-base outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleSave('currentCity')} className="bg-[#9181EE] text-white px-4 rounded-2xl">
                        <Check size={16} />
                      </button>
                      <button onClick={handleCancel} className="bg-slate-200 text-slate-600 px-4 rounded-2xl">
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between group-hover:border-[#9181EE]/30 transition-all cursor-pointer" onClick={() => handleEdit('currentCity')}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700 text-sm md:text-base">{formData.currentCity || "Enter current city"}</span>
                      </div>
                      <Edit3 size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: FAMILY & CONTACT */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  
                  {['fatherDetails', 'motherDetails', 'whatsappNumber', 'emailId'].map((field) => (
                    <div key={field} className="space-y-2 group">
                      <div className="flex items-center gap-2 ml-1">
                        {field.includes('father') || field.includes('mother') ? (
                          <Users size={16} className="text-[#9181EE]"/>
                        ) : field.includes('whatsapp') ? (
                          <Phone size={16} className="text-[#9181EE]"/>
                        ) : (
                          <Mail size={16} className="text-[#9181EE]"/>
                        )}
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                          {field === 'fatherDetails' ? "Father's Details" :
                           field === 'motherDetails' ? "Mother's Details" :
                           field === 'whatsappNumber' ? "WhatsApp No" : "Email ID"}
                        </label>
                      </div>
                      {editingField === field ? (
                        <div className="flex gap-2">
                          <input
                            type={field === 'emailId' ? "email" : field === 'whatsappNumber' ? "tel" : "text"}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 bg-white border border-[#9181EE] rounded-2xl px-5 py-4 shadow-sm font-bold text-slate-700 text-sm md:text-base outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleSave(field)} className="bg-[#9181EE] text-white px-4 rounded-2xl">
                            <Check size={16} />
                          </button>
                          <button onClick={handleCancel} className="bg-slate-200 text-slate-600 px-4 rounded-2xl">
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between group-hover:border-[#9181EE]/30 transition-all cursor-pointer" onClick={() => handleEdit(field)}>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-700 text-sm md:text-base">
                              {formData[field] || (
                                field === 'fatherDetails' ? "Enter father's details" :
                                field === 'motherDetails' ? "Enter mother's details" :
                                field === 'whatsappNumber' ? "Enter WhatsApp number" : "Enter email ID"
                              )}
                            </span>
                          </div>
                          <Edit3 size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Siblings Details */}
                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 ml-1">
                    <Users size={16} className="text-[#9181EE]"/>
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Brother/Sister Details</label>
                  </div>
                  <textarea 
                    value={formData.siblingsDetails}
                    onChange={(e) => handleInputChange('siblingsDetails', e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-5 shadow-sm outline-none focus:border-[#9181EE]/50 transition-all text-sm font-bold text-slate-700 min-h-[120px] resize-none"
                    placeholder="Enter details about your siblings..."
                  />
                </div>
              </div>
            )}

            {/* STEP 4: KUNDALI & PARTNER */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  
                  {['birthTime', 'birthPlace'].map((field) => (
                    <div key={field} className="space-y-2 group">
                      <div className="flex items-center gap-2 ml-1">
                        {field === 'birthTime' ? (
                          <Clock size={16} className="text-[#9181EE]"/>
                        ) : (
                          <MapPin size={16} className="text-[#9181EE]"/>
                        )}
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                          {field === 'birthTime' ? 'Birth Time' : 'Birth Place'}
                        </label>
                      </div>
                      {editingField === field ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 bg-white border border-[#9181EE] rounded-2xl px-5 py-4 shadow-sm font-bold text-slate-700 text-sm md:text-base outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleSave(field)} className="bg-[#9181EE] text-white px-4 rounded-2xl">
                            <Check size={16} />
                          </button>
                          <button onClick={handleCancel} className="bg-slate-200 text-slate-600 px-4 rounded-2xl">
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between group-hover:border-[#9181EE]/30 transition-all cursor-pointer" onClick={() => handleEdit(field)}>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-700 text-sm md:text-base">
                              {formData[field] || (
                                field === 'birthTime' ? "Enter birth time" : "Enter birth place"
                              )}
                            </span>
                          </div>
                          <Edit3 size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Partner Expectations */}
                <div className="p-6 md:p-6 bg-[#F8F7FF] rounded-[32px] border border-purple-50 space-y-6 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-purple-100 pb-4">
                    <Heart size={20} className="text-rose-400" fill="#FDA4AF" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Ideal Partner Expectations</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    {['partnerAge', 'partnerEducation', 'preferredLocation', 'minAnnualIncome'].map((field) => (
                      <div key={field} className="space-y-2 group">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter ml-1">
                          {field === 'partnerAge' ? "Partner's Age" :
                           field === 'partnerEducation' ? "Partner's Education" :
                           field === 'preferredLocation' ? "Preferred Location" : "Min. Annual Income"}
                        </label>
                        <CustomSelect
                          value={formData[field]}
                          options={dropdownOptions[field] || []}
                          onChange={(val) => handleInputChange(field, val)}
                          placeholder={
                            field === 'partnerAge' ? "Select age range" :
                            field === 'partnerEducation' ? "Select education" :
                            field === 'preferredLocation' ? "Select location" : "Select income"
                          }
                        />
                      </div>
                    ))}
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
              className="flex items-center gap-3 bg-[#9181EE] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_-5px_rgba(145,129,238,0.5)] hover:bg-[#7b6fd6] active:scale-95 transition-all"
            >
              {currentStep === steps.length ? "Submit Profile" : "Next Step"} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}