import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Destinations from "./pages/Destinations";

// Lazy load pages for better performance
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Chat = lazy(() => import("./pages/Chat"));
const Trips = lazy(() => import("./pages/Trips"));
const Plan = lazy(() => import("./pages/Plan"));
const Itinerary = lazy(() => import("./pages/Itinerary"));
const Profile = lazy(() => import("./pages/Profile"));
const Preferences = lazy(() => import("./pages/Preferences"));
const Saved = lazy(() => import("./pages/Saved"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const NotFound = lazy(() => import("./pages/NotFound"));



// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen p-8 space-y-4">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/itinerary/:tripId" element={<Itinerary />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
);


export default App;
