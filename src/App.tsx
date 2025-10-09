import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Destinations from "./pages/Destinations";
import Trips from "./pages/Trips";
import Plan from "./pages/Plan";
import Itinerary from "./pages/Itinerary";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/" element={<Index />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/itinerary/:tripId" element={<Itinerary />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          {/* Placeholder for chat - will be implemented in Phase 3 */}
          <Route path="/chat" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
