import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[900px]">
      <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/90 backdrop-blur-[30px] h-[40px] sm:h-[66px] px-3 sm:px-4">
        
        {/* Left: Logo */}
        <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M22.2849 8.16174H15.0731V1H8.16174C8.16174 4.95649 4.95649 8.16174 1 8.16174V15.0731H8.16174V22.2348H15.0731C15.0731 18.2783 18.3284 15.0731 22.2849 15.0731V8.16174Z"
              fill="#181818"
            />
          </svg>

          <span className="font-medium text-base sm:text-lg lg:text-2xl text-slate-900 whitespace-nowrap">
            Swayamvar
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center h-full gap-1">
          <NavItem label="Home" href="/home" />
          <NavItem label="Profile" href="/profile" />
          <NavItem label="My Matches" href="/inbox" />
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 active:scale-95 transition"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-slate-900" />
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-lg p-4 md:hidden">
            <Link
              to="/home"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/inbox"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Matches
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <Link
      to={href}
      className="flex items-center justify-center px-2 lg:px-4 h-full text-slate-900 hover:text-pink-600 transition-colors font-medium text-base lg:text-lg whitespace-nowrap"
    >
      {label}
    </Link>
  );
}
