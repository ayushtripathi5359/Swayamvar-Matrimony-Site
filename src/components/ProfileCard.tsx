export default function ProfileCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center">

      {/* Image */}
      <div className="rounded-xl overflow-hidden mb-4">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          alt="Profile"
          className="w-full h-36 lg:h-[220px] object-cover"
        />
      </div>

      {/* Info */}
      <h3 className="font-semibold text-gray-900 mb-1">
        Prachi Mamidwar
      </h3>

      <p className="text-sm text-gray-500 leading-snug mb-4">
        24, Animation & Multimedia, <br />
        Graphic & UI/UX designer
      </p>

      {/* Button */}
      <button className="w-full py-2 rounded-full bg-gray-100 text-sm font-medium hover:bg-gray-200 transition">
        View Profile
      </button>
    </div>
  );
}
