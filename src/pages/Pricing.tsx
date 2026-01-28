import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Crown, Heart, Star, Users, Zap } from "lucide-react";

export default function Pricing() {
  const basicFeatures = [
    "Create detailed profile",
    "Browse unlimited profiles",
    "Send up to 10 interests per month",
    "Basic search filters",
    "View contact details of accepted matches",
    "Email support"
  ];

  const premiumFeatures = [
    "All Basic features",
    "Unlimited interests & messages",
    "Advanced search filters",
    "See who viewed your profile",
    "Priority listing in search results",
    "Verified badge on profile",
    "Dedicated relationship manager",
    "Phone support",
    "Profile highlighting"
  ];

  const eliteFeatures = [
    "All Premium features",
    "Personalized matchmaking service",
    "Professional photo shoot assistance",
    "Profile writing assistance",
    "Background verification",
    "Exclusive elite member directory",
    "Personal consultation sessions",
    "24/7 priority support",
    "Custom match recommendations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart size={16} />
            Find Your Perfect Match
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> Love Story</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan to begin your journey towards finding your life partner. 
            Each plan is designed to give you the best matrimonial experience.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Users size={16} />
                Basic
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">₹999</div>
              <div className="text-gray-500">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Plan - Most Popular */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-pink-500 p-8 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Star size={16} />
                Premium
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">₹2,499</div>
              <div className="text-gray-500">per month</div>
              <div className="text-sm text-green-600 font-medium mt-1">Save 30% annually</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
              Choose Premium
            </button>
          </div>

          {/* Elite Plan */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Crown size={16} />
                Elite
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">₹4,999</div>
              <div className="text-gray-500">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {eliteFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Go Elite
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Matrimonial Platform?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Profiles</h3>
              <p className="text-gray-600">All profiles are manually verified to ensure authenticity and safety.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">Advanced algorithms to find compatible matches based on your preferences.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Success Stories</h3>
              <p className="text-gray-600">Over 10,000+ successful marriages through our platform.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan anytime?</h3>
              <p className="text-gray-600">Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my personal information secure?</h3>
              <p className="text-gray-600">Absolutely. We use industry-standard encryption and security measures to protect your data.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I don't find a match?</h3>
              <p className="text-gray-600">We offer a satisfaction guarantee. If you're not satisfied within the first 30 days, we'll provide a full refund.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
