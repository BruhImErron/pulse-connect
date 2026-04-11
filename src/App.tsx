import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import CustomCursor from "@/components/CustomCursor";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NgoMatches from "./pages/NgoMatches";
import NgoMap from "./pages/NgoMap";
import Donations from "./pages/Donations";
import Tracking from "./pages/Tracking";
import Impact from "./pages/Impact";
import Activity from "./pages/Activity";
import Library from "./pages/Library";
import Feed from "./pages/Feed";
import Advisor from "./pages/Advisor";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ngos" element={<NgoMatches />} />
            <Route path="/map" element={<NgoMap />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/library" element={<Library />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
