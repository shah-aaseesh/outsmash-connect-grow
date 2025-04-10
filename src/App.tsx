
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Opportunities from "./pages/Opportunities";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Mock authentication status - in a real app, this would come from your auth provider
const isAuthenticated = true; // This is just for demonstration

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? 
              <Profile /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/network" 
            element={
              isAuthenticated ? 
              <Network /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/messages" 
            element={
              isAuthenticated ? 
              <Messages /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? 
              <Settings /> : 
              <Navigate to="/" replace />
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
