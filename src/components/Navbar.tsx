import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[900px]">
      <div className="flex items-center justify-between rounded-full md:border md:border-slate-200 bg-white/90 md:backdrop-blur-[30px] h-[40px] sm:h-[66px] px-3 sm:px-4">
        
        {/* Left: Logo */}
        <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-44 md:w-64">
          <img src="src\assets\swayamwar.png" alt="" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center h-full gap-1">
          <NavItem label="Home" href="/home" />
          <NavItem label="My Profile" href="/my-profile" />
          <NavItem label="My Matches" href="/inbox" />
          <NavItem label="Upcoming Melava" href="/melava-events" />
          <NavItem label="About Us" href="/aboutus" />
          {/* <NavItem label="Pricing" href="/pricing" /> */}
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
              to="/my-profile"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Profile
            </Link>
            <Link
              to="/inbox"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Matches
            </Link>
            <Link
              to="/melava-events"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upcoming Melava
            </Link>
            <Link
              to="/aboutus"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            {/* <Link
              to="/pricing"
              className="block px-4 py-2 text-slate-900 hover:text-pink-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link> */}
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
