import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/profile";
import MyProfile from "./pages/MyProfile";
import StepwiseRegistration from "./pages/StepwiseRegistration";
import InboxListingPage from "./pages/InboxListingPage";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Pricing from "./pages/Pricing";
import AboutUsPage from "./pages/AboutUsPage";
import AuthCallback from "./pages/AuthCallback"; 
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/registration" element={<StepwiseRegistration />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/inbox" element={<InboxListingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pricing1234" element={<Pricing />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
