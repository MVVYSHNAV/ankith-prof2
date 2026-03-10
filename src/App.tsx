import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import KhulljaSimSim from "./pages/KhulljaSimSim";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Preloader from "./components/layout/Preloader";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

import { ThemeProvider } from "@/components/theme-provider";

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isVaultRoute = location.pathname.startsWith("/khullja-sim-sim") ||
    location.pathname.startsWith("/panache");

  useEffect(() => {
    if (isVaultRoute) {
      setIsLoading(false);
    }
  }, [isVaultRoute]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading && !isVaultRoute && (
          <Preloader onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/khullja-sim-sim" element={<KhulljaSimSim />} />
        <Route
          path="/panache"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
