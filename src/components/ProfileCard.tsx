import { useNavigate } from "react-router-dom";

export interface ProfileCardData {
  _id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  age?: string | number;
  education?: string;
  occupation?: string;
  jobLocation?: string;
  photos?: {
    western?: { url?: string };
    traditional?: { url?: string };
  };
  profilePhotos?: { western?: string; traditional?: string };
}

interface ProfileCardProps {
  profile?: ProfileCardData;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (profile?._id) {
      // Navigate to specific profile by ID
      navigate(`/profile/${profile._id}`);
    } else {
      // For placeholder cards (when not authenticated), redirect to login
      navigate("/login");
    }
  };

  const displayName =
    profile?.fullName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Prachi Mamidwar";

  const displayAge = profile?.age ? String(profile.age) : "24";
  const displayPrimary =
    profile?.education || profile?.occupation || "Animation & Multimedia";
  const displaySecondary =
    profile?.occupation || "Graphic & UI/UX designer";

  const photoSrc =
    profile?.photos?.profilePhoto?.url ||
    profile?.photos?.traditional?.url ||
    profile?.photos?.western?.url ||
    profile?.profilePhotos?.traditional ||
    profile?.profilePhotos?.western ||
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e";

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer group"
         onClick={handleViewProfile}>

      {/* Image */}
      <div className="rounded-xl overflow-hidden mb-4">
        <img
          src={photoSrc}
          alt={displayName}
          className="w-full h-36 lg:h-[220px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {displayName}
      </h3>

      <p className="text-sm text-gray-500 leading-snug mb-4">
        {displayAge}, {displayPrimary}, <br />
        {displaySecondary}
      </p>

      {/* Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent double-click when clicking button
          handleViewProfile();
        }}
        className="w-full py-2 rounded-full bg-gray-100 text-sm font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:bg-blue-50"
      >
        View Profile
      </button>
    </div>
  );
}
