import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OfflineBanner } from "./components/pwa/OfflineBanner";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import { Skeleton } from "@/components/ui/skeleton";

// Eager-loaded pages (critical path)
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail"));
const Chat = lazy(() => import("./pages/Chat"));
const Trips = lazy(() => import("./pages/Trips"));
const Plan = lazy(() => import("./pages/Plan"));
const Itinerary = lazy(() => import("./pages/Itinerary"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const Preferences = lazy(() => import("./pages/Preferences"));
const Saved = lazy(() => import("./pages/Saved"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const App = () => (
  <HashRouter>
    <AuthProvider>
      <OfflineBanner />
      <InstallPrompt />
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding" element={
          <Suspense fallback={<PageLoader />}>
            <Onboarding />
          </Suspense>
        } />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Index />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Chat />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/destinations" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Destinations />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/destinations/:id" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DestinationDetail />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/trips" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Trips />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/plan" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Plan />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/itinerary/:tripId" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Itinerary />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ProfileEdit />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/preferences" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Preferences />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/saved" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Saved />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Notifications />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Help />
            </Suspense>
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  </HashRouter>
);

export default App;
