import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
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
  ChevronDown,
  Camera,
  Check,
  Edit3,
  Clock,
  X,
  Plus,
  AlertCircle,
  ChevronUp,
  Crop as CropIcon,
  RotateCcw
} from "lucide-react";

// Validation Functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Custom Dropdown Component with smart positioning
const CustomSelect = ({ 
  label, 
  value, 
   
  options = [], 
  onChange, 
  placeholder = "Select option",
  disabled = false,
  className = "",
  showIcon = true,
  required = false
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
    <div className={`group relative ${className}`} ref={dropdownRef} style={{ position: 'relative', zIndex: isOpen ? 10000 : 1 }}>
      <div className="flex items-center gap-2 ml-1">
        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      <div 
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`bg-white mt-2 border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm flex items-center justify-between cursor-pointer transition-all duration-200 ${
          isOpen 
            ? "border-[#9181EE] shadow-[0_0_0_3px_rgba(145,129,238,0.1)]" 
            : "border-slate-100 hover:border-[#9181EE]/30"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        style={{ position: 'relative', zIndex: isOpen ? 10000 : 0 }}
      >
        <div className="flex items-center gap-2">
          <span className={`font-bold ${value ? "text-black" : "text-slate-400"} text-base truncate`}>
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
    className={`absolute z-[9999] w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 ${
      position === "top" ? "bottom-full mb-1" : "top-full mt-1"
    }`}
    style={{
      maxHeight: 'min(240px, 50vh)',
      minWidth: '200px'
    }}
  >
    <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'inherit' }}>
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => handleSelect(option)}
          className={`px-4 lg:px-5 py-3 font-bold text-black hover:bg-[#F8F7FF] hover:text-[#9181EE] transition-colors cursor-pointer border-b border-slate-50 last:border-0 text-base ${
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

// Custom Multi-Select Component
const CustomMultiSelect = ({ 
  label, 
  value = [], 
  options = [], 
  onChange, 
  placeholder = "Select options",
  disabled = false,
  className = "",
  required = false
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
    const newValue = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  const displayText = value.length === 0 
    ? placeholder 
    : value.length === 1 
      ? value[0] 
      : `${value.length} selected`;

  return (
    <div className={`group relative ${className}`} ref={dropdownRef} style={{ position: 'relative', zIndex: isOpen ? 10000 : 1 }}>
      <div className="flex items-center gap-2 ml-1">
        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      <div 
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`bg-white mt-2 border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm flex items-center justify-between cursor-pointer transition-all duration-200 ${
          isOpen 
            ? "border-[#9181EE] shadow-[0_0_0_3px_rgba(145,129,238,0.1)]" 
            : "border-slate-100 hover:border-[#9181EE]/30"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        style={{ position: 'relative', zIndex: isOpen ? 10000 : 0 }}
      >
        <div className="flex items-center gap-2 flex-1">
          <span className={`font-bold ${value.length > 0 ? "text-black" : "text-slate-400"} text-base truncate`}>
            {displayText}
          </span>
          {value.length > 1 && (
            <div className="flex flex-wrap gap-1 max-w-[200px] overflow-hidden">
              {value.slice(0, 2).map((item, idx) => (
                <span key={idx} className="bg-[#F8F7FF] text-[#9181EE] px-2 py-1 rounded-lg text-xs font-semibold">
                  {item.length > 10 ? `${item.substring(0, 10)}...` : item}
                </span>
              ))}
              {value.length > 2 && (
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-semibold">
                  +{value.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronDown 
          size={18} 
          className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#9181EE]" : "text-slate-300"}`} 
        />
      </div>

      {isOpen && options.length > 0 && (
        <div 
          className={`absolute z-[9999] w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 ${
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{
            maxHeight: 'min(240px, 50vh)',
            minWidth: '200px'
          }}
        >
          <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'inherit' }}>
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 lg:px-5 py-3 font-bold hover:bg-[#F8F7FF] hover:text-[#9181EE] transition-colors cursor-pointer border-b border-slate-50 last:border-0 text-base flex items-center justify-between ${
                  value.includes(option) ? "bg-[#F8F7FF] text-[#9181EE]" : "text-black"
                }`}
              >
                <span>{option}</span>
                {value.includes(option) && (
                  <Check size={16} className="text-[#9181EE]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Calendar Picker Component (iOS-friendly)
const CustomCalendarPicker = ({ value, onChange, label, maxDate = new Date(), required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const parts = value.split('-');
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, 1);
    }
    return new Date();
  });
  const [showYearMonth, setShowYearMonth] = useState(false);
  const calendarRef = useRef(null);
  const triggerRef = useRef(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const yearRange = Array.from({ length: 100 }, (_, i) => currentYear - 80 + i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return selectedDate > today;
  };

  const handleDateSelect = (day) => {
    if (isDateDisabled(day)) return;
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${dayStr}-${month}-${year}`);
    setIsOpen(false);
    setShowYearMonth(false);
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setShowYearMonth(false);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (newMonth <= today) {
      setCurrentMonth(newMonth);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [selectedDay, selectedMonth, selectedYear] = value ? value.split('-') : [];

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center gap-2 ml-1">
        <label className="text-[12px] font-bold text-slate-500 uppercase">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#9181EE]/30 transition-all active:scale-95"
        style={{ minHeight: '44px' }}
      >
        <span className={`font-bold ${value ? "text-black" : "text-slate-400"} text-sm lg:text-base`}>
          {value || "DD-MM-YYYY"}
        </span>
        <Calendar size={16} className="text-[#9181EE] opacity-60" />
      </div>

      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute z-[9999] top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 w-full max-w-sm animate-in fade-in zoom-in-95"
          style={{ minHeight: 'fit-content' }}
        >
          {!showYearMonth ? (
            <>
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onTouchStart={previousMonth}
                  onClick={previousMonth}
                  className="p-2 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <ChevronLeft size={18} className="text-[#9181EE]" />
                </button>
                <button
                  onClick={() => setShowYearMonth(true)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors font-bold text-slate-700"
                >
                  <span>{monthName} {year}</span>
                  <ChevronDown size={16} className="text-[#9181EE]" />
                </button>
                <button
                  onTouchStart={nextMonth}
                  onClick={nextMonth}
                  className="p-2 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  disabled={new Date(year, currentMonth.getMonth() + 1) > today}
                >
                  <ChevronRight size={18} className={`${new Date(year, currentMonth.getMonth() + 1) > today ? 'text-slate-300' : 'text-[#9181EE]'}`} />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  const disabled = day ? isDateDisabled(day) : true;
                  return (
                    <button
                      key={idx}
                      onClick={() => !disabled && day && handleDateSelect(day)}
                      onTouchStart={() => !disabled && day && handleDateSelect(day)}
                      disabled={disabled}
                      className={`py-2 text-sm font-semibold rounded-lg transition-all active:scale-95 ${
                        !day
                          ? 'text-slate-200 cursor-default'
                          : disabled
                          ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                          : value && selectedDay === String(day).padStart(2, '0') && selectedMonth === String(currentMonth.getMonth() + 1).padStart(2, '0') && selectedYear === String(year)
                          ? 'bg-[#9181EE] text-white'
                          : 'text-slate-700 hover:bg-[#F8F7FF] hover:text-[#9181EE] cursor-pointer'
                      }`}
                      style={{
                        minHeight: '44px',
                        cursor: disabled ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Year/Month Selector */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Year</label>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {yearRange.map((y) => (
                      <button
                        key={y}
                        onClick={() => handleYearChange(y)}
                        className={`py-2 px-2 rounded-lg text-sm font-semibold transition-all ${
                          y === year
                            ? 'bg-[#9181EE] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Month</label>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => handleMonthChange(idx)}
                        className={`py-2 px-2 rounded-lg text-sm font-semibold transition-all ${
                          idx === currentMonth.getMonth()
                            ? 'bg-[#9181EE] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowYearMonth(false)}
                  className="w-full bg-[#9181EE] text-white py-2 rounded-lg font-bold text-sm uppercase transition-all active:scale-95"
                  style={{ minHeight: '44px' }}
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Custom Time Picker Component (iOS-friendly with 12-hour AM/PM format)
const CustomTimePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeRef = useRef(null);
  const triggerRef = useRef(null);

  // Parse time from 24-hour format to 12-hour
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: 12, minutes: 0, isPM: false };
    const [h, m] = timeStr.split(':').map(Number);
    const isPM = h >= 12;
    const hours = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return { hours, minutes: m, isPM };
  };

  const [time, setTime] = useState(parseTime(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeRef.current && !timeRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Convert 12-hour time to 24-hour format for storage
  const convert12to24 = (h, isPM) => {
    if (h === 12) return isPM ? 12 : 0;
    return isPM ? h + 12 : h;
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
    const hours24 = convert12to24(newTime.hours, newTime.isPM);
    const timeStr = `${String(hours24).padStart(2, '0')}:${String(newTime.minutes).padStart(2, '0')}`;
    onChange(timeStr);
  };

  const displayTime = `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')} ${time.isPM ? 'PM' : 'AM'}`;

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center gap-2 ml-1">
        <label className="text-[12px] font-bold text-slate-500 uppercase">{label}</label>
      </div>

      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#9181EE]/30 transition-all active:scale-95"
        style={{ minHeight: '44px' }}
      >
        <span className={`font-bold ${value ? "text-black" : "text-slate-400"} text-sm lg:text-base`}>
          {value ? displayTime : "HH:MM AM/PM"}
        </span>
        <Clock size={16} className="text-[#9181EE] opacity-60" />
      </div>

      {isOpen && (
        <div
          ref={timeRef}
          className="absolute z-[9999] top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-6 w-full max-w-xs animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-center gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Hours</label>
              <button
                onClick={() => handleTimeChange({ ...time, hours: time.hours === 1 ? 12 : time.hours - 1 })}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronUp size={18} className="text-[#9181EE]" />
              </button>
              <input
                type="number"
                min="1"
                max="12"
                value={String(time.hours).padStart(2, '0')}
                onChange={(e) => {
                  const h = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
                  handleTimeChange({ ...time, hours: h });
                }}
                className="w-16 px-3 py-2 text-center text-lg font-bold border border-slate-200 rounded-lg"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={() => handleTimeChange({ ...time, hours: time.hours === 12 ? 1 : time.hours + 1 })}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronDown size={18} className="text-[#9181EE]" />
              </button>
            </div>

            {/* Separator */}
            <div className="text-2xl font-bold text-slate-400 mt-6">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Minutes</label>
              <button
                onClick={() => handleTimeChange({ ...time, minutes: time.minutes === 0 ? 59 : time.minutes - 1 })}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronUp size={18} className="text-[#9181EE]" />
              </button>
              <input
                type="number"
                min="0"
                max="59"
                value={String(time.minutes).padStart(2, '0')}
                onChange={(e) => {
                  const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  handleTimeChange({ ...time, minutes: m });
                }}
                className="w-16 px-3 py-2 text-center text-lg font-bold border border-slate-200 rounded-lg"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={() => handleTimeChange({ ...time, minutes: time.minutes === 59 ? 0 : time.minutes + 1 })}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronDown size={18} className="text-[#9181EE]" />
              </button>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Period</label>
              <button
                onClick={() => handleTimeChange({ ...time, isPM: !time.isPM })}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                  time.isPM 
                    ? 'bg-slate-100 text-slate-700' 
                    : 'bg-[#9181EE] text-white'
                }`}
                style={{ minHeight: '44px' }}
              >
                AM
              </button>
              <button
                onClick={() => handleTimeChange({ ...time, isPM: !time.isPM })}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                  time.isPM 
                    ? 'bg-[#9181EE] text-white' 
                    : 'bg-slate-100 text-slate-700'
                }`}
                style={{ minHeight: '44px' }}
              >
                PM
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full bg-[#9181EE] text-white py-3 rounded-lg font-bold text-sm uppercase transition-all active:scale-95"
            style={{ minHeight: '44px' }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

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
              className="px-6 py-3 bg-[#9181EE] text-white rounded-xl font-semibold hover:bg-[#7b6fd6] transition-all flex items-center gap-2"
            >
              <CropIcon size={16} />
              Apply Square Crop
            </button>
          </div>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
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
    spouseName: "",
    businessName: "",
    businessLocation: "",
    designation: "",
    companyName: "",
    currentEducation: "",
    otherOccupation: ""
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
  }, [siblingData, index, onChange]);

  const handleChange = (field, value) => {
    setSiblingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const maritalStatusOptions = ["Unmarried", "Married"];
  const occupationOptions = ["Business", "Job/Salaried", "Student", "Homemaker", "Not Working", "Other"];

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
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

        {/* Business Fields */}
        {siblingData.occupation === 'Business' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Business Name</label>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <input
                  type="text"
                  value={siblingData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                  placeholder="Enter business name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Business Location</label>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <input
                  type="text"
                  value={siblingData.businessLocation}
                  onChange={(e) => handleChange('businessLocation', e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                  placeholder="Enter business location"
                />
              </div>
            </div>
          </>
        )}

        {/* Job/Salaried Fields */}
        {siblingData.occupation === 'Job/Salaried' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Designation</label>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <input
                  type="text"
                  value={siblingData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                  placeholder="Enter designation"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Company Name</label>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <input
                  type="text"
                  value={siblingData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </>
        )}

        {/* Student Field */}
        {siblingData.occupation === 'Student' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Current Education</label>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <input
                type="text"
                value={siblingData.currentEducation}
                onChange={(e) => handleChange('currentEducation', e.target.value)}
                className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                placeholder="Enter current education"
              />
            </div>
          </div>
        )}

        {/* Other Occupation Field */}
        {siblingData.occupation === 'Other' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Other Occupation</label>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <input
                type="text"
                value={siblingData.otherOccupation}
                onChange={(e) => handleChange('otherOccupation', e.target.value)}
                className="w-full text-sm font-semibold text-slate-700 outline-none bg-transparent"
                placeholder="Enter other occupation"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FormData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  aboutMe: string;
  maritalStatus: string;
  motherTongue: string;
  height: string;
  complexion: string;
  bloodGroup: string;
  highestEducation: string;
  collegeUniversity: string;
  occupation: string;
  organization: string;
  designation: string;
  currentEducation: string;
  otherOccupation: string;
  annualIncome: string;
  jobLocation: string;
  fathersFullName: string;
  fathersOccupation:string;
  fathersBusinessName: string;
  fathersBusinessLocation: string;
  fathersDesignation: string;
  fathersCompanyName: string;
  fathersOtherOccupation: string;
  mothersFullName: string;
  mothersOccupation:string;
  mothersBusinessName: string;
  mothersBusinessLocation: string;
  mothersDesignation: string;
  mothersCompanyName: string;
  mothersOtherOccupation: string;
  brothers: Record<string, string>[];
  sisters: Record<string, string>[];
  whatsappNumber: string;
  emailId: string;
  linkedinHandle: string;
  instagramHandle: string;
  facebookHandle: string;
  birthName: string;
  birthTime: string;
  birthPlace: string;
  firstGotra: string;
  secondGotra: string;
  partnerAgeFrom: string;
  partnerAgeTo: string;
  partnerQualification: string[];
  preferredLocation: string[];
  minAnnualIncome: string;
}

const validateStep1 = (formData: FormData) => {
  const errors: Record<string, string> = {};
  if (!formData.fullName?.trim()) errors.fullName = "Full name is required";
  if (!formData.gender) errors.gender = "Gender is required";
  if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  if (!formData.maritalStatus) errors.maritalStatus = "Marital status is required";
  if (!formData.motherTongue) errors.motherTongue = "Mother tongue is required";
  if (!formData.height) errors.height = "Height is required";
  if (!formData.complexion) errors.complexion = "Complexion is required";
  if (!formData.bloodGroup) errors.bloodGroup = "Blood group is required";
  
  if (formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber)) {
    errors.whatsappNumber = "Enter a valid 10-digit phone number";
  }
  if (formData.emailId && !validateEmail(formData.emailId)) {
    errors.emailId = "Enter a valid email address";
  }
  
  // At least one social media handle is required
  const hasSocialMedia = formData.linkedinHandle?.trim() || formData.instagramHandle?.trim() || formData.facebookHandle?.trim();
  if (!hasSocialMedia) {
    errors.socialMedia = "At least one social media profile is required";
    // Add error to all social media fields to highlight them
    if (!formData.linkedinHandle?.trim()) errors.linkedinHandle = "Required (at least one social media profile)";
    if (!formData.instagramHandle?.trim()) errors.instagramHandle = "Required (at least one social media profile)";
    if (!formData.facebookHandle?.trim()) errors.facebookHandle = "Required (at least one social media profile)";
  }
  
  return errors;
};

const validateStep2 = (formData: FormData) => {
  const errors: Record<string, string> = {};
  
  // Always required fields for Step 2
  if (!formData.highestEducation) errors.highestEducation = "Education is required";
  // Note: collegeUniversity field is not currently visible in the UI, so don't require it
  if (!formData.occupation) errors.occupation = "Occupation is required";
  
  // Dynamic validation based on occupation
  const nonWorkingOccupations = ["Student", "Homemaker", "Not Working"];
  
  if (!nonWorkingOccupations.includes(formData.occupation)) {
    // Organization/Business Name is required for working occupations
    if (!formData.organization?.trim()) {
      errors.organization = formData.occupation === "Business Owner" ? "Business name is required" : "Organization is required";
    }
    
    // Annual Income is required for working occupations
    if (!formData.annualIncome?.trim()) {
      errors.annualIncome = "Annual income is required";
    }
    
    // Job Location validation
    if (formData.occupation === "Business Owner") {
      // Business Location is stored in jobLocation field for Business Owner
      if (!formData.jobLocation?.trim()) {
        errors.jobLocation = "Business location is required";
      }
    } else {
      // Job Location is required for other working occupations
      if (!formData.jobLocation?.trim()) {
        errors.jobLocation = "Job location is required";
      }
    }
    
    // Designation validation for salaried employees
    if ((formData.occupation === "Salaried (Private)" || formData.occupation === "Salaried (Government)") && !formData.designation?.trim()) {
      errors.designation = "Designation is required";
    }
    
    // Other details validation for self-employed/freelancer
    if ((formData.occupation === "Self-Employed" || formData.occupation === "Freelancer") && !formData.otherOccupation?.trim()) {
      errors.otherOccupation = "Additional details are required";
    }
  }
  
  // Student-specific validation
  if (formData.occupation === "Student" && !formData.currentEducation?.trim()) {
    errors.currentEducation = "Current education is required";
  }
  
  return errors;
};

const validateStep3 = (formData: FormData) => {
  const errors: Record<string, string> = {};
  
  // Always required fields
  if (!formData.fathersFullName?.trim()) errors.fathersFullName = "Father's name is required";
  if (!formData.mothersFullName?.trim()) errors.mothersFullName = "Mother's name is required";
  
  // Dynamic validation for father's occupation fields
  if (formData.fathersOccupation === "Business") {
    if (!formData.fathersBusinessName?.trim()) errors.fathersBusinessName = "Father's business name is required";
    if (!formData.fathersBusinessLocation?.trim()) errors.fathersBusinessLocation = "Father's business location is required";
  } else if (formData.fathersOccupation === "Job/Salaried") {
    if (!formData.fathersDesignation?.trim()) errors.fathersDesignation = "Father's designation is required";
    if (!formData.fathersCompanyName?.trim()) errors.fathersCompanyName = "Father's company name is required";
  } else if (formData.fathersOccupation === "Other") {
    if (!formData.fathersOtherOccupation?.trim()) errors.fathersOtherOccupation = "Father's occupation details are required";
  }
  
  // Dynamic validation for mother's occupation fields
  if (formData.mothersOccupation === "Business") {
    if (!formData.mothersBusinessName?.trim()) errors.mothersBusinessName = "Mother's business name is required";
    if (!formData.mothersBusinessLocation?.trim()) errors.mothersBusinessLocation = "Mother's business location is required";
  } else if (formData.mothersOccupation === "Job/Salaried") {
    if (!formData.mothersDesignation?.trim()) errors.mothersDesignation = "Mother's designation is required";
    if (!formData.mothersCompanyName?.trim()) errors.mothersCompanyName = "Mother's company name is required";
  } else if (formData.mothersOccupation === "Other") {
    if (!formData.mothersOtherOccupation?.trim()) errors.mothersOtherOccupation = "Mother's occupation details are required";
  }
  
  return errors;
};

const validateStep4 = (formData: FormData) => {
  const errors: Record<string, string> = {};
  if (!formData.partnerAgeFrom) errors.partnerAgeFrom = "Partner age range is required";
  if (!formData.partnerAgeTo) errors.partnerAgeTo = "Partner age range is required";
  if (!formData.partnerQualification || formData.partnerQualification.length === 0) errors.partnerQualification = "Partner qualification is required";
  if (!formData.preferredLocation || formData.preferredLocation.length === 0) errors.preferredLocation = "Preferred location is required";
  if (!formData.minAnnualIncome) errors.minAnnualIncome = "Minimum income is required";
  return errors;
};

export default function UnifiedMatrimonialForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [westernPhoto, setWesternPhoto] = useState(null);
  const [traditionalPhoto, setTraditionalPhoto] = useState(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Image cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropperMode, setCropperMode] = useState(null); // 'western' or 'traditional'
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    // Basic Profile
    fullName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    aboutMe: "",
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
    designation: "",
    currentEducation: "",
    otherOccupation: "",
    annualIncome: "",
    jobLocation: "",
    
    // Family Details
    fathersFullName: "",
    fathersOccupation:"",
    fathersBusinessName: "",
    fathersBusinessLocation: "",
    fathersDesignation: "",
    fathersCompanyName: "",
    fathersOtherOccupation: "",
    mothersFullName: "",
    mothersOccupation:"",
    mothersBusinessName: "",
    mothersBusinessLocation: "",
    mothersDesignation: "",
    mothersCompanyName: "",
    mothersOtherOccupation: "",
    brothers: [],
    sisters: [],
    
    // Contact Details
    whatsappNumber: "",
    emailId: "",
    linkedinHandle: "",
    instagramHandle: "",
    facebookHandle: "",
    
    // Kundali Details
    birthName: "",
    birthTime: "",
    birthPlace: "",
    firstGotra: "",
    secondGotra: "",

    // Partner Preference
    partnerAgeFrom: "",
    partnerAgeTo: "",
    partnerQualification: [],
    preferredLocation: [],
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
    for (let feet = 4; feet < 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        options.push(`${feet}' ${inches}"`);
      }
    }
    return options;
  };

  const dropdownOptions = {
    gender: ["Male", "Female"],
    maritalStatus: ["Unmarried", "Divorced", "Separated", "Widowed"],
    motherTongue: ["English", "Marathi", "Hindi", "Tamil", "Telugu"],
    height: generateHeightOptions(),
    complexion: ["Very Fair", "Fair", "Wheatish", "Dark"],
    bloodGroup: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    highestEducation: [
        "Professional Degree (CA / CS / ICWA)",
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
    partnerQualification: [
      "Doctor (MBBS/MD/MS)",
      "Engineer (B.Tech/M.Tech)",
      "Chartered Accountant (CA)",
      "Company Secretary (CS)",
      "Cost Accountant (CMA)",
      "Lawyer/Advocate",
      "MBA",
      "Pharmacist",
      "Architect",
      "Software Engineer",
      "Data Scientist",
      "Civil Services (IAS/IPS/IFS)",
      "Banking Professional",
      "Teacher/Professor",
      "Consultant",
      "Business Owner",
      "Government Employee",
      "Any Graduate",
      "Any Post Graduate",
      "No Preference"
    ],
    preferredLocation: [
      "Mumbai", 
      "Delhi/NCR", 
      "Bangalore", 
      "Pune", 
      "Hyderabad", 
      "Chennai", 
      "Kolkata", 
      "Ahmedabad", 
      "Surat", 
      "Jaipur", 
      "Lucknow", 
      "Kanpur", 
      "Nagpur", 
      "Indore", 
      "Thane", 
      "Bhopal", 
      "Visakhapatnam", 
      "Pimpri-Chinchwad", 
      "Patna", 
      "Vadodara", 
      "Ghaziabad", 
      "Ludhiana", 
      "Agra", 
      "Nashik", 
      "Faridabad", 
      "Meerut", 
      "Rajkot", 
      "Kalyan-Dombivali", 
      "Vasai-Virar", 
      "Varanasi", 
      "Srinagar", 
      "Aurangabad", 
      "Dhanbad", 
      "Amritsar", 
      "Navi Mumbai", 
      "Allahabad", 
      "Ranchi", 
      "Howrah", 
      "Coimbatore", 
      "Jabalpur", 
      "Gwalior", 
      "Vijayawada", 
      "Jodhpur", 
      "Madurai", 
      "Raipur", 
      "Kota", 
      "Chandigarh", 
      "Guwahati", 
      "Solapur", 
      "Hubli-Dharwad", 
      "Bareilly", 
      "Moradabad", 
      "Mysore", 
      "Gurgaon", 
      "Aligarh", 
      "Jalandhar", 
      "Tiruchirappalli", 
      "Bhubaneswar", 
      "Salem", 
      "Warangal", 
      "Mira-Bhayandar", 
      "Thiruvananthapuram", 
      "Bhiwandi", 
      "Saharanpur", 
      "Gorakhpur", 
      "Guntur", 
      "Bikaner", 
      "Amravati", 
      "Noida", 
      "Jamshedpur", 
      "Bhilai Nagar", 
      "Cuttack", 
      "Firozabad", 
      "Kochi", 
      "Bhavnagar", 
      "Dehradun", 
      "Durgapur", 
      "Asansol", 
      "Nanded-Waghala", 
      "Kolhapur", 
      "Ajmer", 
      "Gulbarga", 
      "Jamnagar", 
      "Ujjain", 
      "Loni", 
      "Siliguri", 
      "Jhansi", 
      "Ulhasnagar", 
      "Nellore", 
      "Jammu", 
      "Sangli-Miraj & Kupwad", 
      "Belgaum", 
      "Mangalore", 
      "Ambattur", 
      "Tirunelveli", 
      "Malegaon", 
      "Gaya", 
      "Jalgaon", 
      "Udaipur", 
      "Maheshtala", 
      "Any Metro City", 
      "Any Tier 1 City", 
      "Any Tier 2 City", 
      "Anywhere in India", 
      "Open to Relocation"
    ],
    minAnnualIncome: ["Not Reqired","5LPA+","₹10 LPA +", "₹15 LPA +", "₹20 LPA +", "₹25 LPA +", "₹30 LPA +", "₹40 LPA +", "₹50 LPA +"],
    parentOccupation: ["Business", "Job/Salaried", "Retired", "Homemaker", "Not Working", "Other"],
    gotra: [
      "Aankul",
      "Abhimanchkul",
      "Abhimankul",
      "Abhimanyukul",
      "Akumanchal",
      "Anantkul",
      "Ankul",
      "Antakul",
      "Ayankul",
      "Balshishta/Balshatal",
      "Bhanukul",
      "Bibshatla",
      "Bomadshatla",
      "Budhankul",
      "Chandkul",
      "Chandrakul",
      "Chandrashil",
      "Chennakul (Channakul)",
      "Chidrupkul",
      "Chilkul",
      "Chilshil",
      "Chinnakul",
      "Chitrapil",
      "Deokul",
      "Deoshatla",
      "Deoshetti/Devshishta",
      "Deshatla",
      "Dhankul",
      "Dhanshil",
      "Dikshkul",
      "Ebhrashatla",
      "Ebishatla",
      "Ekshakul",
      "Enkol",
      "Enkul",
      "Ennakul",
      "Eshashishta",
      "Eshpal",
      "Eshwakul",
      "Gandheshil",
      "Gandheshwar",
      "Ganshatla",
      "Gaurshatla",
      "Gondakulla",
      "Gondkul",
      "Gontakul",
      "Gunai",
      "Gundkul",
      "Guntkul",
      "Janukul",
      "Jenchkul",
      "Khushal",
      "Komarshatla",
      "Kumshatla",
      "Madankul",
      "Malshet",
      "Mandkul",
      "Mankul",
      "Masantkul",
      "Minkul",
      "Mithunkul",
      "Molukul",
      "Moonkul",
      "Morkul",
      "Mulkul",
      "Munikul",
      "Munjikula",
      "Murkul",
      "Nabhilla",
      "Nabhilkul",
      "Narali",
      "Navshil",
      "Pabhal/Prabhal",
      "Padgeshil",
      "Padgeshwar",
      "Padmashatla",
      "Padmashil",
      "Padmashishta",
      "Pagadikul",
      "Paidikul",
      "Paidkul",
      "Paitkul",
      "Panaskul",
      "Panchkul",
      "Panshil",
      "Pansul",
      "Parashar",
      "Paulshishta",
      "Pawanshil",
      "Pendakul",
      "Pendalkul",
      "Pendlikul",
      "Penlikul",
      "Pennakul",
      "Perushatla(Perishatla)",
      "Polishatla",
      "Polshatla",
      "Pongeshil",
      "Puchhakul",
      "Pulashatla",
      "Pulkul",
      "Pulshetal",
      "Punavshil",
      "Pungeshil",
      "Pungwshwar",
      "Punjashil",
      "Punyashil",
      "Punyeshwar",
      "Punsakul",
      "Pushpal",
      "Rankul",
      "Rantkul/Runtakul",
      "Rentkul",
      "Renukul",
      "Rontakul",
      "Sanku",
      "Senshatla",
      "Shaigol/Shaivgol",
      "Shankul",
      "Shayankul",
      "Sheelkul",
      "Shirsal",
      "Shirshatla",
      "Shrinikul",
      "Shrishal",
      "Shrishatla",
      "Shrisheel",
      "Shrishishta",
      "Shrishreshta",
      "Sirsal",
      "Sirshatla",
      "Sudarshan",
      "Surkul",
      "Sursal",
      "Suryakul",
      "Susal",
      "Totkul",
      "Tulashatla",
      "Tulshishta (Tulshitla)",
      "Upankul",
      "Utkul/Utkalkul",
      "Vachhakul",
      "Vastrakul",
      "Vatsakul",
      "Vikramshishta/ Vikramshil",
      "Vinukul",
      "Viparishatla",
      "Viparishishta",
      "Viprashatla",
      "Vishnukul",
      "Vishwapal",
      "Yalkul",
      "Yalshat",
      "Yalshatla",
      "Yalshatti",
      "Yalshishta",
      "Yankul",
      "Yannakul",
      "Yenishatala",
      "Yenkul",
      "Yetakul"
    ]
  };

  const ageOptions = Array.from({ length: 25 }, (_, i) => i + 21);

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
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    if (today.getDate() < birthDate.getDate()) {
      months--;
      if (months < 0) {
        months += 12;
      }
    }
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
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

  const next = () => {
    let stepErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      stepErrors = validateStep1(formData);
      // Check if at least one photo is uploaded
      if (!westernPhoto && !traditionalPhoto) {
        stepErrors.photos = "Please upload at least one photo (Western or Traditional)";
      }
    } else if (currentStep === 2) {
      stepErrors = validateStep2(formData);
    } else if (currentStep === 3) {
      stepErrors = validateStep3(formData);
    } else if (currentStep === 4) {
      stepErrors = validateStep4(formData);
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, steps.length));
  };
  const back = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts editing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear social media validation errors when any social media field is filled
    if (['linkedinHandle', 'instagramHandle', 'facebookHandle'].includes(field) && value?.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.socialMedia;
        delete newErrors.linkedinHandle;
        delete newErrors.instagramHandle;
        delete newErrors.facebookHandle;
        return newErrors;
      });
    }
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

  const handleFileUpload = (e, photoType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setCropperMode(photoType); // 'western' or 'traditional'
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (cropperMode === 'western') {
      setWesternPhoto(croppedImageUrl);
    } else if (cropperMode === 'traditional') {
      setTraditionalPhoto(croppedImageUrl);
    }
    setShowCropper(false);
    setOriginalImage(null);
    setCropperMode(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage(null);
    setCropperMode(null);
  };

  const removePhoto = (photoType) => {
    if (photoType === 'western') {
      setWesternPhoto(null);
    } else if (photoType === 'traditional') {
      setTraditionalPhoto(null);
    }
  };

  // Sibling management functions
  const addBrother = () => {
    setFormData(prev => ({
      ...prev,
      brothers: [...prev.brothers, { 
        name: "", 
        maritalStatus: "", 
        occupation: "", 
        spouseName: "",
        businessName: "",
        businessLocation: "",
        designation: "",
        companyName: "",
        currentEducation: "",
        otherOccupation: ""
      }]
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
      sisters: [...prev.sisters, { 
        name: "", 
        maritalStatus: "", 
        occupation: "", 
        spouseName: "",
        businessName: "",
        businessLocation: "",
        designation: "",
        companyName: "",
        currentEducation: "",
        otherOccupation: ""
      }]
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
    // Final validation before submission
    const finalErrors = validateStep4(formData);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }
    
    // Navigate to profile page after successful validation
    setErrors({});
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
      <div className="flex-1 max-w-7xl w-full pb-20 lg:pb-0">
        <div className="bg-white rounded-2xl lg:rounded-[40px] p-4 md:p-6 lg:p-8 border border-purple-50 w-full overflow-hidden">

            <div className="lg:hidden flex items-center justify-center gap-1 overflow-x-auto pb-2 no-scrollbar">
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
          
          {/* Photos Section - Western and Traditional */}
          <div className="flex flex-col items-center mb-6 lg:mb-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
              {/* Western Photo */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 lg:border-[5px] border-white shadow-lg lg:shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {westernPhoto ? (
                    <img src={westernPhoto} className="w-full h-full object-cover" alt="Western Photo" />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-[#9181EE] p-2 lg:p-3 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={16} className="lg:size-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'western')} />
                </label>
                {westernPhoto && (
                  <button
                    onClick={() => removePhoto('western')}
                    className="absolute top-2 right-2 bg-red-500 p-1 lg:p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} className="lg:size-4" />
                  </button>
                )}
                <p className="text-center text-[10px] lg:text-[11px] font-bold text-slate-600 mt-2 uppercase">Western</p>
              </div>

              {/* Traditional Photo */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 lg:border-[5px] border-white shadow-lg lg:shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {traditionalPhoto ? (
                    <img src={traditionalPhoto} className="w-full h-full object-cover" alt="Traditional Photo" />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-[#9181EE] p-2 lg:p-3 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={16} className="lg:size-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'traditional')} />
                </label>
                {traditionalPhoto && (
                  <button
                    onClick={() => removePhoto('traditional')}
                    className="absolute top-2 right-2 bg-red-500 p-1 lg:p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} className="lg:size-4" />
                  </button>
                )}
                <p className="text-center text-[10px] lg:text-[11px] font-bold text-slate-600 mt-2 uppercase">Traditional</p>
              </div>
            </div>

            {errors.photos && (
              <div className="flex items-center gap-2 text-red-500 text-xs mb-4">
                <AlertCircle size={14} />
                <span>{errors.photos}</span>
              </div>
            )}
            
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
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                    errors.fullName ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                  }`}>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        const filteredValue = e.target.value.replace(/[0-9]/g, '');
                        handleInputChange('fullName', filteredValue);
                      }}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter your full name"
                      style={{ fontSize: '16px' }} 
                    />
                  </div>
                  {errors.fullName && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <CustomSelect
                    label="Gender"
                    value={formData.gender}
                    options={dropdownOptions.gender}
                    onChange={(val) => handleInputChange('gender', val)}
                    placeholder="Select gender"
                    required={true}
                  />
                  {errors.gender && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.gender}</span>
                    </div>
                  )}
                </div>
                
                {/* Date of Birth - Custom Calendar */}
                <div>
                  <CustomCalendarPicker
                    value={formData.dateOfBirth}
                    onChange={(val) => {
                      handleInputChange('dateOfBirth', val);
                      handleInputChange('age', calculateAge(val));
                    }}
                    label="Date of Birth"
                    maxDate={new Date()}
                    required={true}
                  />
                  {errors.dateOfBirth && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.dateOfBirth}</span>
                    </div>
                  )}
                </div>


                {/* Age (Auto-calculated) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
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
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">WhatsApp Number</label>
                  </div>
                  <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                    errors.whatsappNumber ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                  }`}>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                        if (value.length <= 10) {
                          handleInputChange('whatsappNumber', value);
                        }
                      }}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter WhatsApp number"
                      maxLength={10}
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  {errors.whatsappNumber && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.whatsappNumber}</span>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Email Address</label>
                  </div>
                  <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                    errors.emailId ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                  }`}>
                    <input
                      type="email"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter email address"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  {errors.emailId && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.emailId}</span>
                    </div>
                  )}
                </div>

                {/* LinkedIn Handle */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">LinkedIn Profile</label>
                  </div>
                  <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                    errors.linkedinHandle ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                  }`}>
                    <input
                      type="url"
                      value={formData.linkedinHandle}
                      onChange={(e) => handleInputChange('linkedinHandle', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter LinkedIn profile URL"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  {errors.linkedinHandle && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.linkedinHandle}</span>
                    </div>
                  )}
                </div>

                {/* Instagram Handle */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Instagram Profile</label>
                  </div>
                  <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                    errors.instagramHandle ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                  }`}>
                    <input
                      type="url"
                      value={formData.instagramHandle}
                      onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter Instagram profile URL"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  {errors.instagramHandle && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.instagramHandle}</span>
                    </div>
                  )}
                </div>

                {/* Facebook Handle */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Facebook Profile</label>
                  </div>
                  <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                    errors.facebookHandle ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                  }`}>
                    <input
                      type="url"
                      value={formData.facebookHandle}
                      onChange={(e) => handleInputChange('facebookHandle', e.target.value)}
                      className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                      placeholder="Enter Facebook profile URL"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  {errors.facebookHandle && (
                    <div className="flex items-center gap-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.facebookHandle}</span>
                    </div>
                  )}
                </div>

                {/* Social Media Requirement Notice */}
                {errors.socialMedia && (
                  <div className="md:col-span-2 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span className="font-semibold">At least one social media profile is required</span>
                    </div>
                    <p className="text-red-500 text-xs mt-1 ml-6">Please provide your LinkedIn, Instagram, or Facebook profile URL.</p>
                  </div>
                )}

                {/* Marital Status */}
                <div>
                  <CustomSelect
                    label="Marital Status"
                    value={formData.maritalStatus}
                    options={dropdownOptions.maritalStatus}
                    onChange={(val) => handleInputChange('maritalStatus', val)}
                    placeholder="Select status"
                    required={true}
                  />
                  {errors.maritalStatus && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.maritalStatus}</span>
                    </div>
                  )}
                </div>

                {/* Mother Tongue */}
                <div>
                  <CustomSelect
                    label="Mother Tongue"
                    value={formData.motherTongue}
                    options={dropdownOptions.motherTongue}
                    onChange={(val) => handleInputChange('motherTongue', val)}
                    placeholder="Select language"
                    required={true}
                  />
                  {errors.motherTongue && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.motherTongue}</span>
                    </div>
                  )}
                </div>

                {/* First Gotra */}
                <div>
                  <CustomSelect
                    label="First Gotra"
                    value={formData.firstGotra}
                    options={dropdownOptions.gotra}
                    onChange={(val) => handleInputChange('firstGotra', val)}
                    placeholder="Select first gotra"
                  />
                </div>

                {/* Second Gotra */}
                <div>
                  <CustomSelect
                    label="Second Gotra"
                    value={formData.secondGotra}
                    options={dropdownOptions.gotra}
                    onChange={(val) => handleInputChange('secondGotra', val)}
                    placeholder="Select second gotra"
                  />
                </div>


                {/* Height */}
                <div>
                  <CustomSelect
                    label="Height"
                    value={formData.height}
                    options={dropdownOptions.height}
                    onChange={(val) => handleInputChange('height', val)}
                    placeholder="Select height"
                    required={true}
                  />
                  {errors.height && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.height}</span>
                    </div>
                  )}
                </div>

                {/* Complexion */}
                <div>
                  <CustomSelect
                    label="Complexion"
                    value={formData.complexion}
                    options={dropdownOptions.complexion}
                    onChange={(val) => handleInputChange('complexion', val)}
                    placeholder="Select complexion"
                    required={true}
                  />
                  {errors.complexion && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.complexion}</span>
                    </div>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <CustomSelect
                    label="Blood Group"
                    value={formData.bloodGroup}
                    options={dropdownOptions.bloodGroup}
                    onChange={(val) => handleInputChange('bloodGroup', val)}
                    placeholder="Select blood group"
                    required={true}
                  />
                  {errors.bloodGroup && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.bloodGroup}</span>
                    </div>
                  )}
                </div>

                {/* About Me */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                      About Me
                    </label>
                    <span className="text-[10px] text-slate-400">({formData.aboutMe?.length || 0}/100)</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm">
                    <textarea
                      value={formData.aboutMe}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 100);
                        handleInputChange('aboutMe', value);
                      }}
                      className="w-full font-semibold text-black text-sm lg:text-base outline-none bg-transparent resize-none"
                      placeholder="Tell us about yourself (max 100 characters)"
                      style={{ fontSize: '16px', minHeight: '80px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CAREER & EDUCATION */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Highest Education */}
                <div>
                  <CustomSelect
                    label="Highest Education"
                    value={formData.highestEducation}
                    options={dropdownOptions.highestEducation}
                    onChange={(val) => handleInputChange('highestEducation', val)}
                    placeholder="Select highest education"
                    required={true}
                  />
                  {errors.highestEducation && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.highestEducation}</span>
                    </div>
                  )}
                </div>

                

                {/* Occupation */}
                <div>
                  <CustomSelect
                    label="Occupation"
                    value={formData.occupation}
                    options={dropdownOptions.occupation}
                    onChange={(val) => handleInputChange('occupation', val)}
                    placeholder="Select occupation"
                    required={true}
                  />
                  {errors.occupation && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.occupation}</span>
                    </div>
                  )}
                </div>

                {/* Organization */}
                {formData.occupation !== "Student" && formData.occupation !== "Homemaker" && formData.occupation !== "Not Working" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        {formData.occupation === "Business Owner" ? "Business Name" : "Organization"} <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.organization ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder={formData.occupation === "Business Owner" ? "Enter your business name" : "Enter organization"}
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.organization && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.organization}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Fields Based on Occupation */}
                {/* Business Owner Fields */}
                {formData.occupation === "Business Owner" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Business Location <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.jobLocation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.jobLocation}
                        onChange={(e) => handleInputChange('jobLocation', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter business location"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.jobLocation && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.jobLocation}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Job/Salaried Fields */}
                {(formData.occupation === "Salaried (Private)" || formData.occupation === "Salaried (Government)") && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                          Designation <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                        errors.designation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                      }`}>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                          placeholder="Enter designation"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                      {errors.designation && (
                        <div className="flex items-center gap-2 text-red-500 text-xs">
                          <AlertCircle size={14} />
                          <span>{errors.designation}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Student Field */}
                {formData.occupation === "Student" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Current Education <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.currentEducation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.currentEducation}
                        onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter current education"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.currentEducation && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.currentEducation}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Other Occupation Field */}
                {(formData.occupation === "Self-Employed" || formData.occupation === "Freelancer") && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Other Details <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.otherOccupation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.otherOccupation}
                        onChange={(e) => handleInputChange('otherOccupation', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter additional details"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.otherOccupation && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.otherOccupation}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Annual Income */}
                {formData.occupation !== "Student" && formData.occupation !== "Homemaker" && formData.occupation !== "Not Working" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Annual Income <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.annualIncome ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.annualIncome}
                        onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter your annual income"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.annualIncome && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.annualIncome}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Job Location */}
                {formData.occupation !== "Business Owner" && formData.occupation !== "Student" && formData.occupation !== "Homemaker" && formData.occupation !== "Not Working" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Job Location <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.jobLocation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.jobLocation}
                        onChange={(e) => handleInputChange('jobLocation', e.target.value)}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter job location"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.jobLocation && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.jobLocation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: FAMILY DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Father's Full Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Father's Full Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.fathersFullName ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.fathersFullName}
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(/[0-9]/g, '');
                          handleInputChange('fathersFullName', filteredValue);
                        }}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter father's full name"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.fathersFullName && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.fathersFullName}</span>
                      </div>
                    )}
                  </div>


                  {/* Father's Occupation */}
                  <div>
                    <CustomSelect
                      label="Father's Occupation"
                      value={formData.fathersOccupation}
                      options={dropdownOptions.parentOccupation}
                      onChange={(val) => handleInputChange('fathersOccupation', val)}
                      placeholder="Select father's occupation"
                    />
                  </div>

                  {/* Father's Business Fields */}
                  {formData.fathersOccupation === "Business" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Business Name <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.fathersBusinessName ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.fathersBusinessName}
                            onChange={(e) => handleInputChange('fathersBusinessName', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter business name"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.fathersBusinessName && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.fathersBusinessName}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Business Location <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.fathersBusinessLocation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.fathersBusinessLocation}
                            onChange={(e) => handleInputChange('fathersBusinessLocation', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter business location"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.fathersBusinessLocation && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.fathersBusinessLocation}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Father's Job/Salaried Fields */}
                  {formData.fathersOccupation === "Job/Salaried" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Designation <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.fathersDesignation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.fathersDesignation}
                            onChange={(e) => handleInputChange('fathersDesignation', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter designation"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.fathersDesignation && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.fathersDesignation}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.fathersCompanyName ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.fathersCompanyName}
                            onChange={(e) => handleInputChange('fathersCompanyName', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter company name"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.fathersCompanyName && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.fathersCompanyName}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Father's Other Occupation Field */}
                  {formData.fathersOccupation === "Other" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                          Other Occupation <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                        errors.fathersOtherOccupation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                      }`}>
                        <input
                          type="text"
                          value={formData.fathersOtherOccupation}
                          onChange={(e) => handleInputChange('fathersOtherOccupation', e.target.value)}
                          className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                          placeholder="Enter other occupation"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                      {errors.fathersOtherOccupation && (
                        <div className="flex items-center gap-2 text-red-500 text-xs">
                          <AlertCircle size={14} />
                          <span>{errors.fathersOtherOccupation}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mother's Full Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                        Mother's Full Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                      errors.mothersFullName ? 'border-slate-100 bg-red-50' : 'border-slate-100'
                    }`}>
                      <input
                        type="text"
                        value={formData.mothersFullName}
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(/[0-9]/g, '');
                          handleInputChange('mothersFullName', filteredValue);
                        }}
                        className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                        placeholder="Enter mother's full name"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    {errors.mothersFullName && (
                      <div className="flex items-center gap-2 text-red-500 text-xs">
                        <AlertCircle size={14} />
                        <span>{errors.mothersFullName}</span>
                      </div>
                    )}
                  </div>

                  {/* Mother's Occupation */}
                  <div>
                    <CustomSelect
                      label="Mother's Occupation"
                      value={formData.mothersOccupation}
                      options={dropdownOptions.parentOccupation}
                      onChange={(val) => handleInputChange('mothersOccupation', val)}
                      placeholder="Select mother's occupation"
                    />
                  </div>

                  {/* Mother's Business Fields */}
                  {formData.mothersOccupation === "Business" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Business Name <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.mothersBusinessName ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.mothersBusinessName}
                            onChange={(e) => handleInputChange('mothersBusinessName', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter business name"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.mothersBusinessName && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.mothersBusinessName}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Business Location <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.mothersBusinessLocation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.mothersBusinessLocation}
                            onChange={(e) => handleInputChange('mothersBusinessLocation', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter business location"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.mothersBusinessLocation && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.mothersBusinessLocation}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Mother's Job/Salaried Fields */}
                  {formData.mothersOccupation === "Job/Salaried" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Designation <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.mothersDesignation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.mothersDesignation}
                            onChange={(e) => handleInputChange('mothersDesignation', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter designation"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.mothersDesignation && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.mothersDesignation}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 ml-1">
                          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                          errors.mothersCompanyName ? 'border-red-300 bg-red-50' : 'border-slate-100'
                        }`}>
                          <input
                            type="text"
                            value={formData.mothersCompanyName}
                            onChange={(e) => handleInputChange('mothersCompanyName', e.target.value)}
                            className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                            placeholder="Enter company name"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        {errors.mothersCompanyName && (
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.mothersCompanyName}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Mother's Other Occupation Field */}
                  {formData.mothersOccupation === "Other" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">
                          Other Occupation <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className={`bg-white border rounded-2xl px-4 lg:px-5 py-3 lg:py-4 shadow-sm ${
                        errors.mothersOtherOccupation ? 'border-red-300 bg-red-50' : 'border-slate-100'
                      }`}>
                        <input
                          type="text"
                          value={formData.mothersOtherOccupation}
                          onChange={(e) => handleInputChange('mothersOtherOccupation', e.target.value)}
                          className="w-full font-bold text-black text-sm lg:text-base outline-none bg-transparent"
                          placeholder="Enter other occupation"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                      {errors.mothersOtherOccupation && (
                        <div className="flex items-center gap-2 text-red-500 text-xs">
                          <AlertCircle size={14} />
                          <span>{errors.mothersOtherOccupation}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Brothers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
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

                  
                  

                  


                  {/* Birth Time - Custom Time Picker */}
                  <CustomTimePicker
                    value={formData.birthTime}
                    onChange={(val) => handleInputChange('birthTime', val)}
                    label="Birth Time"
                  />
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
                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-tighter">Partner's Age Range</label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <CustomSelect
                            label=""
                            value={formData.partnerAgeFrom}
                            options={ageOptions.map(age => `${age} years`)}
                            onChange={(val) => handleInputChange('partnerAgeFrom', val)}
                            placeholder="From"
                            showIcon={false}
                            className="-mt-5"
                          />
                          {errors.partnerAgeFrom && (
                            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                              <AlertCircle size={14} />
                              <span>{errors.partnerAgeFrom}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <CustomSelect
                            label=""
                            value={formData.partnerAgeTo}
                            options={ageOptions.map(age => `${age} years`)}
                            onChange={(val) => handleInputChange('partnerAgeTo', val)}
                            placeholder="To"
                            showIcon={false}
                            className="-mt-5"
                          />
                          {errors.partnerAgeTo && (
                            <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                              <AlertCircle size={14} />
                              <span>{errors.partnerAgeTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Partner Qualification */}
                    <div>
                      <CustomMultiSelect
                        label="Partner's Qualification"
                        value={formData.partnerQualification}
                        options={dropdownOptions.partnerQualification}
                        onChange={(val) => handleInputChange('partnerQualification', val)}
                        placeholder="Select qualification options"
                        required={true}
                      />
                      {errors.partnerQualification && (
                        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                          <AlertCircle size={14} />
                          <span>{errors.partnerQualification}</span>
                        </div>
                      )}
                    </div>

                    {/* Preferred Location */}
                    <div>
                      <CustomMultiSelect
                        label="Preferred Location"
                        value={formData.preferredLocation}
                        options={dropdownOptions.preferredLocation}
                        onChange={(val) => handleInputChange('preferredLocation', val)}
                        placeholder="Select location options"
                        required={true}
                      />
                      {errors.preferredLocation && (
                        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                          <AlertCircle size={14} />
                          <span>{errors.preferredLocation}</span>
                        </div>
                      )}
                    </div>

                    {/* Minimum Annual Income */}
                    <div>
                      <CustomSelect
                        label="Minimum Annual Income"
                        value={formData.minAnnualIncome}
                        options={dropdownOptions.minAnnualIncome}
                        onChange={(val) => handleInputChange('minAnnualIncome', val)}
                        placeholder="Select income"
                      />
                      {errors.minAnnualIncome && (
                        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                          <AlertCircle size={14} />
                          <span>{errors.minAnnualIncome}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="hidden lg:flex mt-10  items-center justify-between pt-6 border-t border-slate-50 lg:relative">
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
              {currentStep === steps.length ? "Submit" : "Next"} <ChevronRight size={18} />
            </button>
          </div>

          {/* Mobile Sticky Navigation - Only visible on mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-lg">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button 
                onClick={back}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>{currentStep}</span>
                <span>/</span>
                <span>{steps.length}</span>
              </div>

              <button 
                onClick={currentStep === steps.length ? handleSubmit : next}
                className="flex items-center gap-2 bg-[#9181EE] text-white px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg hover:bg-[#7b6fd6] active:scale-95 transition-all"
              >
                {currentStep === steps.length ? "Submit" : "Next"} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropper
        imageSrc={originalImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        isOpen={showCropper}
      />
    </div>
  );
}