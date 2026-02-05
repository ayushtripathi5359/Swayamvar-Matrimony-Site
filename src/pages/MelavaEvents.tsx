import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Phone, Users, Clock, Heart, Star, MessageSquare } from "lucide-react";

export default function MelavaEvents() {
  const events = [
    {
      id: 1,
      location: "Pune",
      date: "Sunday, April 5, 2026",
      title: "Hi-Tech Up Bride~Groom~Parents Snehamilan Mela Pune",
      description: "Parents of the bride and groom will also be given a meeting at each venue from 10 am. If parents are not present, only the bride and groom can book.",
      venue: "Bird Valley Hotel Hinjewadi Phase 1 Pune",
      contact: {
        name: "Mr. Piyush Nilawar",
        phone: "7066699935"
      },
      whatsappGroup: true,
      whatsappGroupLink: "https://chat.whatsapp.com/FAHez6p2sEyBh6jeJRAY6w",
      status: "upcoming"
    },
    {
      id: 2,
      location: "Nanded",
      date: "23rd and 24th January 2027",
      title: "Upvar-Upavadhu Introduction Fair 2027",
      description: "Organized by Shri Nagreshwar Vaishya Mandir, Sarafa, Nanded",
      venue: "Shri Nagreshwar Vaishya Mandir, Sarafa, Nanded",
      contact: {
        name: "",
        phone: ""
      },
      whatsappGroup: false,
      moreInfoLink: "https://nagareshwarnanded.com/",
      status: "upcoming"
    }
  ];

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

          {/* Main Content */}
          <div className="px-5  sm:px-8 md:px-12 lg:px-16 pt-32 pb-16">
        {/* Hero Section */}
        <div className="mb-16">
          {/* Page Title */}
          <div className="mb-8">
            
            <h1 className="font-bold text-[28px] sm:text-[34px] lg:text-[42px] leading-tight tracking-tight text-slate-900 mb-4">
              Dear <span className="text-[#ED9B59]">Swayamwar</span> Candidates
            </h1>
            <p className="text-slate-600 text-base lg:text-lg max-w-4xl">
              Join our exclusive matrimonial events designed to bring together families and individuals 
              seeking meaningful connections. Below are the details of Melava's planned this year.
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-8 mb-16">
          {events.map((event) => (
            <div key={event.id} className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] shadow-xl border border-slate-100 p-8 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                </div>
              </div>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 bg-[#ED9B59]/10 text-[#ED9B59] px-3 py-1 rounded-full text-sm font-medium mb-6">
                <MapPin size={16} />
                {event.location}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Content */}
                <div className="space-y-6">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="bg-[#ED9B59]/10 p-2 rounded-lg">
                      <Calendar size={20} className="text-[#ED9B59]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Event Date</p>
                      <p className="text-lg font-bold text-slate-900">{event.date}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Right Content */}
                <div className="space-y-6">
                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1">
                      <MapPin size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Venue</p>
                      <p className="text-slate-900 font-semibold">{event.venue}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-lg p-4 border border-slate-100">
                    {/* Show contact info only if contact name exists */}
                    {event.contact.name && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Phone size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Contact Person</p>
                          <p className="text-slate-900 font-semibold">{event.contact.name}</p>
                          {event.contact.phone && event.contact.phone !== "Contact details will be updated soon" && (
                            <p className="text-green-600 font-medium">📱 {event.contact.phone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* More Info Link */}
                    {event.moreInfoLink && (
                      <div className={event.contact.name ? "mb-4" : ""}>
                        <a
                          href={event.moreInfoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          For More Information
                        </a>
                      </div>
                    )}

                    {/* WhatsApp Group */}
                    {event.whatsappGroup && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare size={16} className="text-green-600" />
                          <span className="text-sm text-green-700 font-medium">WhatsApp Group Available</span>
                        </div>
                        {event.whatsappGroupLink && (
                          <a
                            href={event.whatsappGroupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors active:scale-95"
                          >
                            <MessageSquare size={14} />
                            Join WhatsApp Group
                          </a>
                        )}
                      </div>
                    )}

                    {/* Show message if no contact info and no website */}
                    {!event.contact.name && !event.moreInfoLink && (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">Contact details will be updated soon</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-[#ED9B59] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95">
                      Register Interest
                    </button>
                    {event.contact.phone !== "Contact details will be updated soon" && (
                      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors active:scale-95">
                        Contact
                      </button>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes Section */}
        {/* <div className="mb-16">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star size={24} className="text-yellow-600" />
              </div>
              Important Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Timing</p>
                    <p className="text-sm">Events typically start from 10:00 AM onwards. Please arrive on time for the best experience.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg mt-1">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Attendance</p>
                    <p className="text-sm">Both bride and groom candidates along with their parents are encouraged to attend for better interaction.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg mt-1">
                    <Phone size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Registration</p>
                    <p className="text-sm">Prior registration is recommended. Contact the respective coordinators for booking your spot.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#ED9B59]/10 p-2 rounded-lg mt-1">
                    <Heart size={16} className="text-[#ED9B59]" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Dress Code</p>
                    <p className="text-sm">Traditional Indian attire is preferred to maintain the cultural essence of the event.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Call to Action */}
        {/* <div className="mb-16">
          <div className="bg-gradient-to-r from-[#ED9B59] to-orange-500 rounded-[16px] p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of families who have found their happiness through our Melava events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#ED9B59] font-semibold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors active:scale-95">
                View All Events
              </button>
              <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-[#ED9B59] transition-colors active:scale-95">
                Contact Organizers
              </button>
            </div>
          </div>
        </div> */}

        {/* FAQ Section */}
        {/* <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What should I bring to the Melava event?</h3>
              <p className="text-slate-600">Please bring your biodata, recent photographs, and any relevant documents. It's also recommended to bring your parents or guardians for better family interaction.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Is there any registration fee?</h3>
              <p className="text-slate-600">Registration fees may vary by event. Please contact the respective coordinators for detailed information about fees and payment methods.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I attend multiple events?</h3>
              <p className="text-slate-600">Yes, you can attend multiple Melava events. Each event offers unique opportunities to meet different families and potential matches.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[16px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What if I can't attend on the scheduled date?</h3>
              <p className="text-slate-600">Please inform the coordinators in advance if you cannot attend. They may be able to provide alternative arrangements or information about future events.</p>
            </div>
          </div>
        </div> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Background Patterns Component (matching other pages)
function BackgroundPatterns() {
  return (
    <svg className="absolute -left-[500px] -top-[50px] opacity-10" width="2384" height="1706" viewBox="0 0 2384 1706" fill="none">
      <path d="M623.501 1118.65C597.168 1041.98 458.801 883.151 116.001 861.151" stroke="#ED9B59" strokeWidth="2"/>
      <path d="M969.73 1086.65C964.137 1005.78 871.594 816.548 546.169 706.574" stroke="#ED9B59" strokeWidth="2"/>
    </svg>
  );
}