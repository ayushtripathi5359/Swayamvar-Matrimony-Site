import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors">
              Swayamvar
            </span>
          </Link>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
