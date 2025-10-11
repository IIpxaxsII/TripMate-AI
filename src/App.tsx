// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";

import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Destinations from "./pages/Destinations";
import Onboarding from "./pages/Onboarding";
import Chat from "./pages/Chat";
import Trips from "./pages/Trips";
import Plan from "./pages/Plan";
import Itinerary from "./pages/Itinerary";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import Saved from "./pages/Saved";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";




const App = () => (
  <HashRouter>
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
  </HashRouter>
);


export default App;
